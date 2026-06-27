import type {
  IPostDetailResponse,
  IPostResponse,
  TPostDetailsWithRelations,
  TPostListWithRelations,
} from "./posts.interface";

// mapPost — for list
export const mapPost = (post: TPostListWithRelations): IPostResponse => {
  return {
    id: post.id,
    authorId: post.authorId,
    author: post.author
      ? {
          userName: post.author?.userName,
          email: post.author?.email,
        }
      : null,
    title: post.title,
    slug: post.slug,
    content: post.content,
    isFeatured: post.isFeatured,
    status: post.status,
    visibility: post.visibility,
    thumbnailMediaId: post.thumbnailMediaId,
    coverMediaId: post.coverMediaId,
    totalViews: post.totalViews,
    totalComments: post._count.comments,
    totalLikes: post._count.postLike,
    totalBookmarks: post.totalBookmarks,
    totalShares: post.totalShares,
    totalReadingTimeMinutes: post.totalReadingTimeMinutes,
    seoTitle: post.seoTitle,
    seoDescription: post.seoDescription,
    createdAt: post.createdAt,
    publishedAt: post.publishedAt,
    scheduledAt: post.scheduledAt,
    updatedAt: post.updatedAt,
    categories: post.postCategory.map((pc) => pc.category.name),
    tags: post.postTags.map((pt) => pt.tag.name),
  };
};

// mapPostDetail — for single post
export const mapPostDetail = (
  post: TPostDetailsWithRelations,
): IPostDetailResponse => {
  return {
    ...mapPost(post as unknown as TPostListWithRelations), // common fields
    comments: post.comments.map((c) => ({
      id: c.id,
      content: c.content,
      createdAt: c.createdAt,
      user: c.user
        ? { id: c.user.id, userName: c.user.userName, profile: c.user.profile }
        : null,
    })),
  };
};
