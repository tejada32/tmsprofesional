import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
import { Branch } from '../branches/entities/branch.entity';

@Injectable()
export class SubscriptionGuard implements CanActivate {
  constructor(
    @InjectRepository(Company)
    private companyRepo: Repository<Company>,
    @InjectRepository(Branch)
    private branchRepo: Repository<Branch>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const companyId = request.user?.companyId;

    if (!companyId) return false;

    const company = await this.companyRepo.findOne({ 
      where: { id: companyId }, 
      relations: { plan: true } 
    });

    if (!company || !company.plan) {
      throw new ForbiddenException('No tienes un plan de suscripción asignado.');
    }

    const method = request.method;
    const path = request.route?.path || '';

    if (method === 'POST' && path.includes('branches')) {
      const currentBranchesCount = await this.branchRepo.count({ where: { companyId } });

      if (currentBranchesCount >= company.plan.maxBranches) {
        throw new ForbiddenException(
          `Has alcanzado el límite de sucursales permitidas (${company.plan.maxBranches}) para tu plan actual. Actualiza tu plan para crear más.`
        );
      }
    }

    return true; 
  }
}