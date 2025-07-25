import express from "express";
import {
  obtenerPlanes,
  crearPlan,
  actualizarPlan,
  cambiarEstadoPlan,
} from "../controllers/planesController";
import { autenticar } from "../middleware/autenticar";
import { verificarPermisos } from "../middleware/verificarPermiso";

const router = express.Router();

router.use(autenticar);

// Solo roles con permisos específicos pueden gestionar planes
router.get("/", verificarPermisos(["ver planes"]), obtenerPlanes);
router.post("/", verificarPermisos(["crear planes"]), crearPlan);
router.put("/:id", verificarPermisos(["editar planes"]), actualizarPlan);
router.patch("/:id/toggle", verificarPermisos(["editar planes"]), cambiarEstadoPlan);

export default router;
