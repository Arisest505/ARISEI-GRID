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

export const crearModulo = async (req: Request, res: Response) => {
  try {
    const { nombre, path, icono, orden_menu, visible_en_menu } = req.body;

    const nuevoModulo = await prisma.modulo.create({
      data: {
        nombre,
        path,
        icono,
        orden_menu,
        visible_en_menu,
      },
    });

    res.json(nuevoModulo);
  } catch (error) {
    console.error("Error al crear módulo:", error);
    res.status(500).json({ error: "Error al crear módulo" });
  }
};

// Actualizar módulo
export const actualizarModulo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, path, icono, orden_menu, visible_en_menu } = req.body;

  try {
    const moduloActualizado = await prisma.modulo.update({
      where: { id },
      data: {
        nombre,
        path,
        icono,
        orden_menu,
        visible_en_menu,
      },
    });

    res.json(moduloActualizado);
  } catch (error) {
    console.error("Error al actualizar módulo:", error);
    res.status(500).json({ error: "Error al actualizar módulo" });
  }
};

// Eliminar módulo
export const eliminarModulo = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    await prisma.modulo.delete({ where: { id } });
    res.json({ message: "Módulo eliminado correctamente" });
  } catch (error) {
    console.error("Error al eliminar módulo:", error);
    res.status(500).json({ error: "Error al eliminar módulo" });
  }
};

// POST /api/modulos/:id/permisos
export const crearPermisosModulo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { permisos } = req.body;

  try {
    const existentes = await prisma.permisoModulo.findMany({
      where: { modulo_id: id },
    });

const yaCreados = existentes.map((p: any) => p.nombre.toLowerCase());

    const nuevos = permisos.filter((p: string) => !yaCreados.includes(p.toLowerCase()));

    const data = nuevos.map((nombre: string) => ({
      nombre,
      modulo_id: id,
    }));

    if (data.length > 0) {
      await prisma.permisoModulo.createMany({ data });
    }

    res.json({ message: "Permisos creados correctamente" });
  } catch (error) {
    console.error("Error al crear permisos del módulo:", error);
    res.status(500).json({ error: "Error al crear permisos" });
  }
};
