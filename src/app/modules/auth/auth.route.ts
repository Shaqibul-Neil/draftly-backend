import { loginLimiter } from "../../../middlewares/rateLimiter";
import { validateRequest } from "../../../middlewares/validate";
import type { TRouteModule } from "../../routes/route.types";
import { authController } from "./auth.controller";
import {
  loginValidationSchema,
  registerValidationSchema,
} from "./auth.validation";

export const authRouteModule: TRouteModule = {
  basePath: "/auth",
  routes: [
    {
      method: "post",
      path: "/register",
      middlewares: [validateRequest(registerValidationSchema)],
      handler: authController.register,
      name: "auth.register",
      description: "Register a new user account.",
      tags: ["Auth"],
    },
    {
      method: "post",
      path: "/login",
      middlewares: [loginLimiter, validateRequest(loginValidationSchema)],
      handler: authController.login,
      name: "auth.login",
      description: "Authenticate a user and issue access/refresh tokens.",
      tags: ["Auth"],
    },
    {
      method: "post",
      path: "/refresh-token",
      handler: authController.refreshToken,
      name: "auth.refreshToken",
      description: "Issue a new access token from a valid refresh token.",
      tags: ["Auth"],
    },
  ],
};
