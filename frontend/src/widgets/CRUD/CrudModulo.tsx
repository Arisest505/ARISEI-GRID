import { useEffect, useMemo, useState, useCallback } from "react";
import { Input } from "../../components/ui/Input";
import { Boton } from "../../components/ui/BotonPrincipal";
import { toast } from "sonner";
import {
  Plus,
  Trash2,
  Pencil,
  XCircle,
  Eye,
  Edit,
  Trash,
  PlusCircle,
} from "lucide-react";
import clsx from "clsx";
import { apiFetch } from "../../lib/api";

/* ================== Tipos ================== */
interface PermisoModulo {
  id: string;
  nombre: string;
}

interface Modulo {
  id: string;
  nombre: string;
  path: string;
  icono?: string;
  orden_menu?: number;
  visible_en_menu: boolean;
  permisos?: PermisoModulo[];
}

/* ================== Constantes ================== */
const PERMISOS_BASE = ["crear", "editar", "eliminar", "ver"] as const;
type PermisoBase = (typeof PERMISOS_BASE)[number];

/* ================== Helpers ================== */
const unique = <T,>(arr: T[]) => [...new Set(arr)];
const parseBackendError = async (res: Response) => {
  const text = await res.text();
  try {
    const data = JSON.parse(text);
    return data?.error || data?.message || text || `HTTP ${res.status}`;
  } catch {
    return text || `HTTP ${res.status}`;
  }
};
const ensureLeadingSlash = (p: string) => {
  const s = (p || "").trim();
  if (!s) return "/";
  return s.startsWith("/") ? s : `/${s}`;
};
const isPermisoBase = (v: string): v is PermisoBase =>
  (PERMISOS_BASE as readonly string[]).includes(v);

