'use client';

import Link from 'next/link';
import { useAuth } from './providers/auth-provider';
import { Button } from './ui/button';
import { Feather, LogOut, User, PlusCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: '/', label: 'Home', icon: Feather },
    { href: '/profile', label: 'Profile', icon: User },
  ];

  return (
    <header className="bg-card/80 backdrop-blur-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center gap-2">
            <Feather className="text-primary" />
            <span className="text-xl font-headline font-bold">MinkedIn</span>
          </Link>
          <nav className="flex items-center gap-1 sm:gap-2">
            {user ? (
              <>
                <Button
                  variant={pathname === '/create' ? 'secondary' : 'default'}
                  asChild
                  className={cn(
                    'w-full sm:w-auto',
                    pathname === '/create' && 'bg-primary/10 text-primary'
                  )}
                  size="sm"
                >
                  <Link href="/create">
                    <PlusCircle className="mr-0 sm:mr-2 h-4 w-4" />
                    <span className="hidden sm:inline">Create Post</span>
                  </Link>
                </Button>
                {navLinks.map(({ href, label, icon: Icon }) => (
                  <Button
                    key={label}
                    variant={pathname === href ? 'secondary' : 'ghost'}
                    asChild
                    className={cn(
                      'hidden md:inline-flex',
                      pathname === href && 'bg-primary/10 text-primary'
                    )}
                  >
                    <Link href={href}>
                      <Icon className="mr-2 h-4 w-4" />
                      {label}
                    </Link>
                  </Button>
                ))}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={logout}
                  aria-label="Logout"
                >
                  <LogOut className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                {pathname !== '/login' && (
                  <Button asChild variant="ghost">
                    <Link href="/login">Login</Link>
                  </Button>
                )}
                {pathname !== '/signup' && (
                  <Button asChild>
                    <Link href="/signup">Sign Up</Link>
                  </Button>
                )}
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
