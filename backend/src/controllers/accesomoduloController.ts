// src/controllers/accesomoduloController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Actualiza varios accesos en lote
export const actualizarAccesos = async (req: Request, res: Response) => {
  const { accesos } = req.body;

  if (!Array.isArray(accesos)) {
    return res.status(400).json({ error: "El campo 'accesos' debe ser un array." });
  }

  try {
    const operaciones = accesos.map((acceso: any) =>
      prisma.rolModuloAcceso.upsert({
        where: {
          rol_id_permiso_modulo_id: {
            rol_id: acceso.rol_id,
            permiso_modulo_id: acceso.permiso_modulo_id,
          },
        },
        update: { acceso_otorgado: acceso.acceso_otorgado },
        create: { ...acceso },
      })
    );

    await Promise.all(operaciones);

    return res.status(200).json({ message: " Accesos actualizados correctamente" });
  } catch (error) {
    console.error(" Error al actualizar accesos:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};

// Actualiza un solo acceso desde botón individual
export const actualizarAccesoUno = async (req: Request, res: Response) => {
  const { rol_id, permiso_modulo_id, acceso_otorgado } = req.body;

  if (!rol_id || !permiso_modulo_id || typeof acceso_otorgado !== "boolean") {
    return res.status(400).json({ error: "Faltan datos necesarios o formato inválido." });
  }

  try {
    await prisma.rolModuloAcceso.upsert({
      where: {
        rol_id_permiso_modulo_id: {
          rol_id,
          permiso_modulo_id,
        },
      },
      update: { acceso_otorgado },
      create: { rol_id, permiso_modulo_id, acceso_otorgado },
    });

    return res.status(200).json({ message: " Acceso actualizado" });
  } catch (error) {
    console.error(" Error al actualizar acceso individual:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
};
