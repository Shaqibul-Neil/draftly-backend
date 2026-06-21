import type {
  TRequest,
  TResponse,
  TNextFunction,
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
  };
};
