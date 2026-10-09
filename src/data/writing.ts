/** Building the Gaps posts. Each card previews a post and links out to LinkedIn. */
export interface Post {
  title: string;
  url: string;
  /** One or two lines from the post, in Chi's words. */
  excerpt: string;
}

export const posts: Post[] = [];
