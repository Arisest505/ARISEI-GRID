// COMPONENTE CRUD ROLES con estilo moderno y botón Cancelar
import { useEffect, useState } from "react";
import { Input } from "../../components/ui/Input";
import { Boton } from "../../components/ui/BotonPrincipal";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, XCircle } from "lucide-react";

interface Rol {
  id: string;
  nombre: string;
  descripcion?: string;
}

const API = "http://localhost:5000/api";

export default function CrudRol() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [editing, setEditing] = useState<Rol | null>(null);
  const [form, setForm] = useState<Omit<Rol, "id">>({ nombre: "", descripcion: "" });

  const token = localStorage.getItem("token");

  useEffect(() => {
    getRoles();
  }, []);

  const getRoles = async () => {
    try {
      const res = await fetch(`${API}/roles`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Error al obtener roles");
      const data = await res.json();
      setRoles(data);
    } catch (err) {
      toast.error("No se pudieron cargar los roles.");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    if (!form.nombre) return toast.warning("El nombre es obligatorio.");

    const method = editing ? "PUT" : "POST";
    const url = editing ? `${API}/roles/${editing.id}` : `${API}/roles`;

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editing ? "Rol actualizado." : "Rol creado.");
      getRoles();
      resetForm();
    } catch {
      toast.error("Error al guardar rol");
    }
  };

  const resetForm = () => {
    setForm({ nombre: "", descripcion: "" });
    setEditing(null);
  };

  const handleEdit = (rol: Rol) => {
    setEditing(rol);
    setForm({ nombre: rol.nombre, descripcion: rol.descripcion || "" });
  };

  const handleDelete = async (id: string) => {
    toast("¿Eliminar rol?", {
      action: {
        label: "Sí, eliminar",
        onClick: async () => {
          try {
            const res = await fetch(`${API}/roles/${id}`, {
              method: "DELETE",
              headers: { Authorization: `Bearer ${token}` },
            });
            if (!res.ok) throw new Error();
            toast.success("Rol eliminado");
            getRoles();
          } catch {
            toast.error("Error al eliminar rol");
          }
        },
      },
    });
  };

  return (
    <div className="grid grid-cols-1 gap-6 p-6 mx-auto text-sm md:grid-cols-2 max-w-7xl">
      {/* Formulario */}
      <div className="p-6 text-black bg-white border shadow-md rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-cyan-800">
          {editing ? "Editar Rol" : "Crear Nuevo Rol"}
        </h2>
        <div className="space-y-3 text-black">
          <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del rol" />
          <Input name="descripcion" value={form.descripcion} onChange={handleChange} placeholder="Descripción (opcional)" />

          <div className="flex gap-3">
            <Boton onClick={handleSubmit} className="w-full">
              {editing ? (
                <><Pencil className="w-4 h-4 mr-2" /> Actualizar</>
              ) : (
                <><Plus className="w-4 h-4 mr-2" /> Crear</>
              )}
            </Boton>

            {editing && (
              <Boton variant="ghost" onClick={resetForm} className="w-full text-red-500 border border-red-300">
                <XCircle className="w-4 h-4 mr-2" /> Cancelar
              </Boton>
            )}
          </div>
        </div>
      </div>

      {/* Lista de roles */}
      <div className="p-6 text-black bg-white border shadow-md rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-cyan-800">Roles existentes</h2>
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
          {roles.map((rol) => (
            <div
              key={rol.id}
              className={
                editing?.id === rol.id
                  ? "flex items-center justify-between p-3 border rounded-lg bg-cyan-100 border-cyan-400"
                  : "flex items-center justify-between p-3 border rounded-lg bg-white/70 hover:shadow hover:border-cyan-200"
              }
            >
              <div>
                <h3 className="font-semibold text-gray-800">{rol.nombre}</h3>
                <p className="text-xs text-black">{rol.descripcion}</p>
              </div>
              <div className="flex gap-2">
                <Boton
                  variant="ghost"
                  onClick={() => handleEdit(rol)}
                  className="text-blue-600"
                  active={editing?.id === rol.id}
                >
                  <Pencil className="w-4 h-4" />
                </Boton>
                <Boton
                  variant="ghost"
                  onClick={() => handleDelete(rol.id)}
                  className="text-red-500"
                >
                  <Trash2 className="w-4 h-4" />
                </Boton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
