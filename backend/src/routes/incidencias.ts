// src/routes/incidencias.ts
import express from "express";
import { crearIncidenciaCompleta } from "../controllers/incidenciaController";

const router = express.Router();

// Ruta para crear una incidencia completa
router.post("/crear", crearIncidenciaCompleta);

export default router;
