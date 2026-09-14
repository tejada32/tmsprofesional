// src/components/SettingsView.jsx
import React, { useState } from 'react';

const API_URL = 'http://localhost:3000';

export function SettingsView({ token, user, setUser }) {
  const [form, setForm] = useState({
    companyName: user?.companyName || '',
    phone: user?.phone || '',
    taxId: user?.taxId || '',
    country: user?.country || 'República Dominicana',
    region: user?.region || 'Latam',
    sessionTimeoutMinutes: user?.sessionTimeoutMinutes || 15,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/company`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const resConfig = await fetch(`${API_URL}/companies/config`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ sessionTimeoutMinutes: Number(form.sessionTimeoutMinutes) }),
      });

      const data = await res.json();
      if (res.ok && resConfig.ok) {
        alert('¡Configuración actualizada con éxito!');
        const updatedUser = { ...user, ...form };
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
      } else {
        alert(data.message || 'Error al actualizar la configuración');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg bg-gray-800 p-6 shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-4 text-white">⚙️ Configuración General de la Empresa</h2>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-gray-300">Nombre de la Empresa / Negocio</label>
            <input
              type="text"
              value={form.companyName}
              onChange={(e) => setForm({ ...form, companyName: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300">Teléfono Comercial</label>
            <input
              type="text"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
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
          <div>
            <label className="block text-sm font-medium text-gray-300">País</label>
            <input
              type="text"
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-300">
              Tiempo límite de inactividad para Navegador Web
            </label>
            <select
              value={form.sessionTimeoutMinutes}
              onChange={(e) => setForm({ ...form, sessionTimeoutMinutes: e.target.value })}
              className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-sm text-white"
            >
              <option value={5}>5 Minutos</option>
              <option value={10}>10 Minutos</option>
              <option value={15}>15 Minutos</option>
              <option value={30}>30 Minutos</option>
              <option value={60}>1 Hora</option>
            </select>
            <p className="text-xs text-gray-400 mt-1">
              La sesión en navegadores web expirará automáticamente tras este tiempo sin actividad de mouse o teclado.
            </p>
          </div>

          <div className="md:col-span-2">
            <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-sm font-semibold hover:bg-blue-700">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>

      <div className="rounded-lg bg-gray-800 p-6 shadow border border-gray-700">
        <h2 className="text-xl font-semibold mb-2 text-white">🔒 Información de Sesión</h2>
        <p className="text-sm text-gray-400 mb-4">Detalles técnicos del usuario actual conectado en el sistema.</p>
        <div className="bg-gray-900 p-4 rounded border border-gray-700 text-sm space-y-2">
          <p><span className="text-gray-400">Usuario:</span> <strong className="text-white">{user?.email}</strong></p>
          <p><span className="text-gray-400">Rol principal:</span> <strong className="text-yellow-400 uppercase">{user?.role}</strong></p>
          <p><span className="text-gray-400">ID de Dispositivo:</span> <strong className="text-gray-300">{user?.deviceUuid || 'N/A'}</strong></p>
        </div>
      </div>
    </div>
  );
}