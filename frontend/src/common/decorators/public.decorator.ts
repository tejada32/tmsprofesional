// src/common/decorators/public.decorator.ts
import { SetMetadata } from '@nestjs/common';

export const IS_PUBLIC_KEY = 'isPublic';

/**
 * Marca una ruta o controlador como público, es decir, que NO requiere
 * un JWT válido. Úsalo solo en endpoints que deben ser accesibles sin
 * sesión, como login o registro.
 *
 * Ejemplo:
 *   @Public()
 *   @Post('login')
 *   login() { ... }
 */
export const Public = () => SetMetadata(IS_PUBLIC_KEY, true);
