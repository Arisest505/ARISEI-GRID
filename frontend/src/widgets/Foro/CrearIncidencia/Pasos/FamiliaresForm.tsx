// src/widgets/Foro/CrearIncidencia/Pasos/FamiliaresForm.tsx

import { useState } from "react";
import type { FamiliarVinculoData } from "@/types/FormData";

interface Props {
  data: FamiliarVinculoData[];
  onNext: (data: FamiliarVinculoData[]) => void;
  onBack: () => void;
}

export default function FamiliaresForm({ data, onNext, onBack }: Props) {
  const [familiares, setFamiliares] = useState<FamiliarVinculoData[]>(data);
  const [form, setForm] = useState<FamiliarVinculoData>({
    nombre: "",
    dni: "",
    tipo_vinculo: "Padre",
    telefono: "",
    correo: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleAdd = () => {
    if (!form.nombre || !form.dni || !form.tipo_vinculo) return;
    setFamiliares((prev) => [...prev, form]);
    setForm({
      nombre: "",
      dni: "",
      tipo_vinculo: "Padre",
      telefono: "",
      correo: "",
    });
  };

  const handleNext = () => {
    onNext(familiares);
  };

 return (
  <section className="max-w-3xl p-6 mx-auto text-black bg-white shadow-md rounded-xl">
    <h2 className="mb-1 text-2xl font-bold text-cyan-700">Paso 4: Vincular Familiares</h2>
    <p className="mb-6 text-sm text-gray-600">Agrega información sobre los familiares relacionados con la persona afectada.</p>

    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Nombre completo</label>
        <input
          name="nombre"
          placeholder="Ej. Juan Pérez García"
          value={form.nombre}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">DNI</label>
        <input
          name="dni"
          placeholder="Documento Nacional de Identidad"
          value={form.dni}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Teléfono (opcional)</label>
        <input
          name="telefono"
          placeholder="Ej. 987654321"
          value={form.telefono || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Correo electrónico (opcional)</label>
        <input
          name="correo"
          placeholder="Ej. familiar@gmail.com"
          value={form.correo || ""}
          onChange={handleChange}
          className="w-full px-4 py-2 border rounded-lg"
        />
      </div>

      <div className="md:col-span-2">
        <label className="block mb-1 text-sm font-medium text-gray-700">Tipo de vínculo familiar</label>
        <select
          name="tipo_vinculo"
          value={form.tipo_vinculo}
          onChange={handleChange}
          className="w-full px-4 py-2 bg-white border rounded-lg"
        >
          <option value="">Selecciona un vínculo</option>
          <option value="Padre">Padre</option>
          <option value="Madre">Madre</option>
          <option value="Hermano/a">Hermano/a</option>
          <option value="Tío/a">Tío/a</option>
          <option value="Otro">Otro</option>
        </select>
      </div>
    </div>

    <button
      onClick={handleAdd}
      className="px-4 py-2 mt-4 text-white transition rounded-lg bg-cyan-700 hover:bg-cyan-800"
    >
      Agregar Familiar
    </button>

    {familiares.length > 0 && (
      <div className="mt-6">
        <h3 className="mb-2 text-sm font-semibold text-gray-800">Familiares agregados:</h3>
        <ul className="space-y-2 text-sm text-gray-700">
          {familiares.map((f, i) => (
            <li key={i} className="flex items-center justify-between pb-2 border-b">
              <span>
                <strong>{f.nombre}</strong> — DNI: {f.dni} — {f.tipo_vinculo}
              </span>
            </li>
          ))}
        </ul>
      </div>
    )}

    <div className="flex justify-between mt-6">
      <button
        onClick={onBack}
        className="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400"
      >
        Atrás
      </button>
      <button
        onClick={handleNext}
        className="px-4 py-2 text-white rounded-lg bg-cyan-700 hover:bg-cyan-800"
      >
        Siguiente
      </button>
    </div>
  </section>
);

}
