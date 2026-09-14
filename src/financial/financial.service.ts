//\src\financial/financial.service.ts
//\src\financial/financial.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, EntityManager } from 'typeorm';
import {
  AccountTransaction,
  AccountTransactionType,
  AccountTransactionStatus,
  AccountTransactionSourceType,
  InstallmentFrequency,
} from '../entities/account-transaction.entity';
import { AccountInstallment, AccountInstallmentStatus } from '../entities/account-installment.entity';

interface CreditScheduleInput {
  totalAmount: number;
  downPayment?: number; // opcional: si no se manda, se financia el 100%
  interestRate: number;
  installmentsCount: number;
  installmentFrequency: InstallmentFrequency;
  roundToWhole?: boolean; // default true: cuotas sin centavos
  roundingIncrement?: number; // default 5: cada cuota termina en 0 o 5
}

interface ScheduleLine {
  installmentNumber: number;
  amount: number;
  dueDate: Date;
}

@Injectable()
export class FinancialService {
  constructor(
    @InjectRepository(AccountTransaction)
    private readonly transactionRepo: Repository<AccountTransaction>,
    @InjectRepository(AccountInstallment)
    private readonly installmentRepo: Repository<AccountInstallment>,
  ) {}

  // Cálculo puro, sin tocar la base de datos. Lo usan tanto la
  // previsualización como el modo automático de createCreditAccount.
  //
  // NUEVO: roundToWhole (por defecto true) redondea el monto financiado
  // a pesos enteros y reparte cuotas también en pesos enteros — la
  // última cuota absorbe cualquier diferencia de redondeo, igual que
  // antes hacíamos con centavos, pero ahora a nivel de peso completo.
  private calculateInstallmentSchedule(data: CreditScheduleInput): {
    financedWithInterest: number;
    totalPayable: number;
    installments: ScheduleLine[];
    today: Date;
  } {
    // Defensivo: si por alguna razón llega undefined en vez de 0
    const downPayment = data.downPayment || 0;
    const financedPrincipal = data.totalAmount - downPayment;

    if (financedPrincipal <= 0) {
      throw new BadRequestException('El inicial cubre o supera el monto total.');
    }
    if (data.installmentsCount <= 0) {
      throw new BadRequestException('La cantidad de cuotas debe ser mayor a cero.');
    }

    const roundToWhole = data.roundToWhole !== false;
    // NUEVO: cada cuota (menos la última) termina en 0 o 5, no en
    // cualquier peso. Ej. con incremento 5: 733.33 -> 735.
    const roundingIncrement = data.roundingIncrement && data.roundingIncrement > 0 ? data.roundingIncrement : 5;

    const rawFinancedWithInterest = financedPrincipal * (1 + Number(data.interestRate || 0) / 100);

    const financedWithInterest = roundToWhole
      ? Math.round(rawFinancedWithInterest)
      : Number(rawFinancedWithInterest.toFixed(2));

    const rawInstallment = financedWithInterest / data.installmentsCount;

    const baseInstallment = roundToWhole
      ? Math.round(rawInstallment / roundingIncrement) * roundingIncrement
      : Number(rawInstallment.toFixed(2));

    const totalPayable = Number((downPayment + financedWithInterest).toFixed(2));

    const today = new Date();
    const currentDate = new Date(today);
    const startingNumber = downPayment > 0 ? 2 : 1;
    let assignedSoFar = 0;
    const installments: ScheduleLine[] = [];

    for (let i = 0; i < data.installmentsCount; i++) {
      if (data.installmentFrequency === InstallmentFrequency.WEEKLY) {
        currentDate.setDate(currentDate.getDate() + 7);
      } else if (data.installmentFrequency === InstallmentFrequency.BIWEEKLY) {
        currentDate.setDate(currentDate.getDate() + 15);
      } else {
        currentDate.setMonth(currentDate.getMonth() + 1);
      }

      // La última cuota absorbe lo que sobre o falte — no se fuerza a
      // que también sea múltiplo de 5, "como quede no importa".
      const isLast = i === data.installmentsCount - 1;
      const amount = isLast
        ? Number((financedWithInterest - assignedSoFar).toFixed(2))
        : baseInstallment;

      assignedSoFar = Number((assignedSoFar + amount).toFixed(2));

      installments.push({
        installmentNumber: startingNumber + i,
        amount,
        dueDate: new Date(currentDate),
      });
    }

    return { financedWithInterest, totalPayable, installments, today };
  }

  // NUEVO: previsualiza el plan de pagos SIN guardar nada. El frontend
  // usa esto para mostrarle las cuotas al empleado antes de confirmar,
  // y si el empleado las ajusta a mano, esa lista editada es la que
  // luego se manda a createCreditAccount como "manualInstallments".
  previewInstallments(data: CreditScheduleInput) {
    const downPayment = data.downPayment || 0;
    const schedule = this.calculateInstallmentSchedule(data);

    const installments: (ScheduleLine & { isDownPayment: boolean })[] = [];

    if (downPayment > 0) {
      installments.push({
        installmentNumber: 1,
        amount: downPayment,
        dueDate: schedule.today,
        isDownPayment: true,
      });
    }

    installments.push(...schedule.installments.map((line) => ({ ...line, isDownPayment: false })));

    return {
      downPayment,
      financedPrincipal: data.totalAmount - downPayment,
      financedWithInterest: schedule.financedWithInterest,
      totalPayable: schedule.totalPayable,
      installments,
    };
  }

