import { Router } from "express";
import { registro, login, googleCallback } from "./auth.controller";
import passport from "../../config/passport";
import { ENV } from "../../config/env";

const router = Router();

router.post("/registro", registro);
router.post("/login", login);

router.get(
  "/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${ENV.FRONTEND_URL}/login?error=google`,
    session: true,
  }),
  googleCallback
);

export default router;