import { Request, Response, NextFunction } from "express";
import { registrarUsuario, loginUsuario } from "./auth.service";

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