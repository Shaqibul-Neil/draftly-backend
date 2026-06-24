import type {
  TRequest,
  TResponse,
  TNextFunction,
  TRequestHandler,
} from "../types/express.types";

type TController = (
  req: TRequest,
  res: TResponse,
  next: TNextFunction,
) => Promise<void>;

export const asyncHandler = (controller: TController) => {
  return async (req: TRequest, res: TResponse, next: TNextFunction) => {
    try {
      await controller(req, res, next);
    } catch (error) {
      next(error);
    }
    //Promise.resolve(controller(req, res, next)).catch(next);
  };
};

const catchAsync = (fn: TRequestHandler) => {
  return async (req: TRequest, res: TResponse, next: TNextFunction) => {
    try {
      await fn(req, res, next);
    } catch (error) {
      next(error);
    }
  };
};
