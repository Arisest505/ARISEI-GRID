// Paso 2: Crear Institución relacionada
import { useState } from "react";

interface InstitucionData {
  nombre: string;
  ubicacion?: string;
  codigo_modular?: string;
  tipo: string;
}

interface Props {
  onNext: (data: InstitucionData) => void;
  onBack: () => void;
}

export default function PasoInstitucion({ onNext, onBack }: Props) {
  const [institucion, setInstitucion] = useState<InstitucionData>({
    nombre: "",
    tipo: "Colegio",
  });

  const handleChange = (field: keyof InstitucionData, value: string) => {
    setInstitucion({ ...institucion, [field]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!institucion.nombre || !institucion.tipo) {
      alert("Por favor, completa los campos obligatorios");
      return;
    }
    onNext(institucion);
  };

  return (
  <div className="max-w-2xl p-6 mx-auto bg-white rounded-lg shadow-md">
    <h2 className="mb-1 text-xl font-bold text-cyan-700">Paso 2: Datos de la Institución</h2>
    <p className="mb-4 text-sm text-gray-600">Ingresa la información de la institución educativa relacionada con la incidencia.</p>

    <form onSubmit={handleSubmit} className="space-y-4 text-black">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Nombre de la Institución <span className="text-red-500">*</span>
        </label>
        <input
          type="text"
          placeholder="Ej. I.E. - San Martín de Porres"
          value={institucion.nombre}
          onChange={(e) => handleChange("nombre", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-600"
          required
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Ubicación geográfica / dirección exacta
        </label>
        <input
          type="text"
          placeholder="Ej. Jr. Los Laureles 125, San Juan de Lurigancho, Lima"
          value={institucion.ubicacion || ""}
          onChange={(e) => handleChange("ubicacion", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Código Modular (opcional)
        </label>
        <input
          type="text"
          placeholder="Ej. 0192387"
          value={institucion.codigo_modular || ""}
          onChange={(e) => handleChange("codigo_modular", e.target.value)}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">
          Tipo de institución
        </label>
        <select
          value={institucion.tipo}
          onChange={(e) => handleChange("tipo", e.target.value)}
          className="w-full px-4 py-2 bg-white border rounded-lg"
        >
          <option value="">Seleccione una opción</option>
          <option value="Colegio">Colegio</option>
          <option value="Universidad">Universidad</option>
          <option value="Instituto">Instituto</option>
          <option value="Otro">Otro</option>
        </select>
      </div>

      <div className="flex justify-between pt-2">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 text-sm font-semibold text-gray-600 border border-gray-400 rounded-lg hover:bg-gray-100"
        >
          Atrás
        </button>

        <button
          type="submit"
          className="px-4 py-2 text-sm font-semibold text-white rounded-lg bg-cyan-700 hover:bg-cyan-800"
        >
          Siguiente
        </button>
      </div>
    </form>
  </div>
);

}
