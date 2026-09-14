import React, { useState, useEffect } from 'react';
import { getOrCreateDeviceUuid } from '../utils/device.util';
import {
  SUBSCRIPTION_PLANS_MASTER,
} from '../common/constants/subscription-plans.constant';
import logoImg from '../assets/logo.png';
import './RegisterView.css';

const LATAM_COUNTRIES = [
  { label: 'República Dominicana', code: 'DO' },
  { label: 'México', code: 'MX' },
  { label: 'Colombia', code: 'CO' },
  { label: 'Argentina', code: 'AR' },
  { label: 'Chile', code: 'CL' },
  { label: 'Perú', code: 'PE' },
  { label: 'Ecuador', code: 'EC' },
  { label: 'Panamá', code: 'PA' },
  { label: 'Costa Rica', code: 'CR' },
  { label: 'Uruguay', code: 'UY' },
  { label: 'Venezuela', code: 'VE' },
  { label: 'Bolivia', code: 'BO' },
  { label: 'Guatemala', code: 'GT' },
  { label: 'Honduras', code: 'HN' },
];

const USER_FUNCTIONS = [
  'Empresario de Transporte y Logística',
  'Comerciante / Retail / Electrodomésticos',
  'Gestor de Préstamos / Financiera',
  'Empresario Agrícola',
  'Prestador de Servicios Profesionales',
  'Otro',
];

