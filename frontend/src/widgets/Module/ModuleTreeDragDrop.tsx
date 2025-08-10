import { useEffect, useState } from "react";
import * as LucideIcons from "lucide-react";
import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";

// 1. Define a type for a Lucide icon component.
type LucideIconComponent = ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>;

// 2. Create a safe, type-guarded object containing only valid icon components.
const validIcons = Object.fromEntries(
  Object.entries(LucideIcons).filter(
    // Filter out non-component values like createLucideIcon
    ([, value]) => typeof value === 'object' && '$$typeof' in value
  )
) as Record<string, LucideIconComponent>;

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
      .filter((item) => item.permitido);

    setModulosDelRol(modulosCalculados);
  }, [permisos, accesos, rolSeleccionado]);

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-cyan-700">Módulos Permitidos</h2>

      {modulosDelRol.map(({ modulo }) => {
        // 3. Access the icon from the safe `validIcons` object.
        const IconComponent = modulo.icono
          ? validIcons[modulo.icono]
          : validIcons.LayoutGrid;

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