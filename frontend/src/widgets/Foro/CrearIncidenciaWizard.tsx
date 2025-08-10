import { useState } from "react";
import PersonaIncidenciaForm from "./CrearIncidencia/Pasos/PersonaIncidenciaForm";
import InstitucionForm from "./CrearIncidencia/Pasos/InstitucionForm";
import DatosIncidenciaForm from "./CrearIncidencia/Pasos/DatosIncidenciaForm";
import FamiliaresForm from "./CrearIncidencia/Pasos/FamiliaresForm";
import ResumenFinal from "./CrearIncidencia/Pasos/ResumenFinal";

// Tipos
import type { CrearIncidenciaFormData } from "@/types/FormData";

// Hook de autenticación
import { useAuth } from "../../hooks/useAuth";

// Estado inicial del formulario completo, coincidiendo con los tipos
const initialFormData: CrearIncidenciaFormData = {
  persona: {
    nombreCompleto: "",
    dni: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    correo: "",
    imagenUrl: "",
    notasAdicionales: "",
  },
  institucion: {
    nombre: "",
    tipo: "",
    ubicacion: "",
    codigoModular: "",
  },
  incidencia: {
    titulo: "",
    descripcion: "",
    tipoIncidencia: "",
    montoDeuda: "",
    fechaIncidencia: "",
    estadoIncidencia: "Pendiente",
    confidencialidadNivel: "Privado",
    adjuntosUrl: "",
  },
  familiares: [],
};

export default function CrearIncidenciaWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<CrearIncidenciaFormData>(initialFormData);
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();

  const next = () => setStep((prev) => Math.min(prev + 1, 5));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  // Función para actualizar el estado del formulario de manera parcial
  const updateFormData = (newData: Partial<CrearIncidenciaFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handlePublicar = async () => {
    // Aquí puedes incluir cualquier validación final antes de enviar
    if (!user?.id) {
      throw new Error("No se pudo obtener el ID de usuario.");
    }

    setLoading(true);
    try {
      // Usar variable de entorno para la URL de la API
      const backendUrl = import.meta.env.VITE_BACKEND_URL;
      if (!backendUrl) {
          throw new Error("VITE_BACKEND_URL no está definida.");
      }
      
      const response = await fetch(`${backendUrl}/api/incidencias/crear`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData, // Usamos el estado consolidado
          usuarioId: user.id, // Corregido a camelCase para consistencia
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Error inesperado del servidor.");
      }

      await response.json();
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen py-20 bg-center bg-no-repeat bg-cover"
      style={{
        backgroundImage: "url('/01sdasgtkyukjgh.webp')",
      }}
      id="crear-incidencia"
    >
      {/* Capa negra suave para contraste */}
      <div className="absolute inset-0 z-0 bg-black/40 backdrop-blur-sm" />

      <div className="relative z-10 max-w-6xl px-6 mx-auto">
        <h2 className="mb-10 text-4xl font-extrabold text-center text-white drop-shadow-lg">
          Crear nueva incidencia
        </h2>

        <div className="p-6 transition-all duration-500 bg-white border shadow-2xl rounded-xl border-slate-200 animate-fade-in">
          {step === 1 && (
            <PersonaIncidenciaForm
              initialData={formData.persona}
              onNext={(data) => {
                updateFormData({ persona: data });
                next();
              }}
            />
          )}

          {step === 2 && (
            <InstitucionForm
              initialData={formData.institucion}
              onBack={back}
              onNext={(data) => {
                updateFormData({ institucion: data });
                next();
              }}
            />
          )}

          {step === 3 && (
            <DatosIncidenciaForm
              data={formData.incidencia}
              onBack={back}
              onNext={(data) => {
                updateFormData({ incidencia: data });
                next();
              }}
            />
          )}

          {step === 4 && (
            <FamiliaresForm
              data={formData.familiares}
              onBack={back}
              onNext={(data) => {
                updateFormData({ familiares: data });
                next();
              }}
            />
          )}

          {step === 5 && (
            <ResumenFinal
              persona={formData.persona}
              institucion={formData.institucion}
              incidencia={formData.incidencia}
              familiares={formData.familiares}
              onBack={back}
              onPublicar={handlePublicar}
              loading={loading}
            />
          )}
        </div>
      </div>
    </section>
  );
}