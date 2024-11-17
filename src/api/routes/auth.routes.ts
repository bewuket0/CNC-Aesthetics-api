import { Router } from "express";
import authController from "../../controller/auth.controller";

const router = Router();

router.get("/healthcheck", authController.healthcheck);
router.post("/login", authController.login);
router.post("/register", authController.registerUser);
// router.post('/forgot-password', authController.login)

export default router;
