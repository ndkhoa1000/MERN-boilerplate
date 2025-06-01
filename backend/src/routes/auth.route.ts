import { Router } from "express";
import passport from "passport";
import { config } from "../config/app.config";
import { googleLoginCallback, loginController, logoutController, registerController } from "../controllers/auth.controller";

const authRoutes = Router();
const failedURL = `${config.FRONTEND_GOOGLE_CALLBACK_URL}?status=failure`

// google OAuth routes
authRoutes.get(
    "/google", 
    passport.authenticate("google", {
        scope:["profile", "email"],
        session:false,
    })
);

authRoutes.get(
    "/google/callback",
    passport.authenticate("google", {
        failureRedirect: failedURL,
        session:false,
    }),
    googleLoginCallback
);
//local authentication route
authRoutes.post("/register",registerController);
authRoutes.post("/login", loginController);
authRoutes.post("/logout",logoutController);

//user profile 
authRoutes.get("/me");
export default authRoutes;

