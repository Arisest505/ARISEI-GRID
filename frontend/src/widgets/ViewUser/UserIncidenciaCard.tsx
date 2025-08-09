import { motion } from "framer-motion";
import { Pencil,  } from "lucide-react";

interface Props {
  incidencia: {
    id: string;
    titulo: string;
    descripcion: string;
    estado_incidencia: string;
    fecha_creacion: string;
    tipo_incidencia?: string;
  };
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UserIncidenciaCard({ incidencia, onEdit, }: Props) {
  const { id, titulo, descripcion, estado_incidencia, fecha_creacion, tipo_incidencia } = incidencia;

  // Limitar descripción a 100 caracteres
  const shortDesc = descripcion.length > 100 ? descripcion.slice(0, 100) + "..." : descripcion;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="relative p-6 transition-shadow border border-gray-200 shadow-md bg-white/70 backdrop-blur-lg rounded-xl hover:shadow-xl"
    >
      {/* Título */}
      <h2 className="mb-2 text-2xl font-bold text-gray-800">{titulo}</h2>

      {/* Tipo + estado */}
      <div className="flex flex-wrap items-center gap-4 mb-3 text-sm text-gray-500">
        {tipo_incidencia && (
          <span className="px-3 py-1 text-xs font-medium text-blue-800 bg-blue-100 rounded-full">
            {tipo_incidencia}
          </span>
        )}
        <span
          className={`px-3 py-1 rounded-full text-xs font-medium ${
            estado_incidencia === "resuelto"
              ? "bg-green-100 text-green-800"
              : "bg-yellow-100 text-yellow-800"
          }`}
        >
          {estado_incidencia.toUpperCase()}
        </span>
        <span className="ml-auto text-xs text-gray-400">
          📅 {new Date(fecha_creacion).toLocaleDateString()}
        </span>
      </div>

      {/* Descripción */}
      <p className="text-sm text-gray-700">{shortDesc}</p>

      {/* Acciones */}
      <div className="flex justify-end gap-3 mt-4">
        <button
          onClick={() => onEdit(id)}
          className="flex items-center gap-1 px-4 py-2 text-sm font-medium text-blue-600 transition hover:text-blue-800"
        >
          <Pencil className="w-4 h-4" />
          Editar
        </button>
      </div>
    </motion.article>
  );
}
