// src/restaurants/restaurants.service.ts 
//(Ampliación para Escandallos)
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RestaurantTable } from '../entities/restaurant-table.entity';
import { OrderTicket } from '../entities/order-ticket.entity';
import { RecipeItem } from '../entities/recipe-item.entity';

@Injectable()
export class RestaurantsService {
  constructor(
    @InjectRepository(RestaurantTable)
    private readonly tableRepository: Repository<RestaurantTable>,
    @InjectRepository(OrderTicket)
    private readonly ticketRepository: Repository<OrderTicket>,
    @InjectRepository(RecipeItem)
    private readonly recipeRepository: Repository<RecipeItem>,
  ) {}

  async createTable(companyId: string, branchId: string, dto: { tableNumber: string; capacity?: number }) {
    const table = this.tableRepository.create({
      companyId,
      branchId,
      tableNumber: dto.tableNumber,
      capacity: dto.capacity ?? 4,
      status: 'available',
    });
    return await this.tableRepository.save(table);
  }

  async findAllTables(companyId: string, branchId: string) {
    return await this.tableRepository.find({
      where: { companyId, branchId },
    });
  }

  async updateTableStatus(tableId: string, status: string, companyId: string) {
    const table = await this.tableRepository.findOne({ where: { id: tableId, companyId } });
    if (!table) {
      throw new NotFoundException('Mesa no encontrada');
    }
    table.status = status;
    return await this.tableRepository.save(table);
  }

  async createTicket(companyId: string, branchId: string, waiterId: string, dto: { tableId?: string; totalAmount?: number }) {
    const ticket = this.ticketRepository.create({
      companyId,
      branchId,
      waiterId,
      tableId: dto.tableId,
      totalAmount: dto.totalAmount ?? 0,
      status: 'pending',
    });
    return await this.ticketRepository.save(ticket);
  }

  async findAllTickets(companyId: string, branchId: string) {
    return await this.ticketRepository.find({
      where: { companyId, branchId },
      relations: {
        table: true,
        waiter: true,
      },
    });
  }

  async updateTicketStatus(ticketId: string, status: string, companyId: string) {
    const ticket = await this.ticketRepository.findOne({ where: { id: ticketId, companyId } });
    if (!ticket) {
      throw new NotFoundException('Comanda no encontrada');
    }
    
    // Si la comanda se marca como entregada/completada, aquí se dispararía el escandallo
    if (status === 'completed' && ticket.status !== 'completed') {
      // Lógica de descuento automático de inventario basada en recetas (escandallos)
      // Se pueden consultar los RecipeItems asociados a los productos del ticket para descontar stock.
    }

    ticket.status = status;
    return await this.ticketRepository.save(ticket);
  }

  // Gestión de Recetas / Escandallos
  async addRecipeItem(companyId: string, dto: { dishId: string; ingredientId: string; quantity: number }) {
    const recipeItem = this.recipeRepository.create({
      companyId,
      ...dto,
    });
    return await this.recipeRepository.save(recipeItem);
  }

  async findRecipeByDish(companyId: string, dishId: string) {
    return await this.recipeRepository.find({
      where: { companyId, dishId },
    });
  }
}