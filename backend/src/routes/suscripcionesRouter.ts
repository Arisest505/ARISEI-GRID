import express from "express";
import { autenticar } from "../middleware/autenticar";
import { verificarPermisos } from "../middleware/verificarPermiso";
import { obtenerHistorialSuscripciones,obtenerSuscripcionesVerificadas } from "../controllers/suscripcionController";

const router = express.Router();

router.use(autenticar);

router.get("/historial", verificarPermisos(["ver historial suscripciones"]), obtenerHistorialSuscripciones);
router.get(
  "/historial-verificadas",
  verificarPermisos(["ver historial suscripciones"]),
  obtenerSuscripcionesVerificadas
);



export default router;
