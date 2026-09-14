// src/tips/tips.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Tip, TipStatus } from '../entities/tip.entity';
import { TipPayout } from '../entities/tip-payout.entity';

@Injectable()
export class TipsService {
  constructor(
    @InjectRepository(Tip)
    private readonly tipRepo: Repository<Tip>,
    @InjectRepository(TipPayout)
    private readonly tipPayoutRepo: Repository<TipPayout>,
  ) {}

  async getPendingTipsByEmployee(companyId: string) {
    const pendingTips = await this.tipRepo.find({
      where: { companyId, status: TipStatus.PENDING },
      relations: { employee: true }, // Corregido para TypeORM v0.3+
    });

    const grouped = pendingTips.reduce((acc, tip) => {
      const empId = tip.employeeId;
      if (!acc[empId]) {
        acc[empId] = {
          employeeId: empId,
          employeeName: tip.employee?.fullName,
          totalPending: 0,
          tipIds: [],
        };
      }
      acc[empId].totalPending += Number(tip.amount);
      acc[empId].tipIds.push(tip.id);
      return acc;
    }, {} as Record<string, any>);

    return Object.values(grouped);
  }

  async processCashPayout(companyId: string, employeeIds: string[], cashierId: string) {
    if (!employeeIds || employeeIds.length === 0) {
      throw new BadRequestException('Debe seleccionar al menos un empleado para el desembolso');
    }

    const tipsToPay = await this.tipRepo.find({
      where: {
        companyId,
        employeeId: In(employeeIds),
        status: TipStatus.PENDING,
      },
    });

    if (tipsToPay.length === 0) {
      throw new BadRequestException('No hay propinas pendientes para los empleados seleccionados');
    }

    const totalPaidAmount = tipsToPay.reduce((sum, tip) => sum + Number(tip.amount), 0);

    const payout = this.tipPayoutRepo.create({
      companyId,
      cashierEmployeeId: cashierId,
      totalPaidAmount,
    });
    const savedPayout = await this.tipPayoutRepo.save(payout);

    const tipIds = tipsToPay.map((t) => t.id);
    await this.tipRepo.update(
      { id: In(tipIds) },
      { status: TipStatus.PAID, payoutId: savedPayout.id },
    );

    return {
      message: 'Desembolso de propinas procesado con éxito',
      payoutId: savedPayout.id,
      totalPaidAmount,
      employeesProcessed: employeeIds.length,
    };
  }

  async getPendingTipsForPayroll(companyId: string, employeeId: string) {
    return this.tipRepo.find({
      where: {
        companyId,
        employeeId,
        status: TipStatus.PENDING,
      },
    });
  }
}