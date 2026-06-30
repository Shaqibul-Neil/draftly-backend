import type { TRouteModule } from "./route.types";
import { authRouteModule } from "../modules/auth";
import { userRouteModule } from "../modules/users";
import { postsRouteModule } from "../modules/posts";
import { statsRouteModule } from "../modules/stats";
import { subscriptionRouteModule } from "../modules/subscription";

export const routeRegistry: TRouteModule[] = [
  authRouteModule,
  userRouteModule,
  subscriptionRouteModule,
  postsRouteModule,
  statsRouteModule,
];
