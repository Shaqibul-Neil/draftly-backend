import type { TResponse } from "../types/express.types";

export const setRefreshTokenCookie = (res: TResponse, token: string) => {
  res.cookie("refreshToken", token, {
    sameSite: "none",
    httpOnly: true,
    secure: false,
    maxAge: 30 * 24 * 60 * 60 * 1000,
  });
};
