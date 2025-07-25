import { Router } from "express";
import { getDetalleIncidencia } from "../controllers/detalleincidencia";

const router = Router();

// GET /api/listarincidencias/:id
router.get("/:id", getDetalleIncidencia);

export default router;
