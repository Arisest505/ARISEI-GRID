import { useEffect, useRef, useState } from "react";
import { Search, Calendar, User, Landmark, IdCard } from "lucide-react";
import { apiFetch } from "../../lib/api"; // ajusta la ruta según tu estructura

interface Props {
  onSearch: (filters: {
    query: string;
    dni: string;
    colegio: string;
    autor: string;
    fecha: string;
  }) => void;
}

export default function ForoSearch({ onSearch }: Props) {
  const [filters, setFilters] = useState({
    query: "",
    dni: "",
    colegio: "",
    autor: "",
    fecha: "",
  });

  const [sugerenciasColegios, setSugerenciasColegios] = useState<string[]>([]);
  const [sugerenciasAutores, setSugerenciasAutores] = useState<string[]>([]);
  const [loadingColegios, setLoadingColegios] = useState(false);
  const [loadingAutores, setLoadingAutores] = useState(false);
  const [showColegios, setShowColegios] = useState(false);
  const [showAutores, setShowAutores] = useState(false);

  const colegioRef = useRef<HTMLDivElement>(null);
  const autorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (colegioRef.current && !colegioRef.current.contains(event.target as Node)) {
        setShowColegios(false);
      }
      if (autorRef.current && !autorRef.current.contains(event.target as Node)) {
        setShowAutores(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleChange = (field: string, value: string) => {
    setFilters((prev) => ({ ...prev, [field]: value }));
    if (field === "colegio") setShowColegios(true);
    if (field === "autor") setShowAutores(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(filters);
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filters.colegio.length > 1) {
        setLoadingColegios(true);
        apiFetch(`/autocomplete/colegios?q=${filters.colegio}`)
          .then(res => res.json())
          .then(data => setSugerenciasColegios(data.map((d: any) => d.nombre)))
          .finally(() => setLoadingColegios(false));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters.colegio]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (filters.autor.length > 1) {
        setLoadingAutores(true);
        apiFetch(`/autocomplete/autores?q=${filters.autor}`)
          .then(res => res.json())
          .then(data => setSugerenciasAutores(data.map((d: any) => d.nombre)))
          .finally(() => setLoadingAutores(false));
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, [filters.autor]);

  useEffect(() => {
    onSearch(filters);
  }, [filters]);


  return (
     <form
      onSubmit={handleSubmit}
      className="w-full max-w-5xl px-4 py-6 mx-auto mt-6 space-y-4 bg-white shadow-md rounded-xl animate-fade-in"
    >
      <h2 className="flex items-center gap-2 text-xl font-semibold text-cyan-700">
        <Search className="w-5 h-5" /> Filtros de búsqueda avanzada
      </h2>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div className="flex items-center gap-2">
          <Search className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por título o resumen"
            value={filters.query}
            onChange={(e) => handleChange("query", e.target.value)}
            className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div className="flex items-center gap-2">
          <IdCard className="text-gray-500" />
          <input
            type="text"
            placeholder="Buscar por DNI"
            value={filters.dni}
            onChange={(e) => handleChange("dni", e.target.value)}
            className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>

        <div className="relative" ref={colegioRef}>
          <div className="flex items-center gap-2">
            <Landmark className="text-gray-500" />
            <input
              type="text"
              placeholder="Buscar por colegio"
              value={filters.colegio}
              onChange={(e) => handleChange("colegio", e.target.value)}
              className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
              autoComplete="off"
            />
          </div>
          {loadingColegios && <div className="mt-1 text-xs text-gray-400">Cargando colegios...</div>}
          {showColegios && sugerenciasColegios.length > 0 && (
            <ul className="absolute z-10 w-full text-black bg-white border border-gray-200 rounded-md shadow">
              {sugerenciasColegios.map((nombre, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleChange("colegio", nombre);
                    setShowColegios(false);
                  }}
                >
                  {nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="relative" ref={autorRef}>
          <div className="flex items-center gap-2">
            <User className="text-gray-500" />
            <input
              type="text"
              placeholder="Autor"
              value={filters.autor}
              onChange={(e) => handleChange("autor", e.target.value)}
              className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
              autoComplete="off"
            />
          </div>
          {loadingAutores && <div className="mt-1 text-xs text-gray-400">Cargando autores...</div>}
          {showAutores && sugerenciasAutores.length > 0 && (
            <ul className="absolute z-10 w-full text-black bg-white border border-gray-200 rounded-md shadow">
              {sugerenciasAutores.map((nombre, idx) => (
                <li
                  key={idx}
                  className="px-4 py-2 cursor-pointer hover:bg-gray-100"
                  onClick={() => {
                    handleChange("autor", nombre);
                    setShowAutores(false);
                  }}
                >
                  {nombre}
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Calendar className="text-gray-500" />
          <input
            type="date"
            value={filters.fecha}
            onChange={(e) => handleChange("fecha", e.target.value)}
            className="w-full px-4 py-2 text-black border rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-600"
          />
        </div>
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="w-full py-2 text-black transition rounded-lg hover:text-white bg-cyan-400 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-60 hover:shadow-lg hover:shadow-cyan-300 hover:-translate-y-0.5 hover:scale-105 shadow-sm0"
        >
          Buscar incidencia
        </button>
      </div>
    </form>
  );
}
