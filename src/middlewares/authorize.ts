import httpStatus from "http-status";
import type {
  TNextFunction,
  TRequest,
  TResponse,
} from "../types/express.types";
import type { TUserRoles } from "../types/types";
import { AppError } from "../utils/appError";

export const authorize = (...roles: TUserRoles[]) => {
  return (req: TRequest, res: TResponse, next: TNextFunction) => {
    if (!roles.length)
      throw new AppError(
        "Server Misconfiguration",
        httpStatus.INTERNAL_SERVER_ERROR,
        "No roles specified for this route.",
      );
    try {
      if (!req.user)
        throw new AppError(
          "Unauthorized",
          httpStatus.UNAUTHORIZED,
          "Missing or invalid authentication context. Please re-authenticate",
        );

      if (!roles.includes(req.user.role))
        throw new AppError(
          "Forbidden Access",
          httpStatus.FORBIDDEN,
          `Access denied. Role '${req.user.role}' lacks necessary privileges.`,
        );
      next();
    } catch (error) {
      next(error);
    }
  };
};
