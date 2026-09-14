// src/companies/company.controller.ts
import {
  Controller,
  Patch,
  Body,
  UseGuards,
  Req,
  Post,
  BadRequestException,
} from '@nestjs/common';

import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { PasswordChangeGuard } from '../auth/guards/password-change.guard';

import { SelectBusinessTypeDto } from './dto/select-business-type.dto';
import { CompaniesService } from './companies.service';
import { RegisterCompanyDto } from './dto/register-company.dto';
import { SetupCompanyDto } from './dto/setup-company.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { Company } from '../entities/company.entity';
import { Repository, DataSource } from 'typeorm';

import { Public } from '../common/decorators/public.decorator';
import { UserService } from '../users/user.service';

@UseGuards(JwtAuthGuard, PasswordChangeGuard)
@Controller('companies')
export class CompanyController {
  constructor(
    private readonly companiesService: CompaniesService,
    private readonly userService: UserService,

    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>,
    private readonly dataSource: DataSource,
  ) {}

   @Patch('config')
  async updateConfig(@Req() req: any, @Body() body: Record<string, any>) {
    const companyId = req.user.companyId;
    return this.companiesService.updateConfig(companyId, body);
  }


  @Patch('business-type')
  async updateBusinessType(
    @Req() req: any,
    @Body() dto: SelectBusinessTypeDto,
  ) {
    const companyId = req.user.companyId;
    return this.companiesService.selectBusinessType(companyId, dto);
  }
  

  @Public()
  @Post('register')
  async register(@Body() registerDto: RegisterCompanyDto) {
    const existingUser = await this.userService.findByEmail(
      registerDto.adminEmail,
    );

    if (existingUser) {
      throw new BadRequestException(
        'El correo electrónico ya está registrado en el sistema.',
      );
    }

    // Transacción atómica para asegurar consistencia
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Calcular la fecha de expiración de la suscripción
      const now = new Date();
      let subscriptionEndsAt = new Date();

      if (registerDto.planType === 'trial') {
        subscriptionEndsAt.setDate(now.getDate() + 3); // 3 días de prueba
      } else {
        switch (registerDto.billingCycle) {
          case '1-mes':
            subscriptionEndsAt.setMonth(now.getMonth() + 1);
            break;
          case '3-meses':
            subscriptionEndsAt.setMonth(now.getMonth() + 3);
            break;
          case '6-meses':
            subscriptionEndsAt.setMonth(now.getMonth() + 6);
            break;
          case '1-ano':
            subscriptionEndsAt.setFullYear(now.getFullYear() + 1);
            break;
          default:
            subscriptionEndsAt.setMonth(now.getMonth() + 1);
        }
      }

      const newCompany = queryRunner.manager.create(Company, {
        name: registerDto.companyName,
        plan: registerDto.plan as any,
        businessType: registerDto.businessType,
        subscriptionEndsAt,
        isSetupCompleted: true,
      });

      const savedCompany = await queryRunner.manager.save(newCompany);

      await this.companiesService.createCompanyConfig(
        savedCompany.id,
        registerDto.businessType,
      );

      const adminUser = await this.userService.create({
        name: 'Administrador General',
        email: registerDto.adminEmail,
        password: registerDto.password || 'tmsprofesional',
        role: 'ADMIN',
        companyId: savedCompany.id,
        mustChangePassword: true,
        passwordChangedAt: new Date(),
      });

      await queryRunner.commitTransaction();

      return {
        message: 'Empresa y usuario administrador registrados exitosamente',
        companyId: savedCompany.id,
        adminEmail: adminUser.email,
      };
    } catch (error) {
      console.error('DETALLE DEL ERROR SQL:', error);
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error en el proceso de registro: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  @Post('setup-onboarding')
  @UseGuards(JwtAuthGuard)
  async setupOnboarding(
    @Req() req: any,
    @Body() setupData: SetupCompanyDto,
  ) {
    const companyId = req.user.companyId;
    return await this.companiesService.completeOnboarding(
      companyId,
      setupData,
    );
  }
}