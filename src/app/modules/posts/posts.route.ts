import type { TRouteModule } from "../../routes/route.types";

export const postsRouteModule: TRouteModule = {
  basePath: "/posts",
  routes: [
    {
      method: "get",
      path: "/all-posts",
      middlewares: [],
      // handler: posts.get,
      name: "posts.getAllPosts",
      description: "Get All Posts",
      tags: ["Posts"],
    },
  ],
};
