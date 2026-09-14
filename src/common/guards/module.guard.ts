// src/common/guards/module.guard.ts
import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CompanyConfig } from '../../entities/company-config.entity';
import { MODULE_KEY } from '../decorators/require-module.decorator';

@Injectable()
export class ModuleGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(CompanyConfig)
    private readonly configRepo: Repository<CompanyConfig>,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredModule = this.reflector.getAllAndOverride<string>(MODULE_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si la ruta no requiere ningún módulo específico, dejamos pasar
    if (!requiredModule) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const companyId = request.user?.companyId;

    if (!companyId) {
      throw new ForbiddenException('No se pudo identificar la empresa del usuario.');
    }

    // Buscamos la configuración de la empresa
    const config = await this.configRepo.findOne({ where: { companyId } });

    if (!config || !config.activeModules.includes(requiredModule)) {
      throw new ForbiddenException(`Tu plan o tipo de negocio no tiene habilitado el módulo: ${requiredModule}`);
    }

    return true;
  }
}