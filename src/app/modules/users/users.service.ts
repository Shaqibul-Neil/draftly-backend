import { prisma } from "../../../lib/prisma";

export class UserService {
  /**
   * Current user Profile.
   */
  async getMyProfile(userId: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id: userId },
      omit: { passwordHash: true },
      include: { profile: true },
    });

    return user;
  }
}

export const userService = new UserService();
