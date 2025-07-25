import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const obtenerPermisosConModulo = async (req: Request, res: Response) => {
  try {
    const permisos = await prisma.permisoModulo.findMany({
      include: {
        modulo: true,
      },
      orderBy: {
        nombre: "asc",
      },
    });
    res.json(permisos);
  } catch (error) {
    console.error("Error al obtener permisos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
