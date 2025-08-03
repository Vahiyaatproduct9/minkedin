'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { PostCard } from '@/components/post-card';
import { EditProfileDialog } from '@/components/edit-profile-dialog';
import { Skeleton } from '@/components/ui/skeleton';
import { doc, getDoc, collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import type { User, Post } from '@/lib/types';

export default function UserProfilePage() {
  const { user: currentUser, loading: authLoading } = useAuth();
  const router = useRouter();
  const params = useParams();
  const userId = params.userId as string;

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) return;

    const fetchUserData = async () => {
      setLoading(true);
      const userDocRef = doc(db, 'users', userId);
      const userDoc = await getDoc(userDocRef);

      if (userDoc.exists()) {
        setProfileUser({ id: userDoc.id, ...userDoc.data() } as User);
      } else {
        // Handle user not found, maybe redirect to a 404 page
        router.push('/');
      }
    };

    fetchUserData();
  }, [userId, router]);
  
  useEffect(() => {
    if (!profileUser) return;

    const postsQuery = query(
        collection(db, 'posts'), 
        where('authorId', '==', profileUser.id),
        orderBy('createdAt', 'desc')
    );
    
    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as any).toDate(),
      } as Post));
      setUserPosts(posts);
      setLoading(false);
    });

    return () => unsubscribe();

  }, [profileUser]);


  if (loading || authLoading) {
    return (
        <div className="space-y-8">
            <div className="flex items-center gap-6">
                <Skeleton className="h-24 w-24 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-6 w-64" />
                </div>
            </div>
             {currentUser?.id === userId && <Skeleton className="h-10 w-32" /> }
            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                <Skeleton className="h-48 rounded-lg" />
                <Skeleton className="h-48 rounded-lg" />
            </div>
        </div>
    );
  }
  
  if (!profileUser) {
      return <div className="text-center">User not found.</div>
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col sm:flex-row items-start gap-6 mb-12">
        <Avatar className="h-24 w-24 text-4xl">
          <AvatarImage src={`https://placehold.co/128x128.png`} data-ai-hint="avatar abstract" />
          <AvatarFallback>{profileUser.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-4xl font-headline font-bold">{profileUser.name}</h1>
              <p className="text-muted-foreground">{profileUser.email}</p>
            </div>
            {currentUser?.id === profileUser.id && <EditProfileDialog />}
          </div>
          <p className="mt-4 text-lg">{profileUser.bio}</p>
        </div>
      </div>

      <h2 className="text-3xl font-headline font-bold mb-8 border-b pb-2">Posts</h2>
      {userPosts.length > 0 ? (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {userPosts.map(post => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 border-2 border-dashed rounded-lg">
          <p className="text-muted-foreground text-lg">This user hasn't written any posts yet.</p>
        </div>
      )}
    </div>
  );
}