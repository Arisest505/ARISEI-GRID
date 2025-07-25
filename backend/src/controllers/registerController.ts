// src/controllers/auth/registerController.ts
import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid";
import { prisma } from "../lib/prisma";
 // ajusta esta ruta si tu alias no apunta correctamente

export const registerUser = async (req: Request, res: Response) => {
  const {
    email,
    password,
    firstName,
    lastName,
    dni,
    phone,
    user, // nickname
  } = req.body;

  try {
    // Validación básica
    if (!email || !password || !firstName || !lastName || !dni || !user) {
      return res.status(400).json({ error: "Faltan campos obligatorios." });
    }

    // Buscar duplicados
    const existingUser = await prisma.usuario.findFirst({
      where: {
        OR: [
          { email },
          { usuario: user },
          { dni },
        ],
      },
    });

    if (existingUser) {
      return res.status(409).json({ error: "El correo, DNI o usuario ya está registrado." });
    }

    // Hash de contraseña
    const password_hash = await bcrypt.hash(password, 12);

    // Crear usuario con rol por defecto: "Usuario"
    const nuevoUsuario = await prisma.usuario.create({
      data: {
        email,
        password_hash,
        nombre: firstName,
        apellidos: lastName,
        dni,
        telefono: phone,
        usuario: user,
        codigo_usuario: uuidv4(),
        rol: {
          connect: { nombre: "Usuario" }, // asegúrate que este rol existe
        },
      },
      select: {
        id: true,
        email: true,
        usuario: true,
        nombre: true,
        apellidos: true,
        rol: {
          select: { nombre: true },
        },
      },
    });

    return res.status(201).json({
      message: "Usuario registrado exitosamente.",
      user: nuevoUsuario,
    });

  } catch (error) {
    console.error("[ERROR REGISTRO]:", error);
    return res.status(500).json({ error: "Error interno del servidor." });
  }
};
