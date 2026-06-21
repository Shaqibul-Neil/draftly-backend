import type { TResponse } from "../types/express.types";

export const setRefreshTokenCookie = (res: TResponse, token: string) => {
  res.cookie("refreshToken", token, {
    sameSite: "lax",
    httpOnly: true,
    secure: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
