import type { TRouteModule } from "../../routes/route.types";
import { protectedRoute } from "../../routes/route-helpers";
import { subscriptionController } from "./subscription.controller";

export const subscriptionRouteModule: TRouteModule = {
  basePath: "/subscription",
  routes: [
    {
      method: "post",
      path: "/checkout",
      middlewares: protectedRoute(),
      handler: subscriptionController.checkoutSession,
    },
  ],
};
