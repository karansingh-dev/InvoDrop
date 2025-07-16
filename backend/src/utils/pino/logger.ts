// src/utils/logger.ts
import pino from "pino";
import path from "path";
import { config } from "../../config/config";
import fs from "fs";

// Set destination path

const logDir = path.join(process.cwd(), "logs");
const logFilePath = path.join(logDir, "server.log");

// Make sure the directory exists
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir, { recursive: true });
}

const isProd = config.NODE_ENV === "production";

const logger = isProd
  ? pino(
      {
        level: "info",
        timestamp: pino.stdTimeFunctions.isoTime,
      },
      pino.destination(logFilePath)
    )
  : pino({
      transport: {
        target: "pino-pretty",
        options: {
          colorize: true,
          translateTime: "SYS:standard",
          ignore: "pid,hostname",
        },
      },
      level: "debug",
    });

export default logger;
