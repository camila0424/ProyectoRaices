import { Router } from "express";
import { getPerfil, getCandidatos, putPerfil } from "./users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/perfil", authMiddleware, getPerfil);
router.put("/perfil", authMiddleware, putPerfil);
router.get("/candidatos", authMiddleware, getCandidatos);

export default router;