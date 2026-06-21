import type { IIssueFilters } from "../app/modules/issues/issues.interface";
import type { TIssueStatus, TIssueTypes } from "../types/types";

export const issueFilter = (query: IIssueFilters) => {
  const { sort, type, status } = query;
  return {
    ...(sort && { sort: (sort as string) || "newest" }),
    ...(type && { type: (type as TIssueTypes) ?? undefined }),
    ...(status && { status: (status as TIssueStatus) ?? undefined }),
  };
};
