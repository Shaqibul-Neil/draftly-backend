import httpStatus from "http-status";
import type { TRequest, TResponse } from "../../../types/express.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import { postService, type PostService } from "./posts.service";
import type {
  TCreatePostPayload,
  TUpdatePostPayload,
} from "./posts.validation";
import type {
  TPostStatus,
  TPostVisibility,
  TRole,
} from "../../../../generated/prisma/enums";
import type { IGetPostsParams, TPostSortField } from "./posts.interface";

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
    const params: IGetPostsParams = {
      page: req.query.page as number | undefined,
      limit: req.query.limit as number | undefined,
      search: req.query.search as string | undefined,
      status: req.query.status as TPostStatus | undefined,
      visibility: req.query.visibility as TPostVisibility | undefined,
      sortBy: req.query.sortBy as TPostSortField | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
      startDate: req.query.startDate as Date | undefined,
      endDate: req.query.endDate as Date | undefined,
    };

    const posts = await this.postService.getPosts(params);

    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Posts fetched successfully",
      data: posts,
    });
  });

  //Get My Posts
  getMyPosts = asyncHandler(async (req: TRequest, res: TResponse) => {
    const userId = req.user.id as string;
    const params: IGetPostsParams = {
      page: req.query.page as number | undefined,
      limit: req.query.limit as number | undefined,
      search: req.query.search as string | undefined,
      status: req.query.status as TPostStatus | undefined,
      visibility: req.query.visibility as TPostVisibility | undefined,
      sortBy: req.query.sortBy as TPostSortField | undefined,
      sortOrder: req.query.sortOrder as "asc" | "desc" | undefined,
      startDate: req.query.startDate as Date | undefined,
      endDate: req.query.endDate as Date | undefined,
    };

    const posts = await this.postService.getMyPosts(userId, params);
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

  //Update Post
  updatePost = asyncHandler(async (req: TRequest, res: TResponse) => {
    const { postId } = req.params as { postId: string };
    const payload = req.body as TUpdatePostPayload;
    const userId = req.user.id as string;
    const userRole = req.user.role as TRole;

    const post = await this.postService.updatePost(
      postId,
      payload,
      userId,
      userRole,
    );

    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Post updated successfully",
      data: post,
    });
  });

  //Delete Post
  deletePost = asyncHandler(async (req: TRequest, res: TResponse) => {
    const { postId } = req.params as { postId: string };
    const userId = req.user.id as string;
    const userRole = req.user.role as TRole;

    await this.postService.deletePost(postId, userId, userRole);
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Post deleted successfully",
      data: null,
    });
  });

  //Delete All Posts
  deleteAllPosts = asyncHandler(async (req: TRequest, res: TResponse) => {});
}
export const postController = new PostController(postService);
