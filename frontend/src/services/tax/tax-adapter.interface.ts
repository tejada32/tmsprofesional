// src/services/tax/tax-adapter.interface.ts
export interface TaxDocumentPayload {
  companyTaxId: string;
  invoiceNumber: string;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
    taxRate: number;
  }>;
  totalAmount: number;
  totalTax: number;
}

export interface TaxAdapterResponse {
  success: boolean;
  trackId?: string;
  digitalSignature?: string;
  error?: string;
}

export interface ITaxAdapter {
  emitElectronicInvoice(payload: TaxDocumentPayload): Promise<TaxAdapterResponse>;
}