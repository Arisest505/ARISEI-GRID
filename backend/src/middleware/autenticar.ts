import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import dotenv from "dotenv";
dotenv.config(); // Asegura que process.env.JWT_SECRET esté disponible

// Definir una versión extendida del Request
interface AuthenticatedRequest extends Request {
  usuario?: {
    id: string;
    rol_id: string;
  };
}

export const autenticar = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Token no proporcionado" });
  }

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no definido en el entorno");
    }

    const payload: any = jwt.verify(token, secret);

    // Token debe incluir un objeto usuario con id y rol
    const usuarioId = payload.usuario?.id;
    const rolId = payload.usuario?.rol;

    if (!usuarioId || !rolId) {
      return res.status(401).json({ error: "Token inválido o malformado" });
    }

    const usuario = await prisma.usuario.findUnique({
      where: { id: usuarioId },
    });

    if (!usuario) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }

    req.usuario = {
      id: usuario.id,
      rol_id: usuario.rol_id,
    };

    next();
  } catch (err) {
    console.error("Error al verificar el token:", err);
    return res.status(401).json({ error: "Token inválido" });
  }
};
