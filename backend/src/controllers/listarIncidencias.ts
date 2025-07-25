import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const filtrarIncidencias = async (req: Request, res: Response) => {
  try {
    const { query, dni, colegio, autor, fecha } = req.query;

    const where: any = {};

    if (query) {
      where.OR = [
        { titulo: { contains: String(query), mode: "insensitive" } },
        { descripcion: { contains: String(query), mode: "insensitive" } },
      ];
    }

    if (dni) {
      where.persona = {
        is: {
          dni: { contains: String(dni), mode: "insensitive" },
        },
      };
    }

    if (colegio) {
      where.institucion = {
        is: {
          nombre: { contains: String(colegio), mode: "insensitive" },
        },
      };
    }

    if (autor) {
      where.creador = {
        is: {
          nombre: { contains: String(autor), mode: "insensitive" },
        },
      };
    }

    if (fecha) {
      const targetDate = new Date(String(fecha));
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);

      where.fecha_creacion = {
        gte: targetDate,
        lt: nextDay,
      };
    }

    const incidencias = await prisma.incidencia.findMany({
      where,
      include: {
        persona: true,
        institucion: true,
        creador: true,
      },
      orderBy: {
        fecha_creacion: "desc",
      },
    });

    const resultados = incidencias.map((inc) => ({
      id: inc.id,
      titulo: inc.titulo,
      descripcion: inc.descripcion,
      autor: inc.creador?.nombre || inc.persona?.nombre_completo || "Anónimo",
      fecha: inc.fecha_creacion,
      colegio: inc.institucion?.nombre || "--",
    }));

    return res.status(200).json(resultados);
  } catch (error) {
    console.error("[filtrarIncidencias]", error);
    return res.status(500).json({ error: "No se pudieron obtener las incidencias." });
  }
  
};
export const listarIncidencias = async (req: Request, res: Response) => {
  try {
    const incidencias = await prisma.incidencia.findMany({
      include: {
        persona: true,
        institucion: true,
        creador: true,
      },
      orderBy: {
        fecha_creacion: "desc",
      },
    });

    const resultados = incidencias.map((inc) => ({
      id: inc.id,
      titulo: inc.titulo,
      descripcion: inc.descripcion,
      autor: inc.creador?.nombre || inc.persona?.nombre_completo || "Anónimo",
      fecha: inc.fecha_creacion,
      colegio: inc.institucion?.nombre || "--",
    }));

    return res.status(200).json(resultados);
  } catch (error) {
    console.error("[listarIncidencias]", error);
    return res.status(500).json({ error: "No se pudieron listar las incidencias." });
  }
};
