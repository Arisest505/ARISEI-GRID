// PÁGINA ADMINISTRATIVA PARA GESTIONAR CRUD DE MÓDULOS Y ROLES
import { useState } from "react";
import CrudModulo from "./CrudRoles";
import CrudRol from "./CrudModulo";
import { Boton } from "../../components/ui/BotonPrincipal";

const views = [
    { key: "roles", label: "Gestionar Roles" },
  { key: "modulos", label: "Gestionar Módulos" },

];

export default function CrudsAdminPage() {
  const [active, setActive] = useState("modulos");

  return (
    <div className="px-4 py-6 mx-auto max-w-7xl">
      <div className="flex justify-center gap-4 mb-8">
        {views.map((v) => (
          <Boton
            key={v.key}
            onClick={() => setActive(v.key)}
            variant={active === v.key ? "primary" : "outline"}
          >
            {v.label}
          </Boton>
        ))}
      </div>

      <div className="transition-all duration-300">
        {active === "roles" && <CrudModulo />}
        {active === "modulos" && <CrudRol />}
      </div>
    </div>
  );
}
