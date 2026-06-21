import express from "express";
import { validateRequest } from "../../../middlewares/validate";
import { registerValidationSchema } from "./auth.validation";
import { authController } from "./auth.controller";

const router = express.Router();

router.post(
  "/register",
  validateRequest(registerValidationSchema),
  authController.register,
);

export const authRoutes = router;
