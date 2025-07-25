import { Router } from "express";
import { obtenerRoles } from "../controllers/rolController";
import { obtenerPermisosConModulo } from "../controllers/permisosController";
import { obtenerAccesos } from "../controllers/accesoController";
import { autenticar } from "../middleware/autenticar";
import { prisma } from "../lib/prisma";

const router = Router();

router.get("/roles", autenticar, async (req, res) => {
  const roles = await prisma.rol.findMany();
  res.json(roles);
});

router.get("/permisos", autenticar, async (req, res) => {
  const permisos = await prisma.permisoModulo.findMany({
    include: { modulo: true },
  });
  res.json(permisos);
});

router.get("/accesos", autenticar, async (req, res) => {
  const accesos = await prisma.rolModuloAcceso.findMany();
  res.json(accesos);
});


export default router;
