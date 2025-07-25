import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "../lib/prisma";
import dotenv from "dotenv";
dotenv.config(); // Asegura que JWT_SECRET esté cargado

export const loginUser = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario por correo o nickname
    const user = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email: email },
          { usuario: email },
        ],
      },
    });

    if (!user) {
      return res.status(401).json({ error: "Credenciales inválidas." });
    }

    if (!user.activo) {
      return res.status(403).json({ error: "Usuario desactivado." });
    }

    // Verificar contraseña
    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) {
      return res.status(401).json({ error: "Contraseña incorrecta." });
    }

    const secret = process.env.JWT_SECRET;
    if (!secret) {
      throw new Error("JWT_SECRET no definido en el entorno");
    }

    // Crear JWT con estructura compatible con el middleware
    const token = jwt.sign(
      {
        usuario: {
          id: user.id,
          rol: user.rol_id,
        },
      },
      secret,
      { expiresIn: "7d" }
    );

    const { password_hash, ...userData } = user;

    res.status(200).json({
      message: "Login exitoso",
      token,
      user: userData,
    });
  } catch (error) {
    console.error("[ERROR LOGIN]:", error);
    res.status(500).json({ error: "Error del servidor al iniciar sesión" });
  }
};
