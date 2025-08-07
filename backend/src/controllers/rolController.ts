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

export const crearRol = async (req: Request, res: Response) => {
  const { nombre, descripcion } = req.body;
  try {
    const nuevoRol = await prisma.rol.create({ data: { nombre, descripcion } });
    res.json(nuevoRol);
  } catch (error) {
    res.status(500).json({ error: "Error al crear rol" });
  }
};

export const actualizarRol = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, descripcion } = req.body;
  try {
    const actualizado = await prisma.rol.update({
      where: { id },
      data: { nombre, descripcion },
    });
    res.json(actualizado);
  } catch (error) {
    res.status(500).json({ error: "Error al actualizar rol" });
  }
};

export const eliminarRol = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.rol.delete({ where: { id } });
    res.json({ message: "Rol eliminado correctamente" });
  } catch (error) {
    res.status(500).json({ error: "Error al eliminar rol" });
  }
};
