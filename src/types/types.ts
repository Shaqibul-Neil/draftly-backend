export const USER_ROLES = ["contributor", "maintainer"] as const;
export type TRoles = (typeof USER_ROLES)[number];
