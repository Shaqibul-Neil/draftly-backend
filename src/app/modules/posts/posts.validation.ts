import { z } from "zod";
import {
  TPostStatus,
  TPostVisibility,
} from "../../../../generated/prisma/enums";

export const createPostValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(255, "Title cannot exceed 255 characters"),

      content: z.string().trim().min(1, "Content cannot be empty"),

      isFeatured: z.boolean().optional(),

      status: z.enum(TPostStatus).optional(),
      visibility: z.enum(TPostVisibility).optional(),

      thumbnailMediaId: z.uuid("Invalid thumbnail media id").optional(),
      coverMediaId: z.uuid("Invalid cover media id").optional(),
      categoryIds: z.array(z.uuid("Invalid category id")).optional(),
      tags: z
        .array(z.string().trim().min(1, "Tag cannot be empty").max(50))
        .optional(),

      seoTitle: z
        .string()
        .trim()
        .max(255, "SEO title cannot exceed 255 characters")
        .optional(),
      seoDescription: z.string().trim().optional(),

      scheduledAt: z.coerce.date().optional(),
    })
    .refine(
      (data) =>
        data.status !== TPostStatus.SCHEDULED || Boolean(data.scheduledAt),
      {
        message: "scheduledAt is required when status is SCHEDULED",
        path: ["scheduledAt"],
      },
    ),
});

export const updatePostValidationSchema = z.object({
  body: z
    .object({
      title: z
        .string()
        .trim()
        .min(1, "Title cannot be empty")
        .max(255, "Title cannot exceed 255 characters")
        .optional(),

      content: z.string().trim().min(1, "Content cannot be empty").optional(),

      isFeatured: z.boolean().optional(),

      status: z.enum(TPostStatus).optional(),
      visibility: z.enum(TPostVisibility).optional(),

      thumbnailMediaId: z
        .uuid("Invalid thumbnail media id")
        .optional()
        .nullable(),
      coverMediaId: z.uuid("Invalid cover media id").optional().nullable(),

      categoryIds: z.array(z.uuid("Invalid category id")).optional(),
      tags: z
        .array(z.string().trim().min(1, "Tag cannot be empty").max(50))
        .optional(),

      seoTitle: z
        .string()
        .trim()
        .max(255, "SEO title cannot exceed 255 characters")
        .optional()
        .nullable(),
      seoDescription: z.string().trim().optional().nullable(),

      scheduledAt: z.coerce.date().optional().nullable(),
    })
    .refine(
      (data) =>
        data.status !== TPostStatus.SCHEDULED || Boolean(data.scheduledAt),
      {
        message: "scheduledAt is required when status is SCHEDULED",
        path: ["scheduledAt"],
      },
    )
    .refine((data) => Object.keys(data).length > 0, {
      message: "At least one field must be provided for update",
    }),
});

export const postIdParamValidationSchema = z.object({
  params: z.object({
    postId: z.string().uuid("Invalid post ID — must be a valid UUID"),
  }),
});

export type TUpdatePostPayload = z.infer<
  typeof updatePostValidationSchema
>["body"];

export type TCreatePostPayload = z.infer<
  typeof createPostValidationSchema
>["body"];
