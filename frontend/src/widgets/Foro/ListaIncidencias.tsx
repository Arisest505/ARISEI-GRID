import { useEffect, useState } from "react";
import IncidenciaPreviewCard from "./IncidenciaPreviewCard";

interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  autor: string;
  colegio: string;
  fecha: string;
}

export default function ListaIncidencias() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 10; // 5 filas × 3 columnas
  const totalPages = Math.ceil(incidencias.length / itemsPerPage);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/listarincidencias/listar");
        const data = await response.json();
        setIncidencias(data);
      } catch (err) {
        console.error("Error al cargar incidencias", err);
      }
    };
    fetchData();
  }, []);

  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIncidencias = incidencias.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6">
      {/* Grid de incidencias */}
      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 mx-auto sm:grid-cols-2 lg:grid-cols-2">
        {paginatedIncidencias.map((inc) => (
          <IncidenciaPreviewCard
            key={inc.id}
            id={inc.id}
            title={inc.titulo}
            resumen={inc.descripcion}
            autor={inc.autor}
            colegio={inc.colegio}
            fecha={new Date(inc.fecha).toLocaleDateString()}
          />
        ))}
      </div>

      {/* Paginación */}
      {totalPages > 1 && (
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setCurrentPage(i + 1)}
              className={`px-3 py-1 rounded-md border transition ${
                currentPage === i + 1
                  ? "bg-cyan-600 text-white border-cyan-600"
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
