// controllers/autocompleteController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const buscarColegios = async (req: Request, res: Response) => {
  const { q } = req.query;

  const colegios = await prisma.institucion.findMany({
    where: {
      nombre: { contains: String(q), mode: "insensitive" }
    },
    select: { nombre: true },
    take: 10
  });

  res.json(colegios);
};

export const buscarAutores = async (req: Request, res: Response) => {
  const { q } = req.query;

  const autores = await prisma.usuario.findMany({
    where: {
      nombre: { contains: String(q), mode: "insensitive" }
    },
    select: { nombre: true },
    take: 10
  });

  res.json(autores);
};
