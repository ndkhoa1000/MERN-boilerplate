import winston from "winston";
import { consoleFormat } from "winston-console-format";
import { config } from "../config/app.config";

const { combine, timestamp, ms, errors, splat, json, colorize, padLevels } = winston.format; 

const logger = winston.createLogger({
  level: config.LOG_LEVEL || "info",
  format:combine(
        timestamp(),
        ms(),
        errors({ stack: true }),
        splat(),
        json()
      ),
  defaultMeta: { service: "auth-service" },
  transports: [new winston.transports.Console({
      format: combine(
        colorize({ all: true }),
        padLevels(),
        consoleFormat({
          showMeta: true,
          metaStrip: ["timestamp", "service"],
          inspectOptions: {
            depth: Infinity,
            colors: true,
            maxArrayLength: Infinity,
            breakLength: 120,
            compact: Infinity,
          },
        })
      ),
    }),],
});

export default logger;