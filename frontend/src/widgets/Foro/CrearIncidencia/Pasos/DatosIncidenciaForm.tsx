import { useState, useEffect } from "react";
import { ArrowLeft, ArrowRight } from "lucide-react";
import type { IncidenciaData } from "@/types/FormData";

interface Props {
  data: IncidenciaData;
  onNext: (data: IncidenciaData) => void;
  onBack: () => void;
}

const tiposComunes = [
  "Deuda",
  "Bullying",
  "Agresión",
  "Retraso Académico",
  "Inasistencia Prolongada",
  "Otro",
];

export default function DatosIncidenciaForm({ data, onNext, onBack }: Props) {
  const [localData, setLocalData] = useState<IncidenciaData>({ ...data });
  const [tipoSeleccionado, setTipoSeleccionado] = useState<string>(data.tipoIncidencia || "");
  const [otroTipo, setOtroTipo] = useState<string>("");

  useEffect(() => {
    // Si viene un valor personalizado, selecciona automáticamente "Otro"
    if (data.tipoIncidencia && !tiposComunes.includes(data.tipoIncidencia)) {
      setTipoSeleccionado("Otro");
      setOtroTipo(data.tipoIncidencia);
    }
  }, [data.tipoIncidencia]);

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;
    setLocalData((prev) => ({
      ...prev,
      [name]: type === "number" ? value : value,
    }));
  };

  const handleTipoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value;
    setTipoSeleccionado(selected);
    if (selected !== "Otro") {
      setLocalData((prev) => ({ ...prev, tipoIncidencia: selected }));
      setOtroTipo("");
    } else {
      setLocalData((prev) => ({ ...prev, tipoIncidencia: "" }));
    }
  };

  const handleOtroTipoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOtroTipo(e.target.value);
    setLocalData((prev) => ({
      ...prev,
      tipoIncidencia: e.target.value,
    }));
  };

  const handleNext = () => {
    onNext(localData);
  };
  const handleBack = () => {
    onBack();
  };

  return (
    <div className="max-w-3xl p-6 mx-auto mt-10 text-black bg-white shadow-xl rounded-xl">
      <h2 className="mb-2 text-2xl font-bold text-cyan-700">Paso 3: Datos de la Incidencia</h2>
      <p className="mb-6 text-sm text-gray-600">Completa los detalles de lo ocurrido en esta incidencia para su registro y seguimiento.</p>

      <div className="space-y-4">
        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="titulo"
            placeholder="Ej. Incumplimiento de pagos, conducta inapropiada..."
            value={localData.titulo}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Descripción</label>
          <textarea
            name="descripcion"
            placeholder="Describe detalladamente los hechos"
            value={localData.descripcion}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
            rows={4}
          />
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-slate-700">
            Tipo de Incidencia
          </label>
          <select
            name="tipoIncidencia"
            value={tipoSeleccionado}
            onChange={handleTipoChange}
            className="w-full px-4 py-2 border rounded-lg text-slate-800 bg-slate-50 border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
          >
            <option value="" disabled>
              Selecciona un tipo...
            </option>
            {tiposComunes.map((tipo) => (
              <option key={tipo} value={tipo}>
                {tipo}
              </option>
            ))}
          </select>

          {tipoSeleccionado === "Otro" && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Especificar otro tipo de incidencia"
                value={otroTipo}
                onChange={handleOtroTipoChange}
                className="w-full px-4 py-2 bg-white border rounded-lg text-slate-800 border-slate-300 focus:outline-none focus:ring-2 focus:ring-cyan-600"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Monto de deuda (si aplica)</label>
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-sm text-gray-500">S/</span>
            <input
              type="number"
              name="montoDeuda"
              placeholder="0.00"
              value={localData.montoDeuda || ""}
              onChange={handleChange}
              className="w-full py-2 pl-10 pr-4 border rounded-lg"
            />
          </div>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Fecha del incidente</label>
          <input
            type="date"
            name="fechaIncidencia"
            value={localData.fechaIncidencia}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
          <p className="mt-1 text-xs text-gray-500">Selecciona la fecha en la que ocurrió la incidencia.</p>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Estado actual de la incidencia</label>
          <select
            name="estadoIncidencia"
            value={localData.estadoIncidencia}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border rounded-lg"
          >
            <option value="Pendiente">Pendiente (no se ha tomado acción)</option>
            <option value="En proceso">En proceso (se está gestionando)</option>
            <option value="Resuelto">Resuelto (ya se solucionó)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Nivel de confidencialidad</label>
          <select
            name="confidencialidadNivel"
            value={localData.confidencialidadNivel}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border rounded-lg"
          >
            <option value="Privado">Privado (visible solo para administradores)</option>
            <option value="Público">Público (puede verse en el foro institucional)</option>
          </select>
        </div>

        <div>
          <label className="block mb-1 text-sm font-medium text-gray-700">Adjuntos (URL)</label>
          <input
            type="text"
            name="adjuntosUrl"
            placeholder="URL de algún documento, imagen o evidencia relacionada"
            value={localData.adjuntosUrl || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={handleBack}
          className="flex items-center px-4 py-2 text-sm text-gray-600 transition bg-gray-200 rounded-lg hover:bg-gray-300"
        >
          <ArrowLeft className="w-4 h-4 mr-1" /> Anterior
        </button>
        <button
          onClick={handleNext}
          className="flex items-center px-4 py-2 text-sm text-white transition rounded-lg bg-cyan-700 hover:bg-cyan-800"
        >
          Siguiente <ArrowRight className="w-4 h-4 ml-1" />
        </button>
      </div>
    </div>
  );
}