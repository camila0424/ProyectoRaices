import { Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  aplicarEmpleo,
  obtenerMisCandidaturas,
  obtenerCandidaturasDeEmpleo,
} from "./applications.service";

export async function postAplicar(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workerId = req.userId!;
    const { jobId, nota } = req.body as { jobId: string; nota?: string };
    const resultado = await aplicarEmpleo(workerId, jobId, nota);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function getMisCandidaturas(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const workerId = req.userId!;
    const candidaturas = await obtenerMisCandidaturas(workerId);
    res.json(candidaturas);
  } catch (error) {
    next(error);
  }
}

export async function getCandidaturasEmpleo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const employerId = req.userId!;
    const jobId = String(req.params["jobId"] ?? "");
    const candidaturas = await obtenerCandidaturasDeEmpleo(jobId, employerId);
    res.json(candidaturas);
  } catch (error) {
    next(error);
  }
}