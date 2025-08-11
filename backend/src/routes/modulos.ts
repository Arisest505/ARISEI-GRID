import { Router } from "express";
import {
  obtenerModulosConPermisos,
  crearModulo,
  actualizarModulo,
  eliminarModulo,
  actualizarAccesosRol,
  cambiarRolUsuario,
  crearPermisosModulo,  // POST (agrega)
  setPermisosModulo,    // PUT  (reemplaza TODO el set)
} from "../controllers/moduloController";
import { autenticar } from "../middleware/autenticar";
import { obtenerRoles } from "../controllers/rolController";

const router = Router();

// Módulos
router.get("/", autenticar, obtenerModulosConPermisos);
router.post("/", autenticar, crearModulo);
router.put("/:id", autenticar, actualizarModulo);
router.delete("/:id", autenticar, eliminarModulo);

// Permisos de un módulo
router.post("/:id/permisos", autenticar, crearPermisosModulo); // agrega (merge)
router.put("/:id/permisos", autenticar, setPermisosModulo);    // reemplaza (ideal al editar)

// Accesos por rol / roles
router.post("/permisos", autenticar, actualizarAccesosRol);    // si ya lo usas así, mantenlo
// (Opcional) Alias más explícito:
// router.post("/roles/accesos", autenticar, actualizarAccesosRol);

router.post("/cambiar-rol", autenticar, cambiarRolUsuario);
router.get("/roles", autenticar, obtenerRoles);

export default router;
