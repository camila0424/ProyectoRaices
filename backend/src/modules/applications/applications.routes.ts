import { Router } from "express";
import {
  postAplicar,
  getMisCandidaturas,
  getCandidaturasEmpleo,
} from "./applications.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.post("/", authMiddleware, postAplicar);
router.get("/mis-candidaturas", authMiddleware, getMisCandidaturas);
router.get("/empleo/:jobId", authMiddleware, getCandidaturasEmpleo);

export default router;