  async createCreditAccount(
    data: CreditScheduleInput & {
      companyId: string;
      clientId: string;
      sourceType: AccountTransactionSourceType;
      sourceId: string;
      // NUEVO: si el empleado ya ajustó las cuotas a mano (después de
      // previewInstallments), se pasan aquí y se guardan tal cual, sin
      // volver a calcular. Deben sumar el monto financiado con interés
      // (se valida con un margen de 1 centavo).
      manualInstallments?: { installmentNumber: number; amount: number; dueDate: string | Date }[];
    },
    manager?: EntityManager,
  ) {
    const transactionRepo = manager ? manager.getRepository(AccountTransaction) : this.transactionRepo;
    const installmentRepo = manager ? manager.getRepository(AccountInstallment) : this.installmentRepo;

    const downPayment = data.downPayment || 0;
    const financedPrincipal = data.totalAmount - downPayment;
    if (financedPrincipal <= 0) {
      throw new BadRequestException('El inicial cubre o supera el monto total.');
    }

    const today = new Date();
    let financedWithInterest: number;
    let installmentLines: ScheduleLine[];

    if (data.manualInstallments && data.manualInstallments.length > 0) {
      // MODO MANUAL: se respeta tal cual lo que ajustó el empleado.
      installmentLines = data.manualInstallments.map((line) => ({
        installmentNumber: line.installmentNumber,
        amount: Number(line.amount),
        dueDate: new Date(line.dueDate),
      }));

      const manualSum = Number(
        installmentLines.reduce((sum, line) => sum + line.amount, 0).toFixed(2),
      );
      const expectedFinanced = Number(
        (financedPrincipal * (1 + Number(data.interestRate || 0) / 100)).toFixed(2),
      );

      if (Math.abs(manualSum - expectedFinanced) > 0.01) {
        throw new BadRequestException(
          `Las cuotas ajustadas suman ${manualSum}, pero el monto financiado con interés es ${expectedFinanced}. Ajusta los montos para que cuadren.`,
        );
      }

      financedWithInterest = manualSum;
    } else {
      // MODO AUTOMÁTICO
      const schedule = this.calculateInstallmentSchedule(data);
      financedWithInterest = schedule.financedWithInterest;
      installmentLines = schedule.installments;
    }

    const totalPayable = Number((downPayment + financedWithInterest).toFixed(2));

    // 1. Crear la cuenta por cobrar general
    const transaction = transactionRepo.create({
      companyId: data.companyId,
      clientId: data.clientId,
      type: AccountTransactionType.RECEIVABLE,
      sourceType: data.sourceType,
      sourceId: data.sourceId,
      totalAmount: totalPayable,
      paidAmount: downPayment,
      downPayment,
      interestRate: data.interestRate,
      installmentFrequency: data.installmentFrequency,
      status:
        downPayment >= totalPayable
          ? AccountTransactionStatus.PAID
          : downPayment > 0
            ? AccountTransactionStatus.PARTIAL
            : AccountTransactionStatus.PENDING,
    });

    const savedTransaction = await transactionRepo.save(transaction);

    const installmentsToCreate: Partial<AccountInstallment>[] = [];

    // 2. Cuota 1 = el inicial, vencimiento HOY, ya pagada (solo si hay inicial)
    if (downPayment > 0) {
      installmentsToCreate.push({
        companyId: data.companyId,
        accountTransactionId: savedTransaction.id,
        installmentNumber: 1,
        amount: downPayment,
        paidAmount: downPayment,
        dueDate: today,
        status: AccountInstallmentStatus.PAID,
      });
    }

    // 3. Cuotas siguientes (automáticas o manuales, ya resueltas arriba)
    for (const line of installmentLines) {
      installmentsToCreate.push({
        companyId: data.companyId,
        accountTransactionId: savedTransaction.id,
        installmentNumber: line.installmentNumber,
        amount: line.amount,
        paidAmount: 0,
        dueDate: line.dueDate,
        status: AccountInstallmentStatus.PENDING,
      });
    }

    await installmentRepo.save(installmentsToCreate);

    return {
      message: 'Crédito y cuotas generadas exitosamente',
      transaction: savedTransaction,
      installmentsCount: installmentsToCreate.length,
      totalPayable,
      mode: data.manualInstallments ? 'manual' : 'automatico',
    };
  }

  async payInstallment(installmentId: string, paymentAmount: number) {
    const installment = await this.installmentRepo.findOne({
      where: { id: installmentId },
      relations: { accountTransaction: true },
    });

    if (!installment) {
      throw new NotFoundException('Cuota no encontrada');
    }

    if (installment.status === AccountInstallmentStatus.PAID) {
      throw new BadRequestException('Esta cuota ya está completamente pagada');
    }

    const remainingForInstallment = installment.amount - installment.paidAmount;

    if (paymentAmount > remainingForInstallment) {
      throw new BadRequestException(`El monto excede el saldo pendiente de la cuota (${remainingForInstallment})`);
    }

    installment.paidAmount = Number((Number(installment.paidAmount) + paymentAmount).toFixed(2));

    if (installment.paidAmount >= installment.amount) {
      installment.status = AccountInstallmentStatus.PAID;
    } else {
      installment.status = AccountInstallmentStatus.PARTIAL;
    }

    await this.installmentRepo.save(installment);

    const transaction = installment.accountTransaction;
    transaction.paidAmount = Number((Number(transaction.paidAmount) + paymentAmount).toFixed(2));

    if (transaction.paidAmount >= transaction.totalAmount) {
      transaction.status = AccountTransactionStatus.PAID;
    } else {
      transaction.status = AccountTransactionStatus.PARTIAL;
    }

    await this.transactionRepo.save(transaction);

    return {
      message: 'Pago aplicado exitosamente',
      installmentStatus: installment.status,
      installmentPaid: installment.paidAmount,
      transactionStatus: transaction.status,
      transactionTotalPaid: transaction.paidAmount,
    };
  }
}