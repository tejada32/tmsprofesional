// src/controllers/subscription.controller.ts
import { Controller, Post, Body, Req, Headers, BadRequestException } from '@nestjs/common';
import { SubscriptionService } from '../services/subscription.service';
import { Public } from '../common/decorators/public.decorator';

@Controller('subscriptions')
export class SubscriptionController {
  constructor(private readonly subscriptionService: SubscriptionService) {}

  @Post('create-checkout-session')
  async createSession(@Req() req: any, @Body() body: { priceId: string }) {
    // companyId SIEMPRE del JWT, nunca del body.
    const companyId = req.user.companyId;
    return await this.subscriptionService.createCheckoutSession(companyId, body.priceId);
  }

  @Post('activate-maintenance')
  async activateMaintenance(@Req() req: any, @Body() body: { isStandalone?: boolean }) {
    const companyId = req.user.companyId;
    return await this.subscriptionService.activateMaintenanceAddon(companyId, body.isStandalone);
  }

  // Stripe llama a esta ruta directamente (sin JWT de usuario), por eso es pública.
  // La seguridad aquí depende de validar la firma (stripe-signature) dentro del service,
  // y el companyId se obtiene de los metadatos que Stripe devuelve firmados, nunca de un
  // valor que el cliente pueda manipular.
  @Public()
  @Post('webhook')
  async handleWebhook(@Req() req: any, @Headers('stripe-signature') signature: string) {
    return await this.subscriptionService.handleStripeWebhook(req.rawBody, signature);
  }
}
