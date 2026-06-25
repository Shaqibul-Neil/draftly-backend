import { z } from "zod";

const socialUrlField = z
  .union([z.url("Invalid URL"), z.literal("")])
  .optional()
  .transform((val) => (val === "" ? null : val));

export const updateProfileSchema = z.object({
  body: z.object({
    firstName: z
      .string()
      .trim()
      .min(1, "First name cannot be empty")
      .max(50, "First name cannot exceed 50 characters")
      .optional(),

    lastName: z
      .string()
      .trim()
      .max(50, "Last name cannot exceed 50 characters")
      .optional()
      .transform((val) => (val === "" ? null : val)),

    bio: z
      .string()
      .trim()
      .optional()
      .transform((val) => (val === "" ? null : val)),

    websiteUrl: z
      .union([z.url("Invalid URL format"), z.literal("")])
      .optional()
      .transform((val) => (val === "" ? null : val)),

    avatarMediaId: z
      .union([z.uuid("Invalid avatar media ID"), z.literal("")])
      .optional()
      .transform((val) => (val === "" ? null : val)),

    socialLinks: z
      .object({
        facebook: socialUrlField,
        instagram: socialUrlField,
        twitter: socialUrlField,
      })
      .optional(),
  }),
});

export type TUpdateProfilePayload = z.infer<typeof updateProfileSchema>["body"];
