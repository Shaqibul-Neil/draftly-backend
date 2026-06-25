import { validateRequest } from "../../../middlewares/validate";
import type { TRouteModule } from "../../routes/route.types";
import { protectedRoute } from "../../routes/route-helpers";
import { userController } from "./users.controller";
import { updateProfileSchema } from "./users.validation";

export const userRouteModule: TRouteModule = {
  basePath: "/users",
  routes: [
    {
      method: "get",
      path: "/me",
      middlewares: protectedRoute(),
      handler: userController.getMyProfile,
      name: "users.getMyProfile",
      description: "Get the authenticated user's basic profile.",
      tags: ["Users"],
    },
    {
      method: "get",
      path: "/me/profile",
      middlewares: protectedRoute(),
      handler: userController.getFullProfile,
      name: "users.getFullProfile",
      description: "Get the authenticated user's full profile.",
      tags: ["Users"],
    },
    {
      method: "patch",
      path: "/me/update-profile",
      middlewares: protectedRoute(validateRequest(updateProfileSchema)),
      handler: userController.updateMyProfile,
      name: "users.updateMyProfile",
      description: "Update the authenticated user's profile.",
      tags: ["Users"],
    },
  ],
};
