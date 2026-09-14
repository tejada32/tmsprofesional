// src/auth/auth.service.ts
import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { TrialLog } from '../entities/trial-log.entity';
import { SubscriptionPlan } from '../modules/subscriptions/entities/subscription-plan.entity';
import { CompanyConfig } from '../entities/company-config.entity';
import { UserSessionLog } from '../entities/user-session-log.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { BUSINESS_MODULES_MAP } from '../common/constants/business-modules.constant';
import { Branch } from '../branches/entities/branch.entity';
import { Warehouse } from '../entities/warehouse.entity';

const normalizeKey = (str: string) => {
  if (!str) return 'general';
  return str
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .trim();
};

// Resuelve el nombre por defecto de la sucursal y el almacén principal
// según la CATEGORÍA del plan (no la subcategoría). Estos nombres son
// solo el valor inicial al registrarse — el usuario puede renombrarlos
// después desde configuración (editando la sucursal/almacén normalmente).
const resolveDefaultBranchAndWarehouseNames = (category: string): { branchName: string; warehouseName: string } => {
  const normalized = normalizeKey(category);

  if (normalized.includes('servicios profesionales') || normalized.includes('prestamos') || normalized.includes('seguros')) {
    return { branchName: 'Oficina Principal', warehouseName: 'Almacén Oficina' };
  }
  if (normalized.includes('cuidado personal')) {
    return { branchName: 'Salón Principal', warehouseName: 'Almacén Salón' };
  }
  if (normalized.includes('varios')) {
    return { branchName: 'Taller Principal', warehouseName: 'Almacén Taller' };
  }

  // Venta General, Tiendas, Tecnología, Alimentos y Bebidas, Salud, y
  // cualquier categoría no reconocida caen aquí por defecto.
  return { branchName: 'Tienda Principal', warehouseName: 'Almacén Tienda' };
};

