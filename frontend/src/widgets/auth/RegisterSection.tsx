import { useState } from "react";
import {
  Mail,
  User,
  Lock,
  ShieldCheck,
  School,
  Phone,
  IdCard,
  Hash as HashIcon,
} from "lucide-react";
import TermsAndConditionsSection from "./TermsAndConditionsSection";
import { toast } from "sonner";
import { apiFetch } from "../../lib/api"; // Ajusta la ruta según tu estructura

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

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    const requiredFields = [
      "firstName",
      "lastName",
      "dni",
      "institution",
      "phone",
      "email",
      "password",
    ];

    for (const field of requiredFields) {
      if (!formData[field as keyof typeof formData].trim()) {
        toast.error("Por favor completa todos los campos obligatorios.");
        return;
      }
    }

    if (!acceptedTerms) {
      toast.error("Debes aceptar los Términos y Condiciones para continuar.");
      return;
    }

  try {
    const res = await apiFetch("/auth/register", {
      method: "POST",
      body: JSON.stringify({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        dni: formData.dni,
        phone: formData.phone,
        user: formData.user,
      }),
    });

    const result = await res.json();

    if (res.ok) {
      toast.success("Usuario registrado correctamente.");
      onSwitch(); // redirige a login
    } else {
      toast.error(result?.error || "Error en el registro.");
    }
  } catch (err) {
    console.error("Error:", err);
    toast.error("Error al conectar con el servidor.");
  }
  };

  return (
    <div className="w-full max-w-xl p-8 bg-white border shadow-2xl rounded-2xl border-cyan-100 animate-fade-in">
      <h2 className="flex items-center justify-center gap-2 mb-6 text-3xl font-bold text-center text-cyan-700">
        <ShieldCheck className="w-6 h-6" />
        Registro Institucional
      </h2>

      <form onSubmit={handleRegister} className="space-y-4">
        {/* Nombres y Apellidos */}
        <div className="flex gap-4">
          <div className="relative w-1/2">
            <User className="absolute w-4 h-4 text-black left-3 top-3" />
            <input
              type="text"
              name="firstName"
              placeholder="Nombres *"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
          <div className="relative w-1/2">
            <User className="absolute w-4 h-4 text-black left-3 top-3" />
            <input
              type="text"
              name="lastName"
              placeholder="Apellidos *"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        </div>

        {/* DNI */}
        <div className="relative">
          <IdCard className="absolute w-4 h-4 text-black left-3 top-3" />
          <input
            type="text"
            name="dni"
            placeholder="DNI *"
            value={formData.dni}
            onChange={handleChange}
            className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Colegio */}
        <div className="relative">
          <School className="absolute w-4 h-4 text-black left-3 top-3" />
          <input
            type="text"
            name="institution"
            placeholder="Nombre del colegio *"
            value={formData.institution}
            onChange={handleChange}
            className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Código Modular (opcional) */}
        {formData.institution && (
          <div className="relative">
            <HashIcon className="absolute w-4 h-4 text-black left-3 top-3" />
            <input
              type="text"
              name="institutionNumber"
              placeholder="Código modular del colegio (ej. 20356)"
              value={formData.institutionNumber}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
            />
          </div>
        )}

        {/* Teléfono */}
        <div className="relative">
          <Phone className="absolute w-4 h-4 text-black left-3 top-3" />
          <input
            type="text"
            name="phone"
            placeholder="Teléfono personal *"
            value={formData.phone}
            onChange={handleChange}
            className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Email */}
        <div className="relative">
          <Mail className="absolute w-4 h-4 text-black left-3 top-3" />
          <input
            type="email"
            name="email"
            placeholder="Correo electrónico *"
            value={formData.email}
            onChange={handleChange}
            className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
          <p className="mt-1 ml-1 text-xs text-gray-500">
            * Este correo será el principal medio de comunicación.
          </p>
        </div>

        {/* Nickname */}
        <div className="relative">
          <User className="absolute w-4 h-4 text-black left-3 top-3" />
          <input
            type="text"
            name="user"
            placeholder="Ingrese su nombre completo"
            value={formData.user}
            onChange={handleChange}
            className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Contraseña */}
        <div className="relative">
          <Lock className="absolute w-4 h-4 text-black left-3 top-3" />
          <input
            type="password"
            name="password"
            placeholder="Contraseña *"
            value={formData.password}
            onChange={handleChange}
            className="w-full py-2 pl-10 pr-4 text-black border border-gray-300 rounded-lg focus:ring-2 focus:ring-cyan-500"
          />
        </div>

        {/* Términos y condiciones */}
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
              className="ml-1 underline text-cyan-600"
            >
              Términos y Condiciones
            </button>
          </label>
        </div>
        {showTermsModal && (
          <TermsAndConditionsSection onClose={() => setShowTermsModal(false)} />
        )}

        <button
          type="submit"
          className="w-full py-2 text-black transition rounded-lg hover:text-white bg-cyan-400 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-60 hover:shadow-lg hover:shadow-cyan-300 hover:-translate-y-0.5 hover:scale-105 shadow-sm"
        >
          Crear cuenta
        </button>
      </form>

      <p className="mt-6 text-sm text-center text-black">
        ¿Ya tienes una cuenta?{" "}
        <button
          onClick={onSwitch}
          className="font-medium text-cyan-600 hover:underline"
        >
          Inicia sesión aquí
        </button>
      </p>
    </div>
  );
}
