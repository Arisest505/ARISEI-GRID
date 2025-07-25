import { useEffect, useState } from "react";
import clsx from "clsx";
import * as LucideIcons from "lucide-react";

interface Modulo {
  id: string;
  nombre: string;
  path: string;
  icono?: string;
}

interface PermisoModulo {
  id: string;
  nombre: string;
  modulo: Modulo;
}

interface Acceso {
  rol_id: string;
  permiso_modulo_id: string;
  acceso_otorgado: boolean;
}

interface Props {
  permisos: PermisoModulo[];
  accesos: Acceso[];
  rolSeleccionado: string;
}

export default function ModuleTreeDragDrop({
  permisos,
  accesos,
  rolSeleccionado,
}: Props) {
  const [modulosDelRol, setModulosDelRol] = useState<
    { modulo: Modulo; permitido: boolean }[]
  >([]);

  useEffect(() => {
    if (!rolSeleccionado || permisos.length === 0) return;

    const modulosMap = new Map<string, Modulo>();
    permisos.forEach((permiso) => {
      if (!modulosMap.has(permiso.modulo.id)) {
        modulosMap.set(permiso.modulo.id, permiso.modulo);
      }
    });

    const modulosCalculados = Array.from(modulosMap.values())
      .map((modulo) => {
        const permisosDelModulo = permisos.filter(
          (p) => p.modulo.id === modulo.id
        );

        const tieneAcceso = permisosDelModulo.some((permiso) => {
          const acceso = accesos.find(
            (a) =>
              a.permiso_modulo_id === permiso.id && a.rol_id === rolSeleccionado
          );
          return acceso?.acceso_otorgado === true;
        });

        return {
          modulo,
          permitido: tieneAcceso,
        };
      })
      .filter((item) => item.permitido); // Solo módulos realmente permitidos

    setModulosDelRol(modulosCalculados);
  }, [permisos, accesos, rolSeleccionado]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-cyan-700">Módulos Permitidos</h2>

      {modulosDelRol.map(({ modulo }) => {
        const IconComponent = LucideIcons[modulo.icono as keyof typeof LucideIcons];

        return (
          <div
            key={modulo.id}
            className="flex items-center justify-between px-4 py-3 transition-all bg-white border shadow-md rounded-xl hover:shadow-lg"
          >
            <div className="flex items-center gap-3">
              {IconComponent && <IconComponent className="w-5 h-5 text-cyan-600" />}
              <div>
                <span className="block text-base font-medium text-gray-800">
                  {modulo.nombre}
                </span>
                <span className="block text-xs text-gray-500">{modulo.path}</span>
              </div>
            </div>

            <span className="px-3 py-1 text-sm font-semibold text-green-700 bg-green-100 rounded-full">
              PERMITIDO
            </span>
          </div>
        );
      })}

      {modulosDelRol.length === 0 && (
        <div className="mt-6 text-sm text-center text-gray-500">
          Este rol no tiene ningún módulo permitido.
        </div>
      )}
    </div>
  );
}