export function RegisterView({ setIsRegistering }) {
  const groupedPlans = SUBSCRIPTION_PLANS_MASTER.reduce(
    (acc, plan) => {
      if (!acc[plan.category]) {
        acc[plan.category] = [];
      }
      acc[plan.category].push(plan);
      return acc;
    },
    {}
  );

  const defaultPlan = SUBSCRIPTION_PLANS_MASTER[0];

  const [form, setForm] = useState({
    name: '',
    companyName: '',
    email: '',
    phone: '',
    taxId: '',
    region: 'Latam',
    country: 'República Dominicana',
    userFunction: USER_FUNCTIONS[0],
    customUserFunction: '',
    planType: 'trial',
    planCategory: defaultPlan?.category || 'Transporte',
    planSubcategory: defaultPlan?.abbreviation || 'VG1',
    billingCycle: '1-mes',
    password: '',
    deviceUuid: '',
  });

  const [regionError, setRegionError] = useState('');

  useEffect(() => {
    const uuid = getOrCreateDeviceUuid();
    setForm((prev) => ({
      ...prev,
      deviceUuid: uuid,
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === 'region') {
      if (value !== 'Latam') {
        setRegionError(
          'Esta región no está disponible por el momento. Debe elegir un país de la región Latam.'
        );
      } else {
        setRegionError('');
      }
    }

    if (name === 'planSubcategory') {
      const selectedPlan = SUBSCRIPTION_PLANS_MASTER.find(
        (plan) => plan.abbreviation === value
      );

      setForm((prev) => ({
        ...prev,
        planSubcategory: value,
        planCategory: selectedPlan?.category || prev.planCategory,
      }));

      return;
    }

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const getCurrentPrice = () => {
    if (form.planType === 'trial') {
      return 'Gratis (3 Días)';
    }

    const selectedPlan = SUBSCRIPTION_PLANS_MASTER.find(
      (plan) => plan.abbreviation === form.planSubcategory
    );

    if (!selectedPlan) {
      return '$0.00';
    }

    const base = selectedPlan.priceUsd;
    let multiplier = 1;
    let labelSuffix = 'mes';

    switch (form.billingCycle) {
      case '1-mes':
        multiplier = 1;
        labelSuffix = 'mes';
        break;
      case '3-meses':
        multiplier = 2.7;
        labelSuffix = '3 meses';
        break;
      case '6-meses':
        multiplier = 5;
        labelSuffix = '6 meses';
        break;
      case '1-ano':
        multiplier = 9.5;
        labelSuffix = 'año';
        break;
      default:
        multiplier = 1;
        labelSuffix = 'mes';
    }

    const finalPrice = base * multiplier;
    return `$${finalPrice.toFixed(2)} / ${labelSuffix}`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.region !== 'Latam') {
      alert('Debe seleccionar la región Latam para continuar.');
      return;
    }

    if (
      form.userFunction === 'Otro' &&
      form.customUserFunction.trim().length < 4
    ) {
      alert('La función personalizada debe tener al menos 4 caracteres.');
      return;
    }

    try {
      const selectedPlan = SUBSCRIPTION_PLANS_MASTER.find(
        (plan) => plan.abbreviation === form.planSubcategory
      );

      const businessTypeValue = selectedPlan
        ? `${selectedPlan.subCategory} (${selectedPlan.planName} - $${selectedPlan.priceUsd})`
        : form.planSubcategory;

      const response = await fetch('http://localhost:3000/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          businessType: businessTypeValue,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error en el registro');
      }

      alert('¡Registro exitoso! Bienvenido a TMS Profesional.');
      setIsRegistering(false);
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="register-card">
      <div className="register-header">
        <img
          src={logoImg}
          alt="TMS Profesional"
          className="register-logo"
        />
        <h2>TMS Profesional - Registro (Admin)</h2>
        <p>Registro en TMS Profesional</p>
      </div>

      <form onSubmit={handleSubmit} className="register-form">
        <div className="form-grid-table">
          {/* Nombre */}
          <div className="form-group">
            <label>Nombre del Administrador *</label>
            <input
              type="text"
              name="name"
              placeholder="Ej. Juan Pérez"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          {/* Correo */}
          <div className="form-group">
            <label>Correo Electrónico *</label>
            <input
              type="email"
              name="email"
              placeholder="correo@ejemplo.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          {/* Teléfono */}
          <div className="form-group">
            <label>Teléfono de Contacto *</label>
            <input
              type="tel"
              name="phone"
              placeholder="8095179759"
              value={form.phone}
              onChange={handleChange}
              required
            />
          </div>

          {/* Contraseña */}
          <div className="form-group">
            <label>Contraseña</label>
            <input
              type="password"
              name="password"
              placeholder="Por defecto temporal si se deja vacío"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {/* Empresa */}
          <div className="form-group">
            <label>Nombre de la Empresa *</label>
            <input
              type="text"
              name="companyName"
              placeholder="Mi Empresa S.R.L."
              value={form.companyName}
              onChange={handleChange}
              required
            />
          </div>

          {/* Identificación fiscal */}
          <div className="form-group">
            <label>Identificación Fiscal (RNC / Cédula / NIT)</label>
            <input
              type="text"
              name="taxId"
              placeholder="Ej. 101234567"
              value={form.taxId}
              onChange={handleChange}
            />
          </div>

          {/* Región */}
          <div className="form-group">
            <label>Región *</label>
            <select
              name="region"
              value={form.region}
              onChange={handleChange}
              required
            >
              <option value="Latam">Latam</option>
              <option value="Norteamérica">Norteamérica</option>
              <option value="Europa">Europa</option>
              <option value="Asia">Asia</option>
              <option value="África">África</option>
              <option value="Oceanía">Oceanía</option>
            </select>

            {regionError && (
              <span className="error-text">{regionError}</span>
            )}
          </div>

          {/* País */}
          <div className="form-group">
            <label>País *</label>
            <select
              name="country"
              value={form.country}
              onChange={handleChange}
              required
            >
              {LATAM_COUNTRIES.map((item) => (
                <option key={item.label} value={item.label}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Función principal */}
        <div className="form-group full-width">
          <label>Función Principal *</label>
          <select
            name="userFunction"
            value={form.userFunction}
            onChange={handleChange}
            required
          >
            {USER_FUNCTIONS.map((fn) => (
              <option key={fn} value={fn}>
                {fn}
              </option>
            ))}
          </select>
        </div>

        {/* Función personalizada */}
        {form.userFunction === 'Otro' && (
          <div className="form-group full-width">
            <label>Especifique su función (Mínimo 4 letras) *</label>
            <input
              type="text"
              name="customUserFunction"
              placeholder="Ej. Consultor independiente"
              value={form.customUserFunction}
              onChange={handleChange}
              required
              minLength={4}
            />
          </div>
        )}

        {/* Modalidad de suscripción */}
        <div className="plan-section-box">
          <label className="plan-section-title">Modalidad de Suscripción</label>
          <div className="radio-group">
            <label>
              <input
                type="radio"
                name="planType"
                value="trial"
                checked={form.planType === 'trial'}
                onChange={handleChange}
              />
              Versión de Prueba (3 Días)
            </label>

            <label>
              <input
                type="radio"
                name="planType"
                value="pro"
                checked={form.planType === 'pro'}
                onChange={handleChange}
              />
              Versión Pro (Pagada)
            </label>
          </div>
        </div>

        {/* Selección de plan */}
        <div className="form-grid-table">
          <div className="form-group">
            <label>Categoría y Subcategoría del Plan *</label>
            <select
              name="planSubcategory"
              value={form.planSubcategory}
              onChange={handleChange}
              required
            >
              {Object.entries(groupedPlans).map(([categoryName, plans]) => (
                <optgroup key={categoryName} label={categoryName}>
                  {plans.map((plan) => (
                    <option key={plan.abbreviation} value={plan.abbreviation}>
                      {plan.subCategory} ({plan.planName} - ${plan.priceUsd})
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          {/* Ciclo y precio */}
          <div className="form-group">
            <label>Tiempo de Suscripción y Precio *</label>
            <div className="subcategory-price-wrapper">
              <select
                name="billingCycle"
                value={form.billingCycle}
                onChange={handleChange}
                disabled={form.planType === 'trial'}
                required
              >
                <option value="1-mes">1 Mes</option>
                <option value="3-meses">3 Meses</option>
                <option value="6-meses">6 Meses</option>
                <option value="1-ano">1 Año</option>
              </select>

              <span className="price-tag">{getCurrentPrice()}</span>
            </div>
          </div>
        </div>

        {/* Botón de registro */}
        <button
          type="submit"
          disabled={form.region !== 'Latam'}
          className="submit-btn"
        >
          Completar Registro
        </button>

        {/* Regresar al login */}
        <div className="login-link-container">
          <button
            type="button"
            onClick={() => setIsRegistering(false)}
            className="text-link"
          >
            ¿Ya tienes cuenta? Inicia sesión
          </button>
        </div>
      </form>
    </div>
  );
}