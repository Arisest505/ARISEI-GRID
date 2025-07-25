import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

export const getDetalleIncidencia = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const incidencia = await prisma.incidencia.findUnique({
      where: { id },
      include: {
        institucion: true,
        persona: {
          include: {
            vinculos: {
              include: {
                familiar: true
              }
            }
          }
        },
        creador: true,
      },
    });

    if (!incidencia) {
      return res.status(404).json({ error: "Incidencia no encontrada" });
    }

    res.json({
      id: incidencia.id,
      titulo: incidencia.titulo,
      descripcion: incidencia.descripcion,
      tipo_incidencia: incidencia.tipo_incidencia,
      monto_deuda: incidencia.monto_deuda,
      fecha_incidencia: incidencia.fecha_incidencia,
      estado_incidencia: incidencia.estado_incidencia,
      confidencialidad_nivel: incidencia.confidencialidad_nivel,
      adjuntos_url: incidencia.adjuntos_url,
      fecha_creacion: incidencia.fecha_creacion,
      fecha_actualizacion: incidencia.fecha_actualizacion,

        creador: {
        id: incidencia.creador.id,
        nombre: incidencia.creador.nombre,
        email: incidencia.creador.email, //  este es el campo correcto según Prisma
        },


      institucion: incidencia.institucion && {
        id: incidencia.institucion.id,
        nombre: incidencia.institucion.nombre,
        ubicacion: incidencia.institucion.ubicacion,
        tipo: incidencia.institucion.tipo,
        codigo_modular: incidencia.institucion.codigo_modular,
        fecha_registro: incidencia.institucion.fecha_registro,
      },

      persona: {
        id: incidencia.persona.id,
        nombre_completo: incidencia.persona.nombre_completo,
        dni: incidencia.persona.dni,
        fecha_nacimiento: incidencia.persona.fecha_nacimiento,
        genero: incidencia.persona.genero,
        telefono: incidencia.persona.telefono,
        correo: incidencia.persona.correo,
        imagen_url: incidencia.persona.imagen_url,
        notas_adicionales: incidencia.persona.notas_adicionales,

        vinculos: incidencia.persona.vinculos.map((v) => ({
          id: v.id,
          tipo_vinculo: v.tipo_vinculo,
          fecha_creacion: v.fecha_creacion,
          familiar: {
            id: v.familiar.id,
            dni: v.familiar.dni,
            nombre: v.familiar.nombre,
            telefono: v.familiar.telefono,
            correo: v.familiar.correo,
          },
        })),
      },
    });
  } catch (error) {
    console.error("Error al obtener incidencia:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};
