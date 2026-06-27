import type { Prisma } from "../../../../generated/prisma/client";
import type {
  TPostStatus,
  TPostVisibility,
} from "../../../../generated/prisma/enums";
import type {
  POST_DETAILS_INCLUDE,
  POST_LIST_INCLUDE,
} from "./posts.constants";

export interface IPostResponse {
  id: string;
  authorId: string | null;
  title: string;
  slug: string;
  content: string;
  isFeatured: boolean;
  status: TPostStatus;
  visibility: TPostVisibility;
  categories: string[];
  tags: string[];
  thumbnailMediaId: string | null;
  coverMediaId: string | null;
  totalViews: number;
  totalComments: number;
  totalLikes: number;
  totalBookmarks: number;
  totalShares: number;
  totalReadingTimeMinutes: number;
  seoTitle: string | null;
  seoDescription: string | null;
  createdAt: Date;
  publishedAt: Date | null;
  scheduledAt: Date | null;
  updatedAt: Date;
}

export interface IPostDetailResponse extends IPostResponse {
  comments: {
    id: string;
    content: string;
    createdAt: Date;
    user: {
      id: string;
      userName: string;
      profile: {
        avatarMediaId: string | null;
      } | null;
    } | null;
  }[];
}

export type TPostListWithRelations = Prisma.PostGetPayload<{
  include: typeof POST_LIST_INCLUDE;
}>;

export type TPostDetailsWithRelations = Prisma.PostGetPayload<{
  include: typeof POST_DETAILS_INCLUDE;
}>;
