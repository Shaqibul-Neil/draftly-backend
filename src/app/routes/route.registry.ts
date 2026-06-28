import type { TRouteModule } from "./route.types";
import { authRouteModule } from "../modules/auth";
import { userRouteModule } from "../modules/users";
import { postsRouteModule } from "../modules/posts";
import { statsRouteModule } from "../modules/stats";

export const routeRegistry: TRouteModule[] = [
  authRouteModule,
  userRouteModule,
  postsRouteModule,
  statsRouteModule,
];
