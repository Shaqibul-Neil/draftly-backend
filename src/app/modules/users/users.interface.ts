import type { TRole, TStatus } from "../../../../generated/prisma/enums";

export interface IBaseUser {
  id: string;
  email: string;
  role: TRole;
  status: TStatus;
}
export interface IAuthUser extends IBaseUser {
  userName: string;
}

export interface ISafeUser extends IAuthUser {
  emailVerifiedAt: Date | null;
  lastLoginAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface ISavedProfile {
  id: string;
  userId: string;
  firstName: string;
  lastName: string | null;
  bio: string | null;
  avatarMediaId: string | null;
  websiteUrl: string | null;
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  followerCount: number;
  followingCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJwtPayload extends IBaseUser {}

/**
 * Full profile response type
 * profile nullable because User.profile is optional in schema
 */
export type TFullUserProfile = ISafeUser & {
  profile: ISavedProfile | null;
};
