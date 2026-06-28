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

    const [statusGroups, visibilityGroups, featured] = await Promise.all([
      prisma.post.groupBy({
        by: ["status"],
        where: baseWhere,
        _count: { _all: true },
      }),
      prisma.post.groupBy({
        by: ["visibility"],
        where: baseWhere,
        _count: { _all: true },
      }),
      prisma.post.count({ where: { ...baseWhere, isFeatured: true } }),
    ]);

    const statusMap = Object.fromEntries(
      statusGroups.map((s) => [s.status, s._count._all]),
    );
    const visibilityMap = Object.fromEntries(
      visibilityGroups.map((v) => [v.visibility, v._count._all]),
    );
    const total = statusGroups.reduce((sum, g) => sum + g._count._all, 0);

    return {
      total,
      byStatus: {
        published: statusMap[TPostStatus.PUBLISHED] ?? 0,
        draft: statusMap[TPostStatus.DRAFT] ?? 0,
        scheduled: statusMap[TPostStatus.SCHEDULED] ?? 0,
        archived: statusMap[TPostStatus.ARCHIVED] ?? 0,
      },
      byVisibility: {
        public: visibilityMap[TPostVisibility.PUBLIC] ?? 0,
        premium: visibilityMap[TPostVisibility.PREMIUM] ?? 0,
      },
      featured,
    };
  }
}

export const statsService = new StatsService();
