//src/common/constants/subcriptions-plans.constant.ts
export interface PlanDefinition {
  category: string;
  subCategory: string;
  abbreviation: string;
  planName: string;
  priceUsd: number;
  allowedModules: string[];
}

export const SUBSCRIPTION_PLANS_MASTER: PlanDefinition[] = [
  // 1. Venta General
  { category: 'Venta General', subCategory: 'Vendedor independiente', abbreviation: 'VG1', planName: 'Plan A1', priceUsd: 10, allowedModules: ['dashboard','pos', 'inventory', 'sales','suppliers', 'purchases','collections', 'deliveries', 'commissions', 'trips_vehicles', 'reports' ,'customers'] },
  { category: 'Venta General', subCategory: 'Colmado/MiniMarket', abbreviation: 'VG2', planName: 'Plan A2', priceUsd: 20, allowedModules: ['dashboard','pos', 'inventory', 'sales','suppliers', 'purchases','collections', 'deliveries', 'commissions', 'trips_vehicles', 'reports' ,'customers'] },
  { category: 'Venta General', subCategory: 'Almacén/Distribuidora', abbreviation: 'VG3', planName: 'Plan A3', priceUsd: 30, allowedModules: ['dashboard','pos', 'inventory', 'sales','suppliers', 'purchases','collections', 'deliveries', 'commissions', 'trips_vehicles', 'reports' ,'customers'] },
  { category: 'Venta General', subCategory: 'Ferretería', abbreviation: 'VG4', planName: 'Plan B1', priceUsd: 30, allowedModules: ['dashboard','pos', 'inventory', 'sales','suppliers', 'purchases','collections', 'deliveries', 'commissions', 'trips_vehicles', 'reports' ,'customers'] },

  // 2. Tiendas
  { category: 'Tiendas', subCategory: 'Tienda de muebles', abbreviation: 'TD1', planName: 'Plan B2', priceUsd: 50, allowedModules: ['dashboard','pos','warranty', 'inventory', 'repairs', 'sales','suppliers', 'purchases','collections', 'deliveries', 'commissions', 'trips_vehicles', 'reports' ,'customers'] },
  { category: 'Tiendas', subCategory: 'Tienda por departamento', abbreviation: 'TD2', planName: 'Plan B3', priceUsd: 50, allowedModules: ['dashboard','pos','warranty', 'inventory', 'repairs', 'sales','suppliers', 'purchases','collections', 'deliveries', 'commissions', 'trips_vehicles', 'reports' ,'customers'] },
  { category: 'Tiendas', subCategory: 'Electrodomésticos', abbreviation: 'TD3', planName: 'Plan B4', priceUsd: 50, allowedModules: ['dashboard','pos', 'warranty','inventory', 'sales','suppliers', 'purchases','collections', 'deliveries', 'commissions', 'trips_vehicles', 'reports' ,'customers'] },
  { category: 'Tiendas', subCategory: 'Otros comercios similares', abbreviation: 'TD4', planName: 'Plan B5', priceUsd: 40, allowedModules: ['dashboard','pos', 'warranty', 'repairs','inventory', 'sales','suppliers', 'purchases','collections', 'deliveries', 'commissions', 'trips_vehicles', 'reports' ,'customers'] },

  // 3. Tecnología
  { category: 'Tecnología', subCategory: 'Tienda de computadora', abbreviation: 'TT01', planName: 'Plan C1', priceUsd: 30, allowedModules: ['dashboard', 'pos', 'inventory', 'sales', 'repairs', 'customers', 'suppliers', 'purchases', 'collections', 'warranty', 'reports'] },
  { category: 'Tecnología', subCategory: 'Tienda de celulares/Electronica', abbreviation: 'TT02', planName: 'Plan C2', priceUsd: 30, allowedModules: ['dashboard', 'pos', 'inventory', 'sales', 'repairs', 'customers', 'suppliers', 'purchases', 'collections', 'warranty', 'reports'] },
  { category: 'Tecnología', subCategory: 'Taller de reparación', abbreviation: 'TT03', planName: 'Plan C3', priceUsd: 30, allowedModules: ['dashboard', 'pos', 'inventory', 'sales', 'repairs', 'customers', 'suppliers', 'purchases', 'collections', 'warranty', 'reports'] },

  // 4. Alimentos y Bebidas
  { category: 'Alimentos y Bebidas', subCategory: 'Restaurante', abbreviation: 'VA01', planName: 'Plan D1', priceUsd: 40, allowedModules: ['dashboard', 'pos', 'kitchen', 'tables', 'menu', 'inventory', 'sales', 'customers', 'suppliers', 'purchases', 'collections', 'deliveries', 'commissions', 'reports'] },
  { category: 'Alimentos y Bebidas', subCategory: 'Cafetería / comedor', abbreviation: 'VA02', planName: 'Plan D2', priceUsd: 20, allowedModules: ['dashboard', 'pos', 'kitchen', 'tables', 'menu', 'inventory', 'sales', 'customers', 'suppliers', 'purchases', 'collections', 'deliveries', 'commissions', 'reports'] },

  // 5. Préstamos
  { category: 'Préstamos', subCategory: 'Préstamos', abbreviation: 'PT01', planName: 'Plan E1', priceUsd: 30, allowedModules: ['dashboard', 'loans', 'accounting', 'customers', 'suppliers', 'purchases', 'reports', 'collections'] },
  { category: 'Préstamos', subCategory: 'Financiera', abbreviation: 'PT02', planName: 'Plan E2', priceUsd: 30, allowedModules: ['dashboard', 'loans', 'accounting', 'customers', 'suppliers', 'purchases', 'reports', 'collections'] },
  { category: 'Préstamos', subCategory: 'Cooperativa', abbreviation: 'PT03', planName: 'Plan E3', priceUsd: 30, allowedModules: ['dashboard', 'loans', 'accounting', 'customers', 'suppliers', 'purchases', 'reports', 'collections'] },

  // 6. Servicios Profesionales
  { category: 'Servicios Profesionales', subCategory: 'Instaladores', abbreviation: 'SP01', planName: 'Plan F1', priceUsd: 20, allowedModules: ['dashboard', 'projects', 'invoicing', 'clients', 'appointments', 'accounting', 'reports'] },
  { category: 'Servicios Profesionales', subCategory: 'Ingenieros y técnicos', abbreviation: 'SP02', planName: 'Plan F2', priceUsd: 20, allowedModules: ['dashboard', 'projects', 'invoicing', 'clients', 'appointments', 'accounting', 'reports'] },
  { category: 'Servicios Profesionales', subCategory: 'Abogados', abbreviation: 'SP03', planName: 'Plan F3', priceUsd: 20, allowedModules: ['dashboard', 'projects', 'invoicing', 'clients', 'appointments', 'accounting', 'reports'] },
  { category: 'Servicios Profesionales', subCategory: 'Contadores', abbreviation: 'SP04', planName: 'Plan F4', priceUsd: 20, allowedModules: ['dashboard', 'projects', 'invoicing', 'clients', 'appointments', 'accounting', 'reports'] },
  { category: 'Servicios Profesionales', subCategory: 'Consultores', abbreviation: 'SP05', planName: 'Plan F5', priceUsd: 20, allowedModules: ['dashboard', 'projects', 'invoicing', 'clients', 'appointments', 'accounting', 'reports'] },
  { category: 'Servicios Profesionales', subCategory: 'Otros servicios', abbreviation: 'SP06', planName: 'Plan F6', priceUsd: 20, allowedModules: ['dashboard', 'projects', 'invoicing', 'clients', 'appointments', 'accounting', 'reports'] },

  // 7. Seguros
  { category: 'Seguros', subCategory: 'Seguros de vehículos', abbreviation: 'SG01', planName: 'Plan G1', priceUsd: 40, allowedModules: ['dashboard', 'policies', 'claims', 'clients', 'commissions', 'renewals', 'reports'] },
  { category: 'Seguros', subCategory: 'Seguros personales', abbreviation: 'SG02', planName: 'Plan G2', priceUsd: 40, allowedModules: ['dashboard', 'policies', 'claims', 'clients', 'commissions', 'renewals', 'reports'] },
  { category: 'Seguros', subCategory: 'Seguros empresariales', abbreviation: 'SG03', planName: 'Plan G3', priceUsd: 40, allowedModules: ['dashboard', 'policies', 'claims', 'clients', 'commissions', 'renewals', 'reports'] },

  // 8. Cuidado Personal
  { category: 'Cuidado Personal', subCategory: 'Peluquería', abbreviation: 'CP01', planName: 'Plan H1', priceUsd: 15, allowedModules: ['dashboard', 'appointments', 'pos', 'clients', 'inventory', 'staff', 'reports'] },
  { category: 'Cuidado Personal', subCategory: 'Salón de belleza', abbreviation: 'CP02', planName: 'Plan A27', priceUsd: 15, allowedModules: ['dashboard', 'appointments', 'pos', 'clients', 'inventory', 'staff', 'reports'] },
  { category: 'Cuidado Personal', subCategory: 'Spa', abbreviation: 'CP03', planName: 'Plan A28', priceUsd: 15, allowedModules: ['dashboard', 'appointments', 'pos', 'clients', 'inventory', 'staff', 'reports'] },
  { category: 'Cuidado Personal', subCategory: 'Estética/Uñas', abbreviation: 'CP04', planName: 'Plan A29', priceUsd: 15, allowedModules: ['dashboard', 'appointments', 'pos', 'clients', 'inventory', 'staff', 'reports'] },

  // 9. Salud
  { category: 'Salud', subCategory: 'Farmacia', abbreviation: 'SL01', planName: 'Plan J1', priceUsd: 35, allowedModules: ['dashboard', 'inventory', 'prescriptions', 'pos', 'suppliers', 'customers', 'purchases', 'reports'] },
  
  // 10. Varios
  { category: 'Varios', subCategory: 'Mantenimiento', abbreviation: 'VAR01', planName: 'Plan Mantenimiento', priceUsd: 10, allowedModules: ['dashboard', 'maintenance', 'reports'] },

];