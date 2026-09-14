// src/companies/company-templates.constant.ts

// Sugerencia: definir un Enum para los tipos de negocio
export enum BusinessType {
  VENTAS_GENERAL = 'VENTAS_GENERAL',
  VENTAS_CELULARES = 'VENTAS_CELULARES',
  TIENDA_TECNOLOGIA = 'TIENDA_TECNOLOGIA',
  TIENDA_MUEBLES = 'TIENDA_MUEBLES',
  FARMACIA = 'FARMACIA',
  RESTAURANT = 'RESTAURANT',
  PRESTAMOS = 'PRESTAMOS',
  TALLER_REPARACION = 'TALLER_REPARACION',
  FERRETERIA = 'FERRETERIA',
  SERVICIOS_ESTETICA = 'SERVICIOS_ESTETICA',
}

export const BUSINESS_TEMPLATES = {
  [BusinessType.VENTAS_GENERAL]: {
    name: 'Ventas General + Reparto',
    description: 'Colmados, Minimarket, Supermercado, Tienda por Departamentos',
    modules: ['sales', 'inventory', 'delivery', 'common'],
  },
  [BusinessType.VENTAS_CELULARES]: {
    name: 'Venta Celulares',
    description: 'Control de IMEI, seriales y accesorios',
    modules: ['sales', 'inventory', 'serials', 'common'],
  },
  [BusinessType.TIENDA_TECNOLOGIA]: {
    name: 'Tienda Tecnología',
    description: 'Equipos, garantías y números de serie',
    modules: ['sales', 'inventory', 'warranty', 'common'],
  },
  [BusinessType.TIENDA_MUEBLES]: {
    name: 'Tienda Muebles',
    description: 'Ventas, entregas y almacén',
    modules: ['sales', 'inventory', 'delivery', 'common'],
  },
  [BusinessType.FARMACIA]: {
    name: 'Farmacia',
    description: 'Lotes, fechas de vencimiento y medicamentos',
    modules: ['sales', 'inventory', 'pharmacy', 'common'],
  },
  [BusinessType.RESTAURANT]: {
    name: 'Restaurant / Negocio de Comida',
    description: 'Mesas, cuentas abiertas y cocina',
    modules: ['restaurant', 'sales', 'inventory', 'common'],
  },
  [BusinessType.PRESTAMOS]: {
    name: 'Préstamos',
    description: 'Gestión de créditos, cuotas y desembolsos',
    modules: ['financial', 'loans', 'common'],
  },
  [BusinessType.TALLER_REPARACION]: {
    name: 'Taller de Reparación y Servicio Técnico',
    description: 'Órdenes de servicio, repuestos y estados',
    modules: ['repair', 'inventory', 'common'],
  },
  [BusinessType.FERRETERIA]: {
    name: 'Ferretería y Materiales de Construcción',
    description: 'Unidades de medida avanzadas y stock pesado',
    modules: ['sales', 'inventory', 'common'],
  },
  [BusinessType.SERVICIOS_ESTETICA]: {
    name: 'Servicios Profesionales / Estética',
    description: 'Salón de Belleza, Barbería y gestión de citas',
    modules: ['services', 'appointments', 'common'],
  },
};