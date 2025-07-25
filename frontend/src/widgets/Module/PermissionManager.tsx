import { useEffect, useState } from "react";
import { Check, X } from "lucide-react";
import clsx from "clsx";

interface Rol {
  id: string;
  nombre: string;
}

interface PermisoModulo {
  id: string;
  nombre: string; // Ej: "Crear", "Editar", etc.
  modulo: {
    id: string;
    nombre: string;
  };
}

interface Acceso {
  rol_id: string;
  permiso_modulo_id: string;
  acceso_otorgado: boolean;
}

interface Props {
  roles: Rol[];
  permisos: PermisoModulo[];
  accesos: Acceso[];
  onChange?: (actualizados: Acceso[]) => void;
}

export default function PermissionManager({
  roles,
  permisos,
  accesos,
  onChange = () => {},
}: Props) {
  const [estado, setEstado] = useState<Acceso[]>([]);
  const token = localStorage.getItem("token");
  const rol = roles[0]; // Se asume un solo rol seleccionado

  // Agrupar permisos por módulo
  const permisosPorModulo = permisos.reduce((acc, permiso) => {
    const modId = permiso.modulo.id;
    if (!acc[modId]) {
      acc[modId] = {
        nombre: permiso.modulo.nombre,
        permisos: [],
      };
    }
    acc[modId].permisos.push(permiso);
    return acc;
  }, {} as Record<string, { nombre: string; permisos: PermisoModulo[] }>);

  useEffect(() => {
    setEstado(accesos);
  }, [accesos]);

  const tieneAcceso = (permisoId: string) =>
    estado.find((a) => a.permiso_modulo_id === permisoId && a.rol_id === rol?.id)?.acceso_otorgado ?? false;

  const toggleAcceso = (permisoId: string) => {
    if (!rol) return;
    setEstado((prev) => {
      const idx = prev.findIndex(
        (a) => a.rol_id === rol.id && a.permiso_modulo_id === permisoId
      );
      const nuevos = [...prev];

      if (idx >= 0) {
        nuevos[idx] = {
          ...nuevos[idx],
          acceso_otorgado: !nuevos[idx].acceso_otorgado,
        };
        actualizarBackend(nuevos[idx]);
      } else {
        const nuevo: Acceso = {
          rol_id: rol.id,
          permiso_modulo_id: permisoId,
          acceso_otorgado: true,
        };
        nuevos.push(nuevo);
        actualizarBackend(nuevo);
      }

      onChange(nuevos);
      return nuevos;
    });
  };

  const actualizarBackend = async (nuevo: Acceso) => {
    try {
      const res = await fetch("http://localhost:5000/api/accesos/update-uno", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(nuevo),
      });

      if (!res.ok) {
        console.error("❌ Error al actualizar:", await res.text());
      }
    } catch (error) {
      console.error("❌ Error de red:", error);
    }
  };

  return (
    <div className="grid w-full grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      {Object.entries(permisosPorModulo).map(([moduloId, { nombre, permisos }]) => (
        <div
          key={moduloId}
          className="flex flex-col gap-3 p-4 bg-white border rounded-lg shadow-sm"
        >
          <h3 className="text-lg font-semibold text-gray-800">{nombre}</h3>
          <div className="flex flex-wrap gap-2">
            {permisos.map((permiso) => {
              const activo = tieneAcceso(permiso.id);
              return (
                <button
                  key={permiso.id}
                  onClick={() => toggleAcceso(permiso.id)}
                  className={clsx(
                    "flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold transition-all duration-150",
                    activo
                      ? "bg-green-100 text-green-700 hover:bg-green-200"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  )}
                  title={`${activo ? "Activo" : "Inactivo"} - ${permiso.nombre}`}
                >
                  {activo ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
                  {permiso.nombre}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
