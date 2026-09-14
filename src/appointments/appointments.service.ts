// src/appointments/appointments.service.ts
import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, Not } from 'typeorm';
import { Appointment } from '../entities/appointment.entity';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectRepository(Appointment)
    private readonly appointmentRepository: Repository<Appointment>,
  ) {}

  async create(companyId: string, branchId: string, dto: { employeeId: string; clientName: string; clientPhone?: string; startTime: string; endTime: string; notes?: string }) {
    const start = new Date(dto.startTime);
    const end = new Date(dto.endTime);

    if (start >= end) {
      throw new BadRequestException('La hora de inicio debe ser anterior a la hora de fin.');
    }

    const overlapping = await this.appointmentRepository.findOne({
      where: {
        companyId,
        branchId,
        employeeId: dto.employeeId,
        status: Not('cancelled'),
        startTime: LessThanOrEqual(end),
        endTime: MoreThanOrEqual(start),
      },
    });

    if (overlapping) {
      throw new BadRequestException('El profesional ya tiene una cita programada que se cruza con este horario.');
    }

    const appointment = this.appointmentRepository.create({
      companyId,
      branchId,
      employeeId: dto.employeeId,
      clientName: dto.clientName,
      clientPhone: dto.clientPhone,
      startTime: start,
      endTime: end,
      notes: dto.notes,
      status: 'scheduled',
    });

    return await this.appointmentRepository.save(appointment);
  }

  async findAll(companyId: string, branchId: string) {
    return await this.appointmentRepository.find({
      where: { companyId, branchId },
      relations: { employee: true },
      order: { startTime: 'ASC' },
    });
  }

  async updateStatus(id: string, status: string, companyId: string) {
    const appointment = await this.appointmentRepository.findOne({ where: { id, companyId } });
    if (!appointment) {
      throw new NotFoundException('Cita no encontrada');
    }
    appointment.status = status;
    return await this.appointmentRepository.save(appointment);
  }
}