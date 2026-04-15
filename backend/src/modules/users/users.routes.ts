import { Router } from "express";
import { getPerfil, getCandidatos, putPerfil, deleteUser } from "./users.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/perfil", authMiddleware, getPerfil);
router.put("/perfil", authMiddleware, putPerfil);
router.get("/candidatos", authMiddleware, getCandidatos);
router.delete("/:id", authMiddleware, deleteUser);

export default router;