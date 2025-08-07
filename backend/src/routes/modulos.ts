import { Router } from "express";
import {
  obtenerModulosConPermisos,
  crearModulo,
  actualizarModulo,
  eliminarModulo,
  actualizarAccesosRol,
  cambiarRolUsuario,
  crearPermisosModulo,
} from "../controllers/moduloController";
import { autenticar } from "../middleware/autenticar";
import { obtenerRoles } from "../controllers/rolController";

const router = Router();

// routes/modulos.ts (arreglado)
router.get("/", autenticar, obtenerModulosConPermisos);
router.post("/", autenticar, crearModulo);
router.put("/:id", autenticar, actualizarModulo);
router.delete("/:id", autenticar, eliminarModulo);

router.post("/permisos", autenticar, actualizarAccesosRol);
router.post("/cambiar-rol", autenticar, cambiarRolUsuario);
router.get("/roles", autenticar, obtenerRoles);
router.post("/:id/permisos", autenticar, crearPermisosModulo);
export default router;

