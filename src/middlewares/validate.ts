import type {
  TNextFunction,
  TRequest,
  TResponse,
} from "../types/express.types";
import { asyncHandler } from "../utils/asyncHandler";
import type { ZodType } from "zod";

export const validateRequest = (schema: ZodType) => {
  return asyncHandler(
    async (req: TRequest, res: TResponse, next: TNextFunction) => {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    },
  );
};
