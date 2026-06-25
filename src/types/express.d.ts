import type { IAuthUser } from "../app/modules/users/users.interface";

declare global {
  namespace Express {
    interface Request {
      user: IAuthUser;
    }
  }
}
