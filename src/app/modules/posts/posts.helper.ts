import httpStatus from "http-status";
import { TPostStatus, TRole } from "../../../../generated/prisma/enums";
import { AppError } from "../../../utils/appError";
import { generateSlug, removeDuplicate } from "../../../utils/utils";
import type { IGetPostsParams, TPostSortField } from "./posts.interface";
import type { Prisma } from "../../../../generated/prisma/client";

// Throws 403 if non-admin tries to update/delete a post they don't own
export const ensurePostOwner = (
  userId: string,
  authorId: string | null,
  userRole: TRole,
  type: "update" | "delete" = "update",
): void => {
  if (userRole !== TRole.ADMIN && authorId !== userId) {
    throw new AppError(
      `Not authorized to ${type} this post`,
      httpStatus.FORBIDDEN,
      `You can only ${type} your own posts`,
    );
  }
};

// Generates slug, resolves default status, deduplicates tags, sets publishedAt for PUBLISHED posts
export const prepareCreatePostMeta = (
  title: string,
  status?: TPostStatus,
  tags?: string[],
) => {
  const resolvedStatus = status ?? TPostStatus.PUBLISHED;
  return {
    slug: generateSlug(title),
    status: resolvedStatus,
    tagNames: tags ? removeDuplicate(tags) : [],
    publishedAt: resolvedStatus === TPostStatus.PUBLISHED ? new Date() : null,
  };
};

// Regenerates slug if title changes, sets publishedAt only when status flips to PUBLISHED
export const prepareUpdatePostMeta = (
  title?: string,
  status?: TPostStatus,
  tags?: string[],
) => {
  return {
    slug: title ? generateSlug(title) : undefined,
    tagNames: tags !== undefined ? removeDuplicate(tags) : undefined,
    publishedAt: status === TPostStatus.PUBLISHED ? new Date() : undefined,
  };
};

// Builds Prisma relation input for categories — deleteMany first ensures full replace on update
export const buildCategoryRelations = (categoryIds?: string[]) => {
  if (categoryIds === undefined) return undefined;

  return {
    deleteMany: {},
    ...(categoryIds.length > 0 && {
      create: categoryIds.map((categoryId) => ({
        categoryId,
      })),
    }),
  };
};

// Builds Prisma relation input for tags — connectOrCreate ensures tag reuse across posts
export const buildTagRelations = (tagNames?: string[]) => {
  if (tagNames === undefined) return undefined;

  return {
    deleteMany: {},
    ...(tagNames.length > 0 && {
      create: tagNames.map((name) => ({
        tag: {
          connectOrCreate: {
            where: { name },
            create: {
              name,
              slug: generateSlug(name),
            },
          },
        },
      })),
    }),
  };
};

// Builds reusable Prisma query args (where/orderBy/skip/take) from filter params.
// Pass baseWhere to pin caller-specific conditions (e.g. authorId, isFeatured).
export const buildPostQueryArgs = (
  params: IGetPostsParams,
  baseWhere: Prisma.PostWhereInput = {},
) => {
  const {
    search,
    status,
    visibility,
    startDate,
    endDate,
    sortBy,
    sortOrder = "desc",
    page = 1,
    limit = 10,
  } = params;

  const where: Prisma.PostWhereInput = { ...baseWhere };
  if (search) {
    where.OR = [
      { title: { contains: search, mode: "insensitive" } },
      { content: { contains: search, mode: "insensitive" } },
    ];
  }
  if (status) where.status = status;
  if (visibility) where.visibility = visibility;

  if (startDate || endDate) {
    where.createdAt = {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    };
  }

  const SORT_MAP: Record<TPostSortField, Prisma.PostOrderByWithRelationInput> =
    {
      totalViews: { totalViews: sortOrder },
      totalComments: { comments: { _count: sortOrder } },
      totalLikes: { postLike: { _count: sortOrder } },
      totalShares: { totalShares: sortOrder },
      totalReadingTimeMinutes: { totalReadingTimeMinutes: sortOrder },
    };

  const orderBy: Prisma.PostOrderByWithRelationInput = sortBy
    ? SORT_MAP[sortBy]
    : { createdAt: sortOrder };

  return { where, orderBy, skip: (page - 1) * limit, take: limit, page, limit };
};
