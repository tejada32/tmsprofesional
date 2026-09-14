// src/components/dashboards/SalesDashboard.jsx
import React from 'react';

export function SalesDashboard({ user, subRole, onNavigate }) {
  if (subRole === 'cajero-cobrador') {
    return (
      <div className="space-y-8">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
          <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Efectivo en Caja (Turno Actual)</p>
            <p className="text-3xl font-bold mt-2 text-emerald-600">$4,850.00</p>
          </div>
          <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Facturas / Pagos del Día</p>
            <p className="text-3xl font-bold mt-2 text-blue-600">18 Transacciones</p>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Operaciones de Mostrador (Caja y Cobros)</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={() => alert('Facturar al Contado (POS): módulo en desarrollo')}
              className="p-5 bg-blue-600 hover:bg-blue-700 rounded-xl text-center transition-colors font-semibold text-white shadow-sm shadow-blue-600/20"
            >
              🛒 Facturar al Contado (POS)
            </button>
            <button
              onClick={() => alert('Cobrar Cuota / Préstamo / Abono: módulo en desarrollo')}
              className="p-5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-center transition-colors font-semibold text-white shadow-sm shadow-emerald-600/20"
            >
              💳 Cobrar Cuota / Préstamo / Abono
            </button>
            <button
              onClick={() => alert('Cuadre de Caja Diario: módulo en desarrollo')}
              className="p-5 bg-slate-100 hover:bg-slate-200 rounded-xl text-center transition-colors font-semibold text-slate-700"
            >
              🔄 Cuadre de Caja Diario
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Vendedor / Facturador u otro subRole de ventas sin panel de caja
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas de Hoy</p>
          <p className="text-3xl font-bold mt-2 text-emerald-600">$0.00</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cotizaciones Pendientes</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">0</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clientes Asignados</p>
          <p className="text-3xl font-bold mt-2 text-purple-600">0</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate?.('clients')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            👥 Clientes
          </button>
          <button
            onClick={() => alert('Nueva Cotización: módulo en desarrollo')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            📝 Nueva Cotización
          </button>
          <button
            onClick={() => alert('Nueva Factura: módulo en desarrollo')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            🧾 Nueva Factura
          </button>
        </div>
      </div>
    </div>
  );
}
