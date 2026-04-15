import { Router } from "express";
import { registro, login, googleCallback } from "./auth.controller";
import passport from "../../config/passport";
import { ENV } from "../../config/env";

const router = Router();

router.post("/registro", registro);
router.post("/login", login);

router.get("/google", (req, res, next) => {
  const rol = (req.query.rol as string) ?? "worker";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    state: rol,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${ENV.FRONTEND_URL}/login?error=google`,
    session: true,
  }),
  googleCallback
);

export default router;