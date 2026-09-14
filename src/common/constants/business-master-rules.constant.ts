// src/common/constants/business-modules.constant.ts
import { BusinessType } from '../../companies/enums/business-type.enum';

export const BUSINESS_MASTER_RULES = [
  // Define tus reglas maestras aquí
];

export const BUSINESS_MODULES_MAP: Record<string, string[]> = {
  // ==========================================
  // 1. VENTA GENERAL
  // ==========================================
  'Vendedor independiente': ['sales', 'pos', 'inventory', 'warehouses', 'vehicles', 'dispatches', 'purchases', 'customers', 'reports'],
  'Colmado/MiniMarket': ['sales', 'pos', 'inventory', 'warehouses', 'vehicles', 'dispatches', 'purchases', 'customers', 'reports'],
  'Almacén/Distribuidora': ['sales', 'pos', 'inventory', 'warehouses', 'vehicles', 'dispatches', 'purchases', 'customers', 'reports'],
  'Ferretería': ['sales', 'pos', 'inventory', 'warehouses', 'purchases', 'vehicles', 'dispatches', 'customers', 'reports'],

  // ==========================================
  // 2. TIENDAS
  // ==========================================
  'Tienda de muebles': ['sales', 'pos', 'inventory', 'warehouses', 'fixed-assets', 'installments', 'delivery', 'customers', 'reports'],
  'Tienda por departamento': ['sales', 'pos', 'inventory', 'warehouses', 'purchases', 'customers', 'reports'],
  'Electrodomésticos': ['sales', 'pos', 'inventory', 'warehouses', 'warranty', 'customers', 'reports'],
  'Otros comercios similares': ['sales', 'pos', 'inventory', 'warehouses', 'customers', 'reports'],

  // ==========================================
  // 3. TECNOLOGÍA
  // ==========================================
  'Tienda de computadora': ['sales', 'pos', 'inventory', 'product-serials', 'warehouses', 'warranty', 'customers', 'reports'],
  'Tienda de celulares/Electronica': ['sales', 'pos', 'inventory', 'product-serials', 'warranty', 'customers', 'reports'],
  'Taller de reparación': ['products', 'clients', 'repairs', 'inventory', 'branches', 'warehouses', 'warranty', 'reports'],

  // ==========================================
  // 4. ALIMENTOS Y BEBIDAS
  // ==========================================
  'Restaurante': ['restaurant', 'pos', 'inventory', 'tips', 'cashier-shifts', 'reports'],
  'Cafetería / comedor': ['restaurant', 'pos', 'inventory', 'tips', 'cashier-shifts', 'reports'],

  // ==========================================
  // 5. PRÉSTAMOS
  // ==========================================
  'Préstamos': ['loans', 'financial', 'accounts', 'clients', 'treasury', 'reports'],
  'Financiera': ['loans', 'financial', 'accounts', 'clients', 'treasury', 'reports'],
  'Cooperativa': ['loans', 'financial', 'accounts', 'clients', 'treasury', 'reports'],

  // ==========================================
  // 6. SERVICIOS PROFESIONALES
  // ==========================================
  'Instaladores': ['appointments', 'sales', 'clients', 'invoicing', 'reports'],
  'Ingenieros y técnicos': ['appointments', 'sales', 'clients', 'invoicing', 'reports'],
  'Abogados': ['appointments', 'sales', 'clients', 'invoicing', 'reports'],
  'Contadores': ['appointments', 'sales', 'clients', 'invoicing', 'reports'],
  'Consultores': ['appointments', 'sales', 'clients', 'invoicing', 'reports'],
  'Otros servicios': ['appointments', 'sales', 'clients', 'invoicing', 'reports'],

  // ==========================================
  // 7. SEGUROS
  // ==========================================
  'Seguros de vehículos': ['insurance', 'clients', 'branches', 'warehouses', 'reports', 'settings'],
  'Seguros personales': ['insurance', 'clients', 'branches', 'warehouses', 'reports', 'settings'],
  'Seguros empresariales': ['insurance', 'clients', 'branches', 'warehouses', 'reports', 'settings'],

  // ==========================================
  // 8. CUIDADO PERSONAL
  // ==========================================
  'Peluquería': ['appointments', 'sales', 'pos', 'employees', 'commissions', 'clients', 'reports'],
  'Salón de belleza': ['appointments', 'sales', 'pos', 'employees', 'commissions', 'clients', 'reports'],
  'Spa': ['appointments', 'sales', 'pos', 'employees', 'commissions', 'clients', 'reports'],
  'Estética/Uñas': ['appointments', 'sales', 'pos', 'employees', 'commissions', 'clients', 'reports'],

  // ==========================================
  // 9. SALUD
  // ==========================================
  'Farmacia': ['sales', 'pos', 'inventory', 'inventory-batches', 'warehouses', 'purchases', 'customers', 'reports'],
};