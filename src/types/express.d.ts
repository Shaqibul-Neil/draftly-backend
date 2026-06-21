import type { ISafeUser } from "../app/modules/users/users.interface";

declare global {
  namespace Express {
    interface Request {
      user: ISafeUser;
    }
  }
}
