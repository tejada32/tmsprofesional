// src/common/constants/business-modules.constant.ts
export const BUSINESS_MODULES_MAP: Record<string, string[]> = {
  // Venta General
  'vg1': ['dashboard', 'sales', 'pos', 'customers', 'reports'],
  'vg2': ['dashboard', 'sales', 'pos', 'inventory', 'customers', 'suppliers', 'reports'],
  'vg3': ['dashboard', 'sales', 'inventory', 'warehouses', 'purchases', 'suppliers', 'reports'],
  'vg4': ['dashboard', 'sales', 'pos', 'inventory', 'customers', 'reports'],

  // Tiendas
  'td1': ['dashboard', 'sales', 'pos', 'inventory', 'deliveries', 'customers', 'reports'],
  'td2': ['dashboard', 'sales', 'pos', 'inventory', 'departments', 'customers', 'reports'],
  'td3': ['dashboard', 'sales', 'pos', 'inventory', 'warranty', 'reports'],
  'td4': ['dashboard', 'sales', 'pos', 'inventory', 'reports'],

  // Tecnología
  'tt01': ['dashboard', 'sales', 'pos', 'inventory', 'serial-numbers', 'reports'],
  'tt02': ['dashboard', 'sales', 'pos', 'inventory', 'imei-tracking', 'reports'],
  'tt03': ['dashboard', 'repairs', 'inventory', 'customers', 'technicians', 'reports'],

  // Alimentos y Bebidas
  'va01': ['dashboard', 'pos', 'tables', 'kitchen', 'menu', 'inventory', 'reports'],
  'va02': ['dashboard', 'pos', 'menu', 'inventory', 'reports'],

  // Préstamos
  'pt01': ['dashboard', 'loans', 'amortization', 'clients', 'collections', 'accounting', 'reports'],
  'pt02': ['dashboard', 'loans', 'amortization', 'clients', 'collections', 'accounting', 'reports'],
  'pt03': ['dashboard', 'loans', 'amortization', 'clients', 'collections', 'accounting', 'reports'],

  // Servicios Profesionales
  'sp01': ['dashboard', 'projects', 'clients', 'billing', 'time-tracking', 'reports'],
  'sp02': ['dashboard', 'projects', 'clients', 'billing', 'time-tracking', 'reports'],
  'sp03': ['dashboard', 'projects', 'clients', 'billing', 'time-tracking', 'reports'],
  'sp04': ['dashboard', 'projects', 'clients', 'billing', 'time-tracking', 'reports'],
  'sp05': ['dashboard', 'projects', 'clients', 'billing', 'time-tracking', 'reports'],
  'sp06': ['dashboard', 'projects', 'clients', 'billing', 'time-tracking', 'reports'],

  // Seguros
  'sg01': ['dashboard', 'policies', 'clients', 'claims', 'commissions', 'reports'],
  'sg02': ['dashboard', 'policies', 'clients', 'claims', 'commissions', 'reports'],
  'sg03': ['dashboard', 'policies', 'clients', 'claims', 'commissions', 'reports'],

  // Cuidado Personal
  'cp01': ['dashboard', 'appointments', 'services', 'pos', 'staff', 'reports'],
  'cp02': ['dashboard', 'appointments', 'services', 'pos', 'staff', 'reports'],
  'cp03': ['dashboard', 'appointments', 'services', 'pos', 'staff', 'reports'],
  'cp04': ['dashboard', 'appointments', 'services', 'pos', 'staff', 'reports'],

  // Salud
  'sl01': ['dashboard', 'sales', 'pos', 'inventory', 'prescriptions', 'suppliers', 'reports'],

  // Respaldo genérico
  'default': ['dashboard', 'sales', 'pos', 'customers', 'branches', 'warehouses', 'reports'],
};