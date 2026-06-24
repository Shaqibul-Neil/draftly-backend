import jwt, { type JwtPayload } from "jsonwebtoken";
import config from "../config";
import type { IJwtPayload } from "../app/modules/users/users.interface";
import { AppError } from "./appError";

/**
 * Token Verification
 */
const verifyToken = (token: string, type: "access" | "refresh") => {
  const secret =
    type === "access" ? config.jwt.access.secret : config.jwt.refresh.secret;
  try {
    const decode = jwt.verify(token, secret);
    return decode as JwtPayload;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError(
        "Unauthorized",
        401,
        "Your access token has expired. Please refresh your session.",
      );
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError(
        "Unauthorized",
        401,
        "The provided token is malformed, corrupted, or invalid.",
      );
    }

    throw new AppError(
      "Unauthorized",
      401,
      "Authentication failed due to an invalid token.",
    );
  }
};

/**
 * Generates both access and refresh tokens.
 */

const signToken = (payload: IJwtPayload) => {
  const accessToken = jwt.sign(payload, config.jwt.access.secret, {
    expiresIn: config.jwt.access.expires_in,
  });

  const refreshToken = jwt.sign(payload, config.jwt.refresh.secret, {
    expiresIn: config.jwt.refresh.expires_in,
  });

  return {
    accessToken,
    refreshToken,
  };
};

export const jwtToken = { verifyToken, signToken };
