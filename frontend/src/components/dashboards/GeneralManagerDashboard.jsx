// src/components/dashboards/GeneralManagerDashboard.jsx
import React, { useState } from 'react';

const API_URL = 'http://localhost:3000';

export function GeneralManagerDashboard({ user, token, onNavigate }) {
  const [dashboardData] = useState({
    stats: { totalSales: 12500.0, activeClients: 42, inventoryItems: 156, pendingOrders: 5 },
    recentActivity: [
      { id: 1, description: 'Inicio de sesión del sistema', date: new Date().toLocaleDateString() },
      { id: 2, description: 'Configuración inicial de perfil completada', date: new Date().toLocaleDateString() },
    ],
  });

  const [empName, setEmpName] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empSubRole, setEmpSubRole] = useState('cajero-cobrador');

  const handleCreateEmployee = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/users/employees`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: empName,
          email: empEmail,
          password: empPassword,
          subRole: empSubRole,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('¡Colaborador creado exitosamente!');
        setEmpName('');
        setEmpEmail('');
        setEmpPassword('');
      } else {
        alert(data.message || 'Error al crear empleado');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al registrar empleado');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Panel de Control</h1>
        {user?.company?.plan && (
          <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
            Plan {user.company.plan.abbreviation}: {user.company.plan.subCategory}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ventas Totales</p>
          <p className="text-3xl font-bold mt-2 text-emerald-600">${dashboardData.stats.totalSales.toFixed(2)}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Clientes Activos</p>
          <p className="text-3xl font-bold mt-2 text-blue-600">{dashboardData.stats.activeClients}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Ítems en Inventario</p>
          <p className="text-3xl font-bold mt-2 text-amber-500">{dashboardData.stats.inventoryItems}</p>
        </div>
        <div className="rounded-xl bg-white p-5 shadow-xs border border-slate-200">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Órdenes / Pendientes</p>
          <p className="text-3xl font-bold mt-2 text-purple-600">{dashboardData.stats.pendingOrders}</p>
        </div>
      </div>

      <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
        <h2 className="text-lg font-semibold mb-4 text-slate-800">Registrar Nuevo Empleado / Colaborador</h2>
        <form onSubmit={handleCreateEmployee} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label className="block text-sm font-medium text-slate-600">Nombre</label>
            <input
              type="text"
              value={empName}
              onChange={(e) => setEmpName(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 focus:outline-none text-sm transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Correo Electrónico</label>
            <input
              type="email"
              value={empEmail}
              onChange={(e) => setEmpEmail(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 focus:outline-none text-sm transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Contraseña Temporal</label>
            <input
              type="password"
              value={empPassword}
              onChange={(e) => setEmpPassword(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 focus:outline-none text-sm transition-colors"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-600">Cargo / Perfil</label>
            <select
              value={empSubRole}
              onChange={(e) => setEmpSubRole(e.target.value)}
              className="mt-1 w-full rounded-lg border border-slate-300 bg-slate-50 p-2.5 text-slate-800 focus:border-blue-500 focus:bg-white focus:ring-2 focus:ring-blue-500/15 focus:outline-none text-sm transition-colors"
              required
            >
              <option value="cajero-cobrador">Cajero / Cobrador (Híbrido)</option>
              <option value="vendedor">Vendedor / Facturador</option>
              <option value="gerente-financiero">Gerente Financiero</option>
              <option value="gerente-almacen">Gerente de Almacén</option>
            </select>
          </div>
          <div className="md:col-span-2 lg:col-span-4">
            <button
              type="submit"
              className="rounded-lg bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm shadow-emerald-600/20 hover:bg-emerald-700 transition-colors"
            >
              Crear Colaborador en el Sistema
            </button>
          </div>
        </form>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-xl bg-white p-6 shadow-xs border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Accesos Rápidos a Módulos</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            <button
              onClick={() => onNavigate?.('warehouses')}
              className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
            >
              🏢 Sucursales y Almacenes
            </button>
            <button
              onClick={() => onNavigate?.('products')}
              className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
            >
              📦 Inventario / Stock
            </button>
            <button
              onClick={() => onNavigate?.('settings')}
              className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
            >
              ⚙️ Configuración
            </button>
            <button
              onClick={() => onNavigate?.('suppliers')}
              className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
            >
              🏭 Proveedores
            </button>
            <button className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700">
              🛒 Punto de Venta (POS)
            </button>
            <button
              onClick={() => onNavigate?.('clients')}
              className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700"
            >
              👥 Clientes
            </button>
            <button className="p-4 bg-slate-50 border border-slate-200 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 rounded-xl text-center transition-colors font-medium text-sm text-slate-700">
              📊 Reportes Financieros
            </button>
          </div>
        </div>

        <div className="rounded-xl bg-white p-6 shadow-xs border border-slate-200">
          <h2 className="text-lg font-semibold mb-4 text-slate-800">Actividad Reciente</h2>
          <div className="space-y-4">
            {dashboardData.recentActivity.map((activity) => (
              <div key={activity.id} className="border-b border-slate-100 pb-3 text-sm">
                <p className="text-slate-700">{activity.description}</p>
                <span className="text-xs text-slate-400">{activity.date}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
