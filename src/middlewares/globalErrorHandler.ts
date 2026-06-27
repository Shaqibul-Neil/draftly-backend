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
  let statusCode = 500;
  let message = "Something went wrong";
  let errorSources: { path: string; message: string }[] = [];

  // Handling Zod Errors
  if (err instanceof ZodError) {
    statusCode = httpStatus.BAD_REQUEST;
    message = "Validation Error";

    errorSources = err.issues.map((issue) => ({
      path: String(issue.path.join(".")),
      message: issue.message,
    }));
  }
  // Prisma Known Request Errors
  else if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2025":
        // Record not found — update/delete/findUniqueOrThrow on non-existent row
        statusCode = httpStatus.NOT_FOUND;
        message = "Resource Not Found";
        errorSources = [
          {
            path: "",
            message:
              (err.meta?.cause as string) ??
              "The requested record does not exist.",
          },
        ];
        break;
      case "P2002":
        // Unique constraint violation — duplicate slug, email, etc.
        statusCode = httpStatus.CONFLICT;
        message = "Duplicate Entry";
        errorSources = [
          {
            path: String((err.meta?.target as string[])?.join(", ") ?? ""),
            message: `A record with this ${(err.meta?.target as string[])?.join(", ")} already exists.`,
          },
        ];
        break;
      default:
        statusCode = httpStatus.INTERNAL_SERVER_ERROR;
        message = "Database Error";
        errorSources = [
          { path: "", message: `Prisma error code: ${err.code}` },
        ];
    }
  }
  // Custom App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.details || err.message,
      },
    ];
  }
  // Generic Error
  else if (err instanceof Error) {
    message = err.message;
    errorSources = [
      {
        path: "",
        message: err.message,
      },
    ];
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: errorSources,
  });
};
