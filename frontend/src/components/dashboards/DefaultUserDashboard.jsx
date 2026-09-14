// src/components/dashboards/DefaultUserDashboard.jsx
import React from 'react';

export function DefaultUserDashboard({ user }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-200 text-center">
      <h2 className="text-lg font-semibold mb-2 text-slate-800">Bienvenido a TMS Profesional</h2>
      <p className="text-slate-500">Su perfil se encuentra configurado correctamente en el sistema.</p>
    </div>
  );
}
