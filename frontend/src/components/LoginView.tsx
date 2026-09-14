// src/components/LoginView.tsx
import React, { useState } from 'react';
import logoImg from '../assets/logo.png';

export function LoginView({ setIsRegistering }) {
  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Error al iniciar sesión');

      alert('¡Inicio de sesión exitoso!');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      minHeight: '80vh',
      backgroundColor: '#f1f5f9', // Fondo gris suave para que resalte la tarjeta
      padding: '20px',
      boxSizing: 'border-box'
    }}>
      <div style={{
        maxWidth: '420px',
        width: '100%',
        padding: '35px',
        background: '#ffffff', // Tarjeta blanca sobre fondo gris
        borderRadius: '16px',
        boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.04)',
        border: '1px solid #e2e8f0',
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        boxSizing: 'border-box',
        textAlign: 'left'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '24px', borderBottom: '1px solid #edf2f7', paddingBottom: '20px' }}>
          <img 
            src={logoImg} 
            alt="TMS Profesional" 
            style={{ maxWidth: '160px', height: 'auto', margin: '0 auto 14px auto', display: 'block', objectFit: 'contain' }} 
          />
          <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '6px', marginTop: 0 }}>TMS Profesional</h2>
          <p style={{ color: '#64748b', fontSize: '13.5px', margin: 0, lineHeight: '1.4' }}>Digita tu usuario y contraseña para entrar</p>
        </div>

        {error && (
          <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '13px', marginBottom: '16px', textAlign: 'center', fontWeight: '500' }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '16px' }}>
            <label style={{ fontWeight: '600', fontSize: '13px', color: '#334155', marginBottom: '6px' }}>Correo Electrónico *</label>
            <input 
              type="email" 
              name="email" 
              placeholder="correo@ejemplo.com" 
              value={form.email} 
              onChange={handleChange} 
              required 
              style={{ padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', marginBottom: '20px' }}>
            <label style={{ fontWeight: '600', fontSize: '13px', color: '#334155', marginBottom: '6px' }}>Contraseña *</label>
            <input 
              type="password" 
              name="password" 
              placeholder="Introduce tu contraseña" 
              value={form.password} 
              onChange={handleChange} 
              required 
              style={{ padding: '11px 14px', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '14px', outline: 'none', backgroundColor: '#f8fafc', color: '#0f172a', width: '100%', boxSizing: 'border-box' }}
            />
          </div>

          <button type="submit" style={{ width: '100%', background: 'linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)', color: 'white', padding: '12px', border: 'none', borderRadius: '8px', fontSize: '14.5px', fontWeight: '600', cursor: 'pointer', boxShadow: '0 4px 6px -1px rgba(37, 99, 235, 0.2)' }}>
            Iniciar Sesión
          </button>

          <div style={{ textAlign: 'center', marginTop: '20px', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
            <button type="button" onClick={() => setIsRegistering(true)} style={{ background: 'none', border: 'none', color: '#2563eb', cursor: 'pointer', fontSize: '13.5px', fontWeight: '500', textDecoration: 'none' }}>
              ¿No tienes cuenta? Regístrate aquí
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}