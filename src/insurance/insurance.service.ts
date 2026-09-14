// src/insurance/insurance.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { InsurancePolicy } from '../entities/insurance-policy.entity';

@Injectable()
export class InsuranceService {
  constructor(
    @InjectRepository(InsurancePolicy)
    private readonly policyRepository: Repository<InsurancePolicy>,
  ) {}

  async createPolicy(companyId: string, dto: { branchId?: string; policyNumber: string; clientName: string; insuranceCompany: string; category: string; startDate: string; endDate: string; premiumAmount: number }) {
    const policy = this.policyRepository.create({
      companyId,
      ...dto,
      status: 'active',
    });
    return await this.policyRepository.save(policy);
  }

  async findAllPolicies(companyId: string) {
    return await this.policyRepository.find({
      where: { companyId },
      order: { endDate: 'ASC' },
    });
  }

  async updatePolicyStatus(id: string, status: string, companyId: string) {
    const policy = await this.policyRepository.findOne({ where: { id, companyId } });
    if (!policy) {
      throw new NotFoundException('Póliza de seguro no encontrada');
    }
    policy.status = status;
    return await this.policyRepository.save(policy);
  }
}