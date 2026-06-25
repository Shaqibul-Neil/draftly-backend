import { prisma } from "../../../lib/prisma";

import type {
  IAuthUser,
  ISafeUser,
  ISavedProfile,
  TFullUserProfile,
} from "./users.interface";
import type { TUpdateProfilePayload } from "./users.validation";

export class UserService {
  /**
   * Current User Profile.
   */
  async getAuthContext(userId: string): Promise<IAuthUser> {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        userName: true,
        role: true,
        status: true,
      },
    });

    return user;
  }

  /**
   * Current user full profile
   * profile can be null because profile creation is optional
   */
  async getFullProfile(userId: string): Promise<TFullUserProfile> {
    const result = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      omit: { passwordHash: true },
      include: { profile: true },
    });
    return result as TFullUserProfile;
  }

  /**
   * Create profile if missing, otherwise update it
   */
  async updateProfile(
    userId: string,
    payload: TUpdateProfilePayload,
  ): Promise<TFullUserProfile> {
    const { firstName, lastName, bio, avatarMediaId, websiteUrl, socialLinks } =
      payload;

    const existingUser = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: { userName: true },
    });

    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        profile: {
          upsert: {
            update: {
              ...(firstName !== undefined && { firstName }),
              ...(lastName !== undefined && { lastName }),
              ...(bio !== undefined && { bio }),
              ...(avatarMediaId !== undefined && { avatarMediaId }),
              ...(websiteUrl !== undefined && { websiteUrl }),
              ...(socialLinks?.facebook !== undefined && {
                facebookUrl: socialLinks.facebook,
              }),
              ...(socialLinks?.instagram !== undefined && {
                instagramUrl: socialLinks.instagram,
              }),
              ...(socialLinks?.twitter !== undefined && {
                twitterUrl: socialLinks.twitter,
              }),
            },
            create: {
              firstName: firstName ?? existingUser.userName,
              lastName: lastName ?? null,
              bio: bio ?? null,
              avatarMediaId: avatarMediaId ?? null,
              websiteUrl: websiteUrl ?? null,
              facebookUrl: socialLinks?.facebook ?? null,
              instagramUrl: socialLinks?.instagram ?? null,
              twitterUrl: socialLinks?.twitter ?? null,
            },
          },
        },
      },
      omit: { passwordHash: true },
      include: { profile: true },
    });
    return updatedUser as TFullUserProfile;
  }
}

export const userService = new UserService();
