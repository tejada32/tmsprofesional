// src/services/cashier-shift.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { CashierShift } from '../entities/cashier-shift.entity';
import { Tip, TipStatus } from '../entities/tip.entity';
import { TipPayout } from '../entities/tip-payout.entity';

@Injectable()
export class CashierShiftService {
  constructor(
    @InjectRepository(CashierShift)
    private readonly cashierShiftRepo: Repository<CashierShift>,
    @InjectRepository(Tip)
    private readonly tipRepo: Repository<Tip>,
    @InjectRepository(TipPayout)
    private readonly tipPayoutRepo: Repository<TipPayout>,
  ) {}

  // 1. Abrir Turno de Caja
  async openShift(companyId: string, branchId: string, userId: string, openingBalance: number) {
    const activeShift = await this.cashierShiftRepo.findOne({
      where: { userId, status: 'OPEN' },
    });

    if (activeShift) {
      throw new BadRequestException('El usuario ya tiene un turno de caja abierto.');
    }

    const newShift = this.cashierShiftRepo.create({
      companyId,
      branchId,
      userId,
      openingBalance,
      expectedBalance: openingBalance, // Se actualizará con ventas y propinas al cerrar
      status: 'OPEN',
    });

    return await this.cashierShiftRepo.save(newShift);
  }

  // 2. Cerrar Turno de Caja con Cálculo Dinámico de Propinas
  async closeShift(shiftId: string, closedBalance: number, totalCashSales: number = 0) {
    const shift = await this.cashierShiftRepo.findOne({ where: { id: shiftId } });

    if (!shift) {
      throw new NotFoundException('Turno de caja no encontrado.');
    }

    if (shift.status === 'CLOSED') {
      throw new BadRequestException('Este turno de caja ya se encuentra cerrado.');
    }

    const closedAt = new Date();

    // Consulta dinámica: Propinas pagadas en efectivo durante la ventana de este turno
    const payoutsDuringShift = await this.tipPayoutRepo.find({
      where: {
        companyId: shift.companyId,
        createdAt: Between(shift.openedAt, closedAt),
      },
    });
    const totalPaidTipsCash = payoutsDuringShift.reduce((sum, p) => sum + Number(p.totalPaidAmount), 0);

    // Consulta dinámica: Propinas pendientes generadas que se quedaron físicas en gaveta (no cobradas)
    const pendingTipsDuringShift = await this.tipRepo.find({
      where: {
        companyId: shift.companyId,
        status: TipStatus.PENDING,
        createdAt: Between(shift.openedAt, closedAt),
      },
    });
    const totalPendingTipsInDrawer = pendingTipsDuringShift.reduce((sum, t) => sum + Number(t.amount), 0);

    // Cálculo del balance esperado de forma dinámica:
    // Fondo inicial + Ventas netas en efectivo + Propinas pendientes físicas - Propinas pagadas en caja
    const expectedBalance = 
      Number(shift.openingBalance) + 
      Number(totalCashSales) + 
      totalPendingTipsInDrawer - 
      totalPaidTipsCash;

    // Calcular diferencia (Sobrante o Faltante)
    const difference = closedBalance - expectedBalance;

    shift.expectedBalance = Number(expectedBalance.toFixed(2));
    shift.closedBalance = closedBalance;
    shift.difference = Number(difference.toFixed(2));
    shift.status = 'CLOSED';
    shift.closedAt = closedAt;

    const savedShift = await this.cashierShiftRepo.save(shift);

    return {
      shift: savedShift,
      summary: {
        openingBalance: shift.openingBalance,
        cashSales: totalCashSales,
        paidTipsCash: totalPaidTipsCash,
        pendingTipsRetained: totalPendingTipsInDrawer,
        expectedBalance: Number(expectedBalance.toFixed(2)),
        actualClosedBalance: closedBalance,
        difference: Number(difference.toFixed(2)),
      },
    };
  }
}