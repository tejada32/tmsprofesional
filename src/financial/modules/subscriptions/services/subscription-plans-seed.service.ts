//src/modules/suscripcions/services/subscription-plans-seed.service.ts
import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SubscriptionPlan } from '../entities/subscription-plan.entity';
import { SUBSCRIPTION_PLANS_MASTER } from '../subscription-plans.constant';

@Injectable()
export class SubscriptionPlansSeedService implements OnModuleInit {
  private readonly logger = new Logger(SubscriptionPlansSeedService.name);

  constructor(
    @InjectRepository(SubscriptionPlan)
    private readonly planRepository: Repository<SubscriptionPlan>,
  ) {}

  async onModuleInit() {
    await this.seedPlans();
  }

  async seedPlans() {
    this.logger.log('Iniciando verificación y sincronización de planes de suscripción...');

    for (const planData of SUBSCRIPTION_PLANS_MASTER) {
      const existingPlan = await this.planRepository.findOne({
        where: { abbreviation: planData.abbreviation },
      });

      if (!existingPlan) {
        await this.planRepository.save({
          category: planData.category,
          subCategory: planData.subCategory,
          abbreviation: planData.abbreviation,
          planName: planData.planName,
          priceUsd: planData.priceUsd,
          allowedModules: planData.allowedModules,
          maxBranches: 5,
          maxWarehouses: 5,
          isActive: true,
        });
        this.logger.log(`Plan creado: [${planData.abbreviation}] ${planData.planName} (${planData.subCategory}) - $${planData.priceUsd} USD`);
      } else {
        if (
          existingPlan.priceUsd !== planData.priceUsd || 
          existingPlan.planName !== planData.planName ||
          JSON.stringify(existingPlan.allowedModules) !== JSON.stringify(planData.allowedModules)
        ) {
          existingPlan.priceUsd = planData.priceUsd;
          existingPlan.planName = planData.planName;
          existingPlan.category = planData.category;
          existingPlan.subCategory = planData.subCategory;
          existingPlan.allowedModules = planData.allowedModules;
          await this.planRepository.save(existingPlan);
          this.logger.log(`Plan actualizado: [${planData.abbreviation}] ${planData.planName}`);
        }
      }
    }

    this.logger.log('Sincronización de planes de suscripción completada con éxito.');
  }
}