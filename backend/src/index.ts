import express from "express";
import cors from "cors";
import authRoutes from "./routes/auth";
import incidenciaRoutes from "./routes/incidencias";
import listarIncidenciasRoutes from "./routes/listarincidencias";
import autocompleteRoutes from "./routes/autocomplete";
import detalleIncidenciaRouter from "./routes/detalleincidencia";
import modulos from "./routes/modulos";
import configuracionRoutes from "./routes/configuracion"; // <-- NUEVO
import accesos from "./routes/accesos";
import pagosRouter from "./routes/pagosRouter";
import planesRouter from "./routes/planesRouter";
import suscripcionesRouter from "./routes/suscripcionesRouter";


const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  credentials: true,
}));

app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/incidencias", incidenciaRoutes);
app.use("/api/listarincidencias", listarIncidenciasRoutes);
app.use("/api/autocomplete", autocompleteRoutes);
app.use("/api/foro/incidencia", detalleIncidenciaRouter);
app.use("/api/modulos", modulos);
app.use("/api", configuracionRoutes); // <-- NUEVO
app.use("/api/accesos", accesos);
app.use("/api/pagos", pagosRouter);
app.use("/api/planes", planesRouter);
app.use("/api/suscripciones", suscripcionesRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
