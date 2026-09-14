// src/components/dashboards/InventoryDashboard.jsx
import React from 'react';

export function InventoryDashboard({ user, subRole, onNavigate }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ítems en Inventario</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">0</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Inventario Bajo</p>
          <p className="text-3xl font-bold mt-2 text-amber-500">0</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sin Existencia</p>
          <p className="text-3xl font-bold mt-2 text-red-500">0</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => onNavigate?.('products')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            📦 Productos
          </button>
          <button
            onClick={() => onNavigate?.('warehouses')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            🏢 Sucursales y Almacenes
          </button>
          <button
            onClick={() => onNavigate?.('suppliers')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            🏭 Proveedores
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200 text-center">
        <p className="text-slate-500 text-sm">
          Panel de inventario para <strong className="text-slate-700">{user?.name || user?.email}</strong>
          {subRole && <> — <span className="text-slate-600">{subRole}</span></>}. Las cifras se llenarán al conectar el endpoint de inventario.
        </p>
      </div>
    </div>
  );
}
