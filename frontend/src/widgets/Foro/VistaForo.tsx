import { useState, useEffect } from "react";
import ForoSearch from "./ForoSearch";
import IncidenciaPreviewCard from "./IncidenciaPreviewCard";
import { section } from "framer-motion/m";

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
  const [loading, setLoading] = useState(true); // nuevo estado

  const fetchIncidencias = async (filters = {}) => {
    try {
      setLoading(true); // comienza carga
      const queryParams = new URLSearchParams(filters).toString();
      const url = queryParams
        ? `http://localhost:5000/api/listarincidencias/filtrar?${queryParams}`
        : `http://localhost:5000/api/listarincidencias/listar`;

      const response = await fetch(url);
      const data = await response.json();
      setIncidencias(data);
    } catch (err) {
      console.error("Error al cargar incidencias", err);
    } finally {
      setLoading(false); // termina carga
    }
  };

  useEffect(() => {
    fetchIncidencias(); // carga inicial
  }, []);

  return (
 <section className="py-16 bg-gray-100" id="ask">  
    <div className="min-h-screen">
      <ForoSearch onSearch={fetchIncidencias} />

      <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 mx-auto md:grid-cols-2">
        {loading ? (
          <div className="text-center text-gray-400 col-span-full animate-pulse">
            Cargando incidencias...
          </div>
        ) : incidencias.length > 0 ? (
          incidencias.map((inc) => (
            <IncidenciaPreviewCard
              id={inc.id}
              key={inc.id}
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
    </div>
 </section>
  );
}