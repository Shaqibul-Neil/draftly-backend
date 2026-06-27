import { TPostStatus, TRole } from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import { generateSlug } from "../../../utils/utils";
import type { IPostDetailResponse, IPostResponse } from "./posts.interface";
import type {
  TCreatePostPayload,
  TUpdatePostPayload,
} from "./posts.validation";
import { POST_DETAILS_INCLUDE, POST_LIST_INCLUDE } from "./posts.constants";
import { mapPost, mapPostDetail } from "./posts.mapper";
import {
  buildCategoryRelations,
  buildTagRelations,
  ensurePostOwner,
  prepareCreatePostMeta,
  prepareUpdatePostMeta,
} from "./posts.helper";

export class PostService {
  //------------------------------------------
  //Create A Post
  //------------------------------------------
  async createPost(
    payload: TCreatePostPayload,
    userId: string,
  ): Promise<IPostResponse> {
    const { categoryIds, tags, ...postData } = payload;

    const { slug, status, publishedAt, tagNames } = prepareCreatePostMeta(
      postData.title,
      postData.status,
      tags,
    );

    const post = await prisma.post.create({
      data: {
        ...postData,
        authorId: userId,
        slug,
        status,
        publishedAt,

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
      orderBy: { createdAt: "desc" },
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
      orderBy: { createdAt: "desc" },
      include: POST_LIST_INCLUDE,
    });

    return posts.map((post) => mapPost(post));
  }

  //------------------------------------------
  //Get Post By Id
  //------------------------------------------
  async getPostById(postId: string): Promise<IPostResponse> {
    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: { totalViews: { increment: 1 } },
      include: POST_DETAILS_INCLUDE,
    });

    return mapPostDetail(updatedPost);
  }

  //------------------------------------------
  //Update A Post
  //------------------------------------------
  async updatePost(
    postId: string,
    payload: TUpdatePostPayload,
    userId: string,
    userRole: TRole,
  ): Promise<IPostDetailResponse> {
    //get the required post
    const existingPost = await prisma.post.findUniqueOrThrow({
      where: { id: postId },
      select: { authorId: true },
    });

    //check the user status
    ensurePostOwner(userId, existingPost.authorId, userRole);

    const { categoryIds, tags, ...postData } = payload;

    const { slug, publishedAt, tagNames } = prepareUpdatePostMeta(
      postData.title,
      postData.status,
      tags,
    );

    const updatedPost = await prisma.post.update({
      where: { id: postId },
      data: {
        ...postData,
        ...(slug && { slug }),
        ...(publishedAt && { publishedAt }),

        ...(categoryIds !== undefined && {
          postCategory: buildCategoryRelations(categoryIds),
        }),

        ...(tagNames !== undefined && {
          postTags: buildTagRelations(tagNames),
        }),
      },
      include: POST_DETAILS_INCLUDE,
    });
    return mapPostDetail(updatedPost);
  }

  //------------------------------------------
  //Delete A Post
  //------------------------------------------
  async deletePost(
    postId: string,
    userId: string,
    userRole: TRole,
  ): Promise<void> {
    //get the required post
    const existingPost = await prisma.post.findUniqueOrThrow({
      where: { id: postId },
      select: { authorId: true },
    });

    //check the user status
    ensurePostOwner(userId, existingPost.authorId, userRole, "delete");

    await prisma.post.delete({ where: { id: postId } });
  }

  //------------------------------------------
  //Delete All Posts
  //------------------------------------------
  async deleteAllPosts() {}

  //------------------------------------------
  //Post Moderate --> post featured or not admin actions
  //------------------------------------------
}

export const postService = new PostService();
