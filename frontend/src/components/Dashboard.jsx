// src/components/Dashboard.jsx
import React from 'react';
import { GeneralManagerDashboard } from './dashboards/GeneralManagerDashboard';
import { SalesDashboard } from './dashboards/SalesDashboard';
import { FinanceDashboard } from './dashboards/FinanceDashboard';
import { InventoryDashboard } from './dashboards/InventoryDashboard';
import { DefaultUserDashboard } from './dashboards/DefaultUserDashboard';

export function Dashboard({ user, token, onNavigate }) {
  // Verificamos si el módulo 'dashboard' está permitido en la empresa
  const companyModules = user?.activeModules || [];
  if (companyModules.length > 0 && !companyModules.includes('dashboard')) {
    return (
      <div className="p-6 bg-red-50 border border-red-200 rounded-2xl text-red-700 shadow-sm">
        <h2 className="text-xl font-bold text-red-700">Acceso Restringido</h2>
        <p className="mt-1 text-sm text-red-600">Su plan actual no incluye acceso al módulo de Dashboard general.</p>
      </div>
    );
  }

  // Renderizado condicional según el rol y sub-rol del usuario
  switch (user?.role) {
    case 'general_manager':
    case 'admin':
      return <GeneralManagerDashboard user={user} token={token} onNavigate={onNavigate} />;

    case 'sales':
      return <SalesDashboard subRole={user?.subRole} user={user} onNavigate={onNavigate} />;

    case 'finance':
      return <FinanceDashboard subRole={user?.subRole} user={user} onNavigate={onNavigate} />;

    case 'inventory':
      return <InventoryDashboard subRole={user?.subRole} user={user} onNavigate={onNavigate} />;

    default:
      return <DefaultUserDashboard user={user} />;
  }
}
