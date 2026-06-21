import type { TResponse } from "../types/express.types";

type TSendResponse<T> = {
  res: TResponse;
  status: number;
  success: boolean;
  message?: string;
  data?: T;
};

export const sendResponse = <T>({
  res,
  status,
  success,
  data,
  message,
}: TSendResponse<T>) => {
  return res.status(status).json({
    success,
    message,
    data,
  });
};
