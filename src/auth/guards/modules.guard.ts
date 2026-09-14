// src/auth/guards/modules.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException, NotFoundException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { MODULE_KEY } from '../../common/decorators/require-module.decorator';
import { AuthService } from '../auth.service';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../entities/company.entity';

@Injectable()
export class ModulesGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly authService: AuthService,
    @InjectRepository(Company)
    private readonly companyRepository: Repository<Company>, // <-- Inyección añadida
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.getAllAndOverride<string>(MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.companyId) {
      throw new ForbiddenException('No autorizado o empresa no especificada');
    }

    const companyId = user.companyId; // <-- Definir la variable companyId

    const company = await this.companyRepository.findOne({
      where: { id: companyId },
      relations: { plan: true },
    });

    if (!company) {
      throw new NotFoundException('Compañía no encontrada');
    }

    // 1. Validar si el período de prueba de 3 días ha expirado
    if (company.trialEndsAt && new Date() > new Date(company.trialEndsAt)) {
      throw new ForbiddenException('El período de prueba de 3 días ha expirado. Por favor, actualice su plan.');
    }

    if (!requiredModule) {
      return true;
    }

    // CORREGIDO: se eliminó el paso que buscaba en BUSINESS_MODULES_MAP
    // (business-modules.constant.ts) usando company.businessType como
    // clave. Esa búsqueda nunca podía tener éxito: company.businessType
    // se guarda como texto libre (ej. "Restaurante (Plan Pro - $40)"),
    // no como el código corto ('va01') que usaba ese archivo como clave.
    // Resultado: businessTypeModules siempre quedaba vacío y CUALQUIER
    // ruta con @RequireModule(...) rechazaba a todo el mundo, sin
    // importar el plan o el negocio.
    //
    // La fuente de verdad real y ya funcional es la tabla
    // subscription_plans (columna allowedModules), a través de
    // company.plan. Validamos directamente contra eso.

    // 2. Validar permisos según el plan de suscripción o add-ons activos
    const plan = company.plan;
    let hasPlanAccess = false;

    // Verificar si el módulo está incluido en el plan base
    if (plan && plan.allowedModules) {
      const rawModules = plan.allowedModules as unknown;
      let planModules: string[] = [];

      if (Array.isArray(rawModules)) {
        planModules = rawModules as string[];
      } else if (typeof rawModules === 'string') {
        planModules = rawModules.split(',').map((m) => m.trim());
      } else {
        planModules = String(rawModules).split(',').map((m) => m.trim());
      }

      if (planModules.includes('all') || planModules.includes(requiredModule)) {
        hasPlanAccess = true;
      }
    }

    // Verificar si el módulo está cubierto por un Add-on activo (ej: 'maintenance' por $5)
    if (!hasPlanAccess && company.activeAddons && Array.isArray(company.activeAddons)) {
      if (company.activeAddons.includes(requiredModule)) {
        hasPlanAccess = true;
      }
    }

    if (!hasPlanAccess) {
      throw new ForbiddenException(`Su plan de suscripción o add-ons actuales no incluyen acceso al módulo: [${requiredModule}]`);
    }

    return true;
  }
}