import type { TRequestHandler } from "../../types/express.types";

export type THttpMethod =
  | "get"
  | "post"
  | "put"
  | "patch"
  | "delete"
  | "options"
  | "head";

export type TApiVersion = `v${number}`;

export type TRouteConfig = {
  method: THttpMethod;
  path: string;
  handler: TRequestHandler;
  middlewares?: TRequestHandler[];
  name?: string;
  description?: string;
  tags?: string[];
};

export type TRouteModule = {
  basePath: string;
  routes: TRouteConfig[];
  version?: TApiVersion;
};
