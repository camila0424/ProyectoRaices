import { Request, Response, NextFunction } from "express";

interface AppError extends Error {
  status?: number;
}

export function errorMiddleware(
  err: AppError,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const status = err.status ?? 500;
  const mensaje = err.message ?? "Error interno del servidor";
  console.error(`[Error ${status}]: ${mensaje}`);
  res.status(status).json({ mensaje });
}