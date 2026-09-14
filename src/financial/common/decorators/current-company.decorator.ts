// src/common/decorators/current-company.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export const CurrentCompany = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string => {
    const request = ctx.switchToHttp().getRequest();
    // Asumimos que tu estrategia JWT inyecta el usuario con su companyId en el request
    return request.user?.companyId;
  },
);