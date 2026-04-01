import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  obtenerPerfil,
  obtenerCandidatosDisponibles,
  actualizarPerfil,
} from "./users.service";

export async function getPerfil(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const perfil = await obtenerPerfil(userId);
    res.json(perfil);
  } catch (error) {
    next(error);
  }
}

export async function getCandidatos(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ciudad = req.query.ciudad as string | undefined;
    const candidatos = await obtenerCandidatosDisponibles(ciudad);
    res.json(candidatos);
  } catch (error) {
    next(error);
  }
}

export async function putPerfil(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const userId = req.userId!;
    const perfil = await actualizarPerfil(userId, req.body);
    res.json(perfil);
  } catch (error) {
    next(error);
  }
}