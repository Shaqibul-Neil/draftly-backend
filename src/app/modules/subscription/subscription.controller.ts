import httpStatus from "http-status";
import type { TRequest, TResponse } from "../../../types/express.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import {
  subscriptionService,
  type SubscriptionService,
} from "./subscription.service";

class SubscriptionController {
  constructor(private subscriptionService: SubscriptionService) {}

  checkoutSession = asyncHandler(async (req: TRequest, res: TResponse) => {
    const userId = req.user?.id as string;
    const result = await this.subscriptionService.createCheckoutSession(userId);

    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Checkout completed successfully",
      data: result,
    });
  });
}

export const subscriptionController = new SubscriptionController(
  subscriptionService,
);
