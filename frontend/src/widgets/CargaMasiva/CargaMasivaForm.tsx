import * as XLSX from "xlsx";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../../hooks/useAuth";

export default function CargaMasivaForm() {
  const [archivo, setArchivo] = useState<File | null>(null);
  const [subiendo, setSubiendo] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);
  const { user } = useAuth();

  const handleArchivo = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.name.endsWith(".xlsx")) {
      setArchivo(file);
      setErrores([]);
    } else {
      toast.error("Por favor, selecciona un archivo .xlsx válido.");
    }
  };

  const convertirTexto = (valor: any) =>
    valor !== undefined && valor !== null ? String(valor).trim() : undefined;

  const convertirFecha = (valor: any): string | undefined => {
    if (!valor) return undefined;

    if (typeof valor === "number") {
      const baseDate = new Date(Date.UTC(1899, 11, 30));
      const fecha = new Date(baseDate.getTime() + valor * 86400000);
      return fecha.toISOString().split("T")[0]; // yyyy-mm-dd
    }

    if (typeof valor === "string") {
      if (/^\d{4}-\d{2}-\d{2}$/.test(valor)) {
        return valor; // yyyy-mm-dd correcto
      }

      const partes = valor.split("/");
      if (partes.length === 3) {
        const [dd, mm, yyyy] = partes;
        return `${yyyy}-${mm.padStart(2, "0")}-${dd.padStart(2, "0")}`;
      }
    }

    return undefined;
  };

  const handleSubir = async () => {
    if (!archivo) return toast.error("No se ha seleccionado un archivo.");
    if (!user?.id) return toast.error("Usuario no identificado.");

    setSubiendo(true);
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: "binary" });
        const hoja = workbook.Sheets[workbook.SheetNames[0]];
        const filas: any[] = XLSX.utils.sheet_to_json(hoja);

        if (filas.length === 0) {
          toast.error("El archivo está vacío o mal estructurado.");
          setSubiendo(false);
          return;
        }

        const normalizadas = filas.map((fila) => ({
          dni: convertirTexto(fila.dni),
          nombre_completo: convertirTexto(fila.nombre_completo),
          fecha_nacimiento: convertirFecha(fila.fecha_nacimiento),
          genero: convertirTexto(fila.genero),
          telefono: convertirTexto(fila.telefono),
          correo: convertirTexto(fila.correo),
          institucion_nombre: convertirTexto(fila.institucion_nombre),
          codigo_modular: convertirTexto(fila.codigo_modular),
          tipo_institucion: convertirTexto(fila.tipo_institucion),
          titulo: convertirTexto(fila.titulo),
          descripcion: convertirTexto(fila.descripcion),
          tipo_incidencia: convertirTexto(fila.tipo_incidencia),
          monto_deuda: convertirTexto(fila.monto_deuda),
          fecha_incidencia: convertirFecha(fila.fecha_incidencia),
          estado_incidencia: convertirTexto(fila.estado_incidencia),
          confidencialidad_nivel: convertirTexto(fila.confidencialidad_nivel),
          familiar_dni: convertirTexto(fila.familiar_dni),
          familiar_nombre: convertirTexto(fila.familiar_nombre),
          tipo_vinculo: convertirTexto(fila.tipo_vinculo),
          creado_por_usuario_id: user.id,
        }));

        const response = await fetch("http://localhost:5000/api/incidencias/carga-masiva", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ incidencias: normalizadas }),
        });

        const result = await response.json();

        if (response.ok) {
          toast.success(result.mensaje || "Carga completada.");
          if (result.errores?.length) {
            setErrores(result.errores);
            toast.warning("Algunas filas tuvieron errores.");
          } else {
            setErrores([]);
          }
        } else {
          toast.error(result.error || "Error al subir los datos.");
        }
      } catch (error) {
        console.error(error);
        toast.error("Error al procesar el archivo o conectarse al servidor.");
      } finally {
        setSubiendo(false);
      }
    };

    reader.readAsBinaryString(archivo);
  };
return (
  <div className="max-w-3xl p-8 mx-auto border shadow-xl bg-white/5 backdrop-blur-md border-white/10 rounded-2xl animate-fade-in">
    <h2 className="mb-6 text-3xl font-bold tracking-tight text-gray-800">
      Carga Masiva de Incidencias
    </h2>

    <input
      type="file"
      accept=".xlsx"
      onChange={handleArchivo}
      className="w-full px-4 py-2 mb-6 text-gray-800 placeholder-gray-500 transition-all bg-gray-100 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-400"
    />

    <button
      onClick={handleSubir}
      disabled={subiendo}
      className={`w-full py-2 text-black transition rounded-lg hover:text-white bg-cyan-400 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:opacity-60 hover:shadow-lg hover:shadow-cyan-300 hover:-translate-y-0.5 hover:scale-105 shadow-sm px-4 py-3 text-sm font-semibold rounded-lg transition-all duration-200 tracking-wide shadow-sm  ${
        subiendo
          ? "bg-sky-100 text-sky-600 cursor-not-allowed"
          : "bg-sky-500 hover:bg-sky-600 text-white"
      }`}
    >
      {subiendo ? "Subiendo..." : "Subir incidencias"}
    </button>

    {errores.length > 0 && (
      <div className="p-5 mt-8 overflow-y-auto text-sm text-red-700 bg-red-100 border border-red-300 rounded-lg shadow-inner max-h-60">
        <strong className="block mb-2 font-medium text-red-800">
          Errores detectados en el archivo:
        </strong>
        <ul className="pl-5 space-y-1 list-disc">
          {errores.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      </div>
    )}
  </div>
);


}
