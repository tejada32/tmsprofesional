// src/components/BranchesView.jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export function BranchesView({ token }) {
  const [branches, setBranches] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [form, setForm] = useState({ name: '', address: '', phone: '', isWarehouse: false });

  const fetchBranches = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${API_URL}/branches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setBranches(data);
      } else {
        setErrorMessage(data.message || 'No se pudo cargar la lista de sucursales');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/branches`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        setForm({ name: '', address: '', phone: '', isWarehouse: false });
        await fetchBranches();
      } else {
        alert(data.message || 'Error al registrar la sucursal');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión al registrar la sucursal');
    }
  };

  return (
    <div className="p-6 bg-slate-50 rounded-lg text-slate-800 space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sucursales</h1>
        <p className="text-sm text-slate-500">Configuración / Red de sucursales de la empresa</p>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 p-6">
        <h2 className="text-sm font-bold text-slate-700 mb-4">Registrar Nueva Sucursal</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Nombre
            </label>
            <input
              type="text"
              required
              placeholder="Ej. Sucursal Bella Vista"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Dirección
            </label>
            <input
              type="text"
              placeholder="Calle, número, sector..."
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
              Teléfono
            </label>
            <input
              type="text"
              placeholder="809-000-0000"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none focus:border-blue-400 focus:ring-4 focus:ring-blue-100"
            />
          </div>
          <div className="md:col-span-3 flex items-center justify-between">
            <label className="flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                checked={form.isWarehouse}
                onChange={(e) => setForm({ ...form, isWarehouse: e.target.checked })}
                className="rounded border-slate-300"
              />
              Esta sucursal también funciona como almacén
            </label>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              Guardar Sucursal
            </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50/50">
          <h2 className="text-sm font-bold text-slate-700">Sucursales Registradas</h2>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">{errorMessage}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase font-semibold text-xs tracking-wider border-b border-slate-200">
                <th className="p-3">Nombre</th>
                <th className="p-3">Dirección</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3 text-center">Principal</th>
                <th className="p-3 text-center">También Almacén</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">Cargando sucursales...</td>
                </tr>
              ) : branches.length > 0 ? (
                branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3 font-bold text-slate-900">{branch.name}</td>
                    <td className="p-3 text-slate-600">{branch.address || '—'}</td>
                    <td className="p-3 text-slate-600">{branch.phone || '—'}</td>
                    <td className="p-3 text-center">
                      {branch.isMain && (
                        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          Principal
                        </span>
                      )}
                    </td>
                    <td className="p-3 text-center">{branch.isWarehouse ? 'Sí' : 'No'}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="p-6 text-center text-slate-400">No hay sucursales registradas.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
