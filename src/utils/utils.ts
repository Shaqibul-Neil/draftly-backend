import slugify from "slugify";
import { randomUUID } from "crypto";

//Slug generate
export const generateSlug = (title: string): string => {
  const base = slugify(title, {
    lower: true,
    strict: true,
    trim: true,
  });
  return `${base}-${randomUUID().slice(0, 8)}`;
};

//Duplicate Remove
export const removeDuplicate = (arr: string[] = []): string[] => {
  const normalized = arr
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
  return [...new Set(normalized)];
};
