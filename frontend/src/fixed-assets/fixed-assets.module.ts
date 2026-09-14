// src/fixed-assets/fixed-assets.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FixedAsset } from './entities/fixed-asset.entity';
import { AssetDepreciationRecord } from './entities/asset-depreciation-record.entity';
import { FixedAssetsService } from './services/fixed-assets.service';
import { FixedAssetsController } from './controllers/fixed-assets.controller';

@Module({
  imports: [TypeOrmModule.forFeature([FixedAsset, AssetDepreciationRecord])],
  controllers: [FixedAssetsController],
  providers: [FixedAssetsService],
  exports: [FixedAssetsService],
})
export class FixedAssetsModule {}