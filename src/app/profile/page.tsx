'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostCard } from '@/components/post-card';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { Skeleton } from '@/components/ui/skeleton';

export default function ProfilePage() {
  const { user, loading, userPosts } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-64" />
                </div>
            </div>
            <Skeleton className="h-10 w-32" />
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
            </div>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
        <Avatar className="h-24 w-24 text-4xl">
          <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint="avatar abstract" />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-headline font-bold">{user.name}</h1>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
            <EditProfileDialog />
          </div>
          <p className="mt-4 text-lg">{user.bio}</p>
        </div>
      </div>

      <h2 className="text-3xl font-headline font-bold mb-8 border-b pb-2">Your Posts</h2>
      {userPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-lg">You haven't written any posts yet.</p>
          <p className="text-muted-foreground">Ready to share your thoughts?</p>
          <div className="mt-4">
            <button onClick={() => router.push('/create')} className="text-primary hover:underline">
              Create your first post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
