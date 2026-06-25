import { z } from "zod";

export const registerValidationSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .min(1, "First Name cannot be empty")
      .max(50, "First Name cannot exceed 50 characters"),

    lastName: z
      .string()
      .max(50, "Last Name cannot exceed 50 characters")
      .optional(),

    userName: z
      .string()
      .min(3, "Username must be at least 3 characters")
      .max(30, "Username cannot exceed 30 characters")
      .regex(
        /^[a-zA-Z0-9_]+$/,
        "Username can only contain letters, numbers, and underscores",
      ),

    email: z.email("Invalid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
      .regex(/[a-z]/, "Password must contain at least one lowercase letter")
      .regex(/[0-9]/, "Password must contain at least one number"),
  }),
});

export const loginValidationSchema = z.object({
  body: z.object({
    identifier: z.string().min(1, "Email or username is required"),
    password: z.string().min(1, "Password is required"),
  }),
});

export type TRegisterUserPayload = z.infer<
  typeof registerValidationSchema
>["body"];
export type TLoginUserPayload = z.infer<typeof loginValidationSchema>["body"];
