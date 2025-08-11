import { useRef, useState } from "react";
import PersonaIncidenciaForm from "./CrearIncidencia/Pasos/PersonaIncidenciaForm";
import InstitucionForm from "./CrearIncidencia/Pasos/InstitucionForm";
import DatosIncidenciaForm from "./CrearIncidencia/Pasos/DatosIncidenciaForm";
import FamiliaresForm from "./CrearIncidencia/Pasos/FamiliaresForm";
import ResumenFinal from "./CrearIncidencia/Pasos/ResumenFinal";

import type { CrearIncidenciaFormData } from "@/types/FormData";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "@/lib/api"; // usa tu wrapper

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
    tipo: "", // <- requerido por backend
    ubicacion: "",
    codigoModular: "",
  },
  incidencia: {
    titulo: "",
    descripcion: "", // <- requerido por backend
    tipoIncidencia: "", // <- requerido por backend
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

  // evita doble submit aunque el hijo también lo controle
  const isSubmittingRef = useRef(false);

  const next = () => setStep((prev) => Math.min(prev + 1, 5));
  const back = () => setStep((prev) => Math.max(prev - 1, 1));

  const updateFormData = (newData: Partial<CrearIncidenciaFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  };

  // Helpers de limpieza
  const clean = (v?: string) => (v && v.trim() !== "" ? v.trim() : undefined);
  const toISO = (v?: string) => {
    if (!v || v.trim() === "") return undefined;
    const d = new Date(v);
    return isNaN(d.getTime()) ? undefined : d.toISOString();
  };
  const toNumberOrNull = (v: any) => {
    if (v === null || v === undefined || `${v}`.trim() === "") return null;
    const n = Number(v);
    return Number.isNaN(n) ? null : n;
  };

  const handlePublicar = async () => {
    if (isSubmittingRef.current || loading) return;
    if (!user?.id) throw new Error("No se pudo obtener el ID de usuario.");

    // Normaliza/recorta strings y duplica camelCase/snake_case por compatibilidad con backend
    const persona = {
      dni: clean(formData.persona.dni),
      nombreCompleto: clean(formData.persona.nombreCompleto),
      correo: clean(formData.persona.correo),
      telefono: clean(formData.persona.telefono),
      fechaNacimiento: toISO(formData.persona.fechaNacimiento),
      genero: clean(formData.persona.genero),
      imagenUrl: clean(formData.persona.imagenUrl),
      notasAdicionales: clean(formData.persona.notasAdicionales),
      // snake_case
      nombre_completo: clean(formData.persona.nombreCompleto),
      fecha_nacimiento: toISO(formData.persona.fechaNacimiento),
      imagen_url: clean(formData.persona.imagenUrl),
      notas_adicionales: clean(formData.persona.notasAdicionales),
    };

    const institucion = {
      nombre: clean(formData.institucion.nombre),
      tipo: clean(formData.institucion.tipo),
      ubicacion: clean(formData.institucion.ubicacion),
      codigoModular: clean(formData.institucion.codigoModular),
      // snake_case
      codigo_modular: clean(formData.institucion.codigoModular),
    };

    const adjuntosArray =
      Array.isArray((formData.incidencia as any).adjuntosUrl)
        ? ((formData.incidencia as any).adjuntosUrl as string[]).map((x) => x?.trim()).filter(Boolean)
        : clean((formData.incidencia as any).adjuntosUrl)
        ? [clean((formData.incidencia as any).adjuntosUrl)!]
        : [];

    const incidencia = {
      titulo: clean(formData.incidencia.titulo),
      descripcion: clean(formData.incidencia.descripcion),
      tipoIncidencia: clean(formData.incidencia.tipoIncidencia),
      montoDeuda: toNumberOrNull(formData.incidencia.montoDeuda),
      fechaIncidencia: toISO(formData.incidencia.fechaIncidencia) ?? new Date().toISOString(),
      estadoIncidencia: clean(formData.incidencia.estadoIncidencia),
      confidencialidadNivel: clean(formData.incidencia.confidencialidadNivel),
      adjuntosUrl: adjuntosArray,
      // snake_case
      tipo_incidencia: clean(formData.incidencia.tipoIncidencia),
      monto_deuda: toNumberOrNull(formData.incidencia.montoDeuda),
      fecha_incidencia: toISO(formData.incidencia.fechaIncidencia) ?? new Date().toISOString(),
      estado_incidencia: clean(formData.incidencia.estadoIncidencia),
      confidencialidad_nivel: clean(formData.incidencia.confidencialidadNivel),
      adjuntos_url: adjuntosArray,
    };

    const familiares = (formData.familiares || []).map((f) => ({
      dni: clean(f.dni)!,
      nombre: clean(f.nombre)!,
      telefono: clean(f.telefono),
      correo: clean(f.correo),
      tipoVinculo: clean(f.tipoVinculo),
      // snake_case
      tipo_vinculo: clean(f.tipoVinculo),
    }));

    // Validaciones estrictas (evita 400 genérico “Faltan datos obligatorios”)
    if (!persona.dni) throw new Error("Falta el DNI de la persona afectada.");
    if (!persona.nombreCompleto) throw new Error("Falta el nombre completo de la persona afectada.");
    if (!institucion.nombre) throw new Error("Falta el nombre de la institución.");
    if (!institucion.tipo) throw new Error("Falta el tipo de institución.");
    if (!incidencia.titulo) throw new Error("Falta el título de la incidencia.");
    if (!incidencia.descripcion) throw new Error("Falta la descripción de la incidencia.");
    if (!incidencia.tipoIncidencia) throw new Error("Falta el tipo de incidencia.");
    if (!incidencia.estadoIncidencia) throw new Error("Falta el estado de la incidencia.");
    if (!incidencia.confidencialidadNivel) throw new Error("Falta el nivel de confidencialidad.");
    if (incidencia.montoDeuda !== null && Number.isNaN(Number(incidencia.montoDeuda))) {
      throw new Error("El monto de deuda debe ser numérico.");
    }

    const payload = {
      usuarioId: user.id,
      usuario_id: user.id, // snake_case compat
      persona,
      institucion,
      incidencia,
      familiares,
    };

    // eslint-disable-next-line no-console
    console.log("[CREAR_INCIDENCIA_PAYLOAD]", payload);

    isSubmittingRef.current = true;
    setLoading(true);
    try {
      // IMPORTANTE: VITE_API_URL ya incluye /api ⇒ aquí NO antepongas /api
      const res = await apiFetch("/incidencias/crear", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      // Si tu apiFetch devuelve Response plano:
      const text = await res.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok) {
        const msg = data?.error || data?.message || data?.detalle || text || `HTTP ${res.status}`;
        throw new Error(msg);
      }

      // Si necesitas el objeto creado: return data;
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
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
              loading={loading || isSubmittingRef.current}
            />
          )}
        </div>
      </div>
    </section>
  );
}
