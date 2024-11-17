import { type Express } from "express";

import authRoutes from "./routes/auth.routes";
export default function initRoutes(app: Express): void {
  app.use("/v1.0/cncaestheticsapi/auth", authRoutes);
}
