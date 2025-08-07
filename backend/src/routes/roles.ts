import { Router } from "express";
import { obtenerRoles, crearRol, actualizarRol, eliminarRol } from "../controllers/rolController";
import { autenticar } from "../middleware/autenticar";

const router = Router();

router.get("/", autenticar, obtenerRoles);
router.post("/", autenticar, crearRol);
router.put("/:id", autenticar, actualizarRol);
router.delete("/:id", autenticar, eliminarRol);

export default router;
