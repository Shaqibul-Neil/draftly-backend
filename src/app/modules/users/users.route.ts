import express from "express";
import { userController } from "./users.controller";

const router = express.Router();

router.get("/me", userController.getMyProfile);

export const userRoutes = router;
