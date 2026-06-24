import { Request, Response, NextFunction } from "express";
import { obtenerCiudades, obtenerCiudadPorId } from "./cities.service";

export async function getCiudades(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const ciudades = await obtenerCiudades();
    res.json(ciudades);
  } catch (error) {
    next(error);
  }
}

export async function getCiudadById(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      res.status(400).json({ error: "ID inválido" });
      return;
    }
    const ciudad = await obtenerCiudadPorId(id);
    if (!ciudad) {
      res.status(404).json({ error: "Ciudad no encontrada" });
      return;
    }
    res.json(ciudad);
  } catch (error) {
    next(error);
  }
}