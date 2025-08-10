import { useEffect, useState } from "react";
import { Input } from "../../components/ui/Input";
import { Boton } from "../../components/ui/BotonPrincipal";
import { toast } from "sonner";
import { Plus, Trash2, Pencil, XCircle, Eye, Edit, Trash, PlusCircle } from "lucide-react";
import clsx from "clsx";
import { apiFetch } from "../../lib/api"; //  Ojo ruta corregida

interface Modulo {
  id: string;
  nombre: string;
  path: string;
  icono?: string;
  orden_menu?: number;
  visible_en_menu: boolean;
  permisos?: PermisoModulo[];
}

interface PermisoModulo {
  id: string;
  nombre: string;
}

const PERMISOS_BASE = ["crear", "editar", "eliminar", "ver"];

export default function CrudModulo() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [editing, setEditing] = useState<Modulo | null>(null);
  const [form, setForm] = useState<Omit<Modulo, "id">>({
    nombre: "",
    path: "",
    icono: "",
    orden_menu: 1,
    visible_en_menu: true,
  });
  const [permisos, setPermisos] = useState<string[]>([]);

  useEffect(() => {
    getModulos();
  }, []);

  const getModulos = async () => {
    try {
      const res = await apiFetch("/modulos");
      if (!res.ok) throw new Error("Error en respuesta del servidor");
      const data = await res.json();
      setModulos(data);
    } catch (err) {
      // El tipo de `err` en un bloque catch es `unknown` por defecto en TypeScript.
      // Para usarlo de forma segura, es necesario verificar su tipo.
      console.error("Error al cargar módulos:", err); // Log para depuración.
      if (err instanceof Error) {
        toast.error(`Error al cargar módulos: ${err.message}`);
      } else {
        toast.error("Ocurrió un error inesperado al cargar los módulos.");
      }
    }
  };



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: name === "orden_menu" ? parseInt(value) : value,
    }));
  };

  const togglePermiso = (nombre: string) => {
    setPermisos((prev) =>
      prev.includes(nombre) ? prev.filter((p) => p !== nombre) : [...prev, nombre]
    );
  };

  const handleSubmit = async () => {
    if (!form.nombre || !form.path) return toast.warning("Completa los campos obligatorios");

    const method = editing ? "PUT" : "POST";
    const url = editing ? `/modulos/${editing.id}` : "/modulos";

    try {
      const resModulo = await apiFetch(url, {
        method,
        body: JSON.stringify(form),
      });

      if (!resModulo.ok) throw new Error();
      const modulo = await resModulo.json();

      // Si es creación o edición, asignar permisos
      await apiFetch(`/modulos/${modulo.id}/permisos`, {
        method: "POST",
        body: JSON.stringify({ permisos }),
      });

      toast.success(editing ? "Módulo actualizado." : "Módulo creado con permisos");
      getModulos();
      resetForm();
    } catch {
      toast.error("Error al guardar módulo");
    }
  };

  const resetForm = () => {
    setForm({ nombre: "", path: "", icono: "", orden_menu: 1, visible_en_menu: true });
    setEditing(null);
    setPermisos([]);
  };

  const handleEdit = (modulo: Modulo) => {
    setEditing(modulo);
    setForm({
      nombre: modulo.nombre,
      path: modulo.path,
      icono: modulo.icono || "",
      orden_menu: modulo.orden_menu || 1,
      visible_en_menu: modulo.visible_en_menu,
    });
    const permisosAsociados = modulo.permisos?.map((p) => p.nombre.toLowerCase()) || [];
    setPermisos(permisosAsociados);
  };

  const handleDelete = async (id: string) => {
    toast("¿Eliminar módulo?", {
      action: {
        label: "Sí, eliminar",
        onClick: async () => {
          try {
            const res = await apiFetch(`/modulos/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error();
            toast.success("Módulo eliminado");
            getModulos();
          } catch {
            toast.error("Error al eliminar módulo");
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
          {editing ? "Editar Módulo" : "Crear Nuevo Módulo"}
        </h2>
        <div className="space-y-3 text-black">
          <Input name="nombre" value={form.nombre} onChange={handleChange} placeholder="Nombre del módulo" />
          <Input name="path" value={form.path} onChange={handleChange} placeholder="/ruta" />
          <Input name="icono" value={form.icono} onChange={handleChange} placeholder="Icono (opcional)" />
          <Input type="number" name="orden_menu" value={form.orden_menu} onChange={handleChange} placeholder="Orden" />

          <select
            name="visible_en_menu"
            value={form.visible_en_menu ? "true" : "false"}
            onChange={(e) => setForm((f) => ({ ...f, visible_en_menu: e.target.value === "true" }))}
            className="w-full px-3 py-2 text-gray-700 border rounded-lg bg-gray-50"
          >
            <option value="true">Visible</option>
            <option value="false">Oculto</option>
          </select>

          {/* Permisos como botones toggle */}
          <div className="flex flex-wrap gap-2 mt-2">
            {PERMISOS_BASE.map((permiso) => (
              <button
                key={permiso}
                type="button"
                onClick={() => togglePermiso(permiso)}
                className={clsx(
                  "flex items-center gap-1 px-3 py-1 rounded-full border text-sm capitalize transition-all",
                  permisos.includes(permiso)
                    ? "bg-green-100 text-green-800 border-green-400"
                    : "bg-white text-gray-500 border-gray-300 hover:bg-gray-100"
                )}
              >
                {permiso === "ver" && <Eye className="w-4 h-4" />}
                {permiso === "editar" && <Edit className="w-4 h-4" />}
                {permiso === "eliminar" && <Trash className="w-4 h-4" />}
                {permiso === "crear" && <PlusCircle className="w-4 h-4" />}
                {permiso}
              </button>
            ))}
          </div>

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

      {/* Lista de módulos */}
      <div className="p-6 text-black bg-white border shadow-md rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-cyan-800">Módulos existentes</h2>
        <div className="space-y-2 max-h-[480px] overflow-y-auto pr-2">
          {modulos.map((modulo) => (
            <div
              key={modulo.id}
              className={clsx(
                "flex items-center justify-between p-3 border rounded-lg transition-all duration-150",
                editing?.id === modulo.id
                  ? "bg-cyan-100 border-cyan-400"
                  : "bg-white/70 hover:shadow hover:border-cyan-200"
              )}
            >
              <div>
                <h3 className="font-semibold text-gray-800">{modulo.nombre}</h3>
                <p className="text-xs text-black">{modulo.path}</p>
              </div>
              <div className="flex gap-2">
                <Boton
                  variant="ghost"
                  onClick={() => handleEdit(modulo)}
                  className="text-blue-600"
                  active={editing?.id === modulo.id}
                >
                  <Pencil className="w-4 h-4" />
                </Boton>
                <Boton
                  variant="ghost"
                  onClick={() => handleDelete(modulo.id)}
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