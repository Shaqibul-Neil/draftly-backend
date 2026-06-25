import { Router } from "express";
import type { TRouteConfig } from "./route.types";

export const buildRouter = (routes: TRouteConfig[]) => {
  const router = Router();
  routes.forEach(({ method, path, middlewares = [], handler }) => {
    router[method](path, ...middlewares, handler);
  });
  return router;
};
//router["post"](path, ...middlewares, handler);
//router.post(
//   "/signup",
//   validateRequest(signupValidationSchema),
//   authControllers.signUp,
// );
