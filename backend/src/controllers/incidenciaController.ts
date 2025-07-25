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
        nombre_completo: persona.nombre_completo,
        telefono: persona.telefono,
        correo: persona.correo,
        imagen_url: persona.imagen_url,
        notas_adicionales: persona.notas_adicionales,
      },
      create: {
        nombre_completo: persona.nombre_completo,
        dni: persona.dni,
        fecha_nacimiento: persona.fecha_nacimiento ? new Date(persona.fecha_nacimiento) : null,
        genero: persona.genero,
        telefono: persona.telefono,
        correo: persona.correo,
        imagen_url: persona.imagen_url,
        notas_adicionales: persona.notas_adicionales,
        creado_por_usuario_id: usuario_id,
      },
    });

    // 2. Crear o recuperar institución (solo si hay código modular)
    let institucionCreada = null;
    if (institucion && institucion.codigo_modular) {
      institucionCreada = await prisma.institucion.upsert({
        where: { codigo_modular: institucion.codigo_modular },
        update: {
          nombre: institucion.nombre,
          tipo: institucion.tipo,
          ubicacion: institucion.ubicacion,
        },
        create: {
          nombre: institucion.nombre,
          tipo: institucion.tipo,
          ubicacion: institucion.ubicacion,
          codigo_modular: institucion.codigo_modular,
          creado_por_id: usuario_id,
        },
      });
    }

    // 3. Crear la incidencia principal
    const incidenciaCreada = await prisma.incidencia.create({
      data: {
        titulo: incidencia.titulo,
        descripcion: incidencia.descripcion,
        tipo_incidencia: incidencia.tipo_incidencia,
        monto_deuda: incidencia.monto_deuda ? Number(incidencia.monto_deuda) : null,
        fecha_incidencia: incidencia.fecha_incidencia
          ? new Date(incidencia.fecha_incidencia)
          : new Date(),
        estado_incidencia: incidencia.estado_incidencia || "Pendiente",
        confidencialidad_nivel: incidencia.confidencialidad_nivel || "Privado",
        adjuntos_url: incidencia.adjuntos_url || null,
        persona_id: personaCreada.id,
        institucion_id: institucionCreada?.id || null,
        creado_por_usuario_id: usuario_id,
      },
    });

   // 4. Crear familiares y vincularlos
    for (const fam of familiares || []) {
    if (!fam.dni || !fam.nombre || !fam.tipo_vinculo) continue;

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
            tipo_vinculo: fam.tipo_vinculo,
        },
        });
    } else {
        await prisma.vinculoFamiliarPersona.create({
        data: {
            familiar_id: familiar.id,
            persona_id: personaCreada.id,
            tipo_vinculo: fam.tipo_vinculo,
        },
        });
    }
    }

    return res.status(201).json({
      mensaje: "✅ Incidencia registrada correctamente.",
      incidencia_id: incidenciaCreada.id,
    });
  } catch (error) {
    console.error("[❌ ERROR crearIncidenciaCompleta]", error);
    return res.status(500).json({ error: "Error interno al registrar la incidencia." });
  }
};

