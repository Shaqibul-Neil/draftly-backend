import httpStatus from "http-status";
import type {
  TNextFunction,
  TRequest,
  TResponse,
} from "../types/express.types";
import { AppError } from "../utils/appError";
import { jwtToken } from "../utils/jwt";
import { userService } from "../app/modules/users/users.service";
import { TStatus } from "../../generated/prisma/enums";
import { asyncHandler } from "../utils/asyncHandler";

export const authenticate = asyncHandler(
  async (req: TRequest, res: TResponse, next: TNextFunction) => {
    const token = req.headers.authorization?.startsWith("Bearer ")
      ? req.headers.authorization?.split(" ")[1]
      : null;

    if (!token)
      throw new AppError(
        "Token not found",
        httpStatus.UNAUTHORIZED,
        "You are not logged in. Please log in to access this resource.",
      );

    const verifiedToken = jwtToken.verifyToken(token, "access");
    const userId = verifiedToken["id"] as string;
    if (!userId)
      throw new AppError(
        "Unauthorized",
        httpStatus.UNAUTHORIZED,
        "Token payload is malformed.",
      );

    const user = await userService.getAuthContext(userId);

    if (user.status !== TStatus.ACTIVE)
      throw new AppError(
        "Unauthorized",
        httpStatus.UNAUTHORIZED,
        "Your account is no longer active.",
      );

    req.user = user;
    next();
  },
);
