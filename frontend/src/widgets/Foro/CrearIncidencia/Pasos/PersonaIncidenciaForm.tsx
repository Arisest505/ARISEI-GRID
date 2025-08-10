import { useState } from "react";
import type { PersonaData } from "@/types/FormData";

interface Props {
  onNext: (data: PersonaData) => void;
  initialData?: PersonaData;
}

export default function PersonaIncidenciaForm({ onNext }: Props) {
  const [formData, setFormData] = useState<PersonaData>({
    nombreCompleto: "",
    dni: "",
    fechaNacimiento: "",
    genero: "",
    telefono: "",
    correo: "",
    imagenUrl: "",
    notasAdicionales: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombreCompleto || !formData.dni) {
      return alert("Nombre y DNI son obligatorios");
    }
    onNext(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl p-6 mx-auto space-y-4 text-black bg-white shadow-md rounded-xl">
      <h2 className="mb-4 text-2xl font-bold text-cyan-700">Paso 1: Persona relacionada a la incidencia</h2>

      <input
        name="nombreCompleto"
        placeholder="Nombre completo"
        value={formData.nombreCompleto}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
        required
      />

      <input
        name="dni"
        placeholder="DNI"
        value={formData.dni}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
        required
      />

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">Fecha de nacimiento (cumpleaños)</label>
          <input
            type="date"
            name="fechaNacimiento"
            value={formData.fechaNacimiento || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-md"
          />
        </div>

        <div className="flex-1">
          <label className="block mb-1 text-sm font-medium text-gray-700">Género</label>
          <select
            name="genero"
            value={formData.genero || ""}
            onChange={handleChange}
            className="w-full px-4 py-2 bg-white border rounded-md"
          >
            <option value="">Selecciona</option>
            <option value="Masculino">Masculino</option>
            <option value="Femenino">Femenino</option>
            <option value="Otro">Otro</option>
            <option value="Prefiero no decirlo">Prefiero no decirlo</option>
          </select>
        </div>
      </div>

      <input
        name="telefono"
        placeholder="Teléfono"
        value={formData.telefono || ""}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
      />

      <input
        type="email"
        name="correo"
        placeholder="Correo"
        value={formData.correo || ""}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
      />

      <input
        type="url"
        name="imagenUrl"
        placeholder="URL de la imagen (opcional)"
        value={formData.imagenUrl || ""}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
      />

      <textarea
        name="notasAdicionales"
        placeholder="Notas adicionales (opcional)"
        value={formData.notasAdicionales || ""}
        onChange={handleChange}
        className="w-full px-4 py-2 border rounded-md"
      />

      <button
        type="submit"
        className="px-6 py-2 text-white transition rounded-md bg-cyan-700 hover:bg-cyan-800"
      >
        Siguiente
      </button>
    </form>
  );
}