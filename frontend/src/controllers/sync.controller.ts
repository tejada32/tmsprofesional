// src/controllers/sync.controller.ts
import { Controller, Post, Body, Req } from '@nestjs/common';
import { SyncService } from '../services/sync.service';

@Controller('sync')
export class SyncController {
  constructor(private readonly syncService: SyncService) {}

  // CORREGIDO: companyId venía de la URL (:companyId), lo que permitía que
  // un cliente autenticado con CUALQUIER empresa intentara sincronizar
  // ventas "etiquetadas" como de otra empresa. Ahora companyId sale
  // siempre del JWT, así que solo se pueden sincronizar ventas de la
  // propia empresa del usuario autenticado.
  @Post('push')
  async syncOfflineData(@Req() req: any, @Body('sales') sales: any[]) {
    const companyId = req.user.companyId;
    return await this.syncService.processOfflineSync(companyId, sales);
  }
}
