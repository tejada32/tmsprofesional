// src/components/dashboards/FinanceDashboard.jsx
import React from 'react';

export function FinanceDashboard({ user, subRole, onNavigate }) {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ingresos del Mes</p>
          <p className="text-3xl font-bold mt-2 text-emerald-600">$0.00</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Gastos del Mes</p>
          <p className="text-3xl font-bold mt-2 text-red-500">$0.00</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cuentas por Cobrar</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">$0.00</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Cuentas por Pagar</p>
          <p className="text-3xl font-bold mt-2 text-amber-500">$0.00</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Accesos Rápidos</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <button
            onClick={() => alert('Cajas: módulo en desarrollo')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            💵 Cajas
          </button>
          <button
            onClick={() => alert('Bancos: módulo en desarrollo')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            🏦 Bancos
          </button>
          <button
            onClick={() => alert('Informes Financieros: módulo en desarrollo')}
            className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
          >
            📊 Informes Financieros
          </button>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200 text-center">
        <p className="text-slate-500 text-sm">
          Panel financiero para <strong className="text-slate-700">{user?.name || user?.email}</strong>
          {subRole && <> — <span className="text-slate-600">{subRole}</span></>}. Los datos son de ejemplo hasta conectar los endpoints financieros.
        </p>
      </div>
    </div>
  );
}
