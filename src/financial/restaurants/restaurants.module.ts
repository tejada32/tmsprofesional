// src/restaurants/restaurants.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestaurantsService } from './restaurants.service';
import { RestaurantsController } from './restaurants.controller';
import { RestaurantTable } from '../entities/restaurant-table.entity';
import { OrderTicket } from '../entities/order-ticket.entity';
import { RecipeItem } from '../entities/recipe-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RestaurantTable, OrderTicket, RecipeItem])],
  controllers: [RestaurantsController],
  providers: [RestaurantsService],
  exports: [RestaurantsService],
})
export class RestaurantsModule {}