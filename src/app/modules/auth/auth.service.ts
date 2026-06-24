import httpStatus from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/appError";
import bcrypt from "bcryptjs";
import config from "../../../config";
import type {
  TLoginUserPayload,
  TRegisterUserPayload,
} from "./auth.validation";
import type { IJwtPayload, ISafeUser } from "../users/users.interface";
import { jwtToken } from "../../../utils/jwt";

export class AuthService {
  /**
   * Registers a new user.
   * Handles business logic: duplicate check, password hashing, and persistence.
   */
  async registerUser(payload: TRegisterUserPayload): Promise<ISafeUser> {
    const { userName, firstName, lastName, email, password } = payload;

    const normalizedEmail = email.trim().toLowerCase();
    const normalizedUserName = userName.trim();
    const normalizedFirstName = firstName.trim();
    const normalizedLastName = lastName?.trim();

    const isUserExist = await prisma.user.findFirst({
      where: {
        OR: [{ email: normalizedEmail }, { userName: normalizedUserName }],
      },
    });
    if (isUserExist) {
      if (isUserExist.email === normalizedEmail) {
        throw new AppError(
          "Registration Failed",
          httpStatus.BAD_REQUEST,
          "An account with this email already exists.",
        );
      }
      if (isUserExist.userName === normalizedUserName) {
        throw new AppError(
          "Registration Failed",
          httpStatus.BAD_REQUEST,
          "This username is already taken.",
        );
      }
    }

    const hashedPassword = await bcrypt.hash(
      password,
      config.bcrypt_salt_rounds,
    );

    const user = await prisma.user.create({
      data: {
        userName: normalizedUserName,
        email: normalizedEmail,
        passwordHash: hashedPassword,
        role: "READER",
        status: "ACTIVE",
        profile: {
          create: {
            firstName: normalizedFirstName,
            lastName: normalizedLastName,
          },
        },
      },
      omit: { passwordHash: true },
    });

    return user;
  }

  /**
   * Login user.
   * Handles business logic: duplicate check, password hashing, and persistence.
   */

  async loginUser(payload: TLoginUserPayload) {
    const { identifier, password } = payload;
    const isEmail = identifier.includes("@");

    const normalizedIdentifier = isEmail
      ? identifier.trim().toLowerCase()
      : identifier.trim();

    const user = await prisma.user.findFirst({
      where: isEmail
        ? {
            email: normalizedIdentifier,
          }
        : {
            userName: { equals: normalizedIdentifier, mode: "insensitive" },
          },
    });

    if (!user) {
      throw new AppError(
        "Login Failed",
        httpStatus.UNAUTHORIZED,
        "Invalid credentials.",
      );
    }

    if (user.status === "SUSPENDED") {
      throw new AppError(
        "Login Failed",
        httpStatus.FORBIDDEN,
        "Your account has been suspended.",
      );
    }

    //match the password
    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new AppError(
        "Login Failed",
        httpStatus.UNAUTHORIZED,
        "Password is incorrect.",
      );
    }

    const jwtPayload: IJwtPayload = {
      id: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };

    const { accessToken, refreshToken } = jwtToken.signToken(jwtPayload);

    const {
      passwordHash,
      emailVerifiedAt,
      lastLoginAt,
      createdAt,
      updatedAt,
      ...safeUser
    } = user;

    return { safeUser, accessToken, refreshToken };
    // "tokenType": "Bearer",
    //   "expiresIn": 900,
  }
}

export const authService = new AuthService();
