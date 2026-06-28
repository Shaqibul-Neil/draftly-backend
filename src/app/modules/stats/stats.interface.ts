export interface IPostStatsResponse {
  total: number;
  byStatus: {
    published: number;
    draft: number;
    scheduled: number;
    archived: number;
  };
  byVisibility: {
    public: number;
    premium: number;
  };
  featured: number;
}
