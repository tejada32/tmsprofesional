// src/data/plansData.js
export const PLANS_MAPPING = {
  'Venta General': [
    { id: 'vendedor-independiente', name: 'Vendedor Independiente', basePrice: 10, prices: { '1-mes': 10.00, '3-meses': 27.00, '6-meses': 50.00, '1-ano': 95.00 } },
    { id: 'colmado-minimarket', name: 'Colmado / Minimarket', basePrice: 20, prices: { '1-mes': 20.00, '3-meses': 54.00, '6-meses': 100.00, '1-ano': 190.00 } },
    { id: 'almacen-distribuidora', name: 'Almacén / Distribuidora', basePrice: 30, prices: { '1-mes': 30.00, '3-meses': 81.00, '6-meses': 150.00, '1-ano': 285.00 } },
    { id: 'ferreteria', name: 'Ferretería', basePrice: 30, prices: { '1-mes': 30.00, '3-meses': 81.00, '6-meses': 150.00, '1-ano': 285.00 } }
  ],
  'Tiendas': [
    { id: 'tienda-muebles', name: 'Tienda de muebles', basePrice: 50, prices: { '1-mes': 50.00, '3-meses': 135.00, '6-meses': 250.00, '1-ano': 475.00 } },
    { id: 'tienda-departamentos', name: 'Tienda por departamentos', basePrice: 50, prices: { '1-mes': 50.00, '3-meses': 135.00, '6-meses': 250.00, '1-ano': 475.00 } },
    { id: 'electrodomesticos', name: 'Electrodomésticos', basePrice: 50, prices: { '1-mes': 50.00, '3-meses': 135.00, '6-meses': 250.00, '1-ano': 475.00 } },
    { id: 'otros-comercios', name: 'Otros comercios similares', basePrice: 40, prices: { '1-mes': 40.00, '3-meses': 108.00, '6-meses': 200.00, '1-ano': 380.00 } }
  ],
  'Tecnología': [
    { id: 'tienda-computadoras', name: 'Tienda de computadoras', basePrice: 30, prices: { '1-mes': 30.00, '3-meses': 81.00, '6-meses': 150.00, '1-ano': 285.00 } },
    { id: 'tienda-celulares', name: 'Tienda de celulares / Electrónica', basePrice: 30, prices: { '1-mes': 30.00, '3-meses': 81.00, '6-meses': 150.00, '1-ano': 285.00 } },
    { id: 'taller-reparacion', name: 'Taller de reparación', basePrice: 30, prices: { '1-mes': 30.00, '3-meses': 81.00, '6-meses': 150.00, '1-ano': 285.00 } }
  ],
  'Alimentos y Bebidas': [
    { id: 'restaurante', name: 'Restaurante', basePrice: 40, prices: { '1-mes': 40.00, '3-meses': 108.00, '6-meses': 200.00, '1-ano': 380.00 } },
    { id: 'cafeteria-comedor', name: 'Cafetería / Comedor', basePrice: 20, prices: { '1-mes': 20.00, '3-meses': 54.00, '6-meses': 100.00, '1-ano': 190.00 } }
  ],
  'Préstamos': [
    { id: 'prestamos', name: 'Préstamos', basePrice: 30, prices: { '1-mes': 30.00, '3-meses': 81.00, '6-meses': 150.00, '1-ano': 285.00 } },
    { id: 'financiera', name: 'Financiera', basePrice: 30, prices: { '1-mes': 30.00, '3-meses': 81.00, '6-meses': 150.00, '1-ano': 285.00 } },
    { id: 'cooperativa', name: 'Cooperativa', basePrice: 30, prices: { '1-mes': 30.00, '3-meses': 81.00, '6-meses': 150.00, '1-ano': 285.00 } }
  ],
  'Servicios Profesionales': [
    { id: 'instaladores', name: 'Instaladores', basePrice: 20, prices: { '1-mes': 20.00, '3-meses': 54.00, '6-meses': 100.00, '1-ano': 190.00 } },
    { id: 'ingenieros-tecnicos', name: 'Ingenieros y técnicos', basePrice: 20, prices: { '1-mes': 20.00, '3-meses': 54.00, '6-meses': 100.00, '1-ano': 190.00 } },
    { id: 'abogados', name: 'Abogados', basePrice: 20, prices: { '1-mes': 20.00, '3-meses': 54.00, '6-meses': 100.00, '1-ano': 190.00 } },
    { id: 'contadores', name: 'Contadores', basePrice: 20, prices: { '1-mes': 20.00, '3-meses': 54.00, '6-meses': 100.00, '1-ano': 190.00 } },
    { id: 'consultores', name: 'Consultores', basePrice: 20, prices: { '1-mes': 20.00, '3-meses': 54.00, '6-meses': 100.00, '1-ano': 190.00 } },
    { id: 'otros-servicios', name: 'Otros servicios', basePrice: 20, prices: { '1-mes': 20.00, '3-meses': 54.00, '6-meses': 100.00, '1-ano': 190.00 } }
  ],
  'Seguros': [
    { id: 'seguros-vehiculos', name: 'Seguros de vehículos', basePrice: 40, prices: { '1-mes': 40.00, '3-meses': 108.00, '6-meses': 200.00, '1-ano': 380.00 } },
    { id: 'seguros-personales', name: 'Seguros personales', basePrice: 40, prices: { '1-mes': 40.00, '3-meses': 108.00, '6-meses': 200.00, '1-ano': 380.00 } },
    { id: 'seguros-empresariales', name: 'Seguros empresariales', basePrice: 40, prices: { '1-mes': 40.00, '3-meses': 108.00, '6-meses': 200.00, '1-ano': 380.00 } }
  ],
  'Cuidado Personal': [
    { id: 'peluqueria', name: 'Peluquería', basePrice: 15, prices: { '1-mes': 15.00, '3-meses': 40.50, '6-meses': 75.00, '1-ano': 142.50 } },
    { id: 'salon-belleza', name: 'Salón de belleza', basePrice: 15, prices: { '1-mes': 15.00, '3-meses': 40.50, '6-meses': 75.00, '1-ano': 142.50 } },
    { id: 'spa', name: 'Spa', basePrice: 15, prices: { '1-mes': 15.00, '3-meses': 40.50, '6-meses': 75.00, '1-ano': 142.50 } },
    { id: 'estetica-unas', name: 'Estética / Uñas', basePrice: 15, prices: { '1-mes': 15.00, '3-meses': 40.50, '6-meses': 75.00, '1-ano': 142.50 } }
  ],
  'Salud': [
    { id: 'farmacia', name: 'Farmacia', basePrice: 35, prices: { '1-mes': 35.00, '3-meses': 94.50, '6-meses': 175.00, '1-ano': 332.50 } }
  ]
};