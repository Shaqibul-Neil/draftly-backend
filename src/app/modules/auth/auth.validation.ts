import { z } from "zod";

export const signupValidationSchema = z.object({
  body: z.object({
    name: z.string("Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.enum(["contributor", "maintainer"]).optional(),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    email: z.email("Invalid email"),
    password: z.string().min(6, "Password must be at least 6 characters"),
  }),
});
