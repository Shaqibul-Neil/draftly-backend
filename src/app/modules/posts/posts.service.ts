import httpStatus from "http-status";
import { TPostStatus } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/appError";
import { generateSlug, removeDuplicate } from "../../../utils/utils";
import type { IPostResponse } from "./posts.interface";
import type { TCreatePostPayload } from "./posts.validation";
import { POST_DETAILS_INCLUDE, POST_LIST_INCLUDE } from "./posts.constants";
import { mapPost, mapPostDetail } from "./posts.mapper";

export class PostService {
  //------------------------------------------
  //Create A Post
  //------------------------------------------
  async createPost(
    payload: TCreatePostPayload,
    userId: string,
  ): Promise<IPostResponse> {
    const { categoryIds, tags, ...postData } = payload;

    const slug = generateSlug(postData.title);

    const finalStatus = postData.status ?? TPostStatus.PUBLISHED;

    const tagNames = removeDuplicate(tags);

    const post = await prisma.post.create({
      data: {
        ...postData,
        authorId: userId,
        slug,
        status: finalStatus,
        publishedAt: finalStatus === TPostStatus.PUBLISHED ? new Date() : null,

        ...(categoryIds?.length && {
          postCategory: {
            create: categoryIds.map((categoryId) => ({ categoryId })),
          },
        }),

        ...(tagNames.length && {
          postTags: {
            create: tagNames.map((name) => ({
              tag: {
                connectOrCreate: {
                  where: { name },
                  create: { name, slug: generateSlug(name) },
                },
              },
            })),
          },
        }),
      },
      include: POST_LIST_INCLUDE,
    });
    return mapPost(post);
  }

  //------------------------------------------
  //Get All Post
  //------------------------------------------
  async getPosts(): Promise<IPostResponse[]> {
    const posts = await prisma.post.findMany({
      include: POST_LIST_INCLUDE,
    });

    return posts.map((post) => mapPost(post));
  }

  //------------------------------------------
  //Get Post Stats
  //------------------------------------------
  async getPostStats() {}

  //------------------------------------------
  //Get My Posts
  //------------------------------------------
  async getMyPosts(userId: string): Promise<IPostResponse[]> {
    const posts = await prisma.post.findMany({
      where: { authorId: userId },
      include: POST_LIST_INCLUDE,
    });

    return posts.map((post) => mapPost(post));
  }

  //------------------------------------------
  //Get Post By Id
  //------------------------------------------
  async getPostById(postId: string): Promise<IPostResponse> {
    // const post = await prisma.post.findUnique({
    //   where: { id: postId },
    //   include: POST_INCLUDE,
    // });

    // if (!post)
    //   throw new AppError(
    //     "Post Not Found",
    //     httpStatus.NOT_FOUND,
    //     "No post found with the provided ID.",
    //   );

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { totalViews: { increment: 1 } },
      include: POST_DETAILS_INCLUDE,
    });

    return mapPostDetail(updatedPost);
  }
  //------------------------------------------
  //Delete All Posts
  //------------------------------------------
  async deleteAllPosts() {}

  //------------------------------------------
  //Update Post
  //------------------------------------------
  async updatePost() {}

  //------------------------------------------
  //Delete Post
  //------------------------------------------
  async deletePost() {}
}

export const postService = new PostService();
