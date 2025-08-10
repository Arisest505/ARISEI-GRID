import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

/**
 * Crea una incidencia completa con persona afectada, institución y familiares.
 */
export const crearIncidenciaCompleta = async (req: Request, res: Response) => {
  const { persona, institucion, incidencia, familiares, usuario_id } = req.body;

  if (!usuario_id || !persona || !incidencia) {
    return res.status(400).json({ error: "Faltan datos obligatorios." });
  }

  try {
    // 1. Crear o recuperar persona afectada
    const personaCreada = await prisma.personaIncidencia.upsert({
      where: { dni: persona.dni },
      update: {
        nombre_completo: persona.nombreCompleto,
        telefono: persona.telefono,
        correo: persona.correo,
        imagen_url: persona.imagenUrl,
        notas_adicionales: persona.notasAdicionales,
      },
      create: {
        nombre_completo: persona.nombreCompleto,
        dni: persona.dni,
        fecha_nacimiento: persona.fechaNacimiento ? new Date(persona.fechaNacimiento) : null,
        genero: persona.genero,
        telefono: persona.telefono,
        correo: persona.correo,
        imagen_url: persona.imagenUrl,
        notas_adicionales: persona.notasAdicionales,
        creado_por_usuario_id: usuario_id,
      },
    });

    // 2. Crear o recuperar institución (solo si hay código modular)
    let institucionCreada = null;
    if (institucion && institucion.codigoModular) {
      institucionCreada = await prisma.institucion.upsert({
        where: { codigo_modular: institucion.codigoModular },
        update: {
          nombre: institucion.nombre,
          tipo: institucion.tipo,
          ubicacion: institucion.ubicacion,
        },
        create: {
          nombre: institucion.nombre,
          tipo: institucion.tipo,
          ubicacion: institucion.ubicacion,
          codigo_modular: institucion.codigoModular,
          creado_por_id: usuario_id,
        },
      });
    }

    // 3. Crear la incidencia principal
    const incidenciaCreada = await prisma.incidencia.create({
      data: {
        titulo: incidencia.titulo,
        descripcion: incidencia.descripcion,
        tipo_incidencia: incidencia.tipoIncidencia,
        monto_deuda: incidencia.montoDeuda ? Number(incidencia.montoDeuda) : null,
        fecha_incidencia: incidencia.fechaIncidencia
          ? new Date(incidencia.fechaIncidencia)
          : new Date(),
        estado_incidencia: incidencia.estadoIncidencia || "Pendiente",
        confidencialidad_nivel: incidencia.confidencialidadNivel || "Privado",
        adjuntos_url: incidencia.adjuntosUrl || null,
        persona_id: personaCreada.id,
        institucion_id: institucionCreada?.id || null,
        creado_por_usuario_id: usuario_id,
      },
    });

    // 4. Crear familiares y vincularlos
    for (const fam of familiares || []) {
      if (!fam.dni || !fam.nombre || !fam.tipoVinculo) continue;

      const familiar = await prisma.familiar.upsert({
        where: { dni: fam.dni },
        update: {
          nombre: fam.nombre,
          telefono: fam.telefono,
          correo: fam.correo,
        },
        create: {
          dni: fam.dni,
          nombre: fam.nombre,
          telefono: fam.telefono || null,
          correo: fam.correo || null,
        },
      });

      const vinculoExistente = await prisma.vinculoFamiliarPersona.findFirst({
        where: {
          familiar_id: familiar.id,
          persona_id: personaCreada.id,
        },
      });

      if (vinculoExistente) {
        await prisma.vinculoFamiliarPersona.update({
          where: { id: vinculoExistente.id },
          data: {
            tipo_vinculo: fam.tipoVinculo,
          },
        });
      } else {
        await prisma.vinculoFamiliarPersona.create({
          data: {
            familiar_id: familiar.id,
            persona_id: personaCreada.id,
            tipo_vinculo: fam.tipoVinculo,
          },
        });
      }
    }

    return res.status(201).json({
      mensaje: "Incidencia registrada correctamente.",
      incidencia_id: incidenciaCreada.id,
    });
  } catch (error) {
    console.error("[ERROR crearIncidenciaCompleta]", error);
    return res.status(500).json({ error: "Error interno al registrar la incidencia." });
  }
};