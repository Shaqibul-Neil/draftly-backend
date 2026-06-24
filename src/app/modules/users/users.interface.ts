import type { TRole, TStatus } from "../../../../generated/prisma/enums";

export interface ISafeUser {
  id: string;
  userName: string;
  email: string;
  role: TRole;
  status: TStatus;
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
  socialLinks: Record<string, any> | null;
  followerCount: number;
  followingCount: number;
  postCount: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface IJwtPayload {
  id: string;
  email: string;
  role: TRole;
  status: TStatus;
}
