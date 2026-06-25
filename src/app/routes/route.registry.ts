import type { TRouteModule } from "./route.types";
import { authRouteModule } from "../modules/auth";
import { userRouteModule } from "../modules/users";

export const routeRegistry: TRouteModule[] = [authRouteModule, userRouteModule];
