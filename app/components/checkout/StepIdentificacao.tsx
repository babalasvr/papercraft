'use client';

import { useState } from 'react';
import { formatCPF, formatPhone, validateCPF, validateEmail, validatePhone, validateName } from '@/app/lib/validators';
import { Pencil } from 'lucide-react';

export type CustomerData = {
  name: string;
  email: string;
  cpf: string;
  phone: string;
};

type Props = {
  customer: CustomerData;
  onChange: (customer: CustomerData) => void;
  onNext: () => void;
  isCompleted: boolean;
  onEdit: () => void;
};

export default function StepIdentificacao({ customer, onChange, onNext, isCompleted, onEdit }: Props) {
  const [errors, setErrors] = useState<Partial<Record<keyof CustomerData, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof CustomerData, boolean>>>({});

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof CustomerData, string>> = {};
    if (!validateName(customer.name)) newErrors.name = 'Digite seu nome completo';
    if (!validateEmail(customer.email)) newErrors.email = 'Email inválido';
    if (!validateCPF(customer.cpf)) newErrors.cpf = 'CPF inválido';
    if (!validatePhone(customer.phone)) newErrors.phone = 'Telefone inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    setTouched({ name: true, email: true, cpf: true, phone: true });
    if (validate()) onNext();
  };

  const handleBlur = (field: keyof CustomerData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validate();
  };

  if (isCompleted) {
    return (
      <div className="bg-[#16213e] rounded-lg p-5 border border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
            <h2 className="font-semibold text-white">Identificação</h2>
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <button onClick={onEdit} className="text-gray-400 hover:text-white transition">
            <Pencil className="w-4 h-4" />
          </button>
        </div>
        <div className="text-sm space-y-1 text-gray-300">
          <p className="font-medium text-white">{customer.name}</p>
          <p>{customer.email}</p>
          <p>CPF {formatCPF(customer.cpf)}</p>
          <p>+55 {formatPhone(customer.phone)}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#16213e] rounded-lg p-5 border border-gray-700/50">
      <div className="flex items-center gap-2 mb-5">
        <span className="bg-orange-500 text-white w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold">1</span>
        <h2 className="font-semibold text-white text-lg">Identificação</h2>
      </div>

      <div className="space-y-4">
        {/* Nome */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Nome completo</label>
          <input
            type="text"
            value={customer.name}
            onChange={(e) => onChange({ ...customer, name: e.target.value })}
            onBlur={() => handleBlur('name')}
            placeholder="Seu nome completo"
            className={`w-full bg-[#0f1729] border rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition ${
              touched.name && errors.name ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
            }`}
          />
          {touched.name && errors.name && (
            <p className="text-red-400 text-xs mt-1">{errors.name}</p>
          )}
        </div>

        {/* CPF */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">CPF</label>
          <input
            type="text"
            inputMode="numeric"
            value={formatCPF(customer.cpf)}
            onChange={(e) => onChange({ ...customer, cpf: e.target.value.replace(/\D/g, '').slice(0, 11) })}
            onBlur={() => handleBlur('cpf')}
            placeholder="000.000.000-00"
            className={`w-full bg-[#0f1729] border rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition ${
              touched.cpf && errors.cpf ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
            }`}
          />
          {touched.cpf && errors.cpf && (
            <p className="text-red-400 text-xs mt-1">{errors.cpf}</p>
          )}
        </div>

        {/* Telefone */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Telefone</label>
          <div className="flex">
            <span className="bg-[#0f1729] border border-gray-600 border-r-0 rounded-l-lg px-3 py-3 text-gray-400 text-sm flex items-center">
              +55
            </span>
            <input
              type="tel"
              inputMode="numeric"
              value={formatPhone(customer.phone)}
              onChange={(e) => onChange({ ...customer, phone: e.target.value.replace(/\D/g, '').slice(0, 11) })}
              onBlur={() => handleBlur('phone')}
              placeholder="(00) 00000-0000"
              className={`w-full bg-[#0f1729] border rounded-r-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition ${
                touched.phone && errors.phone ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
              }`}
            />
          </div>
          {touched.phone && errors.phone && (
            <p className="text-red-400 text-xs mt-1">{errors.phone}</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Email</label>
          <input
            type="email"
            value={customer.email}
            onChange={(e) => onChange({ ...customer, email: e.target.value })}
            onBlur={() => handleBlur('email')}
            placeholder="seu@email.com"
            className={`w-full bg-[#0f1729] border rounded-lg px-4 py-3 text-white placeholder-gray-500 outline-none transition ${
              touched.email && errors.email ? 'border-red-500' : 'border-gray-600 focus:border-orange-500'
            }`}
          />
          {touched.email && errors.email && (
            <p className="text-red-400 text-xs mt-1">{errors.email}</p>
          )}
        </div>

        <button
          onClick={handleSubmit}
          className="w-full cta-button py-4 rounded-lg font-bold text-lg text-center"
        >
          Continuar
        </button>
      </div>
    </div>
  );
}
