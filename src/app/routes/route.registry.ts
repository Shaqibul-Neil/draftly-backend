import type { TRouteModule } from "./route.types";
import { authRouteModule } from "../modules/auth";
import { userRouteModule } from "../modules/users";
import { postsRouteModule } from "../modules/posts";

export const routeRegistry: TRouteModule[] = [
  authRouteModule,
  userRouteModule,
  postsRouteModule,
];
