import { Controller, Get, Post, Body, Req, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Sale, SalePaymentMethod } from '../entities/sale.entity';
import { SaleItem } from '../entities/sale-item.entity';
import { WarehouseInventory } from '../entities/warehouse-inventory.entity';
import { Company } from '../entities/company.entity';
import { Product } from '../entities/product.entity';
import { AccountTransactionSourceType, InstallmentFrequency } from '../entities/account-transaction.entity';
import { FinancialService } from '../financial/financial.service';

@Controller('sales')
export class SaleController {
  constructor(
    @InjectRepository(Sale)
    private readonly saleRepo: Repository<Sale>,
    @InjectRepository(WarehouseInventory)
    private readonly inventoryRepo: Repository<WarehouseInventory>,
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
    private readonly financialService: FinancialService,
    private readonly dataSource: DataSource,
  ) {}

  // Ver todas las ventas con sus detalles y relaciones (SOLO de la empresa del token)
  @Get()
  findAll(@Req() req: any) {
    const companyId = req.user.companyId;
    return this.saleRepo.find({
      where: { companyId },
      relations: { branch: true, company: true, user: true, client: true, items: { product: true } },
    });
  }

  // Registrar una venta, calcular impuestos, descontar stock, y si es a
  // crédito, generar el plan de pagos automáticamente.
  @Post()
  async create(@Req() req: any, @Body() body: {
    branchId: string;
    warehouseId: string;
    clientId: string;
    employeeId?: string;
    paymentMethod: SalePaymentMethod;
    discountAmount?: number;
    // NOTA: "unitPrice" ya NO se acepta del cliente. El precio siempre se
    // resuelve en servidor desde el catálogo de productos (ver más abajo).
    items: { productId: string; quantity: number; discountAmount?: number }[];
    // Solo requeridos cuando paymentMethod = CREDIT
    downPayment?: number;
    interestRate?: number;
    installmentsCount?: number;
    installmentFrequency?: InstallmentFrequency;
    roundToWhole?: boolean;
    manualInstallments?: { installmentNumber: number; amount: number; dueDate: string }[];
  }) {
    // companyId y userId SIEMPRE del JWT, nunca del body: un usuario
    // autenticado de la Empresa A no puede registrar ventas a nombre de
    // otra empresa ni suplantar a otro usuario.
    const companyId = req.user.companyId;
    const userId = req.user.userId;
    const { branchId, warehouseId, clientId, employeeId, paymentMethod, items } = body;
    const discountAmount = body.discountAmount || 0;

    if (!items || items.length === 0) {
      throw new BadRequestException('La venta debe incluir al menos un producto.');
    }
    if (!clientId) {
      throw new BadRequestException('La venta debe estar asociada a un cliente (use el cliente "Contado" para ventas de mostrador).');
    }
    if (!warehouseId) {
      throw new BadRequestException('Debe indicar de qué almacén se descuenta el stock.');
    }

    // NUEVO: validar los datos del crédito antes de tocar la base de datos
    if (paymentMethod === SalePaymentMethod.CREDIT) {
      if (!body.installmentsCount || body.installmentsCount <= 0) {
        throw new BadRequestException('Debe indicar la cantidad de cuotas para una venta a crédito.');
      }
      if (!body.installmentFrequency) {
        throw new BadRequestException('Debe indicar la frecuencia de las cuotas (semanal, quincenal o mensual).');
      }
    }

    const company = await this.companyRepo.findOne({ where: { id: companyId } });
    if (!company) {
      throw new BadRequestException('Empresa no válida');
    }

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      let subtotal = 0;
      const saleItemsToSave: SaleItem[] = [];

      for (const item of items) {
        // 1. Resolver el precio EN SERVIDOR desde el catálogo (nunca confiar
        // en un unitPrice enviado por el cliente: eso permitiría comprar
        // cualquier producto al precio que el cliente quisiera).
        const product = await queryRunner.manager.findOne(Product, {
          where: { id: item.productId, companyId },
        });

        if (!product) {
          throw new BadRequestException(`Producto no encontrado en el catálogo: ${item.productId}`);
        }

        const unitPrice = Number(product.price);

        // 2. Verificar inventario en el almacén CON BLOQUEO PESIMISTA: si dos
        // ventas concurrentes intentan descontar el mismo producto al mismo
        // tiempo, la segunda espera a que la primera termine su transacción
        // en vez de leer un stock ya desactualizado (evita sobreventa).
        const inventory = await queryRunner.manager.findOne(WarehouseInventory, {
          where: { companyId, warehouseId, productId: item.productId },
          lock: { mode: 'pessimistic_write' },
        });

        if (!inventory || inventory.stock < item.quantity) {
          throw new BadRequestException(`Stock insuficiente para el producto ID: ${item.productId}`);
        }

        // 3. Descontar el stock
        inventory.stock -= item.quantity;
        await queryRunner.manager.save(inventory);

        // 4. Calcular subtotal de la línea (después de su propio descuento)
        const itemDiscount = item.discountAmount || 0;
        subtotal += item.quantity * unitPrice - itemDiscount;

        const saleItem = queryRunner.manager.create(SaleItem, {
          companyId,
          productId: item.productId,
          quantity: item.quantity,
          unitPrice,
          discountAmount: itemDiscount,
        });
        saleItemsToSave.push(saleItem);
      }

      // CORREGIDO: unitPrice ahora se interpreta como el precio de venta
      // YA CON el impuesto incluido (ej. $10,000 es lo que el cliente
      // paga, no una base a la que se le suma impuesto encima).
      // "totalWithTax" es entonces el total final tal cual se cobra.
      const totalWithTax = subtotal;

      // 5. Aplicar descuento general de la venta (sobre el precio final,
      // que ya incluye impuesto)
      const totalAfterDiscount = totalWithTax - discountAmount;

      // 6. Calcular hacia atrás cuánto de ese total es impuesto, usando
      // la tasa configurada en la empresa. Fórmula: si el total ya
      // incluye el X% de impuesto, entonces:
      //   subtotal (base sin impuesto) = total / (1 + X/100)
      //   impuesto = total - subtotal
      let taxAmount = 0;
      let taxableSubtotal = totalAfterDiscount;

      if (company.useTax) {
        taxableSubtotal = Number((totalAfterDiscount / (1 + Number(company.taxRate) / 100)).toFixed(2));
        taxAmount = Number((totalAfterDiscount - taxableSubtotal).toFixed(2));
      }

      const total = Number(totalAfterDiscount.toFixed(2));

      // 7. Crear la venta principal
      const newSale = queryRunner.manager.create(Sale, {
        companyId,
        branchId,
        warehouseId,
        clientId,
        userId,
        employeeId,
        paymentMethod,
        subtotal: taxableSubtotal,
        discountAmount,
        taxAmount,
        total,
        items: saleItemsToSave,
      });

      const savedSale = await queryRunner.manager.save(newSale);

      // 8. Si la venta es a crédito, generar el plan de pagos (inicial +
      // cuotas) dentro de la MISMA transacción — si algo falla de aquí en
      // adelante, la venta completa se revierte, no solo el crédito.
      if (paymentMethod === SalePaymentMethod.CREDIT) {
        const creditResult = await this.financialService.createCreditAccount(
          {
            companyId,
            clientId,
            sourceType: AccountTransactionSourceType.SALE,
            sourceId: savedSale.id,
            totalAmount: total,
            downPayment: body.downPayment || 0,
            interestRate: body.interestRate || 0,
            installmentsCount: body.installmentsCount,
            installmentFrequency: body.installmentFrequency,
            roundToWhole: body.roundToWhole,
            manualInstallments: body.manualInstallments,
          },
          queryRunner.manager,
        );

        // Guardamos en la venta el monto real que pagará el cliente con
        // el crédito (inicial + cuotas con interés), para no depender de
        // un JOIN a account_transactions solo para imprimir la factura.
        savedSale.totalWithCredit = creditResult.totalPayable;
        await queryRunner.manager.save(savedSale);
      }

      await queryRunner.commitTransaction();
      return savedSale;

    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
}
