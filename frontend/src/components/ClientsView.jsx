// src/components/ClientsView.jsx
import React, { useState, useEffect } from 'react';
import { ClientModal } from './ClientModal';

const API_URL = 'http://localhost:3000';

export function ClientsView({ token }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [clients, setClients] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchClients = async () => {
    setIsLoading(true);
    setErrorMessage('');
    try {
      const res = await fetch(`${API_URL}/clients`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (res.ok) {
        setClients(data);
      } else {
        setErrorMessage(data.message || 'No se pudo cargar la lista de clientes');
      }
    } catch (err) {
      console.error(err);
      setErrorMessage('Error de conexión con el servidor');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const filteredClients = clients.filter(client =>
    client.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    String(client.clientCode).includes(searchTerm) ||
    (client.documentNumber || '').includes(searchTerm)
  );

  const handleSaveClient = async (formData) => {
    const isEditing = !!editingClient;
    const url = isEditing ? `${API_URL}/clients/${editingClient.id}` : `${API_URL}/clients`;
    const method = isEditing ? 'PATCH' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (res.ok) {
        // Recargamos desde el servidor en vez de solo agregar/editar en
        // memoria, así el clientCode, el balance calculado y demás
        // valores mostrados son siempre los reales de la base de datos.
        await fetchClients();
        setEditingClient(null);
      } else {
        alert(data.message || `Error al ${isEditing ? 'actualizar' : 'guardar'} el cliente`);
      }
    } catch (err) {
      console.error(err);
      alert(`Error de conexión al ${isEditing ? 'actualizar' : 'guardar'} el cliente`);
    }
  };

  const handleOpenCreate = () => {
    setEditingClient(null);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (client) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const statusLabel = (status) =>
    status === 'activo' ? 'Activo' : status === 'inactivo' ? 'Inactivo' : 'Crédito Bloqueado';

  return (
    <div className="p-6 bg-slate-50 rounded-lg text-slate-800">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">Gestión de Clientes</h1>
          <p className="text-sm text-slate-500">Módulo de Ventas / Cartera de Clientes y Cuentas por Cobrar</p>
        </div>
        <button
          onClick={handleOpenCreate}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded shadow text-sm font-medium transition cursor-pointer flex items-center gap-2"
        >
          <span>+</span> Nuevo Cliente
        </button>
      </div>

      <div className="bg-white rounded-lg shadow border border-slate-200 overflow-hidden">
        <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-4 bg-slate-50/50">
          <input
            type="text"
            placeholder="Buscar por código, nombre o RNC/Cédula..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-md px-3 py-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
          />
          <div className="text-sm text-slate-500 font-medium">
            Total registros: <span className="text-slate-900 font-bold">{filteredClients.length}</span>
          </div>
        </div>

        {errorMessage && (
          <div className="p-4 bg-red-50 border-b border-red-200 text-red-700 text-sm">{errorMessage}</div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-100 text-slate-600 uppercase font-semibold text-xs tracking-wider border-b border-slate-200">
                <th className="p-3">Código</th>
                <th className="p-3">Cliente / Razón Social</th>
                <th className="p-3">RNC / Cédula</th>
                <th className="p-3">Teléfono</th>
                <th className="p-3 text-right">Balance Pendiente</th>
                <th className="p-3 text-center">Estado</th>
                <th className="p-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {isLoading ? (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">
                    Cargando clientes...
                  </td>
                </tr>
              ) : filteredClients.length > 0 ? (
                filteredClients.map((client) => (
                  <tr key={client.id} className="hover:bg-blue-50/40 transition">
                    <td className="p-3 font-medium text-slate-600">
                      {String(client.clientCode).padStart(6, '0')}
                    </td>
                    <td className="p-3 font-bold text-slate-900">{client.fullName}</td>
                    <td className="p-3 text-slate-600">{client.documentNumber}</td>
                    <td className="p-3 text-slate-600">{client.phone}</td>
                    <td className="p-3 text-right font-semibold text-slate-800">
                      ${Number(client.balance || 0).toLocaleString('en-US', { minimumFractionDigits: 2 })}
                    </td>
                    <td className="p-3 text-center">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        client.status === 'activo'
                          ? 'bg-green-100 text-green-700'
                          : client.status === 'inactivo'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {statusLabel(client.status)}
                      </span>
                    </td>
                    <td className="p-3 text-center space-x-2">
                      <button
                        onClick={() => handleOpenEdit(client)}
                        className="text-blue-600 hover:text-blue-800 font-medium text-xs bg-blue-50 hover:bg-blue-100 px-2.5 py-1 rounded transition"
                      >
                        Editar
                      </button>
                      <button className="text-slate-600 hover:text-slate-900 font-medium text-xs bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded transition">Historial</button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="p-6 text-center text-slate-400">
                    No se encontraron clientes registrados con ese criterio de búsqueda.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <ClientModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingClient(null);
        }}
        onSave={handleSaveClient}
        client={editingClient}
      />
    </div>
  );
}
