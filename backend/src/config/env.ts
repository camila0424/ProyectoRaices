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
};