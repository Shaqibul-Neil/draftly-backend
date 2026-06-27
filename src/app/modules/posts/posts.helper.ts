import httpStatus from "http-status";
import { TPostStatus, TRole } from "../../../../generated/prisma/enums";
import { AppError } from "../../../utils/appError";
import { generateSlug, removeDuplicate } from "../../../utils/utils";

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
