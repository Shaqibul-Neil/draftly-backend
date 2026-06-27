import httpStatus from "http-status";
import { prisma } from "../../../lib/prisma";
import { AppError } from "../../../utils/appError";
import bcrypt from "bcryptjs";
import config from "../../../config";
import type {
  TLoginUserPayload,
  TRegisterUserPayload,
} from "./auth.validation";
import type { IAuthUser } from "../users/users.interface";
import { jwtToken } from "../../../utils/jwt";
import { TRole, TStatus } from "../../../../generated/prisma/enums";
import type { ITokens } from "./auth.interface";

export class AuthService {
  /**
   * Registers a new user.
   * Handles business logic: duplicate check, password hashing, and persistence.
   */
  async registerUser(payload: TRegisterUserPayload): Promise<IAuthUser> {
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
        role: TRole.READER,
        status: TStatus.ACTIVE,
        profile: {
          create: {
            firstName: normalizedFirstName,
            lastName: normalizedLastName,
          },
        },
      },
      omit: { passwordHash: true },
    });

    const { emailVerifiedAt, lastLoginAt, createdAt, updatedAt, ...authUser } =
      user;
    return authUser;
  }

  /**
   * Login user.
   */

  async loginUser(payload: TLoginUserPayload): Promise<{
    safeUser: IAuthUser;
    tokens: ITokens;
  }> {
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

    if (user.status !== TStatus.ACTIVE) {
      throw new AppError(
        "Login Failed",
        httpStatus.FORBIDDEN,
        user.status === TStatus.SUSPENDED
          ? "Your account has been suspended."
          : "Your account is not active.",
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

    const jwtPayload = jwtToken.createJwtPayload(user);

    const tokens = jwtToken.signToken(jwtPayload);

    const {
      passwordHash,
      emailVerifiedAt,
      lastLoginAt,
      createdAt,
      updatedAt,
      ...safeUser
    } = user;

    return { safeUser, tokens };
  }

  /**
   * Refresh Token.
   */
  async refreshToken(refreshToken: string): Promise<ITokens> {
    const payload = jwtToken.verifyToken(refreshToken, "refresh");
    const user = await prisma.user.findFirst({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        role: true,
        status: true,
      },
    });

    if (!user)
      throw new AppError(
        "User not found",
        httpStatus.NOT_FOUND,
        "The requested user record does not exist in the system.",
      );

    if (user.status !== TStatus.ACTIVE)
      throw new AppError(
        "Login Failed",
        httpStatus.FORBIDDEN,
        "The requested user is suspended.",
      );

    const jwtPayload = jwtToken.createJwtPayload(user);
    const newTokens = jwtToken.signToken(jwtPayload);
    return newTokens;
  }
}

export const authService = new AuthService();
