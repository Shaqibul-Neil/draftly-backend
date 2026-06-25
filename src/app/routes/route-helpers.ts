import { authenticate } from "../../middlewares/authenticate";
import { authorize } from "../../middlewares/authorize";
import type { TRequestHandler } from "../../types/express.types";
import type { TUserRoles } from "../../types/types";

// any logged-in user
export const protectedRoute = (
  ...extra: TRequestHandler[]
): TRequestHandler[] => [authenticate, ...extra];

// logged-in + role gate (e.g. roleRoute(["ADMIN"]))
export const roleRoute = (
  roles: TUserRoles[],
  ...extra: TRequestHandler[]
): TRequestHandler[] => [authenticate, authorize(...roles), ...extra];
