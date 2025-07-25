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

  return (
    <div className="grid w-full max-w-6xl grid-cols-1 gap-6 px-4 py-6 mx-auto md:grid-cols-2">
      {incidencias.map((inc) => (
        <IncidenciaPreviewCard
            id={inc.id}
          key={inc.id}
          title={inc.titulo}
          resumen={inc.descripcion}
          autor={inc.autor}
            colegio={inc.colegio}
          fecha={new Date(inc.fecha).toLocaleDateString()}
        />
      ))}
    </div>
  );
}
