// src/components/SuppliersView.jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export function SuppliersView({ token }) {
  const [suppliers, setSuppliers] = useState([]);
  const [form, setForm] = useState({
    name: '',
    contactName: '',
    email: '',
    phone: '',
    address: '',
    taxId: '',
  });

  const fetchSuppliers = async () => {
    try {
      const res = await fetch(`${API_URL}/suppliers`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setSuppliers(data);
    } catch (err) {
      console.error('Error al cargar proveedores', err);
    }
  };

  useEffect(() => {
    fetchSuppliers();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/suppliers`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (res.ok) {
        alert('¡Proveedor registrado con éxito!');
        setForm({
          name: '',
          contactName: '',
          email: '',
          phone: '',
          address: '',
          taxId: '',
        });
        fetchSuppliers();
      } else {
        alert(data.message || 'Error al registrar el proveedor');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-800 p-6 shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">🏭 Registrar Nuevo Proveedor</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-300">Empresa / Proveedor</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Persona de Contacto</label>
            <input
              type="text"
              value={form.contactName}
              onChange={(e) => setForm({ ...form, contactName: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Teléfono</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Correo Electrónico</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">RNC / Tax ID</label>
            <input
              type="text"
              value={form.taxId}
              onChange={(e) => setForm({ ...form, taxId: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
            />
          </div>
          <div className="md:col-span-2 lg:col-span-3">
            <label className="block text-sm font-medium text-gray-300">Dirección</label>
            <input
              type="text"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
            />
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700">
              Guardar Proveedor
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-gray-800 p-6 shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Directorio de Proveedores</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-gray-700 text-xs uppercase bg-gray-900 text-gray-400">
              <tr>
                <th className="p-3">Empresa</th>
                <th className="p-3">Contacto</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3">Correo</th>
                <th className="p-3">RNC / Tax ID</th>
                <th className="p-3">Dirección</th>
              </tr>
            </thead>
            <tbody>
              {suppliers.map((s) => (
                <tr key={s.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3 font-medium text-white">{s.name}</td>
                  <td className="p-3">{s.contactName || 'N/A'}</td>
                  <td className="p-3">{s.phone}</td>
                  <td className="p-3">{s.email || 'N/A'}</td>
                  <td className="p-3">{s.taxId || 'N/A'}</td>
                  <td className="p-3">{s.address || 'N/A'}</td>
                </tr>
              ))}
              {suppliers.length === 0 && (
                <tr>
                  <td colSpan="6" className="p-4 text-center text-gray-500">No hay proveedores registrados todavía.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}