// src/companies/companies.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity'; // Asegúrate de que la ruta a la entidad sea correcta según tu estructura de carpetas
import { BusinessType } from './enums/business-type.enum';
import { CompanyConfig } from '../entities/company-config.entity';
import { BUSINESS_TEMPLATES } from './company-templates.constant';
import { SetupCompanyDto } from './dto/setup-company.dto';
import { Client, ClientType, ClientDocumentType, ClientStatus } from '../entities/client.entity';

@Injectable()
export class CompaniesService {
  constructor(
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    @InjectRepository(CompanyConfig)
    private readonly configRepo: Repository<CompanyConfig>,
    @InjectRepository(Client)
    private readonly clientRepository: Repository<Client>,
  ) {}

  async createCompanyConfig(companyId: string, businessType: string): Promise<CompanyConfig> {
    const template = BUSINESS_TEMPLATES[businessType] || BUSINESS_TEMPLATES[BusinessType.GENERAL_STORE_DELIVERY];

    const config = this.configRepo.create({
      companyId,
      businessType,
      activeModules: template.modules,
    });

    return await this.configRepo.save(config);
  }

  // NUEVO: crea el cliente genérico "Contado" que se usa en ventas de
  // mostrador sin cliente real asociado. Código reservado = 1, para que
  // el facturador pueda digitarlo de memoria. Es idempotente: si ya
  // existe (por ejemplo, si el onboarding se corre dos veces), no crea
  // un duplicado.
  async ensureCashClient(companyId: string): Promise<Client> {
    const existing = await this.clientRepository.findOne({
      where: { companyId, isCashClient: true },
    });
    if (existing) {
      return existing;
    }

    const cashClient = this.clientRepository.create({
      companyId,
      clientCode: 1,
      fullName: 'Contado',
      documentType: ClientDocumentType.CEDULA,
      clientType: ClientType.INDIVIDUAL,
      status: ClientStatus.ACTIVO,
      isCashClient: true,
    });

    return await this.clientRepository.save(cashClient);
  }

  async setBusinessType(companyId: string, businessType: BusinessType) {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException('Compañía no encontrada');
    }

    company.businessType = businessType;
    return await this.companyRepository.save(company);
  }

  // Alias requerido por el controlador (selectBusinessType)
  async selectBusinessType(companyId: string, dto: { businessType: BusinessType }) {
    return this.setBusinessType(companyId, dto.businessType);
  }

  // Método requerido por el controlador para actualizar configuraciones generales
  async updateConfig(companyId: string, updateData: any) {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });
    if (!company) {
      throw new NotFoundException('Compañía no encontrada');
    }

    Object.assign(company, updateData);
    return await this.companyRepository.save(company);
  }

  async completeOnboarding(companyId: string, setupData: SetupCompanyDto) {
    const company = await this.companyRepository.findOne({ where: { id: companyId } });

    if (!company) throw new NotFoundException('Empresa no encontrada');

    company.businessType = setupData.businessType;
    company.plan = setupData.plan as any;
    company.isSetupCompleted = true;
    await this.companyRepository.save(company);

    await this.createCompanyConfig(companyId, setupData.businessType);

    // NUEVO: toda empresa que termina su onboarding sale con su cliente
    // "Contado" ya creado, código 1.
    await this.ensureCashClient(companyId);

    return { message: 'Configuración de negocio completada exitosamente', company };
  }
}
