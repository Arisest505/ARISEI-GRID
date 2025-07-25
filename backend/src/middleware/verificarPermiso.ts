import { Request, Response, NextFunction } from "express";
import { prisma } from "../lib/prisma";

/**
 * Middleware para validar si el usuario tiene alguno de los permisos básicos:
 * ejemplo: "ver", "crear", "editar", "eliminar" — en el módulo correspondiente.
 * @param permisos Lista de nombres de permisos requeridos
 */
export function verificarPermisos(permisos: string[]) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const usuario = (req as any).usuario;

    if (!usuario || !usuario.rol_id) {
      return res.status(401).json({ error: "No autorizado" });
    }

    try {
      const rol = await prisma.rol.findUnique({
        where: { id: usuario.rol_id },
      });

      if (!rol) {
        return res.status(403).json({ error: "Rol no encontrado" });
      }

      //  Permitir acceso total al rol "Administrador"
      if (rol.nombre.toLowerCase() === "administrador") {
        (req as any).usuario.esAdmin = true; // opcional, útil en otras rutas
        return next();
      }

      const permisosEncontrados = await prisma.permisoModulo.findMany({
        where: {
          nombre: {
            in: permisos,
          },
        },
      });

      if (permisosEncontrados.length === 0) {
        return res.status(403).json({ error: "Permisos no encontrados" });
      }

      for (const permiso of permisosEncontrados) {
        const acceso = await prisma.rolModuloAcceso.findUnique({
          where: {
            rol_id_permiso_modulo_id: {
              rol_id: usuario.rol_id,
              permiso_modulo_id: permiso.id,
            },
          },
        });

        if (acceso && acceso.acceso_otorgado) {
          return next();
        }
      }

      return res.status(403).json({ error: "Acceso denegado: Permisos insuficientes" });
    } catch (error) {
      console.error("Error en middleware de permisos:", error);
      return res.status(500).json({ error: "Error interno del servidor" });
    }
  };
}
