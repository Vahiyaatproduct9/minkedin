'use client';

import Link from 'next/link';
import { useAuth } from './providers/auth-provider';
import { Button } from './ui/button';
import { Feather, LogOut, User, PlusCircle } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export function Header() {
  const { user, logout } = useAuth();
  const pathname = usePathname();

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
                  variant="default"
                  asChild
                  className={cn(
                    'w-full sm:w-auto',
                    pathname === '/create' && 'bg-primary/10 text-primary'
                  )}
                  size="sm"
                >
                  <Link href="/create">
                    <PlusCircle className="mr-0 sm:mr-2 h-4 w-4" />
                    <span className="inline">Create Post</span>
                  </Link>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                       <Avatar className="h-8 w-8">
                          <AvatarImage src={`https://placehold.co/32x32.png`} data-ai-hint="avatar abstract" alt={user.name} />
                          <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                        </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                      <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                     <DropdownMenuItem asChild>
                       <Link href="/profile">
                          <User className="mr-2 h-4 w-4" />
                          <span>Profile</span>
                       </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={logout}>
                       <LogOut className="mr-2 h-4 w-4" />
                       <span>Log out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
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