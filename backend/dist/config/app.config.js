"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const get_env_1 = require("../utils/get-env");
// WARN: env might not read, so when deployment, need debug for ensure env can be read smoothly.
const appConfig = () => ({
    NODE_ENV: (0, get_env_1.getEnv)("NODE_ENV", "development"),
    PORT: (0, get_env_1.getEnv)("PORT", "5000"),
    BASE_PATH: (0, get_env_1.getEnv)("BASE_PATH", "/api"),
    MONGO_URI: (0, get_env_1.getEnv)("MONGO_URI", "mongodb://localhost:27017/express-mongo"),
    SESSION_SECRET: (0, get_env_1.getEnv)("SESSION_SECRET", "some_secret_key"),
    SESSION_EXPIRE_IN: (0, get_env_1.getEnv)("SESSION_EXPIRE_IN", "1D"),
    GOOGLE_CLIENT_ID: (0, get_env_1.getEnv)("GOOGLE_CLIENT_ID", "some_id"),
    GOOGLE_CLIENT_SECRET: (0, get_env_1.getEnv)("GOOGLE_CLIENT_SECRET", "some_secret"),
    GOOGLE_CALLBACK_URL: (0, get_env_1.getEnv)("GOOGLE_CALLBACK_URL", "http://localhost:8000/api/auth/google/callback"),
    FRONTEND_ORIGIN: (0, get_env_1.getEnv)("FRONTEND_ORIGIN", "http://localhost:5173"),
    FRONTEND_GOOGLE_CALLBACK_URL: (0, get_env_1.getEnv)("FRONTEND_GOOGLE_CALLBACK_URL", "http://localhost:5173/google/oauth/callback"),
});
exports.config = appConfig();
