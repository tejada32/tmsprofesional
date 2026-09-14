import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Branch } from '../branches/entities/branch.entity';
import { Company } from '../entities/company.entity';

@Injectable()
export class BranchesService {
  constructor(
    @InjectRepository(Branch)
    private branchRepository: Repository<Branch>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
  ) {}

  // Orden corregido: recibe primero el DTO y luego el companyId para empatar con el controlador
  async create(createBranchDto: any, companyId: string) {
    // 1. Obtener la empresa con su plan de suscripción
    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: { plan: true },
    });

    if (!company || !company.plan) {
      throw new BadRequestException('Empresa o plan de suscripción no válido');
    }

    // 2. Contar cuántas sucursales tiene actualmente la empresa
    const currentBranchesCount = await this.branchRepository.count({
      where: { companyId },
    });

    const maxBranches = company.plan.maxBranches; // Ej: Trial/Básico = 1, Profesional = 3, Enterprise = -1 (ilimitado)

    // 3. Validar si alcanzó el límite
    if (maxBranches !== null && maxBranches !== -1 && currentBranchesCount >= maxBranches) {
      throw new BadRequestException(
        `Ha alcanzado el límite máximo de sucursales (${maxBranches}) permitido para su [${company.plan.name}]. Actualice su plan para crear más.`,
      );
    }

    // 4. Si pasa la validación, crear la sucursal
    const branch = this.branchRepository.create({
      ...createBranchDto,
      companyId,
    });

    return await this.branchRepository.save(branch);
  }

  // Método requerido por el controlador para listar las sucursales de la empresa
  async findAllByCompany(companyId: string) {
    return await this.branchRepository.find({
      where: { companyId },
    });
  }
}