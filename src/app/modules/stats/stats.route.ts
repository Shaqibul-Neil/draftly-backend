import { TRole } from "../../../../generated/prisma/enums";
import { roleRoute } from "../../routes/route-helpers";
import type { TRouteModule } from "../../routes/route.types";
import { statsController } from "./stats.controller";

export const statsRouteModule: TRouteModule = {
  basePath: "/stats",
  routes: [
    {
      method: "get",
      path: "/posts",
      middlewares: roleRoute([TRole.ADMIN, TRole.AUTHOR]),
      handler: statsController.getPostStats,
      name: "stats.getPostStats",
      description: "Get Post Statistics (role-based)",
      tags: ["Stats"],
    },
  ],
};