const resolveBusinessModules = (planSubcategoryValue: string): string[] => {
  const normalized = normalizeKey(planSubcategoryValue);

  if (BUSINESS_MODULES_MAP[normalized]) {
    return BUSINESS_MODULES_MAP[normalized];
  }

  if (normalized.includes('vendedor') || normalized.includes('independiente')) {
    return BUSINESS_MODULES_MAP['vg1'];
  }
  if (normalized.includes('colmado') || normalized.includes('minimarket')) {
    return BUSINESS_MODULES_MAP['vg2'];
  }
  if (normalized.includes('almacen') || normalized.includes('distribuidor')) {
    return BUSINESS_MODULES_MAP['vg3'];
  }
  if (normalized.includes('ferreter')) {
    return BUSINESS_MODULES_MAP['vg4'];
  }
  if (normalized.includes('mueble')) {
    return BUSINESS_MODULES_MAP['td1'];
  }
  if (normalized.includes('departamento')) {
    return BUSINESS_MODULES_MAP['td2'];
  }
  if (normalized.includes('electrodomestic')) {
    return BUSINESS_MODULES_MAP['td3'];
  }
  if (normalized.includes('computador')) {
    return BUSINESS_MODULES_MAP['tt01'];
  }
  if (normalized.includes('celular') || normalized.includes('electronica')) {
    return BUSINESS_MODULES_MAP['tt02'];
  }
  if (normalized.includes('taller') || normalized.includes('reparacion')) {
    return BUSINESS_MODULES_MAP['tt03'];
  }
  if (normalized.includes('restaurante')) {
    return BUSINESS_MODULES_MAP['va01'];
  }
  if (normalized.includes('cafeteria') || normalized.includes('comedor')) {
    return BUSINESS_MODULES_MAP['va02'];
  }
  if (normalized.includes('prestam') || normalized.includes('financier') || normalized.includes('cooperativ')) {
    return BUSINESS_MODULES_MAP['pt01'];
  }
  if (normalized.includes('instalador') || normalized.includes('ingenier') || normalized.includes('abogado') || normalized.includes('contador') || normalized.includes('consultor') || normalized.includes('servicios')) {
    return BUSINESS_MODULES_MAP['sp01'];
  }
  if (normalized.includes('seguro')) {
    return BUSINESS_MODULES_MAP['sg01'];
  }
  if (normalized.includes('peluquer') || normalized.includes('salon') || normalized.includes('spa') || normalized.includes('estetica') || normalized.includes('uñas') || normalized.includes('cuidado')) {
    return BUSINESS_MODULES_MAP['cp01'];
  }
  if (normalized.includes('farmacia')) {
    return BUSINESS_MODULES_MAP['sl01'];
  }

  return BUSINESS_MODULES_MAP['default'];
};
@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Company)
    private companyRepository: Repository<Company>,
    @InjectRepository(TrialLog)
    private trialLogRepository: Repository<TrialLog>,
    @InjectRepository(SubscriptionPlan)
    private planRepository: Repository<SubscriptionPlan>,
    @InjectRepository(CompanyConfig)
    private companyConfigRepository: Repository<CompanyConfig>,
    @InjectRepository(UserSessionLog)
    private sessionLogRepository: Repository<UserSessionLog>,
    private dataSource: DataSource,
    private jwtService: JwtService,
  ) {}

   async register(registerDto: RegisterDto, rawIpAddress: string) {
    // ... (validaciones previas de email, región, plan, etc. se mantienen igual)
    const { 
      email, 
      password, 
      name, 
      companyName, 
      phone, 
      taxId, 
      region, 
      country, 
      userFunction, 
      customUserFunction, 
      planType, 
      planCategory, 
      planSubcategory, 
      deviceUuid 
    } = registerDto;

    if (!email || email.trim() === '') {
      throw new BadRequestException('El correo electrónico es obligatorio para el registro.');
    }

    if (region !== 'Latam') {
      throw new BadRequestException(
        'Esta región no está disponible por el momento. Debe elegir un país de la región Latam para continuar.'
      );
    }

    if (!rawIpAddress || rawIpAddress === 'unknown' || rawIpAddress.trim() === '') {
      throw new BadRequestException('No se pudo verificar la dirección IP de origen de forma segura o se detectó uso de ocultamiento.');
    }
    const ipAddress = rawIpAddress;

    const existingUser = await this.userRepository.findOne({ where: { email } });
    if (existingUser) {
      throw new BadRequestException('Ya se ha registrado antes con ese correo electrónico, no puede usarlo 2 veces');
    }

    let plan = null;
    const planIdentifier = registerDto['plan'] || planSubcategory;

    if (planIdentifier) {
      const isUuid = /^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12}$/.test(planIdentifier);
      const queryBuilder = this.planRepository.createQueryBuilder('plan');

      if (isUuid) {
        queryBuilder.where('plan.id = :id OR plan.abbreviation = :id OR plan.subCategory = :id OR plan.planName = :id', { 
          id: planIdentifier 
        });
      } else {
        queryBuilder.where('plan.abbreviation ILIKE :val OR plan.subCategory ILIKE :val OR plan.planName ILIKE :val', { 
          val: `%${planIdentifier}%` 
        });
      }

      plan = await queryBuilder.getOne();
    }

    if (!plan) {
      throw new BadRequestException(`No se encontró ningún plan de suscripción para el identificador: "${planIdentifier}"`);
    }

    const isTrialPlan = planType === 'trial';
    if (isTrialPlan) {
      const trialCount = await this.trialLogRepository.count({
        where: [{ ipAddress }, { deviceUuid }],
      });

      if (trialCount >= 3) {
        throw new BadRequestException(
          'Ya agotó el uso de versiones de prueba, utilice uno de los planes Pro (pagados) para registrarse',
        );
      }
    }

    const trialEndsAt = isTrialPlan 
      ? new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) 
      : null;
    
    const now = new Date();
    let subscriptionEndsAt = new Date();

    if (planType === 'trial') {
      subscriptionEndsAt.setDate(now.getDate() + 3);
    } else {
      const cycle = registerDto['billingCycle'] || '1-mes';
      switch (cycle) {
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

    const planContext = `${planCategory || ''} ${planSubcategory || ''}`;
    const businessModules = (plan.allowedModules && plan.allowedModules.length > 0)
      ? plan.allowedModules
      : resolveBusinessModules(planContext);

    const resolvedBusinessType = plan 
      ? `${plan.subCategory} (${plan.planName} - $${plan.priceUsd})` 
      : (planSubcategory || 'Plan Estándar');

    const rawPassword = password && password.trim() !== '' ? password : 'tmsprofesional';
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(rawPassword, saltRounds);

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // 1. Crear Compañía
      const company = queryRunner.manager.create(Company, {
        name: companyName,
        phone,
        taxId: taxId || null,
        region,
        country,
        businessType: resolvedBusinessType,
        subscriptionPlanId: plan.id,
        isSetupCompleted: false,
        trialEndsAt,
        subscriptionEndsAt,
      });
      const savedCompany = await queryRunner.manager.save(company);

      // 2. Crear sucursal principal por defecto (nombre según categoría)
      const { branchName, warehouseName } = resolveDefaultBranchAndWarehouseNames(plan.category || '');

      const mainBranch = queryRunner.manager.create(Branch, {
        name: branchName,
        isWarehouse: false,
        companyId: savedCompany.id,
      });
      const savedBranch = await queryRunner.manager.save(mainBranch);

      // 3. Crear almacén principal por defecto, atado a la sucursal principal
      const mainWarehouse = queryRunner.manager.create(Warehouse, {
        name: warehouseName,
        companyId: savedCompany.id,
        branchId: savedBranch.id,
        isVehicle: false,
      });
      await queryRunner.manager.save(mainWarehouse);

      // 4. Crear Usuario Administrador
      const user = queryRunner.manager.create(User, {
        name,
        email,
        passwordHash,
        companyId: savedCompany.id,
        role: 'admin',
        subRole: null,
        mustChangePassword: rawPassword === 'tmsprofesional',
      });
      const savedUser = await queryRunner.manager.save(user);

      // 5. Configuración inicial de módulos
      const companyConfig = queryRunner.manager.create(CompanyConfig, {
        companyId: savedCompany.id,
        businessType: resolvedBusinessType,
        activeModules: businessModules,
      });
      await queryRunner.manager.save(companyConfig);

      if (isTrialPlan) {
        const trialLog = queryRunner.manager.create(TrialLog, {
          ipAddress,
          deviceUuid,
          email,
        });
        await queryRunner.manager.save(trialLog);
      }

      await queryRunner.commitTransaction();

      const { passwordHash: _, ...userResult } = savedUser;

      return {
        message: 'Registro exitoso en TMS Profesional',
        company: savedCompany,
        branch: savedBranch,
        warehouse: mainWarehouse,
        user: userResult,
        assignedModules: businessModules,
      };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw new BadRequestException(`Error en el proceso de registro: ${error.message}`);
    } finally {
      await queryRunner.release();
    }
  }

  // ... (métodos login y getCompanyWithPlan se mantienen intactos)
 async login(loginDto: LoginDto, connectionType: string = 'browser', ipAddress: string = '127.0.0.1') {
    const { email, password } = loginDto;

    const user = await this.userRepository
      .createQueryBuilder('user')
      .leftJoinAndSelect('user.company', 'company')
      .addSelect('user.passwordHash') // necesario: passwordHash ahora es select:false por defecto
      .where('user.email = :email', { email })
      .getOne();

    if (!user) {
      throw new UnauthorizedException('Credenciales inválidas o correo no registrado.');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Contraseña incorrecta.');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      companyId: user.companyId,
      role: user.role,
    };

    const accessToken = this.jwtService.sign(payload);

    const { passwordHash: _, ...userResult } = user;

    return {
      statusCode: 200,
      message: 'Inicio de sesión exitoso',
      accessToken,
      user: userResult,
    };
  }
};