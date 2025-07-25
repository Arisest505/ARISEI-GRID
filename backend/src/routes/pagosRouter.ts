import express from "express";
import {
  obtenerPagosPendientes,
  obtenerPlanes,
  aprobarPago,
  obtenerPagosCompletados,
  solicitarActivacion,
  confirmarPago,
} from "../controllers/pagosController";

import { autenticar } from "../middleware/autenticar";
import { verificarPermisos } from "../middleware/verificarPermiso";

const router = express.Router();

//  Ruta pública SIN autenticación
router.post("/solicitar-activacion", solicitarActivacion);

//  Rutas protegidas
router.use(autenticar);

router.get("/pendientes", verificarPermisos(["ver pagos pendientes"]), obtenerPagosPendientes);
router.post("/aprobar", verificarPermisos(["aprobar pago suscripcion"]), aprobarPago);
router.get("/completados", verificarPermisos(["ver pagos completados"]), obtenerPagosCompletados);
// pagosRouter.ts
router.get("/planes-disponibles", obtenerPlanes);
router.patch("/:id/confirmar", verificarPermisos(["confirmar pago"]), confirmarPago);


export default router;
