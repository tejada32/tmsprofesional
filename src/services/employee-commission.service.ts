// src/services/employee-commission.service.ts

import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';

import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import {
  Employee,
  EmployeeRole,
  TechnicalCommissionType,
} from '../entities/employee.entity';

@Injectable()
export class EmployeeCommissionService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepo: Repository<Employee>,
  ) {}

  // =========================================================
  // COMISIÓN POR VENTA
  // =========================================================

  async calculateSalesCommission(
    employeeId: string,
    totalSaleAmount: number,
  ) {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        'Empleado no encontrado',
      );
    }

    if (employee.role !== EmployeeRole.VENDOR) {
      throw new BadRequestException(
        'El empleado seleccionado no está asignado como Vendedor',
      );
    }

    if (totalSaleAmount < 0) {
      throw new BadRequestException(
        'El monto de la venta no puede ser negativo',
      );
    }

    const rate = Number(
      employee.salesCommissionRate,
    );

    const commissionEarned =
      (totalSaleAmount * rate) / 100;

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      role: employee.role,

      baseAmount: totalSaleAmount,

      commissionType:
        TechnicalCommissionType.PERCENTAGE,

      rateApplied: rate,

      rateDescription: `${rate}%`,

      commissionEarned: Number(
        commissionEarned.toFixed(2),
      ),
    };
  }

  // =========================================================
  // COMISIÓN POR COBRO
  // =========================================================

  async calculateCollectionCommission(
    employeeId: string,
    collectedAmount: number,
  ) {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        'Empleado no encontrado',
      );
    }

    if (employee.role !== EmployeeRole.COLLECTOR) {
      throw new BadRequestException(
        'El empleado seleccionado no está asignado como Cobrador',
      );
    }

    if (collectedAmount < 0) {
      throw new BadRequestException(
        'El monto cobrado no puede ser negativo',
      );
    }

    const rate = Number(
      employee.collectionCommissionRate,
    );

    const commissionEarned =
      (collectedAmount * rate) / 100;

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      role: employee.role,

      collectedAmount,

      commissionType:
        TechnicalCommissionType.PERCENTAGE,

      rateApplied: rate,

      rateDescription: `${rate}%`,

      commissionEarned: Number(
        commissionEarned.toFixed(2),
      ),
    };
  }

  // =========================================================
  // COMISIÓN POR TRABAJO TÉCNICO
  // =========================================================

  async calculateTechnicalCommission(
    employeeId: string,
    repairCost: number,
  ) {
    const employee = await this.employeeRepo.findOne({
      where: { id: employeeId },
    });

    if (!employee) {
      throw new NotFoundException(
        'Empleado no encontrado',
      );
    }

    if (employee.role !== EmployeeRole.TECHNICIAN) {
      throw new BadRequestException(
        'El empleado seleccionado no está asignado como Técnico',
      );
    }

    if (repairCost < 0) {
      throw new BadRequestException(
        'El costo de reparación no puede ser negativo',
      );
    }

    const commissionType =
      employee.technicalCommissionType;

    const commissionValue = Number(
      employee.technicalCommissionValue,
    );

    let commissionEarned: number;

    // =======================================================
    // COMISIÓN POR PORCENTAJE
    // =======================================================

    if (
      commissionType ===
      TechnicalCommissionType.PERCENTAGE
    ) {
      commissionEarned =
        (repairCost * commissionValue) / 100;
    }

    // =======================================================
    // COMISIÓN POR MONTO FIJO
    // =======================================================

    else if (
      commissionType ===
      TechnicalCommissionType.FIXED
    ) {
      commissionEarned = commissionValue;
    }

    // =======================================================
    // CONFIGURACIÓN INVÁLIDA
    // =======================================================

    else {
      throw new BadRequestException(
        'Tipo de comisión técnica no válido',
      );
    }

    return {
      employeeId: employee.id,
      employeeName: employee.fullName,
      role: employee.role,

      repairCost,

      commissionType,

      rateApplied: commissionValue,

      rateDescription:
        commissionType ===
        TechnicalCommissionType.PERCENTAGE
          ? `${commissionValue}%`
          : `Monto fijo: ${commissionValue}`,

      commissionEarned: Number(
        commissionEarned.toFixed(2),
      ),
    };
  }
}