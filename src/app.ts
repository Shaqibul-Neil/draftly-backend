import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import httpStatus from "http-status";
import type { TApplication, TRequest, TResponse } from "./types/express.types";
import router, { mountedPaths } from "./app/routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import config from "./config";
import { sendResponse } from "./utils/sendResponse";
import { notFound } from "./middlewares/notFound";
import { stripeWebhookHandler } from "./app/modules/subscription/subscription.webhook";

const app: TApplication = express();

/**
 * Middleware Pipeline
 */
app.use(
  cors({
    origin: [config.url, config.local_url],
    credentials: true,
    methods: ["GET", "PUT", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

//webhook
app.post(
  "/api/v1/subscription/webhook/stripe",
  express.raw({ type: "application/json" }),
  stripeWebhookHandler,
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.set("trust proxy", 1);

/**
 * Application Routes
 * Mounted at /api. The version segment (/v1) is added per-module inside
 * src/app/routes/index.ts. `mountedPaths` is derived from the route registry,
 * so the endpoint list below can never drift out of sync with real routes.
 */
app.use("/api", router);

app.get("/", (req: TRequest, res: TResponse) => {
  sendResponse({
    res,
    status: httpStatus.OK,
    success: true,
    message: "Welcome to Draftly Server",
    data: { endpoints: mountedPaths },
  });
});

// Not Found Route
app.use(notFound);

// Global Error Handler
app.use(globalErrorHandler);

export default app;
