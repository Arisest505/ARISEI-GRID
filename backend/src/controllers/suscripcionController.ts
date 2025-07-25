// controllers/suscripcionController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
export const obtenerHistorialSuscripciones = async (req: Request, res: Response) => {

  try {
    const data = await prisma.suscripcionUsuario.findMany({
      include: {
        usuario: { select: { nombre: true, email: true, codigo_usuario: true } },
        plan: { select: { nombre: true, precio: true, duracion_meses: true } },
        activado_por_usuario: { select: { nombre: true } },
      },
      orderBy: { fecha_inicio: "desc" },
    });

    res.status(200).json(data);
  } catch (error) {
    console.error("[HISTORIAL_SUSCRIPCIONES]", error);
    res.status(500).json({ error: "Error al obtener historial." });
  }
};
export const obtenerSuscripcionesVerificadas = async (req: Request, res: Response) => {
  try {
    const suscripciones = await prisma.suscripcionUsuario.findMany({
      where: {
        pago: {
          medio_verificado: true, //  solo pagos confirmados
        },
      },
      include: {
        usuario: {
          select: { nombre: true, email: true, codigo_usuario: true },
        },
        plan: true,
        activado_por_usuario: {
          select: { nombre: true },
        },
        pago: {
          select: { medio_verificado: true },
        },
      },
    });

    res.json(suscripciones);
  } catch (error) {
    console.error("[ERROR_VERIFICADAS]", error);
    res.status(500).json({ error: "Error al obtener suscripciones verificadas." });
  }
};