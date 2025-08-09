import { useState } from "react";
import type { Incidencia } from "../../types/Incidencia";
import UserIncidenciaCard from "./UserIncidenciaCard";

interface Props {
  incidencias: Incidencia[];
  loading: boolean;
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

export default function UserIncidenciasList({ incidencias, loading, onEdit, onDelete }: Props) {
  const itemsPerPage = 12; // 3 columnas × 5 filas
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(incidencias.length / itemsPerPage);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIncidencias = incidencias.slice(startIndex, startIndex + itemsPerPage);

  if (loading) return <p className="text-center text-gray-500">Cargando...</p>;
  if (incidencias.length === 0) return <p className="text-center text-gray-400">Sin incidencias registradas.</p>;

  return (
    <div className="space-y-6">
      {/* Grid de incidencias */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {paginatedIncidencias.map((inc) => (
          <UserIncidenciaCard
            key={inc.id}
            incidencia={inc}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2 mt-6">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border transition ${
                currentPage === i + 1
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-white text-gray-600 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {i + 1}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
