import type { RateLimitInfo } from "express-rate-limit";
import type { IAuthUser } from "../app/modules/users/users.interface";

declare global {
  namespace Express {
    interface Request {
      user: IAuthUser;
      rateLimit?: RateLimitInfo;
    }
  }
}
