// src/services/subscription.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../entities/company.entity';
// CORREGIDO: "import Stripe from 'stripe'" fallaba en runtime
// (TypeError: stripe_1.default is not a constructor) porque el paquete
// 'stripe' exporta la clase directamente (module.exports = Stripe), no
// como "default". Con "import * as Stripe" esto funciona sin depender de
// si esModuleInterop está activado en tsconfig.json.
import * as Stripe from 'stripe';

@Injectable()
export class SubscriptionService {
  private stripe: Stripe;

  constructor(
    @InjectRepository(Company)
    private readonly companyRepo: Repository<Company>,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2026-07-29.dahlia' as any,
    });
  }
  
  // Activar o sumar el módulo de mantenimiento a una empresa existente o nueva
  async activateMaintenanceAddon(companyId: string, isStandalone: boolean = false) {
    const company = await this.companyRepo.findOne({ where: { id: companyId } });

    if (!company) {
      throw new BadRequestException('Empresa no encontrada');
    }

    if (isStandalone) {
      // Plan Independiente de Mantenimiento (VAR01 - $10 USD)
      company.planType = 'VAR01';
      company.basePlanPrice = 10.00;
      company.addonsPrice = 0;
      company.totalPrice = 10.00;
      company.activeAddons = [];
    } else {
      // Add-on para clientes existentes ($5.00 USD adicionales)
      const activeAddons = company.activeAddons || [];
      
      if (activeAddons.includes('maintenance')) {
        throw new BadRequestException('El módulo de mantenimiento ya está activo.');
      }

      company.activeAddons = [...activeAddons, 'maintenance'];
      company.addonsPrice = Number(company.addonsPrice || 0) + 5.00;
      company.totalPrice = Number(company.basePlanPrice || 0) + Number(company.addonsPrice);
    }

    return await this.companyRepo.save(company);
  }
  

  // Crear una sesión de pago para que el cliente se suscriba al plan
  async createCheckoutSession(companyId: string, priceId: string) {
    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      success_url: `${process.env.FRONTEND_URL}/dashboard?success=true`,
      cancel_url: `${process.env.FRONTEND_URL}/pricing?canceled=true`,
      metadata: { companyId },
    });

    return { url: session.url };
  }

  // Procesar de forma segura el evento de Stripe
  async handleStripeWebhook(rawBody: Buffer, signature: string) {
    let event: Stripe.Event;

    try {
      event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET,
      );
    } catch (err) {
      throw new BadRequestException(`Webhook Error: ${err.message}`);
    }

    if (event.type === 'invoice.payment_succeeded') {
      const invoice = event.data.object as any;
      const companyId = invoice.metadata?.companyId || invoice.parent?.subscription_details?.metadata?.companyId;

      if (companyId) {
        // Activamos la empresa en la base de datos tras el pago exitoso
        await this.companyRepo.update(companyId, { isActive: true });
      }
    }

    return { received: true };
  }
}