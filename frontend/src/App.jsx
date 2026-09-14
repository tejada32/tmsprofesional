// src/App.jsx
import React, { useState, useEffect } from 'react';
import { RegisterView } from './components/RegisterView';
import { ProductsView } from './components/ProductsView';
import { ClientsView } from './components/ClientsView';
import { SuppliersView } from './components/SuppliersView';
import { SettingsView } from './components/SettingsView';
import { WarehousesView } from './components/WarehousesView';
import { BranchesView } from './components/BranchesView';
import { TopMenuBar } from './components/TopMenuBar';
import { Sidebar } from './components/Sidebar';
import { Dashboard } from './components/Dashboard';

const API_URL = 'http://localhost:3000';

export default function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [isRegistering, setIsRegistering] = useState(false);
  
  // Estado para la navegación interna (dashboard, products, suppliers, clients, warehouses, settings)
  const [currentView, setCurrentView] = useState('dashboard');

  // Estados de autenticación (login)
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogout = () => {
    setToken('');
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setCurrentView('dashboard');
  };

  // Control de inactividad para Navegador Web (CORREGIDO DENTRO DEL COMPONENTE)
  useEffect(() => {
    if (!token) return;

    const timeoutMinutes = user?.sessionTimeoutMinutes || 15; 
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        alert('Su sesión ha expirado por inactividad.');
        handleLogout();
      }, timeoutMinutes * 60 * 1000);
    };

    window.addEventListener('mousemove', resetTimer);
    window.addEventListener('keypress', resetTimer);
    window.addEventListener('click', resetTimer);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
    };
  }, [token, user]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (res.ok) {
        setToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('token', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        alert('¡Login exitoso!');
      } else {
        alert(data.message || 'Error en el login');
      }
    } catch (err) {
      console.error(err);
      alert('Error de conexión con el servidor');
    }
  };

  if (!token) {
    if (isRegistering) {
      return (
        <div className="min-h-screen bg-gray-900 p-4">
          <RegisterView setIsRegistering={setIsRegistering} />
        </div>
      );
    }

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-900 text-white p-4">
        <div className="w-full max-w-md rounded-lg bg-gray-800 p-8 shadow-md">
          <h2 className="mb-6 text-center text-2xl font-bold">TMS Profesional - Login</h2>

          <form onSubmit={handleLogin}>
              <div className="mb-4">
                <label className="block text-sm font-medium">Correo Electrónico</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium">Contraseña</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="mt-1 w-full rounded border border-gray-700 bg-gray-900 p-2 text-white focus:border-blue-500 focus:outline-none"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full rounded bg-blue-600 p-2 font-semibold hover:bg-blue-700"
              >
                Iniciar Sesión
              </button>
              <p className="mt-4 text-center text-sm">
                <button
                  type="button"
                  onClick={() => setIsRegistering(true)}
                  className="text-blue-400 hover:underline"
                >
                  ¿No tienes cuenta? Regístrate aquí
                </button>
              </p>
            </form>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-slate-50 text-slate-800 flex flex-col overflow-hidden">
      {/* BARRA SUPERIOR DE MENÚS */}
      <TopMenuBar currentView={currentView} onNavigate={setCurrentView} />

      {/* BARRA DE USUARIO / SESIÓN */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-6 py-3 shrink-0">
        <div>
          <h1
            onClick={() => setCurrentView('dashboard')}
            className="text-xl font-bold text-blue-600 cursor-pointer hover:text-blue-700 transition-colors"
            title="Ir al Dashboard"
          >
            TMS Profesional
          </h1>
          <p className="text-xs text-slate-500">
            Rol: <span className="text-blue-600 uppercase font-semibold">{user?.role}</span>
            {user?.subRole && ` (${user.subRole})`}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-sm bg-slate-100 px-3 py-1 rounded border border-slate-200 text-slate-700">
            Usuario: <strong className="text-slate-900">{user?.name || user?.email}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="rounded bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>

      {/* CONTENEDOR PRINCIPAL: SIDEBAR + CONTENIDO */}
      <div className="flex flex-1 overflow-hidden">
        <Sidebar currentView={currentView} onNavigate={setCurrentView} />

        <main className="flex-1 overflow-y-auto p-6">
          <div className="mx-auto max-w-6xl">
            {currentView === 'products' ? (
              <ProductsView token={token} />
            ) : currentView === 'suppliers' ? (
              <SuppliersView token={token} />
            ) : currentView === 'warehouses' ? (
              <WarehousesView token={token} />
            ) : currentView === 'branches' ? (
              <BranchesView token={token} />
            ) : currentView === 'settings' ? (
              <SettingsView token={token} user={user} setUser={setUser} />
            ) : currentView === 'clients' ? (
              <ClientsView token={token} />
            ) : (
              <Dashboard user={user} token={token} onNavigate={setCurrentView} />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}