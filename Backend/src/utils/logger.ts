//A basic logger that logs to console and files. It logs errors to error.log and everything else to combined.log. It also logs the timestamp of the log.

import { createLogger, format, transports } from "winston";

const logger = createLogger({
  level: "info",
  format: format.combine(
    format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    format.errors({ stack: true }),
    format.json()
  ),
  transports: [
    new transports.Console({ format: format.simple() }), // Logs to console
    new transports.File({ filename: "logs/error.log", level: "error" }), // Logs errors to file
    new transports.File({ filename: "logs/combined.log" }), // Logs everything
  ],
});

export default logger;
