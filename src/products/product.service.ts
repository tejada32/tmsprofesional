// src/product/product.service.ts
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, QueryFailedError } from 'typeorm';
import { Product } from '../entities/product.entity';
import { ProductComboItem } from '../entities/product-combo-item.entity';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(ProductComboItem)
    private readonly comboItemRepository: Repository<ProductComboItem>,
  ) {}

  private calculateCubicMeters(dto: {
    lengthCm?: number;
    widthCm?: number;
    heightCm?: number;
    cubicMeters?: number;
  }) {
    // Fórmula: (Largo x Ancho x Alto) / 1,000,000 para convertir cm³ a m³
    if (!dto.cubicMeters && dto.lengthCm && dto.widthCm && dto.heightCm) {
      return Number(((dto.lengthCm * dto.widthCm * dto.heightCm) / 1000000).toFixed(4));
    }
    return dto.cubicMeters;
  }

  // Traduce el error de índice único de Postgres (código 23505) a un
  // mensaje entendible, en vez de dejar pasar el error crudo de la BD.
  private handleDbError(error: unknown): never {
    if (error instanceof QueryFailedError && (error as any).code === '23505') {
      throw new ConflictException('Ya existe un producto con ese SKU en esta empresa');
    }
    throw error;
  }

  async createProduct(companyId: string, dto: CreateProductDto) {
    const { comboItems, ...productData } = dto;
    const cubicMeters = this.calculateCubicMeters(dto);

    if (dto.isCombo && (!comboItems || comboItems.length === 0)) {
      throw new BadRequestException(
        'Un producto marcado como combo debe incluir al menos un componente (comboItems)',
      );
    }

    const product = this.productRepository.create({
      companyId,
      ...productData,
      cubicMeters,
    });

    try {
      const savedProduct = await this.productRepository.save(product);

      if (dto.isCombo && comboItems?.length) {
        const items = comboItems.map((item) =>
          this.comboItemRepository.create({
            companyId,
            comboProductId: savedProduct.id,
            componentProductId: item.componentProductId,
            quantity: item.quantity,
          }),
        );
        await this.comboItemRepository.save(items);
      }

      return savedProduct;
    } catch (error) {
      return this.handleDbError(error);
    }
  }

  async findAllByCompany(companyId: string, includeInactive = false) {
    return await this.productRepository.find({
      where: includeInactive ? { companyId } : { companyId, isActive: true },
      order: { name: 'ASC' },
    });
  }

  async findOne(companyId: string, id: string) {
    const product = await this.productRepository.findOne({ where: { id, companyId } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    // Si es un combo, traemos también de qué componentes está hecho
    let comboItems: ProductComboItem[] = [];
    if (product.isCombo) {
      comboItems = await this.comboItemRepository.find({
        where: { comboProductId: id },
        relations: { componentProduct: true },
      });
    }

    return { ...product, comboItems };
  }

  async update(companyId: string, id: string, dto: UpdateProductDto) {
    const product = await this.productRepository.findOne({ where: { id, companyId } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }

    const merged = { ...product, ...dto };
    const cubicMeters = this.calculateCubicMeters(merged);
    Object.assign(product, dto, { cubicMeters });

    try {
      return await this.productRepository.save(product);
    } catch (error) {
      return this.handleDbError(error);
    }
  }

  // Borrado suave: Product usa la bandera "isActive" (no @DeleteDateColumn
  // como Client), así que desactivar es simplemente apagar ese campo —
  // el producto sigue existiendo para no romper ventas/compras históricas
  // que ya lo referencian, pero deja de aparecer en los listados normales.
  async deactivate(companyId: string, id: string) {
    const product = await this.productRepository.findOne({ where: { id, companyId } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    product.isActive = false;
    return await this.productRepository.save(product);
  }

  async activate(companyId: string, id: string) {
    const product = await this.productRepository.findOne({ where: { id, companyId } });
    if (!product) {
      throw new NotFoundException('Producto no encontrado');
    }
    product.isActive = true;
    return await this.productRepository.save(product);
  }
}
