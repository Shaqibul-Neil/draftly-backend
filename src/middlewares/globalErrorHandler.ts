import { ZodError } from "zod";
import httpStatus from "http-status";
import { Prisma } from "../../generated/prisma/client";
import type {
  TRequest,
  TResponse,
  TNextFunction,
} from "../types/express.types";
import { AppError } from "../utils/appError";

export const globalErrorHandler = (
  err: unknown,
  req: TRequest,
  res: TResponse,
  next: TNextFunction,
) => {
  let statusCode: number = httpStatus.INTERNAL_SERVER_ERROR;
  let message: string | string[] = "Something went wrong";

  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = err.issues.map((issue) => issue.message).join(" ");
  } else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2000":
        statusCode = httpStatus.BAD_REQUEST;
        message = `Value too long for column: ${(err.meta?.column_name as string) ?? "unknown"}`;
        break;
      case "P2001":
      case "P2015":
      case "P2025":
        statusCode = httpStatus.NOT_FOUND;
        message = (err.meta?.cause as string) ?? "Record not found";
        break;
      case "P2002":
        statusCode = httpStatus.CONFLICT;
        message = `${(err.meta?.target as string[])?.join(", ")} already exists`;
        break;
      case "P2003":
        statusCode = httpStatus.BAD_REQUEST;
        message = `Invalid reference: ${(err.meta?.field_name as string) ?? "related record does not exist"}`;
        break;
      case "P2004":
        statusCode = httpStatus.BAD_REQUEST;
        message = `Database constraint failed: ${(err.meta?.database_error as string) ?? err.message}`;
        break;
      case "P2011":
        statusCode = httpStatus.BAD_REQUEST;
        message = `Required field missing: ${(err.meta?.constraint as string) ?? "unknown"}`;
        break;
      case "P2014":
        statusCode = httpStatus.BAD_REQUEST;
        message = `Relation violation: ${(err.meta?.relation_name as string) ?? "required relation missing"}`;
        break;
      case "P2034":
        statusCode = httpStatus.CONFLICT;
        message = "Transaction conflict or deadlock. Please retry.";
        break;
      default:
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = `Database error (${err.code})`;
    }
  } else if (err instanceof Prisma.PrismaClientValidationError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Invalid query structure. Check field names and types.";
  } else if (err instanceof Prisma.PrismaClientInitializationError) {
    statusCode = httpStatus.SERVICE_UNAVAILABLE;
    message = "Database connection failed. Please try again later.";
  } else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
    statusCode = httpStatus.INTERNAL_SERVER_ERROR;
    message = "An unknown database error occurred.";
  } else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
  } else if (err instanceof Error) {
    message = err.message;
  }

  return res.status(statusCode).json({
    statusCode,
    message,
    error: httpStatus[statusCode as keyof typeof httpStatus] ?? "Error",
    timestamp: new Date().toISOString(),
    path: req.originalUrl,
  });
};
