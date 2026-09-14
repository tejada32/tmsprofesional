import { Module, Global } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from '../entities/user.entity';
import { Company } from '../entities/company.entity';
import { TrialLog } from '../entities/trial-log.entity';
import { SubscriptionPlan } from '../modules/subscriptions/entities/subscription-plan.entity';
import { JwtStrategy } from './strategies/jwt.strategy';
import { CompanyConfig } from '../entities/company-config.entity'; // <-- 1. Importar la entidad
import { UserSessionLog } from '../entities/user-session-log.entity'; // <-- 1. Importar la entidad de sesión

@Global()
@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Company,
      TrialLog,
      SubscriptionPlan,
	  CompanyConfig, // <-- 2. Agregarla aquí para que el repositorio esté disponible
	  UserSessionLog, // <-- 2. Registrar la entidad aquí
    ]),
    PassportModule.register({ defaultStrategy: 'jwt' }),
    JwtModule.register({
      // IMPORTANTE: este fallback debe coincidir EXACTAMENTE con el usado en
      // jwt.strategy.ts, o los tokens firmados aquí no podrán verificarse allá.
      // TODO (punto 7): mover JWT_SECRET a variable de entorno obligatoria, sin fallback.
      secret: process.env.JWT_SECRET || 'tms_profesional_secret_key_2026',
      signOptions: { expiresIn: '8h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy],
  exports: [AuthService, JwtStrategy, PassportModule],
})
export class AuthModule {}