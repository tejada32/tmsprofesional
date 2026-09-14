// src/fixed-assets/entities/asset-depreciation-record.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { FixedAsset } from './fixed-asset.entity';

@Entity('asset_depreciation_records')
export class AssetDepreciationRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  fixedAssetId: string;

  @ManyToOne(() => FixedAsset, { onDelete: 'CASCADE' })
  fixedAsset: FixedAsset;

  @Column({ type: 'varchar', length: 7 })
  period: string;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  depreciationAmount: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  accumulatedDepreciation: number;

  @Column({ type: 'numeric', precision: 12, scale: 2 })
  bookValueAfter: number;

  @CreateDateColumn()
  createdAt: Date;
}