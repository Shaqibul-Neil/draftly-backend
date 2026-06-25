import httpStatus from "http-status";
import type { TRequest, TResponse } from "../../../types/express.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import { userService } from "./users.service";
import type { TUpdateProfilePayload } from "./users.validation";

class UserController {
  getMyProfile = asyncHandler(async (req: TRequest, res: TResponse) => {
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Auth context fetched successfully",
      data: req.user,
    });
  });

  getFullProfile = asyncHandler(async (req: TRequest, res: TResponse) => {
    const profile = await userService.getFullProfile(req.user.id as string);
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "User profile fetched successfully",
      data: profile,
    });
  });

  updateMyProfile = asyncHandler(async (req: TRequest, res: TResponse) => {
    const userId = req.user.id as string;
    const payload = req.body as TUpdateProfilePayload;
    const updatedProfile = await userService.updateProfile(userId, payload);
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Profile updated successfully",
      data: updatedProfile,
    });
  });
}

export const userController = new UserController();