/* ================== Componente ================== */
export default function CrudModulo() {
  const [modulos, setModulos] = useState<Modulo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [editing, setEditing] = useState<Modulo | null>(null);
  const [form, setForm] = useState<Omit<Modulo, "id" | "permisos">>({
    nombre: "",
    path: "",
    icono: "",
    orden_menu: 1,
    visible_en_menu: true,
  });
  const [permisos, setPermisos] = useState<PermisoBase[]>([]);

  /* --------- Cargar módulos --------- */
  const getModulos = useCallback(async () => {
    setIsLoading(true);
    try {
      const res = await apiFetch("/modulos");
      if (!res.ok) throw new Error(await parseBackendError(res));
      const data = (await res.json()) as Modulo[];
      setModulos(data);
    } catch (err: any) {
      console.error("Error al cargar módulos:", err);
      toast.error(err?.message || "Ocurrió un error al cargar los módulos.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    getModulos();
  }, [getModulos]);

  /* --------- Handlers --------- */
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]:
        name === "orden_menu" ? Number.parseInt(value || "0", 10) || 0 : value,
    }));
  };

  const togglePermiso = (nombre: PermisoBase) => {
    setPermisos((prev) =>
      prev.includes(nombre) ? prev.filter((p) => p !== nombre) : [...prev, nombre]
    );
  };

  const resetForm = () => {
    setForm({
      nombre: "",
      path: "",
      icono: "",
      orden_menu: 1,
      visible_en_menu: true,
    });
    setPermisos([]);
    setEditing(null);
  };

  const handleEdit = (modulo: Modulo) => {
    setEditing(modulo);
    setForm({
      nombre: modulo.nombre,
      path: modulo.path,
      icono: modulo.icono || "",
      orden_menu: modulo.orden_menu ?? 1,
      visible_en_menu: modulo.visible_en_menu,
    });
    const permisosAsociados =
      modulo.permisos
        ?.map((p) => p.nombre?.toLowerCase().trim())
        .filter((p): p is PermisoBase => !!p && isPermisoBase(p)) || [];
    setPermisos(unique(permisosAsociados));
  };

  const handleSubmit = async () => {
    if (isSaving) return;
    if (!form.nombre?.trim() || !form.path?.trim()) {
      return toast.warning("Completa los campos obligatorios (nombre y path).");
    }

    const method = editing ? "PUT" : "POST";
    const url = editing ? `/modulos/${editing.id}` : "/modulos";

    // normaliza antes de enviar
    const payload = {
      ...form,
      path: ensureLeadingSlash(form.path),
      orden_menu:
        typeof form.orden_menu === "number" ? form.orden_menu : Number(form.orden_menu) || 0,
    };

    setIsSaving(true);
    try {
      // 1) Crear/actualizar módulo
      const resModulo = await apiFetch(url, {
        method,
        body: JSON.stringify(payload),
      });
      if (!resModulo.ok) throw new Error(await parseBackendError(resModulo));
      const modulo = (await resModulo.json()) as Modulo;

      // 2) Reemplazar permisos del módulo (PUT)
      const resPerms = await apiFetch(`/modulos/${modulo.id}/permisos`, {
        method: "PUT",
        body: JSON.stringify({ permisos }), // PermisoBase[]
      });
      if (!resPerms.ok) throw new Error(await parseBackendError(resPerms));

      toast.success(editing ? "Módulo actualizado." : "Módulo creado con permisos.");
      await getModulos();
      resetForm();
    } catch (err: any) {
      console.error("[GUARDAR MODULO]", err);
      toast.error(err?.message || "Error al guardar módulo");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    toast("¿Eliminar módulo?", {
      action: {
        label: "Sí, eliminar",
        onClick: async () => {
          if (deletingId) return;
          setDeletingId(id);
          try {
            const res = await apiFetch(`/modulos/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error(await parseBackendError(res));
            toast.success("Módulo eliminado");
            await getModulos();
            if (editing?.id === id) resetForm();
          } catch (err: any) {
            console.error("[DELETE MODULO]", err);
            toast.error(
              err?.message ||
                "No se pudo eliminar. Verifica si tiene relaciones asociadas."
            );
          } finally {
            setDeletingId(null);
          }
        },
      },
    });
  };

  /* --------- UI memo --------- */
  const isEditing = Boolean(editing);
  const permisosBaseList = useMemo(
    () => PERMISOS_BASE as readonly PermisoBase[],
    []
  );

  /* ================== Render ================== */
  return (
    <div className="grid grid-cols-1 gap-6 p-6 mx-auto text-sm md:grid-cols-2 max-w-7xl">
      {/* Formulario */}
      <div className="p-6 text-black bg-white border shadow-md rounded-xl">
        <h2 className="mb-4 text-lg font-semibold text-cyan-800">
          {isEditing ? "Editar Módulo" : "Crear Nuevo Módulo"}
        </h2>

        <div className="space-y-3 text-black">
          <Input
            name="nombre"
            value={form.nombre}
            onChange={handleChange}
            placeholder="Nombre del módulo"
            disabled={isSaving}
          />
          <Input
            name="path"
            value={form.path}
            onChange={handleChange}
            placeholder="/ruta"
            disabled={isSaving}
          />
          <Input
            name="icono"
            value={form.icono || ""}
            onChange={handleChange}
            placeholder="Icono (opcional)"
            disabled={isSaving}
          />
          <Input
            type="number"
            name="orden_menu"
            value={form.orden_menu ?? 1}
            onChange={handleChange}
            placeholder="Orden"
            disabled={isSaving}
          />

          <select
            name="visible_en_menu"
            value={form.visible_en_menu ? "true" : "false"}
            onChange={(e) =>
              setForm((f) => ({ ...f, visible_en_menu: e.target.value === "true" }))
            }
            className="w-full px-3 py-2 text-gray-700 border rounded-lg bg-gray-50"
            disabled={isSaving}
          >
            <option value="true">Visible</option>
            <option value="false">Oculto</option>
          </select>

          {/* Permisos como botones toggle */}
          <div className="flex flex-wrap gap-2 mt-2">
            {permisosBaseList.map((permiso) => (
              <button
                key={permiso}
                type="button"
                onClick={() => togglePermiso(permiso)}
                disabled={isSaving}
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
            <Boton onClick={handleSubmit} className="w-full" disabled={isSaving}>
              {isEditing ? (
                <>
                  <Pencil className="w-4 h-4 mr-2" /> {isSaving ? "Guardando..." : "Actualizar"}
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4 mr-2" /> {isSaving ? "Creando..." : "Crear"}
                </>
              )}
            </Boton>

            {isEditing && (
              <Boton
                variant="ghost"
                onClick={resetForm}
                className="w-full text-red-500 border border-red-300"
                disabled={isSaving}
              >
                <XCircle className="w-4 h-4 mr-2" /> Cancelar
              </Boton>
            )}
          </div>
        </div>
      </div>

      {/* Lista de módulos */}
      <div className="p-6 text-black bg-white border shadow-md rounded-xl">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-cyan-800">Módulos existentes</h2>
          {isLoading && (
            <span className="text-xs text-gray-500 animate-pulse">Cargando…</span>
          )}
        </div>

        {modulos.length === 0 && !isLoading ? (
          <p className="p-4 text-sm text-gray-500 rounded-lg bg-gray-50">
            No hay módulos. Crea el primero con el formulario de la izquierda.
          </p>
        ) : (
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
                  {modulo.permisos && modulo.permisos.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {modulo.permisos.map((p) => (
                        <span
                          key={p.id}
                          className="px-2 py-0.5 text-[11px] rounded-full border bg-gray-50 text-gray-700"
                        >
                          {p.nombre}
                        </span>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  <Boton
                    variant="ghost"
                    onClick={() => handleEdit(modulo)}
                    className="text-blue-600"
                    active={editing?.id === modulo.id}
                    disabled={deletingId === modulo.id}
                  >
                    <Pencil className="w-4 h-4" />
                  </Boton>
                  <Boton
                    variant="ghost"
                    onClick={() => handleDelete(modulo.id)}
                    className={clsx(
                      "text-red-500",
                      deletingId === modulo.id && "opacity-60 cursor-not-allowed"
                    )}
                    disabled={deletingId === modulo.id}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Boton>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
