import { useState } from "react";
import PersonaIncidenciaForm from "./CrearIncidencia/Pasos/PersonaIncidenciaForm";
import InstitucionForm from "./CrearIncidencia/Pasos/InstitucionForm";
import DatosIncidenciaForm from "./CrearIncidencia/Pasos/DatosIncidenciaForm";
import FamiliaresForm from "./CrearIncidencia/Pasos/FamiliaresForm";
import ResumenFinal from "./CrearIncidencia/Pasos/ResumenFinal";

import type { CrearIncidenciaFormData } from "@/types/FormData";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "@/lib/api"; // <- usa tu wrapper

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

  const updateFormData = (newData: Partial<CrearIncidenciaFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  const handlePublicar = async () => {
    if (!user?.id) throw new Error("No se pudo obtener el ID de usuario.");

    // Mapea/normaliza para cumplir con backend
    const payload = {
      usuarioId: user.id,
      persona: {
        dni: formData.persona.dni,
        nombreCompleto: formData.persona.nombreCompleto,
        correo: formData.persona.correo || null,
        telefono: formData.persona.telefono || null,
        fechaNacimiento: formData.persona.fechaNacimiento
          ? new Date(formData.persona.fechaNacimiento).toISOString()
          : null,
        genero: formData.persona.genero || null,
        imagenUrl: formData.persona.imagenUrl || null,
        notasAdicionales: formData.persona.notasAdicionales || null,
      },
      institucion: {
        nombre: formData.institucion.nombre,
        ubicacion: formData.institucion.ubicacion || null,
        tipo: formData.institucion.tipo,
        codigoModular: formData.institucion.codigoModular || null,
      },
      incidencia: {
        titulo: formData.incidencia.titulo,
        descripcion: formData.incidencia.descripcion,
        tipoIncidencia: formData.incidencia.tipoIncidencia,
        montoDeuda:
          formData.incidencia.montoDeuda !== undefined &&
          formData.incidencia.montoDeuda !== null &&
          `${formData.incidencia.montoDeuda}`.trim() !== ""
            ? Number(formData.incidencia.montoDeuda)
            : null,
        fechaIncidencia: formData.incidencia.fechaIncidencia
          ? new Date(formData.incidencia.fechaIncidencia).toISOString()
          : new Date().toISOString(),
        estadoIncidencia: formData.incidencia.estadoIncidencia,
        confidencialidadNivel: formData.incidencia.confidencialidadNivel,
        adjuntosUrl: Array.isArray(formData.incidencia.adjuntosUrl)
          ? formData.incidencia.adjuntosUrl
          : formData.incidencia.adjuntosUrl
          ? [formData.incidencia.adjuntosUrl]
          : [],
      },
      familiares: (formData.familiares || []).map((f) => ({
        nombre: f.nombre,
        dni: f.dni,
        tipoVinculo: f.tipoVinculo,
        telefono: f.telefono || null,
        correo: f.correo || null,
      })),
    };

    // Validaciones rápidas antes de enviar
    if (!payload.persona.dni) throw new Error("Falta el DNI de la persona afectada.");
    if (!payload.persona.nombreCompleto) throw new Error("Falta el nombre completo de la persona afectada.");
    if (!payload.institucion.nombre) throw new Error("Falta el nombre de la institución.");
    if (!payload.incidencia.titulo) throw new Error("Falta el título de la incidencia.");
    if (!payload.incidencia.tipoIncidencia) throw new Error("Falta el tipo de incidencia.");
    if (
      payload.incidencia.montoDeuda !== null &&
      Number.isNaN(Number(payload.incidencia.montoDeuda))
    ) {
      throw new Error("El monto de deuda debe ser numérico.");
    }

    setLoading(true);
    try {
      // OJO: tu API base ya incluye /api (VITE_API_URL = https://.../api),
      // por eso aquí el path NO debe llevar /api al inicio.
      const res = await apiFetch("/incidencias/crear", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Tu apiFetch devuelve Response (según tu implementación actual)
      const text = await res.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch {
        // no hacer nada
      }

      if (!res.ok) {
        const msg = data?.error || data?.message || data?.detalle || text || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      // Si quieres usar el objeto creado:
      // return data;
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      className="relative min-h-screen py-20 bg-center bg-no-repeat bg-cover"
      style={{ backgroundImage: "url('/01sdasgtkyukjgh.webp')" }}
      id="crear-incidencia"
    >
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
