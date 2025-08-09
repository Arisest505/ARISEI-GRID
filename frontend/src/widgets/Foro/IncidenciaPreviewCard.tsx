import { MessageCircle, Info, User, CalendarDays, Landmark } from "lucide-react";
import { Link } from "react-router-dom";

interface Props {
  id: string;
  title: string;
  resumen: string;
  autor: string;
  fecha: string;
  colegio: string;
}

export default function IncidenciaPreviewCard({
  id,
  title,
  resumen,
  autor,
  fecha,
  colegio,
}: Props) {
  const resumenLimitado = resumen.length > 100 ? resumen.slice(0, 100) + "..." : resumen;

  return (
    <Link
      to={`/incidencia/${id}`}
      className="flex flex-col justify-between p-5 transition duration-300 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl hover:border-cyan-400 hover:-translate-y-0.5 hover:scale-105 group"
    >
      {/* Título */}
      <div className="flex items-center gap-2 mb-2 text-cyan-600">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold truncate group-hover:text-cyan-700">
          {title}
        </h3>
      </div>

      {/* Resumen */}
      <div className="flex-1 mb-3 text-sm text-gray-500 group-hover:text-gray-800">
        <p className="flex items-start gap-2">
          <Info className="w-5 h-5 mt-0.5 flex-shrink-0 text-yellow-500 group-hover:text-red-500" />
          {resumenLimitado}
        </p>
      </div>

      {/* Footer */}
      <div className="flex justify-between mt-auto text-xs text-gray-500">
        <div className="flex items-center gap-1">
          <User className="w-4 h-4" />
          <span className="truncate">{autor}</span>
        </div>
        <div className="flex items-center gap-1">
          <Landmark className="w-4 h-4" />
          <span className="truncate">{colegio}</span>
        </div>
        <div className="flex items-center gap-1">
          <CalendarDays className="w-4 h-4" />
          <span>{fecha}</span>
        </div>
      </div>
    </Link>
  );
}
