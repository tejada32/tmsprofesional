import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // IMPORTANTE: debe coincidir EXACTAMENTE con el fallback en auth.module.ts.
      secretOrKey: process.env.JWT_SECRET || 'tms_profesional_secret_key_2026',
    });
  }

  async validate(payload: any) {
    // Lo que retornemos aquí se inyectará automáticamente en el objeto `req.user` de la ruta protegida
    return {
      userId: payload.sub,
      email: payload.email,
      role: payload.role,
      companyId: payload.companyId,
    };
  }
}