import httpStatus from "http-status";
import type { TRequest, TResponse } from "../../../types/express.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import { postService, type PostService } from "./posts.service";
import type { TCreatePostPayload } from "./posts.validation";

class PostController {
  constructor(private postService: PostService) {}
  //Create a Post
  createPost = asyncHandler(async (req: TRequest, res: TResponse) => {
    const payload = req.body as TCreatePostPayload;
    const post = await this.postService.createPost(
      payload,
      req.user.id as string,
    );
    sendResponse({
      res,
      status: httpStatus.CREATED,
      success: true,
      message: "Post created successfully",
      data: post,
    });
  });

  //Get All Post
  getAllPosts = asyncHandler(async (req: TRequest, res: TResponse) => {
    const posts = await this.postService.getPosts();
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  });

  //Get Post Stats
  getPostStats = asyncHandler(async (req: TRequest, res: TResponse) => {});

  //Get My Posts
  getMyPosts = asyncHandler(async (req: TRequest, res: TResponse) => {
    const userId = req.user.id as string;
    const posts = await this.postService.getMyPosts(userId);
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  });

  //Get Post By Id
  getPostById = asyncHandler(async (req: TRequest, res: TResponse) => {
    const { postId } = req.params as { postId: string };
    const post = await this.postService.getPostById(postId);
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Post fetched successfully",
      data: post,
    });
  });

  //Delete All Posts
  deleteAllPosts = asyncHandler(async (req: TRequest, res: TResponse) => {});

  //Update Post
  updatePost = asyncHandler(async (req: TRequest, res: TResponse) => {});

  //Delete Post
  deletePost = asyncHandler(async (req: TRequest, res: TResponse) => {});
}
export const postController = new PostController(postService);
