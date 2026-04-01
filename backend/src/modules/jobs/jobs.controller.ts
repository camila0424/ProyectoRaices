import { Request, Response, NextFunction } from "express";
import { AuthRequest } from "../../middlewares/auth.middleware";
import {
  obtenerEmpleos,
  obtenerEmpleo,
  crearEmpleo,
  obtenerEmpleosDeEmpleador,
} from "./jobs.service";

export async function getEmpleos(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ciudad = req.query.ciudad as string | undefined;
    const sector = req.query.sector as string | undefined;
    const contrato = req.query.contrato as string | undefined;
    const empleos = await obtenerEmpleos({ ciudad, sector, contrato });
    res.json(empleos);
  } catch (error) {
    next(error);
  }
}

export async function getUnEmpleo(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = String(req.params["id"] ?? "");
    const empleo = await obtenerEmpleo(id);
    res.json(empleo);
  } catch (error) {
    next(error);
  }
}

export async function postEmpleo(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const employerId = req.userId!;
    const resultado = await crearEmpleo(employerId, req.body);
    res.status(201).json(resultado);
  } catch (error) {
    next(error);
  }
}

export async function getMisEmpleos(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const employerId = req.userId!;
    const empleos = await obtenerEmpleosDeEmpleador(employerId);
    res.json(empleos);
  } catch (error) {
    next(error);
  }
}