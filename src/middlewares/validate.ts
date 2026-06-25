import type {
  TNextFunction,
  TRequest,
  TResponse,
} from "../types/express.types";
import { asyncHandler } from "../utils/asyncHandler";
import type { z, ZodType } from "zod";

type TRequestSchemaOutput = {
  body?: TRequest["body"];
  query?: TRequest["query"];
  params?: TRequest["params"];
  cookies?: TRequest["cookies"];
};

export const validateRequest = <T extends ZodType>(schema: T) => {
  return asyncHandler(
    async (req: TRequest, res: TResponse, next: TNextFunction) => {
      const parsed = (await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
        cookies: req.cookies,
      })) as TRequestSchemaOutput;

      if (parsed.body !== undefined) req.body = parsed.body;
      if (parsed.query !== undefined) req.query = parsed.query;
      if (parsed.params !== undefined) req.params = parsed.params;
      if (parsed.cookies !== undefined) req.cookies = parsed.cookies;

      next();
    },
  );
};
