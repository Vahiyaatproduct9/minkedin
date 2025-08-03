export interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  authorName: string;
  createdAt: Date;
}

export interface User {
  id: string;
  name: string;
  email: string;
  bio?: string;
}
