// src/index.ts
import "dotenv/config"; // Carga variables de entorno (.env)
import express, { Request, Response, NextFunction } from "express";
import cors from "cors";

// Rutas
import authRoutes from "./routes/auth";
import incidenciaRoutes from "./routes/incidencias";
import listarIncidenciasRoutes from "./routes/listarincidencias";
import autocompleteRoutes from "./routes/autocomplete";
import detalleIncidenciaRouter from "./routes/detalleincidencia";
import modulos from "./routes/modulos";
import configuracionRoutes from "./routes/configuracion";
import accesos from "./routes/accesos";
import pagosRouter from "./routes/pagosRouter";
import planesRouter from "./routes/planesRouter";
import suscripcionesRouter from "./routes/suscripcionesRouter";
import cargaMasivaRouter from "./routes/cargaMasiva";
import roles from "./routes/roles";
import userViewRoutes from "./routes/userViewRoutes";

// (Opcional, pero recomendado en prod)
// import helmet from "helmet";
// import compression from "compression";

const app = express();

// Si vas detrás de un proxy (Render, Railway, Nginx), habilita esto
app.set("trust proxy", 1);

/**
 * CORS: usa una allowlist por ENV, así no te quedas con localhost en prod.
 * Ejemplo de ENV:
 *   CORS_ORIGIN="http://localhost:5173,https://tu-frontend.vercel.app"
 */
const allowList = (process.env.CORS_ORIGIN ?? "http://localhost:5173")
  .split(",")
  .map(s => s.trim());

const corsOptions: cors.CorsOptions = {
  origin(origin, cb) {
    // Permite requests sin origin (p.ej. healthchecks) o que estén en la lista
    if (!origin || allowList.includes(origin)) return cb(null, true);
    cb(new Error("Not allowed by CORS"));
  },
  credentials: true,
  // Asegura preflight correcto
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

app.use(cors(corsOptions));

// (Opcional prod)
// app.use(helmet());
// app.use(compression());

// Body parsers con límites razonables
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

// Healthcheck (para Render/Railway)
app.get("/health", (_req, res) => res.status(200).send("ok"));

// ---- RUTAS API ----
app.use("/api/auth", authRoutes);
app.use("/api/incidencias", incidenciaRoutes);
app.use("/api/listarincidencias", listarIncidenciasRoutes);
app.use("/api/autocomplete", autocompleteRoutes);
app.use("/api/foro/incidencia", detalleIncidenciaRouter);
app.use("/api/modulos", modulos);
app.use("/api", configuracionRoutes);
app.use("/api/accesos", accesos);
app.use("/api/pagos", pagosRouter);
app.use("/api/planes", planesRouter);
app.use("/api/suscripciones", suscripcionesRouter);
app.use("/api/incidencias/carga-masiva", cargaMasivaRouter);
app.use("/api/roles", roles);
app.use("/api/usuario", userViewRoutes);

// 404 controlado para rutas que no existen (solo bajo /api/*)
app.use("/api", (_req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Manejador global de errores (Express 5)
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  // Log básico; en prod podrías integrar un logger
  console.error("[GLOBAL_ERROR]", err);
  const status = err.statusCode || err.status || 500;
  const message =
    typeof err === "string"
      ? err
      : err.message || "Error interno del servidor";
  res.status(status).json({ error: message });
});

// PORT dinámico para PaaS
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor listo en :${PORT} (env=${process.env.NODE_ENV || "dev"})`);
});
