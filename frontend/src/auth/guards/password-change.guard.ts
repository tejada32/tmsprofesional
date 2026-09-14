// src/auth/guards/password-change.guard.ts
import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common';

@Injectable()
export class PasswordChangeGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    // Si no hay usuario en el request, dejamos que el JwtAuthGuard maneje la no autorización
    if (!user) {
      return true;
    }

    // Permitir el paso si el usuario está intentando acceder al endpoint de cambio de contraseña
    const url = request.url || '';
    if (url.includes('change-password')) {
      return true;
    }

    // Si la bandera mustChangePassword está activa, bloqueamos el acceso al resto del sistema
    if (user.mustChangePassword === true) {
      throw new ForbiddenException(
        'Por seguridad, debes cambiar tu contraseña temporal antes de continuar.',
      );
    }

    return true;
  }
}