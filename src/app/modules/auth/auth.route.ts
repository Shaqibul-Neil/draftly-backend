import express from "express";
import { validateRequest } from "../../../middlewares/validate";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation";
import { authController } from "./auth.controller";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.register,
);
router.post(
  "/login",
  validateRequest(loginValidationSchema),
  authController.login,
);

export const authRoutes = router;
