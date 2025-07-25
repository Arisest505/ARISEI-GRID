import express from "express";
import { filtrarIncidencias, listarIncidencias } from "../controllers/listarIncidencias";

const router = express.Router();

// Asegúrate de que esté correctamente registrado así:
router.get("/filtrar", filtrarIncidencias);
router.get("/listar", listarIncidencias); //  nuevo endpoint
export default router;
