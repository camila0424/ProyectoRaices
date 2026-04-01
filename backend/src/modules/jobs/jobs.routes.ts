import { Router } from "express";
import {
  getEmpleos,
  getUnEmpleo,
  postEmpleo,
  getMisEmpleos,
} from "./jobs.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get("/", getEmpleos);
router.get("/mis-empleos", authMiddleware, getMisEmpleos);
router.get("/:id", getUnEmpleo);
router.post("/", authMiddleware, postEmpleo);

export default router;