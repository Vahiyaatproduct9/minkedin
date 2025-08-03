'use client';

import { LoginForm } from '@/components/login-form';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function LoginPage() {
    const { user, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!loading && user) {
            router.push('/');
        }
    }, [user, loading, router]);

    return (
        <div className="flex items-center justify-center min-h-[calc(100vh-15rem)]">
            <LoginForm />
        </div>
    );
}
