//branches.controller.ts
import { Controller, Get, Post, Body, Req, UseGuards } from '@nestjs/common';
import { BranchesService } from './branches.service';
import { CreateBranchDto } from './dto/create-branch.dto';
import { ModulesGuard } from '../auth/guards/modules.guard';
import { RequireModule } from '../common/decorators/require-module.decorator';
import { Request } from 'express';

@Controller('branches')
@UseGuards(ModulesGuard)
export class BranchesController {
  constructor(private readonly branchesService: BranchesService) {}

  @Post()
  @RequireModule('branches')
  async create(@Body() createBranchDto: CreateBranchDto, @Req() req: Request) {
    const user: any = req.user;
    return this.branchesService.create(createBranchDto, user.companyId);
  }

  @Get()
  @RequireModule('branches')
  async findAll(@Req() req: Request) {
    const user: any = req.user;
    return this.branchesService.findAllByCompany(user.companyId);
  }
}