import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { RestaurantService } from '../services/restaurant.service';

@Controller('restaurant')
export class RestaurantController {
  constructor(private readonly restaurantService: RestaurantService) {}

  // Ver mapa de mesas de la sucursal
  @Get('tables/:branchId')
  async getTableMap(@Req() req: any, @Param('branchId') branchId: string) {
    const companyId = req.user.companyId;
    return await this.restaurantService.getTableMap(companyId, branchId);
  }

  // Abrir mesa y crear cuenta inicial
  @Post('accounts/open')
  async openTable(
    @Req() req: any,
    @Body('tableId') tableId: string,
    @Body('waiterId') waiterId: string,
    @Body('guestCount') guestCount: number,
  ) {
    const companyId = req.user.companyId;
    return await this.restaurantService.openTable(companyId, tableId, waiterId, guestCount);
  }

  // Agregar productos a la cuenta abierta (Comanda)
  @Post('accounts/:accountId/items')
  async addItems(
    @Req() req: any,
    @Param('accountId') accountId: string,
    @Body('items') items: Array<{ productId: string; productName: string; quantity: number; unitPrice: number; notes?: string }>,
  ) {
    const companyId = req.user.companyId;
    return await this.restaurantService.addItemsToAccount(companyId, accountId, items);
  }

  // Cerrar cuenta y liberar mesa al facturar
  @Post('accounts/:accountId/close')
  async closeAccount(@Req() req: any, @Param('accountId') accountId: string) {
    const companyId = req.user.companyId;
    return await this.restaurantService.closeTableAccount(companyId, accountId);
  }
}
