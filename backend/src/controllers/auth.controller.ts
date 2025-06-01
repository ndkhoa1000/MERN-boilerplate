import {NextFunction, Request, Response} from 'express';
import { asyncHandler } from "../middlewares/asyncHandler.middleware";
import { registerSchema } from '../validation/auth.validation';
import { HTTPSTATUS } from '../config/http.config';
import { registerService } from '../services/auth.service';
import passport from 'passport';
import { config } from '../config/app.config';
import { signJwtToken } from '../utils/jwt';
import logger from '../utils/logger';

// OAuth
export const googleLoginCallback = asyncHandler(
    async(req: Request, res: Response) => {
        const jwt = req.jwt;
    if(!jwt){
        return res.redirect(
            `${config.FRONTEND_ORIGIN}?status=failure`
        )
    }
    return res.redirect(
            `${config.FRONTEND_ORIGIN}?status=success&access_token=${jwt}`
        )
})

// register new local user
export const registerController = asyncHandler
(async(req: Request, res: Response) => {
    const body = registerSchema.parse({
        ...req.body,
    });
    await registerService(body);
    return res.status(HTTPSTATUS.CREATED).json({
        message: "User created successfully.",
    })
})
//local login
export const loginController = asyncHandler(
(async(req: Request, res: Response, next: NextFunction) => {
   passport.authenticate("local", (
    err: Error | null, 
    user: Express.User | false,
    info: {message: string} | undefined,
    ) => {
        if (err) {
            return next(err);
        }
        if(!user){
            return res.status(HTTPSTATUS.UNAUTHORIZED).json({
                message: info?.message || "Invalid email or password."
            })
        }
        // req.logIn(user, (err) => {
        //     if(err){
        //         return next(err);
        //     }
            
        //     return res.status(HTTPSTATUS.OK).json({
        //         message: "Logged in successfully.",
        //         user,
        //     });
        // });

        const access_token = signJwtToken({userId:user._id})
        return res.status(HTTPSTATUS.OK).json({
            message: "Logged in successfully.",
            access_token,
            user,
        });
    })(req, res, next)
})
)
//logout
export const logoutController = asyncHandler(
    async(req: Request, res: Response) => {
    // Client-side is responsible for deleting the JWT.
    // If you implement refresh tokens, you would invalidate the refresh token here.
    // For example, by removing it from the database for the logged-in user.
    // e.g., await invalidateRefreshTokenForUser(req.user._id);

    // If you implement an access token denylist, add the current token to it.
    // e.g., await addToDenylist(req.token); // Assuming req.token holds the JWT

    // For now, we just acknowledge.
    // The actual "logout" happens when the client discards the token.
    logger.info(`User logout initiated for user ID: ${req.user?._id || 'Unknown'}`);
    res.status(HTTPSTATUS.OK).json({ message: "You are trying to Logout in server. Please clear your token on the client-side." });
    }
)
// get current user profile