import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const obtenerAccesos = async (req: Request, res: Response) => {
  try {
    const accesos = await prisma.rolModuloAcceso.findMany();
    res.json(accesos);
  } catch (error) {
    console.error("Error al obtener accesos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
