'use client';

import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function ProfilePage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(`/profile/${user.id}`);
      } else {
        router.push('/login');
      }
    }
  }, [user, loading, router]);

  // Render a loading state or null while redirecting
  return (
    <div className="flex items-center justify-center h-full">
      <p>Loading profile...</p>
    </div>
  );
}
