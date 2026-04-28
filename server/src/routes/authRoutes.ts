import { Router } from "express";
import { login, refresh, logout } from "../controllers/authControllers.js";
import loginLimiter from "../middlewares/loginLimiter.js";

const router = Router();

router.route("/").post(loginLimiter, login);
router.route("/refresh").get(refresh);
router.route("/logout").post(logout);

export default router;
