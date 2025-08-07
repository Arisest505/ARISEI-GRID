import express from "express";
import { prisma } from "../lib/prisma";
import * as z from "zod";

const router = express.Router();

const IncidenciaSchema = z.object({
  dni: z.string().min(8),
  nombre_completo: z.string(),
  fecha_nacimiento: z.string().optional(),
  genero: z.string().optional(),
  telefono: z.string().optional(),
  correo: z.string().optional(),

  institucion_nombre: z.string(),
  codigo_modular: z.string().optional(),
  tipo_institucion: z.string(),

  titulo: z.string(),
  descripcion: z.string(),
  tipo_incidencia: z.string(),
  monto_deuda: z.string().optional(),
  fecha_incidencia: z.string(),
  estado_incidencia: z.string(),
  confidencialidad_nivel: z.string(),

  familiar_dni: z.string().optional(),
  familiar_nombre: z.string().optional(),
  tipo_vinculo: z.string().optional(),
  creado_por_usuario_id: z.string(),
});

router.post("/", async (req, res) => {
  const { incidencias } = req.body;

  if (!Array.isArray(incidencias)) {
    return res.status(400).json({ error: "El formato de datos no es válido." });
  }

  let creadas = 0;
  let ignoradas = 0;
  const errores: string[] = [];

  for (const [index, raw] of incidencias.entries()) {
    const parse = IncidenciaSchema.safeParse(raw);
    if (!parse.success) {
      errores.push(`Fila ${index + 1} inválida: ${parse.error.issues.map(i => i.message).join(", ")}`);
      continue;
    }

    const data = parse.data;

    try {
      // Persona
      const persona = await prisma.personaIncidencia.upsert({
        where: { dni: data.dni },
        update: {},
        create: {
          dni: data.dni,
          nombre_completo: data.nombre_completo,
          fecha_nacimiento: data.fecha_nacimiento ? new Date(data.fecha_nacimiento) : undefined,
          genero: data.genero,
          telefono: data.telefono,
          correo: data.correo,
          creado_por_usuario_id: data.creado_por_usuario_id,
        },
      });

      // Institución
      const institucion = await prisma.institucion.upsert({
        where: { codigo_modular: data.codigo_modular || "" },
        update: {},
        create: {
          nombre: data.institucion_nombre,
          codigo_modular: data.codigo_modular || undefined,
          tipo: data.tipo_institucion,
          creado_por_id: data.creado_por_usuario_id,
        },
      });

      // Verificar incidencia existente
      const yaExiste = await prisma.incidencia.findFirst({
        where: {
          persona_id: persona.id,
          titulo: data.titulo,
          fecha_incidencia: new Date(data.fecha_incidencia),
        },
      });

      if (yaExiste) {
        ignoradas++;
        continue;
      }

      // Crear incidencia
      const incidencia = await prisma.incidencia.create({
        data: {
          persona_id: persona.id,
          institucion_id: institucion.id,
          creado_por_usuario_id: data.creado_por_usuario_id,
          titulo: data.titulo,
          descripcion: data.descripcion,
          tipo_incidencia: data.tipo_incidencia,
          monto_deuda: data.monto_deuda ? parseFloat(data.monto_deuda) : undefined,
          fecha_incidencia: new Date(data.fecha_incidencia),
          estado_incidencia: data.estado_incidencia,
          confidencialidad_nivel: data.confidencialidad_nivel,
        },
      });

      // Familiares (si aplica)
      if (data.familiar_dni && data.familiar_nombre && data.tipo_vinculo) {
        const familiar = await prisma.familiar.upsert({
          where: { dni: data.familiar_dni },
          update: {},
          create: {
            dni: data.familiar_dni,
            nombre: data.familiar_nombre,
            telefono: data.telefono,
            correo: data.correo,
          },
        });

        // Evitar crear vínculo duplicado
        const vinculoExiste = await prisma.vinculoFamiliarPersona.findUnique({
          where: {
            familiar_id_persona_id: {
              familiar_id: familiar.id,
              persona_id: persona.id,
            },
          },
        });

        if (!vinculoExiste) {
          await prisma.vinculoFamiliarPersona.create({
            data: {
              familiar_id: familiar.id,
              persona_id: persona.id,
              tipo_vinculo: data.tipo_vinculo,
            },
          });
        }
      }

      creadas++;
    } catch (err: any) {
      errores.push(`Fila ${index + 1}: ${err.message}`);
    }
  }

  return res.json({
    mensaje: `${creadas} incidencia(s) creadas, ${ignoradas} ignoradas por duplicado.`,
    errores,
  });
});

export default router;
