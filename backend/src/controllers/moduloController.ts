import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const obtenerModulosConPermisos = async (req: Request, res: Response) => {
  try {
    const modulos = await prisma.modulo.findMany({
      where: { visible_en_menu: true },
      include: {
        permisos: {
          include: {
            accesos: true,
          },
        },
      },
      orderBy: { orden_menu: "asc" },
    });

    res.json(modulos);
  } catch (error) {
    console.error("Error al obtener módulos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const actualizarAccesosRol = async (req: Request, res: Response) => {
  const { rolId, permisos } = req.body;

  try {
    // Elimina accesos actuales del rol
    await prisma.rolModuloAcceso.deleteMany({ where: { rol_id: rolId } });

    // Inserta nuevos accesos
    const nuevosAccesos = permisos.map((permiso: any) => ({
      rol_id: rolId,
      permiso_modulo_id: permiso.permisoId,
      acceso_otorgado: permiso.otorgado,
    }));

    await prisma.rolModuloAcceso.createMany({ data: nuevosAccesos });

    res.json({ message: "Accesos actualizados correctamente." });
  } catch (error) {
    console.error("Error actualizando accesos:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

export const cambiarRolUsuario = async (req: Request, res: Response) => {
  const { userId, nuevoRolId } = req.body;

  try {
    await prisma.usuario.update({
      where: { id: userId },
      data: { rol_id: nuevoRolId },
    });

    res.json({ message: "Rol actualizado correctamente." });
  } catch (error) {
    console.error("Error cambiando rol:", error);
    res.status(500).json({ error: "No se pudo cambiar el rol" });
  }
};
