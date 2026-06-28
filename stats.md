# Stats APIs

## Shared Stats (Admin + Author)

Role-based filtering — admin sees all, author sees own posts only.

| Method | Endpoint                      | Description                                                                                                  |
| ------ | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| GET    | `/stats/posts` -- DONE        | Count by status (DRAFT / PUBLISHED / SCHEDULED / ARCHIVED), by visibility (PUBLIC / PREMIUM), featured count |
| GET    | `/stats/posts/top-viewed`     | Top N posts ordered by `totalViews`                                                                          |
| GET    | `/stats/posts/top-liked`      | Top N posts ordered by `totalLikes`                                                                          |
| GET    | `/stats/posts/top-commented`  | Top N posts ordered by `totalComments`                                                                       |
| GET    | `/stats/posts/top-bookmarked` | Top N posts ordered by `totalBookmarks`                                                                      |
| GET    | `/stats/posts/top-shared`     | Top N posts ordered by `totalShares`                                                                         |
| GET    | `/stats/posts/growth`         | Post count grouped by day / week / month via `createdAt`                                                     |

---

## Admin Only Stats

| Method | Endpoint                         | Description                                                                                     |
| ------ | -------------------------------- | ----------------------------------------------------------------------------------------------- |
| GET    | `/admin/stats/overview`          | Total posts, users, comments, views, likes (platform-wide)                                      |
| GET    | `/admin/stats/users`             | Count by role (AUTHOR / READER / ADMIN), by status (ACTIVE / SUSPENDED), verified vs unverified |
| GET    | `/admin/stats/users/growth`      | New user registrations over time via `createdAt`                                                |
| GET    | `/admin/stats/users/top-authors` | Top authors ranked by post count / total views / total likes                                    |
| GET    | `/admin/stats/comments`          | Comment count by status (ACTIVE / HIDDEN / FLAGGED)                                             |
| GET    | `/admin/stats/categories/top`    | Top categories by post count                                                                    |
| GET    | `/admin/stats/tags/top`          | Top tags by post count                                                                          |
| GET    | `/admin/stats/media`             | Total media count, total storage used (sum of `fileSize`)                                       |
