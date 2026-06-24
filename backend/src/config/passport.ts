import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { ENV } from "./env";
import { findOrCreateGoogleUser } from "../modules/auth/auth.service";

passport.use(
  new GoogleStrategy(
    {
      clientID: ENV.GOOGLE_CLIENT_ID,
      clientSecret: ENV.GOOGLE_CLIENT_SECRET,
      callbackURL: ENV.GOOGLE_CALLBACK_URL,
      passReqToCallback: true,
    },
    async (req: any, _accessToken: string, _refreshToken: string, profile: any, done: any) => {
      try {
        const state = (req.query?.state as string) ?? "";
        const [rawRole, rawIntent] = state.split(":");
        const defaultRole = rawRole === "employer" ? "employer" : "worker";
        const intent = rawIntent === "registro" ? "registro" : "login";
        const user = await findOrCreateGoogleUser(profile, defaultRole, intent);
        done(null, user);
      } catch (error: any) {
        if (error?.status === 409) {
          done(null, { _isDuplicate: true });
        } else {
          done(error as Error, undefined);
        }
      }
    }
  )
);

// Serialize/deserialize only used during the OAuth handshake redirect
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user as Express.User));

export default passport;
