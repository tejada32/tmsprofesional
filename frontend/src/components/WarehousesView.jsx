// src/components/WarehousesView.jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export function WarehousesView({ token }) {
  const [warehouses, setWarehouses] = useState([]);
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({ name: '', branchId: '', address: '', isVehicle: false });

  const fetchData = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const [warehousesRes, branchesRes] = await Promise.all([
        fetch(`${API_URL}/warehouses`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/branches`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);
      const warehousesData = await warehousesRes.json();
      const branchesData = await branchesRes.json();

      if (warehousesRes.ok) {
        setWarehouses(warehousesData);
      } else {
        setErrorMessage(warehousesData.message || 'No se pudo cargar la lista de almacenes');
      }

      if (branchesRes.ok) {
        setBranches(branchesData);
        // Preselecciona la primera sucursal disponible, si hay alguna.
        setForm((prev) => (prev.branchId ? prev : { ...prev, branchId: branchesData[0]?.id || '' }));
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.branchId) {
      alert('Debe seleccionar a qué sucursal pertenece este almacén');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/warehouses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setForm((prev) => ({ ...prev, name: '', address: '', isVehicle: false }));
        await fetchData();
      } else {
        alert(data.message || 'Error al registrar el almacén');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al registrar el almacén');
    }
  };

  const branchName = (branchId) => branches.find((b) => b.id === branchId)?.name || '—';

  return (
    <div className="p-6 bg-slate-50 rounded-lg text-slate-800 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Almacenes</h1>
        <p className="text-sm text-slate-500">Configuración / Almacenes por sucursal</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Registrar Nuevo Almacén</h2>

        {branches.length === 0 && !isLoading && (
          <p className="text-sm text-amber-600 mb-4">
            No tienes ninguna sucursal registrada todavía. Crea una primero en Configuración → Sucursales.
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Nombre del Almacén
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Almacén Central"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Sucursal
            </label>
            <select
              required
              value={form.branchId}
              onChange={(e) => setForm({ ...form, branchId: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            >
              <option value="">Selecciona una sucursal...</option>
              {branches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Dirección (opcional)
            </label>
            <input
              type="text"
              placeholder="Si es distinta a la de la sucursal"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div className="md:col-span-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.isVehicle}
                onChange={(e) => setForm({ ...form, isVehicle: e.target.checked })}
                className="rounded border-slate-300"
              />
              Este almacén es un vehículo (requiere Plan Profesional o Enterprise)
            </label>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Guardar Almacén
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-700">Almacenes Registrados</h2>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">{errorMessage}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase font-semibold text-xs tracking-wider border-b border-slate-200">
                <th className="p-3">Nombre</th>
                <th className="p-3">Sucursal</th>
                <th className="p-3">Dirección</th>
                <th className="p-3 text-center">Vehículo</th>
                <th className="p-3 text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">Cargando almacenes...</td>
                </tr>
              ) : warehouses.length > 0 ? (
                warehouses.map((w) => (
                  <tr key={w.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3 font-bold text-slate-900">{w.name}</td>
                    <td className="p-3 text-slate-600">{branchName(w.branchId)}</td>
                    <td className="p-3 text-slate-600">{w.address || '—'}</td>
                    <td className="p-3 text-center">{w.isVehicle ? 'Sí' : 'No'}</td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        w.isActive ? 'bg-green-100 text-green-700' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {w.isActive ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">No hay almacenes registrados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
