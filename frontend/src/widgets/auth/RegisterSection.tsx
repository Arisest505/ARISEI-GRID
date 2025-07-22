import { useState } from "react";
import {
  Mail,
  User,
  Lock,
  ShieldCheck,
  School,
  Phone,
  IdCard,
  HashIcon,
} from "lucide-react";
import TermsAndConditionsSection from "./TermsAndConditionsSection";

export default function RegisterSection({ onSwitch }: { onSwitch: () => void }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    dni: "",
    institution: "",
    institutionNumber: "",
    phone: "",
    user: "",
  });

  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }
    console.log("Datos registrados:", formData);
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white rounded-2xl shadow-2xl border border-cyan-100 animate-fade-in">
      <h2 className="text-3xl font-bold mb-6 text-center text-cyan-700 flex items-center justify-center gap-2">
        <ShieldCheck className="w-6 h-6" />
        Registro Institucional
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <User className="absolute left-3 top-3 w-4 h-4 text-black" />
            <input
              type="text"
              name="firstName"
              placeholder="Nombres"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
            />
          </div>
          <div className="relative w-1/2">
            <User className="absolute left-3 top-3 w-4 h-4 text-black" />
            <input
              type="text"
              name="lastName"
              placeholder="Apellidos"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
            />
          </div>
        </div>

        <div className="relative">
          <IdCard className="absolute left-3 top-3 w-4 h-4 text-black" />
          <input
            type="text"
            name="dni"
            placeholder="DNI"
            value={formData.dni}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
          />
        </div>

        <div className="relative">
          <School className="absolute left-3 top-3 w-4 h-4 text-black" />
          <input
            type="text"
            name="institution"
            placeholder="Nombre del colegio (opcional)"
            value={formData.institution}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
          />
        </div>

        {formData.institution && (
          <div className="relative">
            <HashIcon className="absolute left-3 top-3 w-4 h-4 text-black" />
            <input
              type="text"
              name="institutionNumber"
              placeholder="Código modular del colegio (ej. 20356)"
              value={formData.institutionNumber}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
            />
          </div>
        )}

        <div className="relative">
          <Phone className="absolute left-3 top-3 w-4 h-4 text-black" />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono personal"
            value={formData.phone}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
          />
        </div>

        <div className="relative">
          <Mail className="absolute left-3 top-3 w-4 h-4 text-black" />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico"
            value={formData.email}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
          />
          <p className="text-xs mt-1 text-gray-500 ml-1">
            * Este correo será el principal medio de comunicación.
          </p>
        </div>

        <div className="relative">
          <User className="absolute left-3 top-3 w-4 h-4 text-black" />
          <input
            type="text"
            name="user"
            placeholder="Nombre alternativo / Nickname"
            value={formData.user}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
          />
        </div>

        <div className="relative">
          <Lock className="absolute left-3 top-3 w-4 h-4 text-black" />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            value={formData.password}
            onChange={handleChange}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-black"
          />
        </div>

        {/* Términos y Condiciones */}
        <div className="flex items-start gap-2 text-sm">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={() => setAcceptedTerms(!acceptedTerms)}
            className="mt-1"
          />
          <label className="text-black">
            Acepto los
            <button
              type="button"
              onClick={() => setShowTermsModal(true)}
              className="text-cyan-600 underline ml-1"
            >
              Términos y Condiciones
            </button>
          </label>
          {showTermsModal && (
            <TermsAndConditionsSection onClose={() => setShowTermsModal(false)} />
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-700 text-white py-2 rounded-lg hover:bg-cyan-800 transition"
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-black">
        ¿Ya tienes una cuenta?{" "}
        <button
          onClick={onSwitch}
          className="text-cyan-600 hover:underline font-medium"
        >
          Inicia sesión aquí
        </button>
      </p>
    </div>
  );
}
