import { Router } from "express";
import { actualizarAccesos,actualizarAccesoUno } from "../controllers/accesomoduloController";
import { autenticar } from "../middleware/autenticar";
import { verificarPermisos } from "../middleware/verificarPermiso"; // 

const router = Router();

//  Ruta protegida por autenticación y permiso
router.post("/update", autenticar, verificarPermisos(["editar"]), actualizarAccesos);

router.post("/update-uno", autenticar, verificarPermisos(["editar"]), actualizarAccesoUno);

export default router;
