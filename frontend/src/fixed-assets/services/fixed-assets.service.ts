// src/fixed-assets/services/fixed-assets.service.ts
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { FixedAsset, AssetStatus } from '../entities/fixed-asset.entity';
import { AssetDepreciationRecord } from '../entities/asset-depreciation-record.entity';

@Injectable()
export class FixedAssetsService {
  constructor(
    @InjectRepository(FixedAsset)
    private readonly assetRepository: Repository<FixedAsset>,
    @InjectRepository(AssetDepreciationRecord)
    private readonly depreciationRepository: Repository<AssetDepreciationRecord>,
    private readonly dataSource: DataSource,
  ) {}

  async createAsset(data: Partial<FixedAsset>): Promise<FixedAsset> {
    const asset = this.assetRepository.create({
      ...data,
      currentBookValue: data.purchaseCost,
    });
    return this.assetRepository.save(asset);
  }

  async runMonthlyDepreciation(companyId: string, period: string): Promise<void> {
    const assets = await this.assetRepository.find({
      where: { companyId, status: AssetStatus.ACTIVE },
    });

    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      for (const asset of assets) {
        const existingRecord = await this.depreciationRepository.findOne({
          where: { fixedAssetId: asset.id, period },
        });

        if (existingRecord || asset.currentBookValue <= asset.salvageValue) {
          continue;
        }

        const monthlyDepreciation = (Number(asset.purchaseCost) - Number(asset.salvageValue)) / asset.usefulLifeMonths;
        const currentBook = Number(asset.currentBookValue);
        
        let calculatedDepreciation = monthlyDepreciation;
        let newBookValue = currentBook - calculatedDepreciation;

        if (newBookValue < Number(asset.salvageValue)) {
          calculatedDepreciation = currentBook - Number(asset.salvageValue);
          newBookValue = Number(asset.salvageValue);
        }

        const previousDepreciation = Number(asset.purchaseCost) - currentBook;
        const totalAccumulated = previousDepreciation + calculatedDepreciation;

        const record = queryRunner.manager.create(AssetDepreciationRecord, {
          fixedAssetId: asset.id,
          period,
          depreciationAmount: Number(calculatedDepreciation.toFixed(2)),
          accumulatedDepreciation: Number(totalAccumulated.toFixed(2)),
          bookValueAfter: Number(newBookValue.toFixed(2)),
        });

        await queryRunner.manager.save(record);

        asset.currentBookValue = Number(newBookValue.toFixed(2));
        if (newBookValue <= Number(asset.salvageValue)) {
          asset.status = AssetStatus.FULLY_DEPRECIATED;
        }
        await queryRunner.manager.save(asset);
      }

      await queryRunner.commitTransaction();
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }

  async getAssetSummary(companyId: string) {
    return this.assetRepository.query(
      `
      SELECT 
        category,
        COUNT(*) AS total_items,
        SUM(purchase_cost) AS total_invested,
        SUM(current_book_value) AS total_book_value
      FROM fixed_assets
      WHERE company_id = $1
      GROUP BY category;
    `,
      [companyId],
    );
  }
}