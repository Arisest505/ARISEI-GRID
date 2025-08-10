import { useEffect, useState } from "react";
import clsx from "clsx";
import { ShieldCheck, ShieldOff,  Activity } from "lucide-react";

interface Rol {
  id: string;
  nombre: string;
}

interface Acceso {
  rol_id: string;
  permiso_modulo_id: string;
  acceso_otorgado: boolean;
}

interface Props {
  roles?: Rol[];
  accesos?: Acceso[]; // NUEVO: Lista global de accesos
  valorSeleccionado?: string;
  onChange?: (rolId: string) => void;
}

export default function RoleSelector({
  roles = [],
  accesos = [],
  valorSeleccionado = "",
  onChange = () => {},
}: Props) {
  const [seleccionado, setSeleccionado] = useState(valorSeleccionado);

  useEffect(() => {
    setSeleccionado(valorSeleccionado);
  }, [valorSeleccionado]);

  const seleccionarRol = (id: string) => {
    setSeleccionado(id);
    onChange(id);
  };

  // Verifica si un rol tiene al menos un acceso otorgado
  const estaActivo = (rolId: string) =>
    accesos?.some((a) => a.rol_id === rolId && a.acceso_otorgado);

  return (
    <section className="mb-8">
      <h3 className="flex items-center gap-2 mb-4 text-xl font-bold text-gray-800">
        <Activity className="w-5 h-5 text-cyan-600" />
        Selecciona un Rol para administrar
      </h3>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
        {roles.map((rol) => {
          const activo = estaActivo(rol.id);
          const seleccionadoActivo = seleccionado === rol.id;

          return (
            <div
              key={rol.id}
              onClick={() => seleccionarRol(rol.id)}
              className={clsx(
                "relative cursor-pointer p-4 rounded-xl border group transition-all duration-200 shadow hover:shadow-xl transform hover:scale-[1.02]",
                {
                  "bg-green-100 border-green-500 text-green-800":
                    activo && seleccionadoActivo,
                  "bg-green-50 border-green-400":
                    activo && !seleccionadoActivo,
                  "bg-gray-200 border-gray-400 text-gray-600":
                    !activo && seleccionadoActivo,
                  "bg-gray-100 border-gray-300":
                    !activo && !seleccionadoActivo,
                  "ring-2 ring-cyan-500": seleccionadoActivo,
                }
              )}
            >
              <div className="flex items-center gap-3 mb-2">
                {activo ? (
                  <ShieldCheck className="w-5 h-5 text-green-600" />
                ) : (
                  <ShieldOff className="w-5 h-5 text-gray-500" />
                )}
                <p className="text-base font-semibold truncate">{rol.nombre}</p>
              </div>

              <div className="text-sm">
                <span
                  className={clsx(
                    "inline-block px-2 py-1 rounded-full font-medium text-xs transition",
                    activo
                      ? "bg-green-200 text-green-700"
                      : "bg-red-100 text-red-600"
                  )}
                >
                  {activo ? "Rol Activo (con módulos)" : "Rol Inactivo (sin acceso)"}
                </span>
              </div>

              {seleccionadoActivo && (
                <div className="absolute top-0 right-0 p-1">
                  <span className="flex w-3 h-3">
                    <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-cyan-400" />
                    <span className="relative inline-flex w-3 h-3 rounded-full bg-cyan-600" />
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
