import { ZodError } from "zod";
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
  let errorSources = [
    {
      path: "system",
      message: "Something went wrong",
    },
  ];

  // Handling Zod Errors
  if (err instanceof ZodError) {
    statusCode = 400;
    message = "Validation Error";

    errorSources = err.issues.map((issue) => ({
      path: String(issue.path.at(-1)),
      message: issue.message,
    }));
  }
  // Custom App Error
  else if (err instanceof AppError) {
    statusCode = err.statusCode;
    message = err.message;
    errorSources = [{ path: "system", message: err.details }];
  } else if (err instanceof Error) {
    message = err.message;
  }

  return res.status(statusCode).json({
    success: false,
    message: message,
    errors: errorSources,
  });
};
