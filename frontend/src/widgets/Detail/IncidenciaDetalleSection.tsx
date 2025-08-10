import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  CalendarDays,
  MessageCircle,
  User,
  ArrowLeft,
  FileText,
  ShieldAlert,
  AlertTriangle,
  FileDown,
  School,
  IdCard,
  Phone,
  Mail,
  Users,
  BadgeCheck
} from "lucide-react";
import { apiFetch } from "../../lib/api"; 
interface FamiliarData {
  nombre: string;
  dni: string;
  telefono: string | null;
  correo: string | null;
}

interface Familiar {
  id: string;
  tipo_vinculo: string;
  fecha_creacion: string;
  familiar: FamiliarData;
}

interface Institucion {
  nombre: string;
  ubicacion?: string;
  tipo: string;
  codigo_modular?: string;
  fecha_registro: string;
}

interface PersonaIncidencia {
  nombre_completo: string;
  dni: string;
  fecha_nacimiento?: string;
  genero?: string;
  telefono?: string;
  correo?: string;
  imagen_url?: string;
  notas_adicionales?: string;
  vinculos: Familiar[];
}

interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  tipo_incidencia: string;
  monto_deuda: number | null;
  fecha_incidencia: string;
  estado_incidencia: string;
  confidencialidad_nivel: string;
  adjuntos_url?: string;
  fecha_creacion: string;
  creador: {
    nombre: string;
    email: string;
  };
  institucion?: Institucion;
  persona: PersonaIncidencia;
}

export default function IncidenciaDetallePage() {
  const { id } = useParams();
  const [incidencia, setIncidencia] = useState<Incidencia | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
  const fetchDetalle = async () => {
    try {
      const res = await apiFetch(`/foro/incidencia/${id}`);
      if (!res.ok) throw new Error("No se pudo cargar la incidencia");
      const data = await res.json();
      setIncidencia(data);
    } catch (err) {
      console.error("Error al cargar la incidencia", err);
    } finally {
      setLoading(false);
    }
  };
  fetchDetalle();
}, [id]);


  if (loading) return <div className="p-6 text-center animate-pulse text-cyan-700">Cargando detalles...</div>;
  if (!incidencia) return <div className="p-6 text-center text-red-600">No se encontró la incidencia.</div>;

  return (
     <section className="py-16 bg-white" id="ask">
         <div className="max-w-5xl px-6 py-10 mx-auto bg-white shadow-xl rounded-3xl animate-fade-in">
      <div className="flex items-center justify-between mb-6">
        <Link to="/foro" className="inline-flex items-center text-sm text-cyan-700 hover:underline">
          <ArrowLeft className="w-4 h-4 mr-2" /> Volver al foro
        </Link>
        <span className="text-xs text-gray-400">#{incidencia.id}</span>
      </div>

      <h1 className="flex items-center gap-3 mb-6 text-3xl font-extrabold text-cyan-800">
        <MessageCircle className="w-7 h-7" /> {incidencia.titulo}
      </h1>

      <p className="p-4 mb-6 leading-relaxed text-gray-800 border-l-4 rounded-lg bg-gray-50 border-cyan-400">
        {incidencia.descripcion}
      </p>

      <div className="grid gap-4 mb-10 text-sm text-gray-700 md:grid-cols-2">
        <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Tipo: {incidencia.tipo_incidencia}</div>
        <div className="flex items-center gap-2"><CalendarDays className="w-4 h-4" /> Fecha de incidencia: {new Date(incidencia.fecha_incidencia).toLocaleDateString()}</div>
        <div className="flex items-center gap-2"><ShieldAlert className="w-4 h-4" /> Estado: {incidencia.estado_incidencia}</div>
        <div className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Nivel: {incidencia.confidencialidad_nivel}</div>
        {incidencia.monto_deuda && <div className="flex items-center gap-2"><FileText className="w-4 h-4" /> Deuda: S/{incidencia.monto_deuda}</div>}
        {incidencia.adjuntos_url && (
          <div className="flex items-center gap-2">
            <FileDown className="w-4 h-4" />
            <a href={incidencia.adjuntos_url} target="_blank" className="text-blue-600 underline">Descargar adjunto</a>
          </div>
        )}
      </div>

      <hr className="my-8" />

      <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-cyan-700"><User className="w-5 h-5" /> Detalle de la persona</h2>
      <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-2">
        <p><strong><IdCard className="inline w-4 h-4 mr-1" /> DNI:</strong> {incidencia.persona.dni}</p>
        <p><strong><User className="inline w-4 h-4 mr-1" /> Nombre:</strong> {incidencia.persona.nombre_completo}</p>
        {incidencia.persona.genero && <p><strong>Género:</strong> {incidencia.persona.genero}</p>}
        {incidencia.persona.fecha_nacimiento && <p><strong>Nacimiento:</strong> {new Date(incidencia.persona.fecha_nacimiento).toLocaleDateString()}</p>}
        {incidencia.persona.telefono && <p><strong><Phone className="inline w-4 h-4 mr-1" /> Teléfono:</strong> {incidencia.persona.telefono}</p>}
        {incidencia.persona.correo && <p><strong><Mail className="inline w-4 h-4 mr-1" /> Correo:</strong> {incidencia.persona.correo}</p>}
        {incidencia.persona.notas_adicionales && <p><strong>Notas:</strong> {incidencia.persona.notas_adicionales}</p>}
      </div>

      {incidencia.persona.vinculos.length > 0 && (
        <>
          <h3 className="flex items-center gap-2 mt-8 mb-3 font-semibold text-md text-cyan-600">
            <Users className="w-5 h-5" /> Familiares</h3>
          <div className="grid gap-4 md:grid-cols-2" >
          {incidencia.persona.vinculos.map((v) => (
            <div key={v.id} className="p-4 text-black border shadow-sm bg-gray-50 rounded-xl ">
              {v.familiar?.nombre && (
                <p>
                  <BadgeCheck className="inline w-4 h-4 mr-1 text-cyan-700" /> 
                  <strong>{v.familiar.nombre}</strong> ({v.tipo_vinculo})
                </p>
              )}
              {v.familiar?.dni && (
                <p>
                  <IdCard className="inline w-4 h-4 mr-1" /> DNI: {v.familiar.dni}
                </p>
              )}
              {v.familiar?.telefono && (
                <p>
                  <Phone className="inline w-4 h-4 mr-1" /> {v.familiar.telefono}
                </p>
              )}
              {v.familiar?.correo && (
                <p>
                  <Mail className="inline w-4 h-4 mr-1" /> {v.familiar.correo}
                </p>
              )}
            </div>
          ))}
          </div>
        </>
      )}

      {incidencia.institucion && (
        <>
          <hr className="my-8" />
          <h2 className="flex items-center gap-2 mb-4 text-lg font-bold text-cyan-700"><School className="w-5 h-5" /> Institución</h2>
          <div className="grid gap-3 text-sm text-gray-700 md:grid-cols-2">
            <p><strong>Nombre:</strong> {incidencia.institucion.nombre}</p>
            {incidencia.institucion.ubicacion && <p><strong>Ubicación:</strong> {incidencia.institucion.ubicacion}</p>}
            <p><strong>Tipo:</strong> {incidencia.institucion.tipo}</p>
            {incidencia.institucion.codigo_modular && <p><strong>Código modular:</strong> {incidencia.institucion.codigo_modular}</p>}
            <p><strong>Registro:</strong> {new Date(incidencia.institucion.fecha_registro).toLocaleDateString()}</p>
          </div>
        </>
      )}
    </div>
     </section>
  );
}
