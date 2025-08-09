import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

//  1. Obtener todas las incidencias creadas por un usuario
export const getIncidenciasUsuario = async (req: Request, res: Response) => {
  const { id } = req.params; // id del usuario

  try {
    const incidencias = await prisma.incidencia.findMany({
      where: { creado_por_usuario_id: id },
      orderBy: { fecha_creacion: "desc" },
      include: {
        institucion: true,
        persona: true,
      },
    });

    res.json(incidencias);
  } catch (error) {
    console.error("Error al obtener incidencias:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//  2. Obtener detalle completo de una incidencia
export const getDetalleIncidenciaUsuario = async (req: Request, res: Response) => {
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
        email: incidencia.creador.email,
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
    console.error("Error al obtener detalle:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
};

//  3. Editar una incidencia (si pertenece al usuario)
export const editarIncidenciaUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;

  try {
    const existe = await prisma.incidencia.findUnique({ where: { id } });
    if (!existe) return res.status(404).json({ error: "Incidencia no encontrada" });

    const {
      titulo,
      descripcion,
      tipo_incidencia,
      estado_incidencia,
      confidencialidad_nivel,
      adjuntos_url,
      monto_deuda,
      fecha_incidencia,
    } = req.body || {};

    const data: any = { fecha_actualizacion: new Date() };

    if (typeof titulo === "string") data.titulo = titulo.trim();
    if (typeof descripcion === "string") data.descripcion = descripcion.trim();
    if (typeof tipo_incidencia === "string") data.tipo_incidencia = tipo_incidencia.trim();
    if (typeof estado_incidencia === "string") data.estado_incidencia = estado_incidencia.trim();
    if (typeof confidencialidad_nivel === "string") data.confidencialidad_nivel = confidencialidad_nivel.trim();
    if (typeof adjuntos_url === "string") data.adjuntos_url = adjuntos_url.trim();

    if (monto_deuda !== undefined) {
      if (monto_deuda === "" || monto_deuda === null) data.monto_deuda = null;
      else {
        const num = Number(monto_deuda);
        if (!Number.isNaN(num)) data.monto_deuda = num;
      }
    }

    if (fecha_incidencia !== undefined) {
      if (!fecha_incidencia) data.fecha_incidencia = null;
      else {
        const d = new Date(fecha_incidencia);
        if (!isNaN(d.getTime())) data.fecha_incidencia = d;
      }
    }

    const actualizada = await prisma.incidencia.update({ where: { id }, data });

    // Devuelve el mismo shape que tu GET (si lo necesitas así)
    // OJO: esto hace otra lectura para “armar” el JSON igual
    const detalle = await prisma.incidencia.findUnique({
      where: { id },
      include: {
        institucion: true,
        persona: {
          include: {
            vinculos: { include: { familiar: true } },
          },
        },
        creador: true,
      },
    });

    return res.json({
      id: detalle!.id,
      titulo: detalle!.titulo,
      descripcion: detalle!.descripcion,
      tipo_incidencia: detalle!.tipo_incidencia,
      monto_deuda: detalle!.monto_deuda,
      fecha_incidencia: detalle!.fecha_incidencia,
      estado_incidencia: detalle!.estado_incidencia,
      confidencialidad_nivel: detalle!.confidencialidad_nivel,
      adjuntos_url: detalle!.adjuntos_url,
      fecha_creacion: detalle!.fecha_creacion,
      fecha_actualizacion: detalle!.fecha_actualizacion,
      creador: {
        id: detalle!.creador.id,
        nombre: detalle!.creador.nombre,
        email: detalle!.creador.email,
      },
      institucion: detalle!.institucion && {
        id: detalle!.institucion.id,
        nombre: detalle!.institucion.nombre,
        ubicacion: detalle!.institucion.ubicacion,
        tipo: detalle!.institucion.tipo,
        codigo_modular: detalle!.institucion.codigo_modular,
        fecha_registro: detalle!.institucion.fecha_registro,
      },
      persona: {
        id: detalle!.persona.id,
        nombre_completo: detalle!.persona.nombre_completo,
        dni: detalle!.persona.dni,
        fecha_nacimiento: detalle!.persona.fecha_nacimiento,
        genero: detalle!.persona.genero,
        telefono: detalle!.persona.telefono,
        correo: detalle!.persona.correo,
        imagen_url: detalle!.persona.imagen_url,
        notas_adicionales: detalle!.persona.notas_adicionales,
        vinculos: detalle!.persona.vinculos.map((v) => ({
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
  } catch (error: any) {
    console.error("Error al editar incidencia:", error);
    return res.status(500).json({ error: "Error al editar incidencia", detalle: error?.message });
  }
};

// Asegúrate de que la conexión con Prisma esté configurada correctamente

export const eliminarIncidenciaUsuario = async (req: Request, res: Response) => {
  const { id } = req.params;
  console.log("Recibiendo solicitud para eliminar la incidencia con ID:", id); // Verifica el ID recibido

  try {
    const inc = await prisma.incidencia.findUnique({ where: { id } });

    if (!inc) {
      console.log("Incidencia no encontrada con ID:", id); // Verifica si la incidencia existe
      return res.status(404).json({ error: "Incidencia no encontrada" });
    }

    await prisma.incidencia.delete({ where: { id } });

    console.log("Incidencia eliminada con ID:", id); // Verifica si la eliminación fue exitosa
    return res.json({ mensaje: "Incidencia eliminada correctamente" });
  } catch (error: any) {
    console.error("Error al eliminar incidencia:", error);
    return res.status(500).json({ error: "Error al eliminar incidencia", detalle: error?.message });
  }
};
