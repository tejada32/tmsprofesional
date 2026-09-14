// src/services/tax/tax-orchestrator.service.ts
import { Injectable, BadRequestException } from '@nestjs/common';
import { DgiiAdapterService } from './dgii-adapter.service';
import { TaxDocumentPayload, TaxAdapterResponse } from './tax-adapter.interface';

@Injectable()
export class TaxOrchestratorService {
  constructor(private readonly dgiiAdapter: DgiiAdapterService) {}

  async processTaxEmission(countryCode: string, payload: TaxDocumentPayload): Promise<TaxAdapterResponse> {
    switch (countryCode.toUpperCase()) {
      case 'DO': // República Dominicana
        return await this.dgiiAdapter.emitElectronicInvoice(payload);
      
      case 'CO': // Colombia (DIAN) - Próxima implementación
      case 'MX': // México (SAT) - Próxima implementación
        throw new BadRequestException(`El adaptador fiscal para el país ${countryCode} aún no está activo en este nodo.`);
      
      default:
        throw new BadRequestException(`Código de país no soportado para facturación electrónica: ${countryCode}`);
    }
  }
}