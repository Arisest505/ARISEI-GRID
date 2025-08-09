import { useState, useEffect } from "react";
import ForoSearch from "./ForoSearch";
import IncidenciaPreviewCard from "./IncidenciaPreviewCard";

interface Incidencia {
  id: string;
  titulo: string;
  descripcion: string;
  autor: string;
  colegio: string;
  fecha: string;
}

export default function VistaForo() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);

  // Estado para paginación
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // 5 filas × 3 columnas
  const totalPages = Math.ceil(incidencias.length / itemsPerPage);

  const fetchIncidencias = async (filters = {}) => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams
        ? `http://localhost:5000/api/listarincidencias/filtrar?${queryParams}`
        : `http://localhost:5000/api/listarincidencias/listar`;

      const response = await fetch(url);
      const data = await response.json();
      setIncidencias(data);
      setCurrentPage(1); // reset a la primera página al buscar
    } catch (err) {
      console.error("Error al cargar incidencias", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchIncidencias();
  }, []);

  // Calcular incidencias de la página actual
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIncidencias = incidencias.slice(startIndex, startIndex + itemsPerPage);

  return (
    <section className="py-16 bg-gray-100" id="ask">
      <div className="min-h-screen">
        <ForoSearch onSearch={fetchIncidencias} />

        {/* Grid de incidencias */}
        <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 mx-auto sm:grid-cols-2 lg:grid-cols-2">
          {loading ? (
            <div className="text-lg text-center text-gray-400 col-span-full animate-pulse">
              Cargando incidencias...
            </div>
          ) : paginatedIncidencias.length > 0 ? (
            paginatedIncidencias.map((inc) => (
              <IncidenciaPreviewCard
                key={inc.id}
                id={inc.id}
                title={inc.titulo}
                resumen={inc.descripcion}
                autor={inc.autor}
                colegio={inc.colegio}
                fecha={new Date(inc.fecha).toLocaleDateString()}
              />
            ))
          ) : (
            <div className="text-center text-gray-500 col-span-full">
              No se encontraron incidencias
            </div>
          )}
        </div>

        {/* Paginación */}
        {!loading && totalPages > 1 && (
          <div className="flex justify-center gap-2 mt-4">
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setCurrentPage(i + 1)}
                className={`px-2 py-1 rounded-md border transition ${
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
    </section>
  );
}
