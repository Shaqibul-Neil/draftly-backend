import httpStatus from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/appError";
import bcrypt from "bcryptjs";
import config from "../../../config";
import type { TRegisterUserPayload } from "./auth.validation";
import type { ISavedUserResponse } from "../users/users.interface";

export class AuthService {
  /**
   * Registers a new user.
   * Handles business logic: duplicate check, password hashing, and persistence.
   */
  async registerUser(
    payload: TRegisterUserPayload,
  ): Promise<ISavedUserResponse> {
    const { userName, firstName, lastName, email, password } = payload;

    const isUserExist = await prisma.user.findFirst({
      where: { OR: [{ email }, { userName }] },
    });
    if (isUserExist) {
      throw new AppError(
        "Registration Failed",
        httpStatus.BAD_REQUEST,
        "A user with this email or username already exists in our system.",
      );
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt_salt_rounds,
    );

    const user = await prisma.user.create({
      data: {
        userName,
        email,
        passwordHash: hashedPassword,
        role: "READER",
        status: "ACTIVE",
        profile: {
          create: {
            firstName,
            lastName,
          },
        },
      },
      omit: { passwordHash: true },
    });

    return user;
  }
}

export const authService = new AuthService();
