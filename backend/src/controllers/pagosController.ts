// controllers/pagosController.ts
import { Request, Response } from "express";
import { prisma } from "../lib/prisma";

// Tipado extendido para acceso a `req.usuario`
interface AuthenticatedRequest extends Request {
  usuario?: {
    id: string;
    rol_id: string;
  };
}

export const obtenerPagosPendientes = async (req: Request, res: Response) => {
  try {
    const pagos = await prisma.pago.findMany({
      where: { estado_pago: "pendiente" },
      include: {
        usuario: {
          select: { id: true, nombre: true, email: true, codigo_usuario: true },
        },
      },
      orderBy: { fecha_pago: "desc" },
    });
    res.status(200).json(pagos);
  } catch (error) {
    console.error("[PAGOS_PENDIENTES]", error);
    res.status(500).json({ error: "Error al obtener pagos." });
  }
};

export const obtenerPlanes = async (req: Request, res: Response) => {
  try {
    const planes = await prisma.plan.findMany({
      where: { es_activo: true },
      select: { id: true, nombre: true, precio: true, duracion_meses: true },
    });
    res.status(200).json(planes);
  } catch (error) {
    console.error("[OBTENER_PLANES]", error);
    res.status(500).json({ error: "No se pudieron obtener los planes." });
  }
};

export const aprobarPago = async (req: Request, res: Response) => {
  const { pagoId, usuarioId, planId } = req.body;
  const contadorId = (req as AuthenticatedRequest).usuario?.id;

  if (!pagoId || !usuarioId || !planId) {
    return res.status(400).json({ error: "Datos incompletos." });
  }

  try {
    const plan = await prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) return res.status(404).json({ error: "Plan no encontrado." });

    const fechaInicio = new Date();
    const fechaFin = new Date();
    fechaFin.setMonth(fechaFin.getMonth() + plan.duracion_meses);

    const suscripcion = await prisma.suscripcionUsuario.create({
      data: {
        usuario_id: usuarioId,
        
        plan_id: planId,
        fecha_inicio: fechaInicio,
        fecha_fin: fechaFin,
        estado: "activo",
        metodo_activacion: "manual",
        activado_por_usuario_id: contadorId,
        fecha_activacion: new Date(),
        es_renovable_automaticamente: false,
        
      },
    });

    await prisma.pago.update({
      where: { id: pagoId },
      data: {
        estado_pago: "completado",
        suscripcion_id: suscripcion.id,
        recibido_por_usuario_id: contadorId,
        monto_pagado: plan.precio,
      },
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("[APROBAR_PAGO]", error);
    res.status(500).json({ error: "No se pudo aprobar el pago." });
  }
};

export const obtenerPagosCompletados = async (req: Request, res: Response) => {
  try {
    const pagos = await prisma.pago.findMany({
      where: { estado_pago: "completado" },
      include: {
        usuario: { select: { nombre: true, email: true, codigo_usuario: true } },
        recibido_por_usuario: { select: { nombre: true } },
      },
      orderBy: { fecha_pago: "desc" },
    });

    res.status(200).json(pagos);
  } catch (error) {
    console.error("[GET /pagos/completados]", error);
    res.status(500).json({ error: "Error al obtener pagos completados." });
  }
};

export const solicitarActivacion = async (req: Request, res: Response) => {
  const { nombreUsuario, codigoUsuario } = req.body;

  if (!nombreUsuario || !codigoUsuario) {
    return res.status(400).json({ error: "Nombre y código requeridos." });
  }

  try {
    const usuario = await prisma.usuario.findFirst({
      where: {
        nombre: nombreUsuario,
        codigo_usuario: codigoUsuario,
      },
    });

    if (!usuario) {
      return res.status(404).json({ error: "Usuario no encontrado." });
    }

    const nuevoPago = await prisma.pago.create({
      data: {
        usuario_id: usuario.id,
        codigo_usuario_ingresado: codigoUsuario,
        monto_pagado: 0,
        estado_pago: "pendiente",
        metodo_pago: "QR",
        medio_verificado: false,
      },
    });

    return res.status(201).json({ success: true, id: nuevoPago.id });
  } catch (error) {
    console.error("[SOLICITAR_ACTIVACION]", error);
    return res.status(500).json({ error: "Error al registrar la solicitud." });
  }
};

export const confirmarPago = async (req: AuthenticatedRequest, res: Response) => {
  const { id } = req.params;
  const verificadorId = req.usuario?.id;

  try {
    const pago = await prisma.pago.findUnique({
      where: { id },
      include: { usuario: true },
    });

    if (!pago) {
      return res.status(404).json({ error: "Pago no encontrado." });
    }

    // 1. Confirmar el pago
    const pagoActualizado = await prisma.pago.update({
      where: { id },
      data: {
        medio_verificado: true,
        estado_pago: "completado",
        recibido_por_usuario_id: verificadorId,
      },
    });

    // 2. Obtener ID del rol "Usuario-PRO"
    const rolPRO = await prisma.rol.findUnique({
      where: { nombre: "Usuario-PRO" },
    });

    if (!rolPRO) {
      return res.status(500).json({ error: "Rol 'Usuario-PRO' no encontrado." });
    }

    // 3. Si el usuario tiene el rol actual "Usuario", actualizar a "Usuario-PRO"
    const rolUsuario = await prisma.rol.findUnique({
      where: { nombre: "Usuario" },
    });

    if (pago.usuario.rol_id === rolUsuario?.id) {
      await prisma.usuario.update({
        where: { id: pago.usuario.id },
        data: {
          rol_id: rolPRO.id,
        },
      });
    }

    return res.status(200).json({
      message: "Pago confirmado y rol actualizado correctamente.",
      pago: pagoActualizado,
    });
  } catch (error) {
    console.error("[CONFIRMAR_PAGO]", error);
    return res.status(500).json({ error: "No se pudo confirmar el pago." });
  }
};
