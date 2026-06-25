import httpStatus from "http-status";
import type { TRequest, TResponse } from "../../../types/express.types";
import { asyncHandler } from "../../../utils/asyncHandler";
import { sendResponse } from "../../../utils/sendResponse";
import { authService, AuthService } from "./auth.service";
import type {
  TLoginUserPayload,
  TRegisterUserPayload,
} from "./auth.validation";
import { setRefreshTokenCookie } from "../../../utils/cookie";
import { AppError } from "../../../utils/appError";
import { jwtToken } from "../../../utils/jwt";

class AuthController {
  constructor(private authService: AuthService) {}

  //----------------REGISTER A NEW USER----------------
  register = asyncHandler(async (req: TRequest, res: TResponse) => {
    const payload = req.body as TRegisterUserPayload;
    const user = await this.authService.registerUser(payload);
    sendResponse({
      res,
      status: httpStatus.CREATED,
      success: true,
      message: "User registered successfully",
      data: user,
    });
  });

  //----------------LOGIN USER----------------
  login = asyncHandler(async (req: TRequest, res: TResponse) => {
    const payload = req.body as TLoginUserPayload;
    const { safeUser, accessToken, refreshToken } =
      await this.authService.loginUser(payload);

    //set cookie
    setRefreshTokenCookie(res, refreshToken);

    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "User logged in successfully",
      data: {
        accessToken,
        tokenType: "Bearer",
        expiresIn: 900,
        user: safeUser,
      },
    });
  });

  //----------------REFRESH TOKEN----------------
  refreshToken = asyncHandler(async (req: TRequest, res: TResponse) => {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken)
      throw new AppError(
        "Unauthorized",
        httpStatus.UNAUTHORIZED,
        "Refresh token is missing from your request cookies.",
      );

    // Validate token and get user via service layer
    const user = await this.authService.refreshToken(refreshToken);

    // Token Rotation : Invalidate previous refresh token by issuing a new one
    const { accessToken, refreshToken: newRefreshToken } =
      jwtToken.signToken(user);

    setRefreshTokenCookie(res, newRefreshToken);
    sendResponse({
      res,
      status: httpStatus.OK,
      success: true,
      message: "Access token generated",
      data: { accessToken },
    });
  });
}

export const authController = new AuthController(authService);
