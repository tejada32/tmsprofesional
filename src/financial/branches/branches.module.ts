import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BranchesController } from './branches.controller';
import { BranchesService } from './branches.service';
import { Branch } from '../branches/entities/branch.entity';
import { Company } from '../entities/company.entity'; // 1. Importa la entidad Company

@Module({
  imports: [
    TypeOrmModule.forFeature([Branch, Company]) // 2. Agrégala aquí para que el repositorio esté disponible
  ],
  controllers: [BranchesController],
  providers: [BranchesService],
  exports: [BranchesService],
})
export class BranchesModule {}