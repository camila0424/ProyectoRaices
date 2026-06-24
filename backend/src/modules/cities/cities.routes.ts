import { Router } from "express";
import { getCiudades, getCiudadById } from "./cities.controller";

const router = Router();

router.get("/", getCiudades);
router.get("/:id", getCiudadById);

export default router;