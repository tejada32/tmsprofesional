// src/menuConfig.js
// Fuente única de verdad para el menú superior y el sidebar.
//
// Estructura:
//   menuCategories = [
//     {
//       key, icon, label,
//       groups: [ { title: string|null, items: [{ label, view? }] } ]
//     }
//   ]
//
// - "view" conecta el item a una vista real de App.jsx (currentView).
//   Si no tiene "view", se muestra como "(Próx.)" y solo lanza un aviso.
// - "groups" con varios títulos se usa para agrupar dentro de una misma
//   categoría (ej. Dashboard). Si una categoría tiene un solo grupo sin
//   título, se muestra como lista plana (igual en el menú superior y el
//   sidebar).

export const menuCategories = [
  {
    key: 'dashboard',
    icon: '🏠',
    label: 'Dashboard',
    groups: [
      {
        title: '1. Ventas',
        items: [
          { label: 'Ventas de Hoy' },
          { label: 'Ventas del Mes' },
          { label: 'Productos Más Vendidos' },
        ],
      },
      {
        title: '2. Finanzas',
        items: [
          { label: 'Ingresos del Mes' },
          { label: 'Gastos del Mes' },
          { label: 'Cuentas por Cobrar' },
          { label: 'Cuentas por Pagar' },
          { label: 'Caja de Hoy' },
        ],
      },
      {
        title: '3. Inventario',
        items: [
          { label: 'Existencias' },
          { label: 'Inventario Bajo' },
          { label: 'Sin Existencia' },
        ],
      },
      {
        title: '4. Alertas',
        items: [{ label: 'Avisos' }, { label: 'Mensajes' }],
      },
      {
        title: '5. Gráficos',
        items: [
          { label: 'Gráfico Ventas' },
          { label: 'Gráfico Cliente' },
          { label: 'Gráfico Inventario' },
          { label: 'Gráfico Resultados' },
        ],
      },
    ],
  },
  {
    key: 'ventas',
    icon: '💰',
    label: 'Ventas',
    groups: [
      {
        title: null,
        items: [
          { label: 'Clientes', view: 'clients' },
          { label: 'Pedidos' },
          { label: 'Cotizaciones' },
          { label: 'Facturas' },
          { label: 'Devoluciones' },
          { label: 'Notas de Crédito' },
          { label: 'Entregas' },
          { label: 'Órdenes de Taller / Garantías' },
          { label: 'Vendedores' },
          { label: 'Descuentos / Promociones' },
          { label: 'Informes de Ventas' },
        ],
      },
    ],
  },
  {
    key: 'compras',
    icon: '🛍️',
    label: 'Compras',
    groups: [
      {
        title: null,
        items: [
          { label: 'Proveedores', view: 'suppliers' },
          { label: 'Órdenes de Compra' },
          { label: 'Cotizaciones de Proveedores' },
          { label: 'Entrada de Mercancías' },
          { label: 'Facturas de Compra' },
          { label: 'Devoluciones a Proveedores' },
          { label: 'Notas de Crédito de Proveedores' },
          { label: 'Gastos de Compra' },
          { label: 'Compras Recurrentes' },
          { label: 'Informes de Compras' },
        ],
      },
    ],
  },
  {
    key: 'creditos',
    icon: '💳',
    label: 'Créditos',
    groups: [
      {
        title: null,
        items: [
          { label: 'Solicitudes de Crédito' },
          { label: 'Créditos' },
          { label: 'Cuotas / Calendario de Pagos' },
          { label: 'Cobros' },
          { label: 'Cuentas por Cobrar' },
          { label: 'Acuerdos de Pago' },
          { label: 'Refinanciamientos' },
          { label: 'Créditos Cancelados' },
          { label: 'Garantes' },
          { label: 'Garantías / Colaterales' },
          { label: 'Cobradores' },
          { label: 'Informes de Créditos' },
        ],
      },
    ],
  },
  {
    key: 'finanzas',
    icon: '🏦',
    label: 'Finanzas',
    groups: [
      {
        title: null,
        items: [
          { label: 'Cajas' },
          { label: 'Bancos' },
          { label: 'Cuentas Bancarias' },
          { label: 'Ingresos' },
          { label: 'Egresos' },
          { label: 'Transferencias' },
          { label: 'Conciliación Bancaria' },
          { label: 'Cuentas por Cobrar' },
          { label: 'Cuentas por Pagar' },
          { label: 'Gastos' },
          { label: 'Presupuestos' },
          { label: 'Préstamos' },
          { label: 'Activos' },
          { label: 'Pasivos' },
          { label: 'Patrimonio' },
          { label: 'Contabilidad' },
          { label: 'Informes Financieros' },
        ],
      },
    ],
  },
  {
    key: 'inventario',
    icon: '📦',
    label: 'Inventario',
    groups: [
      {
        title: null,
        items: [
          { label: 'Productos', view: 'products' },
          { label: 'Categorías' },
          { label: 'Marcas' },
          { label: 'Unidades de Medida' },
          { label: 'Almacenes', view: 'warehouses' },
          { label: 'Entradas' },
          { label: 'Salidas' },
          { label: 'Transferencias' },
          { label: 'Ajustes de Inventario' },
          { label: 'Inventario Físico' },
          { label: 'Lotes' },
          { label: 'Números de Serie' },
          { label: 'Vencimientos' },
          { label: 'Kardex' },
          { label: 'Precios' },
          { label: 'Inventario Mínimo / Máximo' },
          { label: 'Productos Dañados / Perdidos' },
          { label: 'Informes de Inventario' },
        ],
      },
    ],
  },
  {
    key: 'taller',
    icon: '🔧',
    label: 'Taller',
    groups: [
      {
        title: null,
        items: [
          { label: 'Clientes', view: 'clients' },
          { label: 'Equipos / Vehículos' },
          { label: 'Órdenes de Taller' },
          { label: 'Diagnósticos' },
          { label: 'Servicios' },
          { label: 'Repuestos / Materiales' },
          { label: 'Técnicos' },
          { label: 'Estados de Reparación' },
          { label: 'Garantías' },
          { label: 'Presupuestos' },
          { label: 'Recepción' },
          { label: 'Entrega' },
          { label: 'Seguimiento de Reparaciones' },
          { label: 'Historial de Servicios' },
          { label: 'Costos de Reparación' },
          { label: 'Fotos / Evidencias' },
          { label: 'Informes de Taller' },
        ],
      },
    ],
  },
  {
    key: 'servicio-cliente',
    icon: '🎧',
    label: 'Servicio al Cliente',
    groups: [
      {
        title: null,
        items: [
          { label: 'Clientes', view: 'clients' },
          { label: 'Consultas' },
          { label: 'Solicitudes' },
          { label: 'Tickets / Casos' },
          { label: 'Quejas y Reclamos' },
          { label: 'Sugerencias' },
          { label: 'Garantías' },
          { label: 'Devoluciones' },
          { label: 'Seguimiento' },
          { label: 'Tareas / Compromisos' },
          { label: 'Estados y Prioridades' },
          { label: 'Historial de Atención' },
          { label: 'Informes de Servicio al Cliente' },
        ],
      },
    ],
  },
  {
    key: 'mantenimiento',
    icon: '🛠️',
    label: 'Mantenimiento',
    groups: [
      {
        title: null,
        items: [
          { label: 'Activos / Equipos' },
          { label: 'Categoría / Grupos' },
          { label: 'Mantenimiento Preventivo' },
          { label: 'Mantenimiento Correctivo' },
          { label: 'Órdenes de Mantenimiento' },
          { label: 'Programación de Mantenimiento' },
          { label: 'Técnicos / Responsables' },
          { label: 'Repuestos / Materiales' },
          { label: 'Servicios Externos' },
          { label: 'Historial de Mantenimiento' },
          { label: 'Costos de Mantenimiento' },
          { label: 'Garantías' },
          { label: 'Alertas / Próximos Mantenimientos' },
          { label: 'Informes de Mantenimiento' },
        ],
      },
    ],
  },
  {
    key: 'rrhh',
    icon: '🧑‍💼',
    label: 'Recursos Humanos',
    groups: [
      {
        title: null,
        items: [
          { label: 'Empleados' },
          { label: 'Departamentos' },
          { label: 'Puestos' },
          { label: 'Contratos' },
          { label: 'Expedientes' },
          { label: 'Asistencia' },
          { label: 'Horarios / Turnos' },
          { label: 'Permisos / Ausencias' },
          { label: 'Vacaciones' },
          { label: 'Nómina' },
          { label: 'Comisiones' },
          { label: 'Préstamos a Empleados' },
          { label: 'Deducciones' },
          { label: 'Bonificaciones' },
          { label: 'Evaluaciones' },
          { label: 'Capacitaciones' },
          { label: 'Documentos' },
          { label: 'Liquidaciones' },
          { label: 'Historial Laboral' },
          { label: 'Informes de Recursos Humanos' },
        ],
      },
    ],
  },
  {
    key: 'configuracion',
    icon: '⚙️',
    label: 'Configuración',
    groups: [
      {
        title: null,
        items: [
          { label: 'Empresa' },
          { label: 'Sucursales', view: 'branches' },
          { label: 'Usuarios' },
          { label: 'Roles y Permisos' },
          { label: 'Configuración General', view: 'settings' },
          { label: 'Monedas' },
          { label: 'Impuestos' },
          { label: 'Series / Numeraciones' },
          { label: 'Métodos de Pago' },
          { label: 'Cajas' },
          { label: 'Bancos' },
          { label: 'Almacenes', view: 'warehouses' },
          { label: 'Impresoras' },
          { label: 'Facturación' },
          { label: 'Notificaciones' },
          { label: 'Seguridad' },
          { label: 'Integraciones' },
          { label: 'Copias de Seguridad' },
          { label: 'Auditoría' },
          { label: 'Configuración de Módulos' },
          { label: 'Suscripción y Facturación' },
          { label: 'Importar / Exportar Datos' },
          { label: 'Comisiones' },
        ],
      },
    ],
  },
  {
    key: 'addons',
    icon: '🧩',
    label: 'Addons',
    groups: [
      {
        title: null,
        items: [
          { label: 'Tienda de Addons' },
          { label: 'Mis Addons' },
          { label: 'Addons Instalados' },
          { label: 'Addons Disponibles' },
          { label: 'Actualizaciones' },
          { label: 'Integraciones' },
          { label: 'API' },
          { label: 'Importar / Exportar' },
          { label: 'Plantillas' },
          { label: 'Informes de Addons' },
        ],
      },
    ],
  },
  {
    key: 'informes',
    icon: '📊',
    label: 'Informes / Reportes',
    groups: [
      {
        title: null,
        items: [
          { label: 'Ventas' },
          { label: 'Compras' },
          { label: 'Inventario' },
          { label: 'Créditos' },
          { label: 'Finanzas' },
          { label: 'Recursos Humanos' },
          { label: 'Taller' },
          { label: 'Servicio al Cliente' },
          { label: 'Mantenimiento' },
          { label: 'Clientes' },
          { label: 'Proveedores' },
          { label: 'Productos' },
          { label: 'Impuestos' },
          { label: 'Contabilidad' },
          { label: 'Auditoría' },
          { label: 'Reportes Personalizados' },
          { label: 'Reportes Programados' },
          { label: 'Exportar Reportes' },
        ],
      },
    ],
  },
  {
    key: 'ayuda',
    icon: '❓',
    label: 'Ayuda',
    groups: [
      {
        title: null,
        items: [
          { label: 'Centro de Ayuda' },
          { label: 'Guías y Tutoriales' },
          { label: 'Preguntas Frecuentes' },
          { label: 'Soporte Técnico' },
          { label: 'Contactar Soporte' },
          { label: 'Novedades y Actualizaciones' },
          { label: 'Atajos de Teclado' },
          { label: 'Documentación' },
          { label: 'Reportar un Problema' },
          { label: 'Solicitar una Función' },
          { label: 'Acerca de TMS Profesional' },
        ],
      },
    ],
  },
  {
    key: 'accesos-directos',
    icon: '⚡',
    label: 'Accesos Directos',
    groups: [
      {
        title: null,
        items: [
          { label: 'Pedifo' },
          { label: 'Cotización' },
          { label: 'Factura' },
          { label: 'Nueva Cotización' },
          { label: 'Nuevo Pedido' },
          { label: 'Caja' },
          { label: 'Productos', view: 'products' },
          { label: 'Entrada de Inventario' },
          { label: 'Entrada de Inventario' },
          { label: 'Transferencia de Inventario' },
          { label: 'Orden de Taller' },
          { label: 'Ticket de Servicio' },
          { label: 'Orden de Mantenimiento' },
          { label: 'Buscar' },
          { label: 'Acceso Directo 1' },
          { label: 'Acceso Directo 2' },
          { label: 'Acceso Directo 3' },
          { label: 'Acceso Directo 4' },
          { label: 'Acceso Directo 5' },
          { label: 'Acceso Directo 6' },
        ],
      },
    ],
  },
];

// Alias para claridad al importar desde cada componente.
export const topMenuConfig = menuCategories;
export const sidebarConfig = menuCategories;
