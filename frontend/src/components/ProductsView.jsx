// src/components/ProductsView.jsx
import React, { useState, useEffect } from 'react';

const API_URL = 'http://localhost:3000';

export function ProductsView({ token }) {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: '',
    sku: '',
    type: 'PHYSICAL',
    price: '',
    lengthCm: '',
    widthCm: '',
    heightCm: '',
    weightKg: '',
    requiresAssembly: true,
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) setProducts(data);
    } catch (err) {
      console.error('Error al cargar productos', err);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: parseFloat(form.price),
          lengthCm: parseFloat(form.lengthCm),
          widthCm: parseFloat(form.widthCm),
          heightCm: parseFloat(form.heightCm),
          weightKg: parseFloat(form.weightKg),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        alert('¡Producto registrado con éxito! Volumen calculado automáticamente.');
        setForm({
          name: '',
          sku: '',
          type: 'PHYSICAL',
          price: '',
          lengthCm: '',
          widthCm: '',
          heightCm: '',
          weightKg: '',
          requiresAssembly: true,
        });
        fetchProducts();
      } else {
        alert(data.message || 'Error al registrar el producto');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-800 p-6 shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">📦 Registrar Mueble / Producto Físico (Cálculo m³)</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre del Mueble</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">SKU</label>
            <input
              type="text"
              value={form.sku}
              onChange={(e) => setForm({ ...form, sku: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Precio ($)</label>
            <input
              type="number"
              step="0.01"
              value={form.price}
              onChange={(e) => setForm({ ...form, price: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Largo (cm)</label>
            <input
              type="number"
              value={form.lengthCm}
              onChange={(e) => setForm({ ...form, lengthCm: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Ancho (cm)</label>
            <input
              type="number"
              value={form.widthCm}
              onChange={(e) => setForm({ ...form, widthCm: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Alto (cm)</label>
            <input
              type="number"
              value={form.heightCm}
              onChange={(e) => setForm({ ...form, heightCm: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Peso (kg)</label>
            <input
              type="number"
              step="0.1"
              value={form.weightKg}
              onChange={(e) => setForm({ ...form, weightKg: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
              required
            />
          </div>
          <div className="flex items-center pt-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={form.requiresAssembly}
                onChange={(e) => setForm({ ...form, requiresAssembly: e.target.checked })}
                className="rounded bg-gray-900 border-gray-700 text-blue-600 focus:ring-0"
              />
              <span className="text-sm font-medium text-gray-300">Requiere Ensamblaje</span>
            </label>
          </div>
          <div className="md:col-span-3">
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700">
              Registrar Producto y Calcular m³
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-gray-800 p-6 shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">Lista de Productos Registrados</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-gray-300">
            <thead className="border-b border-gray-700 text-xs uppercase bg-gray-900 text-gray-400">
              <tr>
                <th className="p-3">Nombre</th>
                <th className="p-3">SKU</th>
                <th className="p-3">Precio</th>
                <th className="p-3">Dimensiones (L x An x Al)</th>
                <th className="p-3">Volumen (m³)</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-b border-gray-700 hover:bg-gray-700/50">
                  <td className="p-3 font-medium text-white">{p.name}</td>
                  <td className="p-3">{p.sku}</td>
                  <td className="p-3">${p.price}</td>
                  <td className="p-3">{p.lengthCm} x {p.widthCm} x {p.heightCm} cm</td>
                  <td className="p-3 text-green-400 font-bold">{p.cubicMeters} m³</td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-4 text-center text-gray-500">No hay productos registrados todavía.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}