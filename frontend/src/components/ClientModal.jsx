// src/components/ClientModal.jsx
import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';

const DOCUMENT_TYPES = [
  { value: 'cedula', label: 'Cédula' },
  { value: 'rnc', label: 'RNC' },
  { value: 'pasaporte', label: 'Pasaporte' },
];

const CLIENT_TYPES = [
  { value: 'individual', label: 'Individual' },
  { value: 'empresa', label: 'Empresa' },
];

const STATUS_OPTIONS = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
  { value: 'credito_bloqueado', label: 'Crédito Bloqueado' },
];

// Botones tipo "segmented control" reutilizados para varios campos de opción única
function SegmentedField({ label, options, value, onChange }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
        {label}
      </label>
      <div className="inline-flex w-full rounded-lg border border-slate-200 bg-slate-50 p-1">
        {options.map((opt) => (
          <button
            key={opt.value}
            type="button"
            onClick={() => onChange(opt.value)}
            className={`flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all ${
              value === opt.value
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-500 hover:text-slate-700'
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div>
      <label className="block text-xs font-semibold uppercase tracking-wide text-slate-500 mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}

const inputClass =
  'w-full px-3.5 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-800 placeholder:text-slate-400 outline-none transition-shadow focus:border-blue-400 focus:ring-4 focus:ring-blue-100';

export function ClientModal({ isOpen, onClose, onSave, client }) {
  const isEditMode = !!client;

  const emptyForm = {
    fullName: '',
    clientType: 'individual',
    documentType: 'cedula',
    documentNumber: '',
    email: '',
    phone: '',
    phoneExtension: '',
    city: '',
    address: '',
    status: 'activo',
    creditLimit: 0,
    notes: '',
  };

  const [formData, setFormData] = useState(emptyForm);

  // Cuando se abre el modal para editar, precarga los datos del cliente.
  // Cuando se abre para crear uno nuevo, arranca en blanco.
  useEffect(() => {
    if (isOpen) {
      setFormData(client ? { ...emptyForm, ...client } : emptyForm);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, client]);

  if (!isOpen) return null;

  const set = (field) => (value) => setFormData((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-hidden rounded-2xl bg-white shadow-2xl animate-[modal-in_0.2s_ease-out]">
        <style>{`
          @keyframes modal-in {
            from { opacity: 0; transform: translateY(10px) scale(0.98); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        `}</style>

        {/* Encabezado */}
        <div className="relative px-7 py-5 bg-gradient-to-r from-blue-600 to-blue-500">
          <button
            onClick={onClose}
            className="absolute right-5 top-5 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
          >
            &times;
          </button>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white/15 text-xl">
              👤
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">
                {isEditMode ? 'Editar Cliente' : 'Registrar Nuevo Cliente'}
              </h2>
              <p className="text-xs text-blue-100">
                {isEditMode
                  ? `Código de cliente: ${String(client.clientCode).padStart(6, '0')}`
                  : 'El código de cliente se asigna automáticamente'}
              </p>
            </div>
          </div>
        </div>

        {/* Cuerpo con scroll */}
        <form onSubmit={handleSubmit} className="flex max-h-[calc(90vh-140px)] flex-col">
          <div className="flex-1 overflow-y-auto px-7 py-6 space-y-7">
            {/* Sección: Identificación */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
                Identificación
              </h3>
              <Field label="Nombre / Razón Social">
                <input
                  type="text"
                  required
                  placeholder="Ej. Comercial Santiago S.R.L."
                  value={formData.fullName}
                  onChange={(e) => set('fullName')(e.target.value)}
                  className={inputClass}
                />
              </Field>
              <div className="grid grid-cols-2 gap-4">
                <SegmentedField
                  label="Tipo de Cliente"
                  options={CLIENT_TYPES}
                  value={formData.clientType}
                  onChange={set('clientType')}
                />
                <SegmentedField
                  label="Tipo de Documento"
                  options={DOCUMENT_TYPES}
                  value={formData.documentType}
                  onChange={set('documentType')}
                />
              </div>
              <Field label="Número de Documento">
                <input
                  type="text"
                  required
                  placeholder="000-0000000-0"
                  value={formData.documentNumber}
                  onChange={(e) => set('documentNumber')(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </section>

            {/* Sección: Contacto */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
                Contacto
              </h3>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Correo Electrónico">
                  <input
                    type="email"
                    placeholder="cliente@correo.com"
                    value={formData.email}
                    onChange={(e) => set('email')(e.target.value)}
                    className={inputClass}
                  />
                </Field>
                <Field label="Ciudad">
                  <input
                    type="text"
                    placeholder="Ej. Santiago"
                    value={formData.city}
                    onChange={(e) => set('city')(e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2">
                  <Field label="Teléfono">
                    <input
                      type="text"
                      required
                      placeholder="809-000-0000"
                      value={formData.phone}
                      onChange={(e) => set('phone')(e.target.value)}
                      className={inputClass}
                    />
                  </Field>
                </div>
                <Field label="Ext.">
                  <input
                    type="text"
                    placeholder="123"
                    value={formData.phoneExtension}
                    onChange={(e) => set('phoneExtension')(e.target.value)}
                    className={inputClass}
                  />
                </Field>
              </div>
              <Field label="Dirección">
                <input
                  type="text"
                  placeholder="Calle, número, sector..."
                  value={formData.address}
                  onChange={(e) => set('address')(e.target.value)}
                  className={inputClass}
                />
              </Field>
            </section>

            {/* Sección: Configuración comercial */}
            <section className="space-y-4">
              <h3 className="text-sm font-bold text-slate-700 border-b border-slate-100 pb-2">
                Configuración Comercial
              </h3>
              <SegmentedField
                label="Estado"
                options={STATUS_OPTIONS}
                value={formData.status}
                onChange={set('status')}
              />
              <Field label="Límite de Crédito (RD$)">
                <input
                  type="number"
                  min="0"
                  value={formData.creditLimit}
                  onChange={(e) => set('creditLimit')(parseFloat(e.target.value) || 0)}
                  className={inputClass}
                />
              </Field>
              <Field label="Notas Internas (opcional)">
                <textarea
                  rows={2}
                  placeholder="Observaciones sobre este cliente..."
                  value={formData.notes}
                  onChange={(e) => set('notes')(e.target.value)}
                  className={`${inputClass} resize-none`}
                />
              </Field>
            </section>
          </div>

          {/* Pie fijo */}
          <div className="flex justify-end gap-3 border-t border-slate-100 bg-slate-50 px-7 py-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition-colors"
            >
              {isEditMode ? 'Guardar Cambios' : 'Guardar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
}
