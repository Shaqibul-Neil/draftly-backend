//------------------------------------------
// Post List Include
// Used for:
// - Get All Posts
// - Get My Posts
// - Search Posts
// - Admin Post List

import { TCommentStatus } from "../../../../generated/prisma/enums";

//------------------------------------------
export const POST_LIST_INCLUDE = {
  author: {
    select: {
      id: true,
      userName: true,
      email: true,
    },
  },
  _count: { select: { comments: true, postLike: true } },
  postCategory: {
    include: {
      category: true,
    },
  },
  postTags: {
    include: {
      tag: true,
    },
  },
} as const;

//------------------------------------------
// Single Post Include
// Used for:
// - Get Post By Id
//------------------------------------------

export const POST_DETAILS_INCLUDE = {
  author: {
    select: {
      id: true,
      userName: true,
      email: true,
    },
  },
  comments: {
    take: 5,
    where: { status: TCommentStatus.ACTIVE },
    orderBy: { createdAt: "desc" },
    include: {
      user: {
        select: {
          id: true,
          userName: true,
          profile: {
            select: {
              avatarMediaId: true,
            },
          },
        },
      },
    },
  },
  postCategory: {
    include: {
      category: true,
    },
  },
  postTags: {
    include: {
      tag: true,
    },
  },
  _count: {
    select: {
      comments: true,
      postLike: true,
    },
  },
} as const;
