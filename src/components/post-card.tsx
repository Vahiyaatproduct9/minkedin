import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import type { Post } from '@/lib/types';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface PostCardProps {
  post: Post;
}

export function PostCard({ post }: PostCardProps) {
  return (
    <Card className="flex flex-col h-full transition-transform transform-gpu hover:-translate-y-1 hover:shadow-xl">
      <CardHeader>
        <CardTitle className="font-headline text-xl">{post.title}</CardTitle>
        <CardDescription>
          by{' '}
          <Link href={`/profile/${post.authorId}`} className="hover:underline text-primary/90">
            {post.authorName}
          </Link>
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-muted-foreground line-clamp-3">{post.content}</p>
      </CardContent>
      <CardFooter>
        <p className="text-xs text-muted-foreground">
          {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
        </p>
      </CardFooter>
    </Card>
  );
}
