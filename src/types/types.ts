import { TRole } from "../../generated/prisma/enums";

export const USER_ROLES = [TRole.ADMIN, TRole.READER, TRole.AUTHOR] as const;
export type TUserRoles = (typeof USER_ROLES)[number];
