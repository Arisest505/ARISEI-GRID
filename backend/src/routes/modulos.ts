import { Router } from "express";
import {
  obtenerModulosConPermisos,
  actualizarAccesosRol,
  cambiarRolUsuario,
} from "../controllers/moduloController";
import { autenticar } from "../middleware/autenticar";
import { obtenerRoles } from "../controllers/rolController";

const router = Router();

router.get("/roles", autenticar, obtenerRoles);
router.get("/modulos", autenticar, obtenerModulosConPermisos);
router.post("/modulos/permisos", autenticar, actualizarAccesosRol);
router.post("/modulos/cambiar-rol", autenticar, cambiarRolUsuario);

export default router;
