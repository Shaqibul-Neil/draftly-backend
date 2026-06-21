import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import type { TApplication, TRequest, TResponse } from "./types/express.types";
import router from "./app/routes";
import { globalErrorHandler } from "./middlewares/globalErrorHandler";
import config from "./config";
import { sendResponse } from "./utils/sendResponse";

const app: TApplication = express();

/**
 * Middleware Pipeline
 */
// In app.ts:
app.use(
  cors({
    origin: [config.url, config.local_url],
    credentials: true,
    methods: ["GET", "POST", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

/**
 * Application Routes
 * Prefixing all API routes with /api
 */
app.use("/api", router);
app.get("/", (req: TRequest, res: TResponse) => {
  sendResponse({
    res,
    status: 200,
    success: true,
    message: "Welcome to Draftly Server",
    data: {
      endpoints: {
        auth: "/api/auth",
        posts: "/api/posts",
      },
    },
  });
});

// Not Found Route
app.use((req: TRequest, res: TResponse) => {
  sendResponse({
    res,
    status: 404,
    success: false,
    message: "API endpoint not found",
    data: {
      endpoints: {
        auth: "/api/auth",
        posts: "/api/posts",
      },
    },
  });
});
// Global Error Handler
app.use(globalErrorHandler);

export default app;
