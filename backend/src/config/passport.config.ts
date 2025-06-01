import { Request } from "express";
import { config } from "./app.config";
import { ProviderEnum } from "../enums/account-provider.enums";
import { NotFoundException } from "../utils/appError";

import passport, { Profile } from "passport";
import { Strategy as GoogleStrategy} from "passport-google-oauth20";
import {Strategy as LocalStrategy} from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt, StrategyOptions } from "passport-jwt";

import { findUserByIdService, loginOrCreateAccountService, verifyUserService } from "../services/auth.service";
import { signJwtToken } from "../utils/jwt";
import { UserDocument } from "../models/user.model";
import logger from "../utils/logger";

passport.use( new GoogleStrategy({
        clientID: config.GOOGLE_CLIENT_ID,
        clientSecret:config.GOOGLE_CLIENT_SECRET,
        callbackURL:config.GOOGLE_CALLBACK_URL,
        scope: ["profile", "email"],
        passReqToCallback:true,
    }, async (req: Request, accessToken, refreshToken, profile, done) => {
        try {
            const { email, sub: googleId, picture } = (profile as any)._json;
            logger.info(`New user [${profile.displayName}] Log in via Google:`);
            // logger.info('googleId', googleId);
            if(!googleId){
                throw new NotFoundException("Google ID (sub) is missing");
            };
            const { user } = await loginOrCreateAccountService({
                provider: ProviderEnum.GOOGLE,
                displayName: profile.displayName,
                providerId: googleId,
                picture: picture,
                email: email,
            });
            const jwt = signJwtToken({userId: user._id});
            req.jwt = jwt;
            done(null, user);
        } catch (error) {
            done(error, false);
        }
    }
    )
);

passport.use(new LocalStrategy({
  usernameField: "email",
  passwordField: "password",
  session:false
},async (email, password, done) =>{
    try {
        const user = await verifyUserService({email, password});
        return done(null, user as UserDocument);
} catch (error: any) {
        return done(error, false, {message: error.message})
    }
}));

interface JwtPayload{
    userId:string;
}

const options: StrategyOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: config.JWT_SECRET,
    audience:["user"],
    algorithms:["HS256"],
};

passport.use(
    new JwtStrategy(options, async (payload: JwtPayload, done) => {
        try {
            const user = await findUserByIdService(payload.userId)
            // logger.info("checking user:",user)
            if (!user) {            
                return done(null, false)
            }
            return done(null, user)
        } catch (error) {
            return done(error, false)
        }
    })
)

passport.serializeUser((user:any, done) => done(null, user));
passport.deserializeUser((user:any, done) => done(null, user));

export const passportAuthenticateIWT = passport.authenticate("jwt",{
    session: false,
})