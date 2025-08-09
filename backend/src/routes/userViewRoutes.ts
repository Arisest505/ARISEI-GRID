import { Router } from "express";
import {
  getIncidenciasUsuario,
  getDetalleIncidenciaUsuario,
  editarIncidenciaUsuario,
  eliminarIncidenciaUsuario,
} from "../controllers/UserViewController";

const router = Router();

// Lista incidencias de un usuario
router.get("/:id/incidencias", getIncidenciasUsuario);

// Detalle
router.get("/incidencias/:id", getDetalleIncidenciaUsuario);

// Editar
router.put("/incidencias/:id", editarIncidenciaUsuario);

// Eliminar incidencia
router.delete("/incidencias/:id", eliminarIncidenciaUsuario);

export default router;
