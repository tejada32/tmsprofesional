// src/services/loan-san.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Loan, LoanStatus } from '../entities/loan.entity';
import { CreateLoanDto } from '../loans/dto/create-loan.dto';

@Injectable()
export class LoanSanService {
  constructor(
    @InjectRepository(Loan)
    private loanRepo: Repository<Loan>,
  ) {}

  // Configuración predeterminada modificable de la empresa
  private companyConfig = {
    graceDays: 3,             // Días de gracia antes de aplicar mora
    delayDaysTrigger: 4,      // Días de retraso exactos para activar el cobro de mora
    lateFeePercentage: 5.0,   // Porcentaje de mora a aplicar sobre la cuota vencida
  };

  // Método para actualizar la configuración de mora desde el panel de administración
  async updateCompanyLoanConfig(config: { graceDays: number; delayDaysTrigger: number; lateFeePercentage: number }) {
    this.companyConfig = { ...this.companyConfig, ...config };
    return { message: 'Configuración de mora y plazos actualizada correctamente', config: this.companyConfig };
  }

  // Simulación y Creación de Préstamo tipo "San" / Cuotas Redondas Fijas
  async createSanOrFixedLoan(data: {
    companyId: string;
    clientId: string;
    principalAmount: number;
    totalPayable: number;      // Monto total acordado (Ej: 1200 para el préstamo de 1000)
    installmentsCount: number; // Cantidad de plazos (Ej: 6 cuotas)
    installmentAmount: number; // Cuota fija redonda (Ej: 200 pesos semanal)
  }) {
    if (!data.principalAmount || !data.totalPayable || !data.installmentsCount || !data.installmentAmount) {
      throw new BadRequestException('Todos los campos del préstamo tipo San son obligatorios');
    }

    // Validación de cuadre matemático del San (Cuota * Cantidad debe igualar al Total a Pagar)
    const expectedTotal = Number((data.installmentAmount * data.installmentsCount).toFixed(2));
    if (expectedTotal !== data.totalPayable) {
      throw new BadRequestException(`El total de las cuotas (${expectedTotal}) no coincide con el total a pagar acordado (${data.totalPayable})`);
    }

    // Cálculo automático del porcentaje de interés global del préstamo
    const interestRate = data.principalAmount > 0 
      ? Number((((data.totalPayable - data.principalAmount) / data.principalAmount) * 100).toFixed(2)) 
      : 0;

    const loan = this.loanRepo.create({
      companyId: data.companyId,
      clientId: data.clientId,
      principalAmount: data.principalAmount,
      interestRate: interestRate,
      installmentsCount: data.installmentsCount,
      totalPayable: data.totalPayable,
      status: LoanStatus.ACTIVE,
    });

    const savedLoan = await this.loanRepo.save(loan);

    return {
      message: 'Préstamo tipo San registrado con éxito',
      loanDetails: savedLoan,
      schedulePlan: {
        installmentValue: data.installmentAmount,
        frequency: 'Semanal / Frecuencia fija',
        totalInstallments: data.installmentsCount,
        graceDaysConfigured: this.companyConfig.graceDays,
        lateFeeTriggerDays: this.companyConfig.delayDaysTrigger,
        lateFeeRate: `${this.companyConfig.lateFeePercentage}%`,
      }
    };
  }

  // Motor de cálculo de Mora por atraso
  async calculateLateFee(installmentAmount: number, daysLate: number) {
    if (daysLate <= this.companyConfig.graceDays) {
      return { status: 'Al día o en período de gracia', delayDays: daysLate, lateFee: 0 };
    }

    if (daysLate >= this.companyConfig.delayDaysTrigger) {
      // Aplica el porcentaje de mora configurado sobre el valor de la cuota vencida
      const lateFeeAmount = Number((installmentAmount * (this.companyConfig.lateFeePercentage / 100)).toFixed(2));
      return {
        status: 'Mora aplicada',
        delayDays: daysLate,
        baseInstallment: installmentAmount,
        lateFee: lateFeeAmount,
        totalWithLateFee: Number((installmentAmount + lateFeeAmount).toFixed(2)),
      };
    }

    return { status: 'Evaluando estado de retraso', delayDays: daysLate, lateFee: 0 };
  }
  // Método para listar todos los préstamos de la empresa
  async findAllByCompany(companyId: string) {
    return await this.loanRepo.find({
      where: { companyId },
      order: { createdAt: 'DESC' }, // Los más recientes primero
    });
  }
}