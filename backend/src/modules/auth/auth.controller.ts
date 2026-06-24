import { Request, Response, NextFunction } from "express";
import { registrarUsuario, loginUsuario } from "./auth.service";
import { ENV } from "../../config/env";

export async function registro(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resultado = await registrarUsuario(req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const resultado = await loginUsuario(req.body);
    res.json(resultado);
  } catch (error) {
    next(error);
  }
}

export function googleCallback(req: Request, res: Response): void {
  const user = req.user as { token?: string; id?: string; nombre?: string; correo?: string; rol?: string; _isDuplicate?: boolean };

  if (user._isDuplicate) {
    res.redirect(`${ENV.FRONTEND_URL}/auth/callback?error=duplicate_email`);
    return;
  }

  const params = new URLSearchParams({
    token: user.token!,
    id: user.id!,
    nombre: user.nombre!,
    correo: user.correo!,
    rol: user.rol!,
  });
  res.redirect(`${ENV.FRONTEND_URL}/auth/callback?${params.toString()}`);
}