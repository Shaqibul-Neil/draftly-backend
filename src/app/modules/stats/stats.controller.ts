import httpStatus from "http-status";
import type { TRole } from "../../../../generated/prisma/enums";
import type { TRequest, TResponse } from "../../../types/express.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import { statsService, type StatsService } from "./stats.service";

class StatsController {
  constructor(private statsService: StatsService) {}

  getPostStats = asyncHandler(async (req: TRequest, res: TResponse) => {
    const userId = req.user.id as string;
    const userRole = req.user.role as TRole;
    const stats = await this.statsService.getPostStats(userId, userRole);
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Post stats fetched successfully",
      data: stats,
    });
  });
}

export const statsController = new StatsController(statsService);
