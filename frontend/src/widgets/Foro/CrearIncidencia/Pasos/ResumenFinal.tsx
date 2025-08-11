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
} from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import type { PersonaData, InstitucionData, IncidenciaData, FamiliarVinculoData } from "@/types/FormData";

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
}: Props) {
  const navigate = useNavigate();

  const handlePublicarConAlerta = async () => {
    // 1. Guardamos la referencia del toast de carga
    const toastId = toast.loading("Publicando incidencia...");
    
    try {
      // 2. Ejecutamos la función de publicación
      await onPublicar();
      
      // 3. Si tiene éxito, cerramos el toast de carga y mostramos el de éxito
      toast.dismiss(toastId);
      toast.success("Incidencia publicada con éxito y visible en el foro.");
      
      // 4. Redirigimos después de un breve delay para que el usuario vea el mensaje
      setTimeout(() => {
        navigate("/foro");
      }, 1000);
      
    } catch {
      // 5. En caso de error, también cerramos el toast de carga y mostramos un error
      toast.dismiss(toastId);
      toast.error("No se pudo publicar la incidencia. Intenta nuevamente.");
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
              <li><User className="inline w-4 h-4 mr-1" /> <strong>Nombre:</strong> {persona.nombreCompleto}</li>
              <li><Mail className="inline w-4 h-4 mr-1" /> <strong>Correo:</strong> {persona.correo || "No especificado"}</li>
              <li><Phone className="inline w-4 h-4 mr-1" /> <strong>Teléfono:</strong> {persona.telefono || "No especificado"}</li>
              {persona.fechaNacimiento && (
                <li><Calendar className="inline w-4 h-4 mr-1" /> <strong>Nacimiento:</strong> {new Date(persona.fechaNacimiento).toLocaleDateString()}</li>
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
              <li><School className="inline w-4 h-4 mr-1" /> <strong>Nombre:</strong> {institucion.nombre}</li>
              <li><MapPin className="inline w-4 h-4 mr-1" /> <strong>Ubicación:</strong> {institucion.ubicacion || "N/A"}</li>
              <li><ShieldCheck className="inline w-4 h-4 mr-1" /> <strong>Tipo:</strong> {institucion.tipo}</li>
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
              <li><FileText className="inline w-4 h-4 mr-1" /> <strong>Monto Deuda:</strong> {incidencia.montoDeuda || "No aplica"}</li>
              <li><CheckCircle className="inline w-4 h-4 mr-1" /> <strong>Estado:</strong> {incidencia.estadoIncidencia}</li>
              <li><ShieldCheck className="inline w-4 h-4 mr-1" /> <strong>Confidencialidad:</strong> {incidencia.confidencialidadNivel}</li>
              <li><Calendar className="inline w-4 h-4 mr-1" /> <strong>Fecha:</strong> {new Date(incidencia.fechaIncidencia).toLocaleDateString()}</li>
              <li><FileText className="inline w-4 h-4 mr-1" /> <strong>Descripción:</strong> {incidencia.descripcion}</li>
              <li><Link2 className="inline w-4 h-4 mr-1" /> <strong>Adjuntos:</strong> {incidencia.adjuntosUrl ? "Sí" : "No"}</li>
            </ul>
          </section>

          {/* Familiares */}
          {familiares.length > 0 && (
            <section className="p-4 border shadow-sm bg-gray-50 rounded-xl">
              <h3 className="mb-2 text-lg font-semibold text-cyan-700">Familiares Vinculados</h3>
              <ul className="pl-5 space-y-1 text-sm text-gray-800 list-disc">
                {familiares.map((f, idx) => (
                  <li key={idx}>
                    <User className="inline w-4 h-4 mr-1" />
                    <strong>{f.nombre}</strong> ({f.tipoVinculo}) <IdCard className="inline w-4 h-4 mx-1" /> DNI: {f.dni}
                    {f.telefono && (
                      <> <Phone className="inline w-4 h-4 mx-1" /> {f.telefono} </>
                    )}
                    {f.correo && (
                      <> <Mail className="inline w-4 h-4 mx-1" /> {f.correo} </>
                    )}
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
            <UploadCloud className="w-5 h-5" />
            {loading ? "Publicando..." : "Publicar Incidencia"}
          </button>

          <p className="flex items-center gap-2 mt-2 text-sm text-gray-600">
            <CheckCircle className="w-4 h-4 text-green-500" />
            Revisa los datos antes de continuar. Esta información será visible en el sistema.
          </p>
        </div>
      </div>
    </section>
  );
}