import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Obtener todos los planes
export const obtenerPlanes = async (_: Request, res: Response) => {
  try {
    const planes = await prisma.plan.findMany({
      orderBy: { nombre: "asc" },
    });
    res.status(200).json(planes);
  } catch (error) {
    console.error("Error al obtener planes:", error);
    res.status(500).json({ error: "No se pudieron obtener los planes." });
  }
};

// Crear un nuevo plan
export const crearPlan = async (req: Request, res: Response) => {
  const {
    nombre,
    descripcion,
    precio,
    duracion_meses,
    rol_asociado,
  } = req.body;

  if (!nombre || !precio || !duracion_meses || !rol_asociado) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  try {
    const nuevoPlan = await prisma.plan.create({
      data: {
        nombre,
        descripcion,
        precio,
        duracion_meses,
        es_activo: true,
        rol_asociado,
      },
    });
    res.status(201).json(nuevoPlan);
  } catch (error) {
    console.error("Error al crear plan:", error);
    res.status(500).json({ error: "No se pudo crear el plan." });
  }
};

// Actualizar un plan existente
export const actualizarPlan = async (req: Request, res: Response) => {
  const { id } = req.params;
  const {
    nombre,
    descripcion,
    precio,
    duracion_meses,
    rol_asociado,
  } = req.body;

  try {
    const actualizado = await prisma.plan.update({
      where: { id },
      data: {
        nombre,
        descripcion,
        precio,
        duracion_meses,
        rol_asociado,
      },
    });

    res.status(200).json(actualizado);
  } catch (error) {
    console.error("Error al actualizar plan:", error);
    res.status(500).json({ error: "No se pudo actualizar el plan." });
  }
};

// Activar o desactivar un plan
export const cambiarEstadoPlan = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) return res.status(404).json({ error: "Plan no encontrado." });

    const actualizado = await prisma.plan.update({
      where: { id },
      data: { es_activo: !plan.es_activo },
    });

    res.status(200).json(actualizado);
  } catch (error) {
    console.error("Error al cambiar estado del plan:", error);
    res.status(500).json({ error: "No se pudo cambiar el estado del plan." });
  }
};
