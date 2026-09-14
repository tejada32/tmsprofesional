//auth.controller.ts
import { Controller, Post, Body, Req, Get } from '@nestjs/common';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { Public } from '../common/decorators/public.decorator';
import { Request } from 'express';
import { Throttle, SkipThrottle } from '@nestjs/throttler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @Throttle({ default: { limit: 3, ttl: 60000 } }) // Máximo 3 registros por minuto por IP
  async register(@Body() registerDto: RegisterDto, @Req() req: Request) {
    const ipAddress = req.ip || req.socket.remoteAddress || 'unknown';
    return this.authService.register(registerDto, ipAddress);
  }

  @Public()
  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  // Requiere JWT válido: cubierto por el guard global (APP_GUARD) en AppModule.
  @Get('profile')
  getProfile(@Req() req: Request) {
    return {
      message: 'Acceso autorizado al perfil del ERP TMS Profesional',
      user: req.user, // Contiene la info decodificada del token JWT
    };
  }
}