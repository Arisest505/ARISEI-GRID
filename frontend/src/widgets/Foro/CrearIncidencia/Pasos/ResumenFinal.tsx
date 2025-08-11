import {
  CheckCircle,
  UploadCloud,
  User,
  IdCard,
  Mail,
  School,
  FileText,
  AlertCircle,
  Phone,
  MapPin,
  KeyRound,
  Link2,
  ShieldCheck,
  Calendar,
  ArrowLeft,
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useMemo, useRef } from "react";
import type {
  PersonaData,
  InstitucionData,
  IncidenciaData,
  FamiliarVinculoData,
} from "@/types/FormData";

interface Props {
  persona: PersonaData;
  institucion: InstitucionData;
  incidencia: IncidenciaData;
  familiares: FamiliarVinculoData[];
  onPublicar: () => Promise<void>;
  loading: boolean;
  onBack: () => void;
}

export default function ResumenIncidenciaStep({
  persona,
  institucion,
  incidencia,
  familiares,
  onPublicar,
  loading,
  onBack,
}: Props) {
  const navigate = useNavigate();
  const isSubmittingRef = useRef(false);

  const fmtFecha = (d?: string | Date) => {
    if (!d) return "No especificado";
    const date = new Date(d);
    return isNaN(date.getTime()) ? "Fecha inválida" : date.toLocaleDateString("es-PE");
    // si quieres hora: date.toLocaleString("es-PE")
  };

  const fmtMonto = (v: unknown) => {
    if (v === null || v === undefined) return "No aplica";
    const s = String(v).trim();
    if (!s) return "No aplica";
    const n = Number(s);
    return Number.isNaN(n) ? "—" : `S/ ${n.toFixed(2)}`;
  };

  // adjuntosUrl puede venir como string (JSON o URL simple) o array; backend guarda TEXT
  const adjuntosSiNo = useMemo(() => {
    const raw: unknown = (incidencia as any)?.adjuntosUrl;
    if (!raw) return "No";

    if (typeof raw === "string") {
      const s = raw.trim();
      if (!s) return "No";
      // intentar parsear JSON stringificado de array
      try {
        const parsed = JSON.parse(s);
        if (Array.isArray(parsed)) return parsed.length > 0 ? "Sí" : "No";
      } catch {
        // no era JSON, es algún string no vacío (p.ej. una URL simple)
      }
      return "Sí";
    }

    if (Array.isArray(raw)) {
      return raw.length > 0 ? "Sí" : "No";
    }

    return "Sí";
  }, [incidencia]);

  // Validaciones mínimas antes de publicar (alineadas con tu backend)
  const validar = (): string | null => {
    if (!persona?.dni) return "Falta el DNI de la persona afectada.";
    if (!persona?.nombreCompleto) return "Falta el nombre completo de la persona afectada.";

    // Solo exigir nombre/tipo si mandas codigoModular (tu backend crea/upserta institución solo en ese caso)
    if (institucion?.codigoModular) {
      if (!institucion?.nombre) return "Falta el nombre de la institución.";
      if (!institucion?.tipo) return "Falta el tipo de institución (Privada o Pública).";
    }

    if (!incidencia?.titulo) return "Falta el título de la incidencia.";
    if (!incidencia?.descripcion) return "Falta la descripción de la incidencia.";
    if (!incidencia?.tipoIncidencia) return "Falta el tipo de incidencia.";
    if (!incidencia?.estadoIncidencia) return "Falta el estado de la incidencia.";
    if (!incidencia?.confidencialidadNivel) return "Falta el nivel de confidencialidad.";

    // Monto (si viene) debe ser numérico
    if (
      (incidencia as any).montoDeuda !== undefined &&
      (incidencia as any).montoDeuda !== null
    ) {
      const s = String((incidencia as any).montoDeuda).trim();
      if (s && Number.isNaN(Number(s))) return "El monto de deuda debe ser numérico.";
    }
    return null;
  };

  const handlePublicarConAlerta = async () => {
    if (isSubmittingRef.current || loading) return;

    const err = validar();
    if (err) {
      toast.error(err);
      return;
    }

    const toastId = toast.loading("Publicando incidencia...");
    isSubmittingRef.current = true;

    try {
      await onPublicar();
      toast.dismiss(toastId);
      toast.success("Incidencia publicada con éxito y visible en el foro.");
      setTimeout(() => navigate("/foro"), 900);
    } catch (e: any) {
      toast.dismiss(toastId);
      toast.error(e?.message || "No se pudo publicar la incidencia. Intenta nuevamente.");
      // eslint-disable-next-line no-console
      console.error("[PUBLICAR_ERROR]", e);
    } finally {
      isSubmittingRef.current = false;
    }
  };

  return (
    <section className="py-16 bg-white" id="ask">
      <div className="max-w-4xl px-6 py-10 mx-auto bg-white shadow-xl md:px-8 rounded-3xl animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <button
            type="button"
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold border border-gray-200 rounded-lg hover:bg-gray-50"
            aria-label="Volver al paso anterior"
          >
            <ArrowLeft className="w-4 h-4" />
            Volver
          </button>

          <h2 className="flex items-center gap-2 text-2xl font-bold md:text-3xl text-cyan-800">
            <AlertCircle className="w-6 h-6" /> Confirmación Final
          </h2>

          <span className="w-[92px]" aria-hidden />
        </div>

        <div className="space-y-8">
          {/* Persona */}
          <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-cyan-700">
              <User className="w-5 h-5" /> Persona Afectada
            </h3>
            <ul className="space-y-1 text-sm text-gray-800">
              <li><IdCard className="inline w-4 h-4 mr-1" /> <strong>DNI:</strong> {persona.dni}</li>
              <li><User className="inline w-4 h-4 mr-1" /> <strong>Nombre:</strong> {persona.nombreCompleto}</li>
              <li><Mail className="inline w-4 h-4 mr-1" /> <strong>Correo:</strong> {persona.correo || "No especificado"}</li>
              <li><Phone className="inline w-4 h-4 mr-1" /> <strong>Teléfono:</strong> {persona.telefono || "No especificado"}</li>
              {persona.fechaNacimiento && (
                <li><Calendar className="inline w-4 h-4 mr-1" /> <strong>Nacimiento:</strong> {fmtFecha(persona.fechaNacimiento)}</li>
              )}
              {persona.genero && (
                <li><User className="inline w-4 h-4 mr-1" /> <strong>Género:</strong> {persona.genero}</li>
              )}
              {persona.notasAdicionales && (
                <li><FileText className="inline w-4 h-4 mr-1" /> <strong>Notas:</strong> {persona.notasAdicionales}</li>
              )}
            </ul>
          </section>

          {/* Institución */}
          <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-cyan-700">
              <School className="w-5 h-5" /> Institución
            </h3>
            <ul className="space-y-1 text-sm text-gray-800">
              <li><School className="inline w-4 h-4 mr-1" /> <strong>Nombre:</strong> {institucion.nombre || "N/A"}</li>
              <li><MapPin className="inline w-4 h-4 mr-1" /> <strong>Ubicación:</strong> {institucion.ubicacion || "N/A"}</li>
              <li><ShieldCheck className="inline w-4 h-4 mr-1" /> <strong>Tipo:</strong> {institucion.tipo || "N/A"}</li>
              <li><KeyRound className="inline w-4 h-4 mr-1" /> <strong>Código Modular:</strong> {institucion.codigoModular || "N/A"}</li>
            </ul>
          </section>

          {/* Incidencia */}
          <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-cyan-700">
              <FileText className="w-5 h-5" /> Datos de la Incidencia
            </h3>
            <ul className="space-y-1 text-sm text-gray-800">
              <li><FileText className="inline w-4 h-4 mr-1" /> <strong>Título:</strong> {incidencia.titulo}</li>
              <li><AlertCircle className="inline w-4 h-4 mr-1" /> <strong>Tipo:</strong> {incidencia.tipoIncidencia}</li>
              <li><FileText className="inline w-4 h-4 mr-1" /> <strong>Monto Deuda:</strong> {fmtMonto((incidencia as any).montoDeuda)}</li>
              <li><CheckCircle className="inline w-4 h-4 mr-1" /> <strong>Estado:</strong> {incidencia.estadoIncidencia}</li>
              <li><ShieldCheck className="inline w-4 h-4 mr-1" /> <strong>Confidencialidad:</strong> {incidencia.confidencialidadNivel}</li>
              <li><Calendar className="inline w-4 h-4 mr-1" /> <strong>Fecha:</strong> {fmtFecha(incidencia.fechaIncidencia)}</li>
              <li><FileText className="inline w-4 h-4 mr-1" /> <strong>Descripción:</strong> {incidencia.descripcion}</li>
              <li><Link2 className="inline w-4 h-4 mr-1" /> <strong>Adjuntos:</strong> {adjuntosSiNo}</li>
            </ul>
          </section>

          {/* Familiares */}
          {Array.isArray(familiares) && familiares.length > 0 && (
            <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
              <h3 className="mb-2 text-lg font-semibold text-cyan-700">Familiares Vinculados</h3>
              <ul className="pl-5 space-y-1 text-sm text-gray-800 list-disc">
                {familiares.map((f, idx) => (
                  <li key={`${f.dni || f.nombre || "fam"}-${idx}`}>
                    <User className="inline w-4 h-4 mr-1" />
                    <strong>{f.nombre}</strong> ({f.tipoVinculo}) <IdCard className="inline w-4 h-4 mx-1" /> DNI: {f.dni}
                    {f.telefono && (<><Phone className="inline w-4 h-4 mx-1" /> {f.telefono}</>)}
                    {f.correo && (<><Mail className="inline w-4 h-4 mx-1" /> {f.correo}</>)}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Acciones */}
        <div className="flex flex-col items-center justify-center gap-4 mt-10">
          <button
            onClick={handlePublicarConAlerta}
            disabled={loading || isSubmittingRef.current}
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white transition rounded-lg bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <UploadCloud className="w-5 h-5" />
            {loading || isSubmittingRef.current ? "Publicando..." : "Publicar Incidencia"}
          </button>

          <p className="flex items-center gap-2 mt-2 text-sm text-center text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Revisa los datos antes de continuar. Esta información será visible en el sistema.
          </p>
        </div>
      </div>
    </section>
  );
}
