import { useEffect, useState } from "react";
import RoleSelector from "./RoleSelector";
import PermissionManager from "./PermissionManager";
import ModuleTreeDragDrop from "./ModuleTreeDragDrop";
import { apiFetch } from "../../lib/api"; // 👈 importa tu helper

interface Rol {
  id: string;
  nombre: string;
  activo: boolean;
}

interface PermisoModulo {
  id: string;
  nombre: string;
  modulo: {
    id: string;
    nombre: string;
    path: string;
    icono: string;
  };
}

interface Acceso {
  rol_id: string;
  permiso_modulo_id: string;
  acceso_otorgado: boolean;
}

export default function AdministracionModules() {
  const [roles, setRoles] = useState<Rol[]>([]);
  const [permisos, setPermisos] = useState<PermisoModulo[]>([]);
  const [accesos, setAccesos] = useState<Acceso[]>([]);
  const [rolSeleccionado, setRolSeleccionado] = useState<string>("");
  const [cargandoAccesos, setCargandoAccesos] = useState(false);

  useEffect(() => {
    const cargarDatosIniciales = async () => {
      try {
        const [resRoles, resPermisos] = await Promise.all([
          apiFetch("/roles"),
          apiFetch("/permisos"),
        ]);
        setRoles(await resRoles.json());
        setPermisos(await resPermisos.json());
      } catch (err) {
        console.error("Error cargando roles o permisos:", err);
      }
    };

    cargarDatosIniciales();
  }, []);

  useEffect(() => {
    if (!rolSeleccionado) return;

    const cargarAccesos = async () => {
      setCargandoAccesos(true);
      try {
        const res = await apiFetch(`/accesos?rol_id=${rolSeleccionado}`);
        const data = await res.json();
        setAccesos(data);
      } catch (err) {
        console.error("Error cargando accesos:", err);
      } finally {
        setCargandoAccesos(false);
      }
    };

    cargarAccesos();
  }, [rolSeleccionado]);


 return (
  <section className="w-full px-1 py-1 space-y-6">
    {/* Selector horizontal */}
    <div className="w-full p-5 bg-white border border-gray-300 rounded-lg shadow">
      <h2 className="mb-3 text-lg font-bold text-gray-800">Seleccionar Rol</h2>
   
     <RoleSelector
        roles={roles}
        accesos={accesos}
        valorSeleccionado={rolSeleccionado}
        onChange={setRolSeleccionado}
        />

    </div>

    {/* Grid con proporciones: módulos más delgado */}
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {/* Módulos - ocupa 1/3 */}
      <div className="p-5 bg-white border border-gray-300 rounded-lg shadow md:col-span-1">
        <h2 className="mb-3 text-lg font-bold text-cyan-800">Módulos del Rol</h2>
        {rolSeleccionado ? (
          cargandoAccesos ? (
            <div className="py-12 text-center text-gray-500">Cargando módulos...</div>
          ) : (
            <ModuleTreeDragDrop
              key={rolSeleccionado}
              permisos={permisos}
              accesos={accesos}
              rolSeleccionado={rolSeleccionado}
            />
          )
        ) : (
          <div className="text-center text-gray-500">
            Selecciona un rol para ver sus módulos.
          </div>
        )}
      </div>

      {/* Permisos - ocupa 2/3 */}
      <div className="p-5 bg-white border border-gray-300 rounded-lg shadow md:col-span-2">
        <h2 className="mb-3 text-lg font-bold text-gray-800">Permisos por Módulo</h2>
        {rolSeleccionado ? (
          <PermissionManager
            roles={roles.filter((r) => r.id === rolSeleccionado)}
            permisos={permisos}
            accesos={accesos}
            onChange={(actualizados) =>
              setTimeout(() => setAccesos(actualizados), 0)
            }
          />
        ) : (
          <div className="text-center text-gray-500">Selecciona un rol primero.</div>
        )}
      </div>
    </div>
  </section>
);

}
