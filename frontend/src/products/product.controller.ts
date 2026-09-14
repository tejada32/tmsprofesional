// src/product/product.controller.ts
import { Controller, Post, Get, Patch, Delete, Param, Body, Req, Query } from '@nestjs/common';
import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Post()
  async createProduct(@Req() req, @Body() dto: CreateProductDto) {
    const companyId = req.user.companyId;
    return await this.productService.createProduct(companyId, dto);
  }

  @Get()
  async findAll(@Req() req, @Query('includeInactive') includeInactive?: string) {
    const companyId = req.user.companyId;
    return await this.productService.findAllByCompany(companyId, includeInactive === 'true');
  }

  @Get(':id')
  async findOne(@Req() req, @Param('id') id: string) {
    const companyId = req.user.companyId;
    return await this.productService.findOne(companyId, id);
  }

  @Patch(':id')
  async update(@Req() req, @Param('id') id: string, @Body() dto: UpdateProductDto) {
    const companyId = req.user.companyId;
    return await this.productService.update(companyId, id, dto);
  }

  @Delete(':id')
  async deactivate(@Req() req, @Param('id') id: string) {
    const companyId = req.user.companyId;
    return await this.productService.deactivate(companyId, id);
  }

  @Patch(':id/activate')
  async activate(@Req() req, @Param('id') id: string) {
    const companyId = req.user.companyId;
    return await this.productService.activate(companyId, id);
  }
}
