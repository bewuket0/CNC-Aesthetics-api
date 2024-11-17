import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import validator from "express-validator";
import cors from "cors";
import timeout from "connect-timeout";
import cron from "node-cron";
import chalk from "chalk";

import mongoDB from "./mongoDB/mongoDB";
import router from "./api";
import authenticate from "./lib/authenticate";
import initConfig from "./config";

// Load Environment Variables

dotenv.config();

// Handle Unhandled Rejections and Exceptions

process.on("unhandledRejection", (reason: string, p: Promise<any>) => {
  console.error("Unhandled Rejection at:", p, "reason:", reason);
});

process.on("uncaughtException", (error: Error) => {
  console.error(`Caught exception: ${error}\nException origin: ${error.stack}`);
});

// Database Connection

void mongoDB.connect();

// Initialize Express Application

const app = express();

// Middleware Setup
app.use(express.json());
app.use(timeout("30s"));
app.use(validator());
app.use(
  cors({
    origin: "*",
    methods: ["OPTIONS", "GET", "PUT", "PATCH", "POST", "DELETE"],
    allowedHeaders: [
      "Accept",
      "Content-Type",
      "access-control-allow-origin",
      "x-api-applicationid",
      "authorization",
    ],
  })
);

// Hit Count Middleware

// Authentication Middleware

// API Routes
router(app);
app.use(
  authenticate().unless({
    path: [
      "/v1.0/cncaestheticsapi/auth/healthcheck",
      "/v1.0/cncaestheticsapi/auth/login",
    ],
  })
);

// Error Handling Middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error("Error:", err);
  return res.status(500).json({ message: err.message });
});
// Start Server

try {
  app.listen(initConfig._port, () => {
    console.log(
      chalk.blue.italic(`Server listening on port ${initConfig._port}`)
    );
  });
  setTimeout(() => {
    try {
    } catch (error) {
      console.error("Error during initialization tasks:", error);
    }
  }, 3000);
} catch (error) {
  console.error("Failed to load configuration and start the server:", error);
}

export default app;
