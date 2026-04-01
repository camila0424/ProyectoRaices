import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";
import authRoutes from "./modules/auth/auth.routes";
import usersRoutes from "./modules/users/users.routes";
import jobsRoutes from "./modules/jobs/jobs.routes";
import applicationsRoutes from "./modules/applications/applications.routes";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();

const app = express();
const PORT = process.env.PORT ?? 3001;

app.use(cors({ origin: "http://localhost:5173" }));
app.use(express.json());

// Rutas
app.use("/api/auth", authRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/jobs", jobsRoutes);
app.use("/api/applications", applicationsRoutes);

// Health check
app.get("/health", async (_req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "conectada" });
  } catch {
    res.status(500).json({ status: "error", database: "sin conexión" });
  }
});

// Manejo de errores
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});