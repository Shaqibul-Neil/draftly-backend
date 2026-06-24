import httpStatus from "http-status";
import type { TRequest, TResponse } from "../../../types/express.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { jwtToken } from "../../../utils/jwt";
import { sendResponse } from "../../../utils/sendResponse";
import { userService } from "./users.service";

class UserController {
  //-----------GET USER PROFILE---------------
  getMyProfile = asyncHandler(async (req: TRequest, res: TResponse) => {
    const { refreshToken } = req.cookies;
    const verifiedToken = await jwtToken.verifyToken(refreshToken, "refresh");
    const userProfile = await userService.getMyProfile(verifiedToken.id);

    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "User profile fetched successfully",
      data: userProfile,
    });
  });
}

export const userController = new UserController();
