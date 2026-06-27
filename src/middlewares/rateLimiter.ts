import { ipKeyGenerator, rateLimit } from "express-rate-limit";
import httpStatus from "http-status";
import config from "../config";
import type {
  TNextFunction,
  TRequest,
  TResponse,
} from "../types/express.types";
import { AppError } from "../utils/appError";

const makeLimiter = (opts: {
  prefix: string;
  windowMs: number;
  max: number;
  skipSuccess?: boolean;
}) =>
  rateLimit({
    windowMs: opts.windowMs,
    limit: opts.max,
    skipSuccessfulRequests: opts.skipSuccess ?? false,
    standardHeaders: "draft-8",
    legacyHeaders: false,
    // Composite key: subnet-safe IP + targeted account.
    // Stops both (a) one IP spraying many accounts and (b) many IPs hitting one account.
    keyGenerator: (req: TRequest) => {
      const ipKey = ipKeyGenerator(req.ip ?? "unknown", 56);
      const email =
        typeof req.body?.email === "string"
          ? req.body.email.trim().toLowerCase()
          : "anon";
      return `${opts.prefix}:${ipKey}:${email}`;
    },
    // Route 429 through globalErrorHandler so error shape stays consistent app-wide.
    handler: (req: TRequest, res: TResponse, next: TNextFunction) => {
      const resetTime = req.rateLimit?.resetTime;
      const retryAfterSec = resetTime
        ? Math.max(1, Math.ceil((resetTime.getTime() - Date.now()) / 1000))
        : Math.ceil(opts.windowMs / 1000);

      res.setHeader("Retry-After", String(retryAfterSec));

      next(
        new AppError(
          "Too many login attempts",
          httpStatus.TOO_MANY_REQUESTS,
          `Account temporarily locked. Try again in ${retryAfterSec}s.`,
        ),
      );
    },
  });

export const loginLimiter = makeLimiter({
  prefix: "login",
  windowMs: config.login_rl_window_ms,
  max: config.login_rl_max,
  skipSuccess: true, // login: only failed count
});

export const forgotPasswordLimiter = makeLimiter({
  prefix: "forgot",
  windowMs: 60 * 60 * 1000, // 1 hr — stricter
  max: 3,
});
