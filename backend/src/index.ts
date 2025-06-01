import "dotenv/config";
import express, {NextFunction,Request,Response } from "express";
import cors from "cors";
import session from "express-session";
import { config } from "./config/app.config";
import connectDatabase from "./config/database.config";
import { HTTPSTATUS } from "./config/http.config";
import { errorHandler } from "./middlewares/errorHandler.middleware";
import { asyncHandler } from "./middlewares/asyncHandler.middleware";

import "./config/passport.config";
import passport from "passport";
import authRoutes from "./routes/auth.route";
import userRoutes from "./routes/user.route";
import { isAuthenticated } from "./middlewares/isAuthenticated.middleware";
import { passportAuthenticateIWT } from "./config/passport.config";
import morgan from "morgan";
import logger from "./utils/logger";

const app = express();
const BASE_PATH = config.BASE_PATH;

app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({extended:true}));
app.use(passport.initialize());
app.use(
    cors({
        origin:config.FRONTEND_ORIGIN,
        credentials:true,
    })
);
app.get('/', asyncHandler(async (req: Request, res: Response,next: NextFunction) => {
        res.status(HTTPSTATUS.OK).json({
            message:"Welcome to home page",
        });
    })
);

app.use(`${BASE_PATH}/auth`, authRoutes);
app.use(`${BASE_PATH}/user`,passportAuthenticateIWT, userRoutes);

//error Handler should be the last middleware
app.use(errorHandler); 
app.listen(config.PORT, async() => {
    logger.info(`server listening on port ${config.PORT} in ${config.NODE_ENV}`)
    await connectDatabase();
});