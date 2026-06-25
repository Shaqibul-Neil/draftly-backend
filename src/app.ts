import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { TApplication, TRequest, TResponse } from "./types/express.types";
import router, { mountedPaths } from "./app/routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import config from "./config";
import { sendResponse } from "./utils/sendResponse";

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

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

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
    status: 200,
    success: true,
    message: "Welcome to Draftly Server",
    data: { endpoints: mountedPaths },
  });
});

// Not Found Route
app.use((req: TRequest, res: TResponse) => {
  sendResponse({
    res,
    status: 404,
    success: false,
    message: "API endpoint not found",
    data: { endpoints: mountedPaths },
  });
});

// Global Error Handler
app.use(globalErrorHandler);

export default app;
