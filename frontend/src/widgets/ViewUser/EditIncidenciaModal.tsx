// EditIncidenciaModalV2.tsx (Plantilla estilo Detalle + edición)
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
 
import {
  X,
  User as UserIcon,
  School,
  FileText,
  Trash2,
  Save,
  CalendarDays,
  ShieldAlert,
  AlertTriangle,
  IdCard,
  Phone,
  Mail,
  Users,
  BadgeCheck,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";

const API = "http://localhost:5000";

interface Props {
  isOpen: boolean;
  onClose: () => void;
  incidenciaId: string;
  onUpdate: () => void;
}

// UI helper
const Label: React.FC<{ icon?: React.ReactNode; text: string }> = ({ icon, text }) => (
  <span className="flex items-center gap-2 text-sm font-semibold text-cyan-700">
    {icon}
    {text}
  </span>
);

export default function EditIncidenciaModalV2({ isOpen, onClose, incidenciaId, onUpdate }: Props) {
  const [formData, setFormData] = useState<any>({ persona: {}, institucion: {}, incidencia: {}, familiares: [] });
  const [loading, setLoading] = useState(false);
  const token = localStorage.getItem("token");

  const setIncidenciaField = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, incidencia: { ...prev.incidencia, [field]: value } }));
  const setPersonaField = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, persona: { ...prev.persona, [field]: value } }));
  const setInstitucionField = (field: string, value: any) =>
    setFormData((prev: any) => ({ ...prev, institucion: { ...prev.institucion, [field]: value } }));

  // Campos a mostrar (solo si tienen valor) — orden consistente
  const incidenciaFieldsOrder = useMemo(
    () => [
      "titulo",
      "tipo_incidencia",
      "otro_tipo",
      "descripcion",
      "monto_deuda",
      "fecha_incidencia",
      "estado_incidencia",
      "confidencialidad_nivel",
      "adjuntos_url",
      "fecha_creacion",
      "fecha_actualizacion",
    ],
    []
  );

  const iconFor = (key: string) => {
    switch (key) {
      case "fecha_incidencia":
      case "fecha_creacion":
      case "fecha_actualizacion":
        return <CalendarDays className="w-4 h-4" />;
      case "estado_incidencia":
        return <ShieldAlert className="w-4 h-4" />;
      case "confidencialidad_nivel":
        return <AlertTriangle className="w-4 h-4" />;
      case "adjuntos_url":
        return <LinkIcon className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const pretty = (k: string) => k.replace(/_/g, " ").replace(/\b\w/g, (m) => m.toUpperCase());

const handleSubmit = async () => {
  try {
    setLoading(true);

    if (!token) {
      toast.error("No autorizado.");
      return;
    }

    // 1) Tomamos los valores del formulario
    const inc = formData?.incidencia ?? {};

    // 2) Normalizamos tipos y vacíos
    const toNullIfEmpty = (v: unknown) =>
      v === "" || v === undefined ? null : v;

    // Si llega número como string, lo volvemos número. Si está vacío, null.
    const montoSanitizado =
      inc.monto_deuda === "" || inc.monto_deuda === null || inc.monto_deuda === undefined
        ? null
        : Number(inc.monto_deuda);

    // Si la fecha llega en yyyy-mm-dd, la mandamos tal cual (el backend hace new Date(fecha))
    // Si está vacía, mandamos null.
    const fechaSanitizada =
      !inc.fecha_incidencia || String(inc.fecha_incidencia).trim() === ""
        ? null
        : String(inc.fecha_incidencia).slice(0, 10);

    // 3) Payload con SOLO campos de la tabla incidencia
    const rawPayload: Record<string, unknown> = {
      titulo: toNullIfEmpty(inc.titulo)?.toString().trim(),
      descripcion: toNullIfEmpty(inc.descripcion)?.toString().trim(),
      tipo_incidencia: toNullIfEmpty(inc.tipo_incidencia)?.toString().trim(),
      estado_incidencia: toNullIfEmpty(inc.estado_incidencia)?.toString().trim(),
      confidencialidad_nivel: toNullIfEmpty(inc.confidencialidad_nivel)?.toString().trim(),
      adjuntos_url: toNullIfEmpty(inc.adjuntos_url)?.toString().trim(),
      monto_deuda: montoSanitizado,
      fecha_incidencia: fechaSanitizada,
    };

    // 4) Quitamos keys con undefined (o null si prefieres no tocar campos)
    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(rawPayload)) {
      if (v !== undefined) payload[k] = v;
    }

    // 5) Disparamos el PUT correcto
    const res = await fetch(`${API}/api/usuario/incidencias/${incidenciaId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(payload),
    });

    // Intenta leer JSON; si no es JSON, lee texto para debug
    let data: any = null;
    const text = await res.text();
    try { data = JSON.parse(text); } catch { /* no-op */ }

    if (!res.ok) {
      const msg = (data && (data.error || data.detalle)) || text || "Error al editar incidencia";
      throw new Error(msg);
    }

    toast.success("Incidencia actualizada correctamente.");
    onUpdate();
    onClose();
  } catch (e: any) {
    console.error("[ERROR_UPDATE]", e);
    toast.error(e?.message || "No se pudo actualizar la incidencia");
  } finally {
    setLoading(false);
  }
};


// Asumo que usas sonner para los toasts

const MySwal = withReactContent(Swal);

const handleDelete = async () => {
  const result = await MySwal.fire({
    title: "¿Eliminar esta incidencia?",
    text: "Esta acción es irreversible.",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    reverseButtons: true,
    background: "rgba(183, 250, 215, 1)",
    color: "rgba(0, 0, 0, 1)",
    confirmButtonColor: "#e02424",
    cancelButtonColor: "#3b82f6",
    customClass: {
      popup: "rounded-xl shadow-lg",
      confirmButton: "px-4 py-2 rounded-md text-white",
      cancelButton: "px-4 py-2 rounded-md text-white",
    }
  });

  if (!result.isConfirmed) return;

  try {
    setLoading(true);

    const cleanId = encodeURIComponent(String(incidenciaId).trim());

    const res = await fetch(`${API}/api/usuario/incidencias/${cleanId}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    const text = await res.text();
    let data: unknown = null;

    if (!res.ok) {
      try { data = JSON.parse(text); } catch {}
      const msg = (data as any)?.error || (data as any)?.detalle || text || "Error al eliminar";
      toast.error(msg);
      throw new Error(msg);
    }

    try { data = JSON.parse(text); } catch {}

    toast.success("Incidencia eliminada correctamente");
    onUpdate();
    onClose();

  } catch (e: any) {
    toast.error(e?.message || "No se pudo eliminar la incidencia");
  } finally {
    setLoading(false);
  }
};



  useEffect(() => {
    const fetchIncidencia = async () => {
      try {
        const res = await fetch(`${API}/api/usuario/incidencias/${incidenciaId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Error al obtener incidencia");

        // El backend puede devolver plano o anidado; normalizamos
        const inc = data.incidencia
          ? data.incidencia
          : {
              titulo: data.titulo,
              tipo_incidencia: data.tipo_incidencia,
              descripcion: data.descripcion,
              monto_deuda: data.monto_deuda,
              fecha_incidencia: data.fecha_incidencia,
              estado_incidencia: data.estado_incidencia,
              confidencialidad_nivel: data.confidencialidad_nivel,
              adjuntos_url: data.adjuntos_url,
              fecha_creacion: data.fecha_creacion,
              fecha_actualizacion: data.fecha_actualizacion,
            };

        setFormData({
          persona: data.persona || {},
          institucion: data.institucion || {},
          incidencia: {
            ...inc,
            // Derivado "otro_tipo": solo si aplica
            otro_tipo: inc?.tipo_incidencia === "Otro" ? inc?.otro_tipo || "" : "",
          },
          familiares:
            data.persona?.vinculos?.map((v: any) => ({
              nombre: v.familiar?.nombre,
              dni: v.familiar?.dni,
              tipo_vinculo: v.tipo_vinculo,
              telefono: v.familiar?.telefono,
              correo: v.familiar?.correo,
            })) || [],
        });
      } catch (e: any) {
        console.error("[ERROR_FETCH]", e);
        toast.error(e?.message || "No se pudo cargar la incidencia");
        onClose();
      }
    };

    if (isOpen && incidenciaId) fetchIncidencia();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, incidenciaId]);

  // Render helpers para inputs tipados
  const renderIncidenciaField = (key: string) => {
    const val = formData?.incidencia?.[key];
    if (val === undefined || val === null || val === "") return null; // Solo si tiene datos

    // Tipo de input por campo
    if (key === "descripcion") {
      return (
        <div key={key} className="space-y-1">
          <Label icon={iconFor(key)} text={pretty(key)} />
          <textarea
            rows={4}
            className="w-full px-3 py-2 bg-white border rounded-lg"
            value={val}
            onChange={(e) => setIncidenciaField(key, e.target.value)}
          />
        </div>
      );
    }

    if (key === "estado_incidencia") {
      return (
        <div key={key} className="space-y-1">
          <Label icon={iconFor(key)} text={pretty(key)} />
          <select
            className="w-full px-3 py-2 bg-white border rounded-lg"
            value={val}
            onChange={(e) => setIncidenciaField(key, e.target.value)}
          >
            <option value="Pendiente">Pendiente</option>
            <option value="En proceso">En proceso</option>
            <option value="Resuelto">Resuelto</option>
          </select>
        </div>
      );
    }

    if (key === "confidencialidad_nivel") {
      return (
        <div key={key} className="space-y-1">
          <Label icon={iconFor(key)} text={pretty(key)} />
          <select
            className="w-full px-3 py-2 bg-white border rounded-lg"
            value={val}
            onChange={(e) => setIncidenciaField(key, e.target.value)}
          >
            <option value="Privado">Privado</option>
            <option value="Público">Público</option>
          </select>
        </div>
      );
    }

    if (key === "fecha_incidencia") {
      const iso = val ? new Date(val).toISOString().slice(0, 10) : "";
      return (
        <div key={key} className="space-y-1">
          <Label icon={iconFor(key)} text={pretty(key)} />
          <input
            type="date"
            className="w-full px-3 py-2 border rounded-lg"
            value={iso}
            onChange={(e) => setIncidenciaField(key, e.target.value)}
          />
        </div>
      );
    }

    if (key === "monto_deuda") {
      return (
        <div key={key} className="space-y-1">
          <Label icon={iconFor(key)} text={pretty(key)} />
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">S/</span>
            <input
              type="number"
              className="w-full py-2 pl-10 pr-3 border rounded-lg"
              value={val}
              onChange={(e) => setIncidenciaField(key, e.target.value)}
            />
          </div>
        </div>
      );
    }

    if (key === "adjuntos_url") {
      return (
        <div key={key} className="space-y-1">
          <Label icon={iconFor(key)} text={pretty(key)} />
          <input
            type="url"
            className="w-full px-3 py-2 border rounded-lg"
            value={val}
            onChange={(e) => setIncidenciaField(key, e.target.value)}
          />
          <a href={val} target="_blank" className="inline-flex items-center gap-2 text-sm text-blue-600 underline">
            <LinkIcon className="w-4 h-4" /> Abrir adjunto
          </a>
        </div>
      );
    }

    if (key === "fecha_creacion" || key === "fecha_actualizacion") {
      const fmt = val ? new Date(val).toLocaleString() : "";
      return (
        <div key={key} className="space-y-1 opacity-80">
          <Label icon={iconFor(key)} text={pretty(key)} />
          <input className="w-full px-3 py-2 bg-gray-100 border rounded-lg" value={fmt} readOnly />
        </div>
      );
    }

    // por defecto: texto
    return (
      <div key={key} className="space-y-1">
        <Label icon={iconFor(key)} text={pretty(key)} />
        <input
          className="w-full px-3 py-2 border rounded-lg"
          value={val}
          onChange={(e) => setIncidenciaField(key, e.target.value)}
        />
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/60 backdrop-blur-sm" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
          <motion.div className="relative w-full max-w-5xl p-6 bg-white rounded-3xl shadow-2xl overflow-y-auto max-h-[92vh] border border-cyan-700" initial={{ scale: 0.95, y: 50 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.95, y: 50 }}>
            <button onClick={onClose} className="absolute text-gray-500 top-4 right-4 hover:text-red-600"><X /></button>
            <h2 className="flex items-center gap-2 mb-6 text-3xl font-extrabold text-center text-cyan-800"><FileText /> Editar Incidencia</h2>

            {/* Persona */}
            {Object.keys(formData.persona || {}).length > 0 && (
              <section className="p-4 mb-6 border shadow-sm bg-gray-50 rounded-xl">
                <Label icon={<UserIcon className="w-5 h-5" />} text="Persona Afectada" />
                <div className="grid grid-cols-1 gap-4 mt-3 text-sm md:grid-cols-2">
                  {formData.persona?.dni !== undefined && (
                    <div className="space-y-1">
                      <Label icon={<IdCard className="w-4 h-4" />} text="DNI" />
                      <input className="w-full px-3 py-2 border rounded-lg" value={formData.persona.dni || ""} onChange={(e) => setPersonaField("dni", e.target.value)} />
                    </div>
                  )}
                  {formData.persona?.nombre_completo !== undefined && (
                    <div className="space-y-1">
                      <Label icon={<UserIcon className="w-4 h-4" />} text="Nombre completo" />
                      <input className="w-full px-3 py-2 border rounded-lg" value={formData.persona.nombre_completo || ""} onChange={(e) => setPersonaField("nombre_completo", e.target.value)} />
                    </div>
                  )}
                  {formData.persona?.genero && (
                    <div className="space-y-1">
                      <Label text="Género" />
                      <select className="w-full px-3 py-2 bg-white border rounded-lg" value={formData.persona.genero} onChange={(e) => setPersonaField("genero", e.target.value)}>
                        <option value="Masculino">Masculino</option>
                        <option value="Femenino">Femenino</option>
                        <option value="Otro">Otro</option>
                        <option value="Prefiero no decirlo">Prefiero no decirlo</option>
                      </select>
                    </div>
                  )}
                  {formData.persona?.fecha_nacimiento && (
                    <div className="space-y-1">
                      <Label text="Fecha de nacimiento" />
                      <input type="date" className="w-full px-3 py-2 border rounded-lg" value={new Date(formData.persona.fecha_nacimiento).toISOString().slice(0, 10)} onChange={(e) => setPersonaField("fecha_nacimiento", e.target.value)} />
                    </div>
                  )}
                  {formData.persona?.telefono && (
                    <div className="space-y-1">
                      <Label icon={<Phone className="w-4 h-4" />} text="Teléfono" />
                      <input className="w-full px-3 py-2 border rounded-lg" value={formData.persona.telefono} onChange={(e) => setPersonaField("telefono", e.target.value)} />
                    </div>
                  )}
                  {formData.persona?.correo && (
                    <div className="space-y-1">
                      <Label icon={<Mail className="w-4 h-4" />} text="Correo" />
                      <input type="email" className="w-full px-3 py-2 border rounded-lg" value={formData.persona.correo} onChange={(e) => setPersonaField("correo", e.target.value)} />
                    </div>
                  )}
                  {formData.persona?.imagen_url && (
                    <div className="space-y-1 md:col-span-2">
                      <Label text="Imagen (URL)" />
                      <input type="url" className="w-full px-3 py-2 border rounded-lg" value={formData.persona.imagen_url} onChange={(e) => setPersonaField("imagen_url", e.target.value)} />
                    </div>
                  )}
                  {formData.persona?.notas_adicionales && (
                    <div className="space-y-1 md:col-span-2">
                      <Label text="Notas adicionales" />
                      <textarea rows={3} className="w-full px-3 py-2 border rounded-lg" value={formData.persona.notas_adicionales} onChange={(e) => setPersonaField("notas_adicionales", e.target.value)} />
                    </div>
                  )}
                </div>

                {formData.familiares?.length > 0 && (
                  <div className="mt-6">
                    <Label icon={<Users className="w-5 h-5" />} text="Familiares Vinculados" />
                    <div className="grid gap-3 mt-2 md:grid-cols-2">
                      {formData.familiares.map((f: any, i: number) => (
                        <div key={i} className="p-3 bg-white border rounded-lg">
                          <p className="text-sm"><BadgeCheck className="inline w-4 h-4 mr-1 text-cyan-700" /> <strong>{f.nombre}</strong> ({f.tipo_vinculo})</p>
                          {f.dni && <p className="text-xs text-gray-600"><IdCard className="inline w-4 h-4 mr-1" /> DNI: {f.dni}</p>}
                          {f.telefono && <p className="text-xs text-gray-600"><Phone className="inline w-4 h-4 mr-1" /> {f.telefono}</p>}
                          {f.correo && <p className="text-xs text-gray-600"><Mail className="inline w-4 h-4 mr-1" /> {f.correo}</p>}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </section>
            )}

            {/* Institución */}
            {Object.keys(formData.institucion || {}).length > 0 && (
              <section className="p-4 mb-6 border shadow-sm bg-gray-50 rounded-xl">
                <Label icon={<School className="w-5 h-5" />} text="Institución" />
                <div className="grid grid-cols-1 gap-4 mt-3 text-sm md:grid-cols-2">
                  {formData.institucion?.nombre !== undefined && (
                    <div className="space-y-1">
                      <Label text="Nombre" />
                      <input className="w-full px-3 py-2 border rounded-lg" value={formData.institucion.nombre || ""} onChange={(e) => setInstitucionField("nombre", e.target.value)} />
                    </div>
                  )}
                  {formData.institucion?.ubicacion && (
                    <div className="space-y-1">
                      <Label text="Ubicación" />
                      <input className="w-full px-3 py-2 border rounded-lg" value={formData.institucion.ubicacion} onChange={(e) => setInstitucionField("ubicacion", e.target.value)} />
                    </div>
                  )}
                  {formData.institucion?.tipo && (
                    <div className="space-y-1">
                      <Label text="Tipo" />
                      <input className="w-full px-3 py-2 border rounded-lg" value={formData.institucion.tipo} onChange={(e) => setInstitucionField("tipo", e.target.value)} />
                    </div>
                  )}
                  {formData.institucion?.codigo_modular && (
                    <div className="space-y-1">
                      <Label text="Código modular" />
                      <input className="w-full px-3 py-2 border rounded-lg" value={formData.institucion.codigo_modular} onChange={(e) => setInstitucionField("codigo_modular", e.target.value)} />
                    </div>
                  )}
                </div>
              </section>
            )}

            {/* Datos de la incidencia */}
            <section className="p-4 mb-4 border shadow-sm bg-gray-50 rounded-xl">
              <Label icon={<FileText className="w-5 h-5" />} text="Datos de la Incidencia" />
              <div className="grid grid-cols-1 gap-4 mt-3 text-sm md:grid-cols-2">
                {incidenciaFieldsOrder.map((key) => renderIncidenciaField(key))}
              </div>
            </section>

            <div className="flex flex-col items-center gap-3 pt-4">
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white transition bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-60"
              >
                <Save className="w-5 h-5" /> {loading ? "Guardando..." : "Actualizar Incidencia"}
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white transition bg-red-600 rounded-lg hover:bg-red-700 disabled:opacity-60"
              >
                <Trash2 className="w-5 h-5" /> {loading ? "Eliminando..." : "Eliminar Incidencia"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
