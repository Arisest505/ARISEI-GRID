import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const obtenerModulosConPermisos = async (req: Request, res: Response) => {
  try {
    const modulos = await prisma.modulo.findMany({
      where: { visible_en_menu: true },
      include: {
        permisos: {
          include: {
            accesos: true, // RolModuloAcceso[]
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
    await prisma.rolModuloAcceso.deleteMany({ where: { rol_id: rolId } });
    const nuevosAccesos = (permisos || []).map((permiso: any) => ({
      rol_id: rolId,
      permiso_modulo_id: permiso.permisoId,
      acceso_otorgado: permiso.otorgado,
    }));
    if (nuevosAccesos.length) {
      await prisma.rolModuloAcceso.createMany({ data: nuevosAccesos });
    }
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
      data: { nombre, path, icono, orden_menu, visible_en_menu },
    });
    res.json(nuevoModulo);
  } catch (error) {
    console.error("Error al crear módulo:", error);
    res.status(500).json({ error: "Error al crear módulo" });
  }
};

export const actualizarModulo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { nombre, path, icono, orden_menu, visible_en_menu } = req.body;
  try {
    const moduloActualizado = await prisma.modulo.update({
      where: { id },
      data: { nombre, path, icono, orden_menu, visible_en_menu },
    });
    res.json(moduloActualizado);
  } catch (error) {
    console.error("Error al actualizar módulo:", error);
    res.status(500).json({ error: "Error al actualizar módulo" });
  }
};

/**
 * DELETE /api/modulos/:id
 * Borra primero accesos → permisos → módulo (evita FK P2003)
 */
export const eliminarModulo = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.$transaction(async (tx) => {
      // 1) buscar permisos del módulo
      const perms = await tx.permisoModulo.findMany({
        where: { modulo_id: id },
        select: { id: true },
      });
      const permIds = perms.map((p) => p.id);

      if (permIds.length) {
        // 2) borrar accesos de esos permisos
        await tx.rolModuloAcceso.deleteMany({
          where: { permiso_modulo_id: { in: permIds } },
        });
        // 3) borrar permisos del módulo
        await tx.permisoModulo.deleteMany({
          where: { id: { in: permIds } },
        });
      }

      // 4) borrar módulo
      await tx.modulo.delete({ where: { id } });
    });

    res.json({ message: "Módulo eliminado correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar módulo:", error);
    if (error?.code === "P2003") {
      return res.status(409).json({ error: "No se puede eliminar: existen registros relacionados." });
    }
    res.status(500).json({ error: "Error al eliminar módulo" });
  }
};

/**
 * POST /api/modulos/:id/permisos
 * 👉 Mantiene comportamiento actual: AGREGA los que no existan. No elimina.
 */
export const crearPermisosModulo = async (req: Request, res: Response) => {
  const { id } = req.params;
  const { permisos } = req.body as { permisos?: string[] };

  try {
    const existentes = await prisma.permisoModulo.findMany({
      where: { modulo_id: id },
      select: { nombre: true },
    });

    const yaCreados = new Set(existentes.map((p) => p.nombre.toLowerCase()));
    const nuevos = (permisos || [])
      .map((p) => String(p).toLowerCase().trim())
      .filter((p) => p && !yaCreados.has(p));

    if (nuevos.length) {
      await prisma.permisoModulo.createMany({
        data: nuevos.map((nombre) => ({ nombre, modulo_id: id })),
        skipDuplicates: true,
      });
    }

    res.json({ message: "Permisos creados correctamente" });
  } catch (error) {
    console.error("Error al crear permisos del módulo:", error);
    res.status(500).json({ error: "Error al crear permisos" });
  }
};

/**
 * PUT /api/modulos/:id/permisos
 * 👉 Reemplaza el set completo (borra los que ya no están, crea los nuevos)
 */
export const setPermisosModulo = async (req: Request, res: Response) => {
  const { id } = req.params;
  let { permisos } = req.body as { permisos?: string[] };

  if (!Array.isArray(permisos)) {
    return res.status(400).json({ error: "Campo 'permisos' debe ser un arreglo" });
  }

  // normaliza
  permisos = [...new Set(permisos.map((p) => String(p).toLowerCase().trim()))].filter(Boolean);

  try {
    const result = await prisma.$transaction(async (tx) => {
      // validar modulo
      const modulo = await tx.modulo.findUnique({ where: { id } });
      if (!modulo) throw new Error("Módulo no existe");

      // actuales
      const actuales = await tx.permisoModulo.findMany({
        where: { modulo_id: id },
        select: { id: true, nombre: true },
      });

      const setActual = new Set(actuales.map((a) => a.nombre.toLowerCase()));
      const setNuevo = new Set(permisos);

      // diferencias
      const aEliminar = actuales.filter((a) => !setNuevo.has(a.nombre.toLowerCase()));
      const aCrear = [...setNuevo].filter((n) => !setActual.has(n));

      // borrar accesos dependientes + permisos que sobran
      if (aEliminar.length) {
        const ids = aEliminar.map((a) => a.id);
        await tx.rolModuloAcceso.deleteMany({ where: { permiso_modulo_id: { in: ids } } });
        await tx.permisoModulo.deleteMany({ where: { id: { in: ids } } });
      }

      // crear faltantes
      if (aCrear.length) {
        await tx.permisoModulo.createMany({
          data: aCrear.map((n) => ({ nombre: n, modulo_id: id })),
          skipDuplicates: true,
        });
      }

      // devolver estado final
      return tx.permisoModulo.findMany({
        where: { modulo_id: id },
        orderBy: { nombre: "asc" },
      });
    });

    res.json({ permisos: result });
  } catch (error: any) {
    console.error("[SET PERMISOS MODULO]", error);
    if (error?.message === "Módulo no existe") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Error al actualizar permisos del módulo" });
  }
};
