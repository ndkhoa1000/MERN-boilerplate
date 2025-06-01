"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const express_session_1 = __importDefault(require("express-session"));
const app_config_1 = require("./config/app.config");
const database_config_1 = __importDefault(require("./config/database.config"));
const http_config_1 = require("./config/http.config");
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
const asyncHandler_middleware_1 = require("./middlewares/asyncHandler.middleware");
require("./config/passport.config");
const passport_1 = __importDefault(require("passport"));
const auth_route_1 = __importDefault(require("./routes/auth.route"));
const user_route_1 = __importDefault(require("./routes/user.route"));
const isAuthenticated_middleware_1 = require("./middlewares/isAuthenticated.middleware");
const organization_route_1 = __importDefault(require("./routes/organization.route"));
const program_route_1 = __importDefault(require("./routes/program.route"));
const event_route_1 = __importDefault(require("./routes/event.route"));
const enum_route_1 = __importDefault(require("./routes/enum.route"));
const attendance_route_1 = __importDefault(require("./routes/attendance.route"));
const app = (0, express_1.default)();
const BASE_PATH = app_config_1.config.BASE_PATH;
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, express_session_1.default)({
    name: "session",
    resave: false,
    saveUninitialized: false,
    secret: app_config_1.config.SESSION_SECRET,
    cookie: {
        maxAge: 24 * 60 * 60 * 1000, //24h
        secure: app_config_1.config.NODE_ENV === "production",
        httpOnly: true,
        sameSite: "lax"
    },
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, cors_1.default)({
    origin: app_config_1.config.FRONTEND_ORIGIN,
    credentials: true,
}));
app.get('/', (0, asyncHandler_middleware_1.asyncHandler)(async (req, res, next) => {
    res.status(http_config_1.HTTPSTATUS.OK).json({
        message: "Welcome to home page",
    });
}));
app.use(`${BASE_PATH}/auth`, auth_route_1.default);
app.use(`${BASE_PATH}/user`, isAuthenticated_middleware_1.isAuthenticated, user_route_1.default);
app.use(`${BASE_PATH}/organization`, isAuthenticated_middleware_1.isAuthenticated, organization_route_1.default);
app.use(`${BASE_PATH}/program`, isAuthenticated_middleware_1.isAuthenticated, program_route_1.default);
app.use(`${BASE_PATH}/event`, isAuthenticated_middleware_1.isAuthenticated, event_route_1.default);
app.use(`${BASE_PATH}/attendance`, isAuthenticated_middleware_1.isAuthenticated, attendance_route_1.default);
app.use(`${BASE_PATH}/enums`, enum_route_1.default);
//error Handler should be the last middleware
app.use(errorHandler_middleware_1.errorHandler);
app.listen(app_config_1.config.PORT, async () => {
    console.log(`server listening on port ${app_config_1.config.PORT} in ${app_config_1.config.NODE_ENV}`);
    await (0, database_config_1.default)();
});
