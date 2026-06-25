import { Router } from "express";
import type { TApiVersion } from "./route.types";
import { buildRouter } from "./registerRoutes";
import { routeRegistry } from "./route.registry";

const DEFAULT_VERSION: TApiVersion = "v1";

const router = Router();

routeRegistry.forEach(({ basePath, routes, version = DEFAULT_VERSION }) =>
  router.use(`/${version}${basePath}`, buildRouter(routes)),
);

export const mountedPaths = routeRegistry.map(
  ({ basePath, version = DEFAULT_VERSION }) => `/api/${version}${basePath}`,
);

export default router;
