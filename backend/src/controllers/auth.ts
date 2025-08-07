import { Response, Request as ExpressRequest } from "express";
import { prisma } from "../lib/prisma";

interface AuthenticatedRequest extends ExpressRequest {
  usuario?: {
    id: string;
    rol_id: string;
  };
}

interface AccesoConPermisoYModulo {
  permiso: {
    nombre: string;
    modulo: {
      nombre: string;
      path: string;
      icono: string;
    };
  };
}

export const getPerfilUsuario = async (req: AuthenticatedRequest, res: Response) => {
  const usuario = req.usuario;

  if (!usuario?.id) {
    return res.status(401).json({ error: "Usuario no autenticado" });
  }

  try {
    const userWithDetails = await prisma.usuario.findUnique({
      where: { id: usuario.id },
      include: {
        rol: {
          include: {
            accesos: {
              where: { acceso_otorgado: true },
              include: {
                permiso: {
                  include: {
                    modulo: true,
                  },
                },
              },
            },
          },
        },
        suscripciones: {
          where: { estado: "activo" },
          include: {
            plan: true,
          },
        },
      },
    });

    if (!userWithDetails) {
      return res.status(404).json({ error: "Usuario no encontrado" });
    }

    const permisos = (userWithDetails.rol.accesos as AccesoConPermisoYModulo[]).map((a) => ({
      permiso: a.permiso.nombre,
      modulo: a.permiso.modulo.nombre,
      path: a.permiso.modulo.path,
      icono: a.permiso.modulo.icono,
    }));

    const planActivo = userWithDetails.suscripciones.length > 0
      ? userWithDetails.suscripciones[0].plan
      : null;

    res.json({
      id: userWithDetails.id,
      nombre: userWithDetails.nombre,
      email: userWithDetails.email,
      rol: userWithDetails.rol.nombre,
      codigo_usuario: userWithDetails.codigo_usuario,
      permisos,
      plan_activo: planActivo
        ? {
            nombre: planActivo.nombre,
            fecha_inicio: userWithDetails.suscripciones[0].fecha_inicio,
            fecha_fin: userWithDetails.suscripciones[0].fecha_fin,
          }
        : null,
    });
  } catch (error) {
    console.error("Error al obtener perfil:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
