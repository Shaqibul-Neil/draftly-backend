import {
  TPostStatus,
  TPostVisibility,
  TRole,
} from "../../../../generated/prisma/enums";
import { prisma } from "../../../lib/prisma";
import type { IPostStatsResponse } from "./stats.interface";

export class StatsService {
  //------------------------------------------
  //Post Stats
  //------------------------------------------
  async getPostStats(
    userId: string,
    userRole: TRole,
  ): Promise<IPostStatsResponse> {
    const baseWhere = userRole === TRole.ADMIN ? {} : { authorId: userId };
    return await prisma.$transaction(async (tx) => {
      const [
        total,
        published,
        draft,
        scheduled,
        archived,
        publicPosts,
        premiumPosts,
        featured,
      ] = await Promise.all([
        tx.post.count({ where: baseWhere }),
        tx.post.count({
          where: { ...baseWhere, status: TPostStatus.PUBLISHED },
        }),
        tx.post.count({
          where: { ...baseWhere, status: TPostStatus.DRAFT },
        }),
        tx.post.count({
          where: { ...baseWhere, status: TPostStatus.SCHEDULED },
        }),
        tx.post.count({
          where: { ...baseWhere, status: TPostStatus.ARCHIVED },
        }),
        tx.post.count({
          where: { ...baseWhere, visibility: TPostVisibility.PUBLIC },
        }),
        tx.post.count({
          where: { ...baseWhere, visibility: TPostVisibility.PREMIUM },
        }),
        tx.post.count({ where: { ...baseWhere, isFeatured: true } }),
      ]);
      return {
        total,
        byStatus: { published, draft, scheduled, archived },
        byVisibility: { public: publicPosts, premium: premiumPosts },
        featured,
      };
    });
  }
}

export const statsService = new StatsService();
