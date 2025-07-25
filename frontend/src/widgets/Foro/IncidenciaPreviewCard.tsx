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
  const resumenLimitado = resumen.length > 100
    ? resumen.slice(0, 100) + "..."
    : resumen;

  return (
    <div className="flex flex-col justify-between p-5 transition duration-300 bg-white border border-gray-200 shadow-md rounded-xl hover:shadow-xl animate-fade-in">
      <div className="flex items-center gap-2 mb-2 text-cyan-600">
        <MessageCircle className="w-5 h-5" />
        <h3 className="text-lg font-semibold truncate">{title}</h3>
      </div>

      <div className="flex-1 mb-3 text-sm text-gray-700">
        <p className="flex items-start gap-2">
          <Link to={`/incidencia/${id}`} className="transition hover:text-blue-600">
            <Info className="w-6 h-6 mt-1 cursor-pointer" />
          </Link>
          {resumenLimitado}
        </p>
      </div>

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
    </div>
  );
}
