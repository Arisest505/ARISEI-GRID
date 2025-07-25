import {
  CheckCircle,
  UploadCloud,
  User,
  IdCard,
  Mail,
  School,
  FileText,
  AlertCircle
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  persona: any;
  institucion: any;
  incidencia: any;
  familiares: any[];
  onPublicar: () => Promise<void>;
  loading: boolean;
}

export default function ResumenIncidenciaStep({
  persona,
  institucion,
  incidencia,
  familiares,
  onPublicar,
  loading,
}: Props) {

  const handlePublicarConAlerta = async () => {
    try {
      await onPublicar();
      toast.success("✅ Incidencia publicada con éxito y visible en el foro.");
    } catch (error) {
      toast.error("❌ No se pudo publicar la incidencia. Intenta nuevamente.");
    }
  };

  return (
    <section className="py-16 bg-white" id="ask">
      <div className="max-w-4xl px-8 py-10 mx-auto bg-white shadow-xl rounded-3xl animate-fade-in">
        <h2 className="flex items-center justify-center gap-2 mb-6 text-3xl font-bold text-center text-cyan-800">
          <AlertCircle className="w-6 h-6" /> Confirmación Final
        </h2>

        <div className="space-y-8">
          {/* Persona */}
          <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-cyan-700">
              <User className="w-5 h-5" /> Persona Afectada
            </h3>
            <ul className="space-y-1 text-sm text-gray-800">
              <li><IdCard className="inline w-4 h-4 mr-1" /> <strong>DNI:</strong> {persona.dni}</li>
              <li><User className="inline w-4 h-4 mr-1" /> <strong>Nombre:</strong> {persona.nombre_completo}</li>
              <li><Mail className="inline w-4 h-4 mr-1" /> <strong>Correo:</strong> {persona.correo || "No especificado"}</li>
            </ul>
          </section>

          {/* Institucion */}
          <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-cyan-700">
              <School className="w-5 h-5" /> Institución
            </h3>
            <ul className="space-y-1 text-sm text-gray-800">
              <li><strong>Nombre:</strong> {institucion.nombre}</li>
              <li><strong>Tipo:</strong> {institucion.tipo}</li>
              <li><strong>Código Modular:</strong> {institucion.codigo_modular || "N/A"}</li>
            </ul>
          </section>

          {/* Incidencia */}
          <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
            <h3 className="flex items-center gap-2 mb-2 text-lg font-semibold text-cyan-700">
              <FileText className="w-5 h-5" /> Datos de la Incidencia
            </h3>
            <ul className="space-y-1 text-sm text-gray-800">
              <li><strong>Título:</strong> {incidencia.titulo}</li>
              <li><strong>Tipo:</strong> {incidencia.tipo_incidencia}</li>
              <li><strong>Estado:</strong> {incidencia.estado_incidencia}</li>
              <li><strong>Confidencialidad:</strong> {incidencia.confidencialidad_nivel}</li>
              <li><strong>Fecha:</strong> {new Date(incidencia.fecha_incidencia).toLocaleDateString()}</li>
              <li><strong>Descripción:</strong> {incidencia.descripcion}</li>
            </ul>
          </section>

          {/* Familiares */}
          {familiares.length > 0 && (
            <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
              <h3 className="mb-2 text-lg font-semibold text-cyan-700">Familiares Vinculados</h3>
              <ul className="pl-5 space-y-1 text-sm text-gray-800 list-disc">
                {familiares.map((f, idx) => (
                  <li key={idx}>
                    <strong>{f.nombre}</strong> ({f.tipo_vinculo}) – DNI: {f.dni}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Botón */}
        <div className="flex flex-col items-center justify-center gap-4 mt-10">
          <button
            onClick={handlePublicarConAlerta}
            disabled={loading}
            className="flex items-center gap-2 px-8 py-3 text-sm font-semibold text-white transition rounded-lg bg-cyan-700 hover:bg-cyan-800 disabled:opacity-50"
          >
            <UploadCloud className="w-5 h-5" /> {loading ? "Publicando..." : "Publicar Incidencia"}
          </button>

          <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" /> Revisa los datos antes de continuar. Esta información será visible en el sistema.
          </p>
        </div>
      </div>
    </section>
  );
}
