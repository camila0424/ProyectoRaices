import dotenv from "dotenv";
dotenv.config();

export const ENV = {
  PORT: process.env.PORT ?? "3001",
  DB_HOST: process.env.DB_HOST ?? "localhost",
  DB_PORT: Number(process.env.DB_PORT ?? 3306),
  DB_USER: process.env.DB_USER ?? "root",
  DB_PASSWORD: process.env.DB_PASSWORD ?? "",
  DB_NAME: process.env.DB_NAME ?? "raices_db",
  JWT_SECRET: process.env.JWT_SECRET ?? "secreto",
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN ?? "7d",
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID ?? "",
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET ?? "",
  GOOGLE_CALLBACK_URL: process.env.GOOGLE_CALLBACK_URL ?? "http://localhost:3001/api/auth/google/callback",
  FRONTEND_URL: process.env.FRONTEND_URL ?? "http://localhost:5173",
};