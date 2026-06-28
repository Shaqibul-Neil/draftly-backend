import { TRole } from "../../../../generated/prisma/enums";
import { validateRequest } from "../../../middlewares/validate";
import { protectedRoute, roleRoute } from "../../routes/route-helpers";
import type { TRouteModule } from "../../routes/route.types";
import { postController } from "./posts.controller";
import {
  createPostValidationSchema,
  postIdParamValidationSchema,
  updatePostValidationSchema,
} from "./posts.validation";

export const postsRouteModule: TRouteModule = {
  basePath: "/posts",
  routes: [
    {
      method: "get",
      path: "/",
      handler: postController.getAllPosts,
      name: "posts.getAllPosts",
      description: "Get All Posts",
      tags: ["Posts"],
    },
    {
      method: "post",
      path: "/",
      middlewares: roleRoute(
        [TRole.ADMIN, TRole.AUTHOR],
        validateRequest(createPostValidationSchema),
      ),
      handler: postController.createPost,
      name: "posts.createPost",
      description: "Create A Post",
      tags: ["Posts"],
    },
    {
      method: "get",
      path: "/my-posts",
      middlewares: protectedRoute(),
      handler: postController.getMyPosts,
      name: "posts.getMyPosts",
      description: "Get Current User Posts",
      tags: ["Posts"],
    },
    {
      method: "delete",
      path: "/all-posts",
      middlewares: roleRoute([TRole.ADMIN]),
      handler: postController.deleteAllPosts,
      name: "posts.deleteAllPosts",
      description: "Delete All Posts",
      tags: ["Posts"],
    },
    {
      method: "get",
      path: "/:postId",
      middlewares: [validateRequest(postIdParamValidationSchema)],
      handler: postController.getPostById,
      name: "posts.getPostById",
      description: "Get A Single Post",
      tags: ["Posts"],
    },
    {
      method: "patch",
      path: "/:postId",
      middlewares: roleRoute(
        [TRole.ADMIN, TRole.AUTHOR],
        validateRequest(postIdParamValidationSchema),
        validateRequest(updatePostValidationSchema),
      ),
      handler: postController.updatePost,
      name: "posts.updatePost",
      description: "Update A Post",
      tags: ["Posts"],
    },
    {
      method: "delete",
      path: "/:postId",
      middlewares: roleRoute(
        [TRole.ADMIN, TRole.AUTHOR],
        validateRequest(postIdParamValidationSchema),
      ),
      handler: postController.deletePost,
      name: "posts.deletePost",
      description: "Delete A Post",
      tags: ["Posts"],
    },
  ],
};
