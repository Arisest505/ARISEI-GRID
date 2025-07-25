import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const obtenerRoles = async (req: Request, res: Response) => {
  try {
    const roles = await prisma.rol.findMany({
      orderBy: { nombre: "asc" },
    });
    res.json(roles);
  } catch (error) {
    console.error("Error al obtener roles:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
