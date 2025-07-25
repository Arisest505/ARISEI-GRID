// src/routes/auth.ts
import { Router } from "express";
import { loginUser } from "../controllers/loginController";
import { registerUser } from "../controllers/registerController";
import { autenticar } from "../middleware/autenticar"; 
import { getPerfilUsuario } from "../controllers/auth";

const router = Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/me", autenticar, getPerfilUsuario);

export default router;
