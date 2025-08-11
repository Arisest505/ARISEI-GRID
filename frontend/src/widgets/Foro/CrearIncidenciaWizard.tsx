import { useRef, useState, useCallback } from "react";
import PersonaIncidenciaForm from "./CrearIncidencia/Pasos/PersonaIncidenciaForm";
import InstitucionForm from "./CrearIncidencia/Pasos/InstitucionForm";
import DatosIncidenciaForm from "./CrearIncidencia/Pasos/DatosIncidenciaForm";
import FamiliaresForm from "./CrearIncidencia/Pasos/FamiliaresForm";
import ResumenFinal from "./CrearIncidencia/Pasos/ResumenFinal";

import type { CrearIncidenciaFormData } from "@/types/FormData";
import { useAuth } from "../../hooks/useAuth";
import { apiFetch } from "@/lib/api";

/* ========== Helpers ========== */
const clean = (v?: string) => (v && v.trim() !== "" ? v.trim() : undefined);
const toISO = (v?: string) => {
  if (!v || v.trim() === "") return undefined;
  const d = new Date(v);
  return isNaN(d.getTime()) ? undefined : d.toISOString();
};
const toNumberOrNull = (v: unknown) => {
  if (v === null || v === undefined || `${v}`.trim?.() === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
};
const norm = (s?: string) =>
  (s || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().trim();

/* Valores consistentes (no son enums DB, pero mantenemos un set uniforme) */
const MAP_TIPO_INCIDENCIA: Record<string, string> = {
  BULLYING: "BULLYING",
  ACOSO: "ACOSO",
  DEUDA: "DEUDA",
  AGRESION: "AGRESION",
};
const MAP_ESTADO: Record<string, string> = {
  PENDIENTE: "PENDIENTE",
  "EN PROCESO": "EN_PROCESO",
  EN_PROCESO: "EN_PROCESO",
  RESUELTO: "RESUELTO",
};
const MAP_CONFID: Record<string, string> = {
  PRIVADO: "PRIVADO",
  PUBLICO: "PUBLICO",
};
const MAP_TIPO_INST: Record<string, string> = {
  PRIVADA: "PRIVADA",
  PUBLICA: "PUBLICA",
};

/* ========== Estado inicial ========== */
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
  const isSubmittingRef = useRef(false);
  const { user } = useAuth();

  const next = useCallback(() => setStep((p) => Math.min(p + 1, 5)), []);
  const back = useCallback(() => setStep((p) => Math.max(p - 1, 1)), []);

  const updateFormData = useCallback((newData: Partial<CrearIncidenciaFormData>) => {
    setFormData((prev) => ({ ...prev, ...newData }));
  }, []);

  const handlePublicar = useCallback(async () => {
    if (isSubmittingRef.current || loading) return;
    if (!user?.id) throw new Error("No se pudo obtener el ID de usuario.");

    /* Persona */
    const persona = {
      dni: clean(formData.persona.dni),
      nombreCompleto: clean(formData.persona.nombreCompleto),
      correo: clean(formData.persona.correo),
      telefono: clean(formData.persona.telefono),
      fechaNacimiento: (() => {
        const iso = toISO(formData.persona.fechaNacimiento);
        if (!iso) return undefined;
        const d = new Date(iso);
        return d.getTime() > Date.now() ? undefined : iso;
      })(),
      genero: clean(formData.persona.genero),
      imagenUrl: clean(formData.persona.imagenUrl),
      notasAdicionales: clean(formData.persona.notasAdicionales),
    };

    /* Institución (solo válida si hay código modular) */
    const codigoModular = clean(formData.institucion.codigoModular);
    const tipoInst = MAP_TIPO_INST[norm(formData.institucion.tipo) || ""] || undefined;

    const institucion = {
      nombre: clean(formData.institucion.nombre),
      tipo: tipoInst,
      ubicacion: clean(formData.institucion.ubicacion),
      codigoModular,
    };

    /* Incidencia */
    const tipoInc = MAP_TIPO_INCIDENCIA[norm(formData.incidencia.tipoIncidencia) || ""] || undefined;
    const estado = MAP_ESTADO[norm(formData.incidencia.estadoIncidencia) || ""] || undefined;
    const confid = MAP_CONFID[norm(formData.incidencia.confidencialidadNivel) || ""] || undefined;

    const adjList = Array.isArray((formData.incidencia as any).adjuntosUrl)
      ? ((formData.incidencia as any).adjuntosUrl as string[]).map((x) => x?.trim()).filter(Boolean)
      : clean((formData.incidencia as any).adjuntosUrl)
      ? [clean((formData.incidencia as any).adjuntosUrl)!]
      : [];

    // 👇 String JSON o null (tu DB tiene TEXT)
    const adjuntosValue: string | null = adjList.length ? JSON.stringify(adjList) : null;

    const incidencia = {
      titulo: clean(formData.incidencia.titulo),
      descripcion: clean(formData.incidencia.descripcion),
      tipoIncidencia: tipoInc,
      montoDeuda: toNumberOrNull(formData.incidencia.montoDeuda),
      fechaIncidencia: toISO(formData.incidencia.fechaIncidencia) ?? new Date().toISOString(),
      estadoIncidencia: estado,
      confidencialidadNivel: confid,
      adjuntosUrl: adjuntosValue,
    };

    /* Familiares */
    const familiares = (formData.familiares || []).map((f) => ({
      dni: clean(f.dni)!,
      nombre: clean(f.nombre)!,
      telefono: clean(f.telefono),
      correo: clean(f.correo),
      tipoVinculo: clean(f.tipoVinculo),
    }));

    /* Validaciones ligeras */
    if (!persona.dni) throw new Error("Falta el DNI de la persona afectada.");
    if (!persona.nombreCompleto) throw new Error("Falta el nombre completo de la persona afectada.");
    if (codigoModular) {
      if (!institucion.nombre) throw new Error("Falta el nombre de la institución.");
      if (!institucion.tipo) throw new Error("Falta el tipo de institución (Privada o Pública).");
    }
    if (!incidencia.titulo) throw new Error("Falta el título de la incidencia.");
    if (!incidencia.descripcion) throw new Error("Falta la descripción de la incidencia.");
    if (!incidencia.tipoIncidencia) throw new Error("Falta el tipo de incidencia válido.");
    if (!incidencia.estadoIncidencia) throw new Error("Falta el estado de la incidencia válido.");
    if (!incidencia.confidencialidadNivel) throw new Error("Falta el nivel de confidencialidad válido.");
    if (incidencia.montoDeuda !== null && Number.isNaN(Number(incidencia.montoDeuda))) {
      throw new Error("El monto de deuda debe ser numérico.");
    }

    const payload = {
      usuario_id: user.id,        //  tu controlador usa este nombre
      persona,
      institucion,
      incidencia,
      familiares,
    };


    console.log("[CREAR_INCIDENCIA_PAYLOAD_NORMALIZADO]", payload);

    isSubmittingRef.current = true;
    setLoading(true);
    try {
      const res = await apiFetch("/incidencias/crear", {
        method: "POST",
        body: JSON.stringify(payload),
      });

      const text = await res.text();
      let data: any = null;
      try { data = JSON.parse(text); } catch {}

      if (!res.ok) {
        const msg = data?.error || data?.message || data?.detalle || text || `HTTP ${res.status}`;
        throw new Error(msg);
      }
      // ok: ResumenFinal maneja el toast/navegación
    } finally {
      setLoading(false);
      isSubmittingRef.current = false;
    }
  }, [formData, loading, user?.id]);

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
              onNext={(data) => { updateFormData({ persona: data }); next(); }}
            />
          )}

          {step === 2 && (
            <InstitucionForm
              initialData={formData.institucion}
              onBack={back}
              onNext={(data) => { updateFormData({ institucion: data }); next(); }}
            />
          )}

          {step === 3 && (
            <DatosIncidenciaForm
              data={formData.incidencia}
              onBack={back}
              onNext={(data) => { updateFormData({ incidencia: data }); next(); }}
            />
          )}

          {step === 4 && (
            <FamiliaresForm
              data={formData.familiares}
              onBack={back}
              onNext={(data) => { updateFormData({ familiares: data }); next(); }}
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
