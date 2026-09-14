import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../entities/product.entity';
import { ProductComboItem } from '../entities/product-combo-item.entity';
import { ProductService } from './product.service';
import { ProductController } from './product.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductComboItem])],
  controllers: [ProductController],
  providers: [ProductService],
})
export class ProductModule {}
