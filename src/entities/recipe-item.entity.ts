// src/entities/recipe-item.entity.ts
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { Company } from './company.entity';

@Entity('recipe_items')
export class RecipeItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id', type: 'uuid' })
  companyId: string;

  @ManyToOne(() => Company, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'company_id' })
  company: Company;

  @Column({ name: 'dish_id', type: 'uuid' }) // ID del producto/plato elaborado en la carta
  dishId: string;

  @Column({ name: 'ingredient_id', type: 'uuid' }) // ID del ingrediente o insumo en el inventario general
  ingredientId: string;

  @Column({ type: 'decimal', precision: 10, scale: 3 })
  quantity: number; // Cantidad requerida del insumo por cada porción del plato

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}