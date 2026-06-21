import httpStatus from "http-status";
import type { TRequest, TResponse } from "../../../types/express.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import { authService, AuthService } from "./auth.service";

class AuthController {
  constructor(private authService: AuthService) {}

  register = asyncHandler(async (req: TRequest, res: TResponse) => {
    const user = await this.authService.registerUser(req.body);
    sendResponse({
      res,
      status: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  });
}

export const authController = new AuthController(authService);
