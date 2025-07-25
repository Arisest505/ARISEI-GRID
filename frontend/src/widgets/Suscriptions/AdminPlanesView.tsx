import { useEffect, useState } from "react";
import { Switch } from "@headlessui/react";
import { Pencil, Plus, Save } from "lucide-react";
import toast from "react-hot-toast";

interface Plan {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
  duracion_meses: number;
  es_activo: boolean;
}

export default function AdminPlanesView() {
  const [planes, setPlanes] = useState<Plan[]>([]);
  const [nuevoPlan, setNuevoPlan] = useState({
    nombre: "",
    descripcion: "",
    precio: 0,
    duracion_meses: 1,
  });
  const [editando, setEditando] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const token = localStorage.getItem("token");

  const fetchPlanes = async () => {
    setCargando(true);
    try {
      const res = await fetch("http://localhost:5000/api/planes", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setPlanes(data || []);
    } catch (err) {
      console.error("[FETCH_PLANES_ERROR]", err);
      toast.error("Error al obtener planes.");
    } finally {
      setCargando(false);
    }
  };

  const toggleActivo = async (id: string) => {
    try {
      const res = await fetch(`http://localhost:5000/api/planes/${id}/toggle`, {
        method: "PATCH",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Estado del plan actualizado.");
      fetchPlanes();
    } catch (err) {
      console.error("Error al cambiar estado:", err);
      toast.error("Error al cambiar el estado del plan.");
    }
  };

  const guardarNuevoPlan = async () => {
    const { nombre, descripcion, precio, duracion_meses } = nuevoPlan;

    if (!nombre || precio <= 0 || duracion_meses <= 0) {
      toast.error("Completa todos los campos correctamente.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/planes", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevoPlan),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Plan creado con éxito.");
      setNuevoPlan({ nombre: "", descripcion: "", precio: 0, duracion_meses: 1 });
      fetchPlanes();
    } catch (err) {
      console.error("Error al crear plan:", err);
      toast.error("Error al crear el plan.");
    }
  };

  const actualizarPlan = async (plan: Plan) => {
    try {
      const res = await fetch(`http://localhost:5000/api/planes/${plan.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(plan),
      });

      if (!res.ok) throw new Error(await res.text());

      toast.success("Plan actualizado.");
      setEditando(null);
      fetchPlanes();
    } catch (err) {
      console.error("Error al actualizar plan:", err);
      toast.error("Error al actualizar el plan.");
    }
  };

  useEffect(() => {
    fetchPlanes();
  }, []);

  return (
    <section className="max-w-5xl px-4 py-10 mx-auto animate-fade-in">
      <h2 className="mb-6 text-2xl font-bold text-cyan-800">Administración de Planes</h2>

      {/* CREAR NUEVO */}
      <div className="p-4 mb-8 bg-white border border-gray-200 rounded-md shadow">
        <h3 className="flex items-center gap-2 mb-3 text-lg font-semibold">
          <Plus className="w-4 h-4" /> Crear nuevo plan
        </h3>
        <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
          <input
            type="text"
            placeholder="Nombre del plan"
            value={nuevoPlan.nombre}
            onChange={(e) => setNuevoPlan({ ...nuevoPlan, nombre: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="text"
            placeholder="Descripción"
            value={nuevoPlan.descripcion || ""}
            onChange={(e) => setNuevoPlan({ ...nuevoPlan, descripcion: e.target.value })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Precio"
            value={nuevoPlan.precio}
            onChange={(e) => setNuevoPlan({ ...nuevoPlan, precio: parseFloat(e.target.value) })}
            className="px-3 py-2 border rounded"
          />
          <input
            type="number"
            placeholder="Duración (meses)"
            value={nuevoPlan.duracion_meses}
            onChange={(e) =>
              setNuevoPlan({ ...nuevoPlan, duracion_meses: parseInt(e.target.value) })
            }
            className="px-3 py-2 border rounded"
          />
        </div>
        <button
          onClick={guardarNuevoPlan}
          className="px-4 py-2 mt-3 text-white rounded bg-cyan-700 hover:bg-cyan-800"
        >
          Guardar
        </button>
      </div>

      {/* LISTA DE PLANES */}
      <div className="space-y-4">
        {planes.map((plan) => (
          <div key={plan.id} className="p-4 bg-white border rounded shadow">
            {editando === plan.id ? (
              <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <input
                  value={plan.nombre}
                  onChange={(e) =>
                    setPlanes((prev) =>
                      prev.map((p) =>
                        p.id === plan.id ? { ...p, nombre: e.target.value } : p
                      )
                    )
                  }
                  className="px-3 py-2 border rounded"
                />
                <input
                  value={plan.descripcion || ""}
                  onChange={(e) =>
                    setPlanes((prev) =>
                      prev.map((p) =>
                        p.id === plan.id ? { ...p, descripcion: e.target.value } : p
                      )
                    )
                  }
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  value={plan.precio}
                  onChange={(e) =>
                    setPlanes((prev) =>
                      prev.map((p) =>
                        p.id === plan.id
                          ? { ...p, precio: parseFloat(e.target.value) }
                          : p
                      )
                    )
                  }
                  className="px-3 py-2 border rounded"
                />
                <input
                  type="number"
                  value={plan.duracion_meses}
                  onChange={(e) =>
                    setPlanes((prev) =>
                      prev.map((p) =>
                        p.id === plan.id
                          ? { ...p, duracion_meses: parseInt(e.target.value) }
                          : p
                      )
                    )
                  }
                  className="px-3 py-2 border rounded"
                />
              </div>
            ) : (
              <div className="flex flex-col items-start justify-between md:flex-row md:items-center">
                <div>
                  <p>
                    <strong>{plan.nombre}</strong> — S/ {plan.precio} por{" "}
                    {plan.duracion_meses} meses
                  </p>
                  <p className="text-sm text-gray-600">{plan.descripcion}</p>
                </div>
                <div className="flex items-center gap-4 mt-3 md:mt-0">
                  <Switch
                    checked={plan.es_activo}
                    onChange={() => toggleActivo(plan.id)}
                    className={`${
                      plan.es_activo ? "bg-green-600" : "bg-gray-400"
                    } relative inline-flex h-6 w-11 items-center rounded-full`}
                  >
                    <span className="sr-only">Activar/Desactivar</span>
                    <span
                      className={`${
                        plan.es_activo ? "translate-x-6" : "translate-x-1"
                      } inline-block h-4 w-4 transform rounded-full bg-white transition`}
                    />
                  </Switch>
                  <button
                    onClick={() => setEditando(plan.id)}
                    className="flex items-center gap-1 text-blue-600 hover:underline"
                  >
                    <Pencil className="w-4 h-4" /> Editar
                  </button>
                </div>
              </div>
            )}

            {editando === plan.id && (
              <button
                onClick={() => actualizarPlan(plan)}
                className="flex items-center gap-1 px-4 py-2 mt-3 text-sm text-white bg-green-600 rounded hover:bg-green-700"
              >
                <Save className="w-4 h-4" /> Guardar cambios
              </button>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
