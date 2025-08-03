'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { MOCK_USERS, MOCK_POSTS } from '@/lib/mock-data';
import type { User, Post } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string) => void;
  logout: () => void;
  signup: (name: string, email: string) => void;
  createPost: (post: Omit<Post, 'id' | 'authorId' | 'authorName' | 'createdAt'>) => void;
  updateProfile: (name: string, bio: string) => void;
  userPosts: Post[];
  allPosts: Post[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userPosts, setUserPosts] = useState<Post[]>([]);
  const [allPosts, setAllPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('reflect-user');
      const storedPosts = localStorage.getItem('reflect-posts');

      if (storedUser) {
        const parsedUser: User = JSON.parse(storedUser);
        setUser(parsedUser);
        
        const posts: Post[] = storedPosts ? JSON.parse(storedPosts) : MOCK_POSTS;
        setAllPosts(posts);
        setUserPosts(posts.filter(p => p.authorId === parsedUser.id));

      } else {
        localStorage.setItem('reflect-posts', JSON.stringify(MOCK_POSTS));
        setAllPosts(MOCK_POSTS);
      }
    } catch (error) {
      console.error("Failed to parse from localStorage", error);
      // Initialize with default mock data if localStorage is corrupt
      localStorage.setItem('reflect-posts', JSON.stringify(MOCK_POSTS));
      setAllPosts(MOCK_POSTS);
    } finally {
      setLoading(false);
    }
  }, []);
  
  const login = (email: string) => {
    setLoading(true);
    const foundUser = MOCK_USERS.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      localStorage.setItem('reflect-user', JSON.stringify(foundUser));
      const posts = JSON.parse(localStorage.getItem('reflect-posts') || '[]');
      setUserPosts(posts.filter((p: Post) => p.authorId === foundUser.id));
      router.push('/');
    } else {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "No user found with that email.",
      });
    }
    setLoading(false);
  };

  const signup = (name: string, email: string) => {
    setLoading(true);
    const newUser: User = {
      id: String(Date.now()),
      name,
      email,
      bio: 'New to ReflectZen!',
    };
    MOCK_USERS.push(newUser); // In a real app, this would be an API call
    setUser(newUser);
    localStorage.setItem('reflect-user', JSON.stringify(newUser));
    setUserPosts([]);
    router.push('/');
    setLoading(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('reflect-user');
    router.push('/login');
  };

  const createPost = (postData: Omit<Post, 'id' | 'authorId' | 'authorName' | 'createdAt'>) => {
    if (user) {
      const newPost: Post = {
        ...postData,
        id: String(Date.now()),
        authorId: user.id,
        authorName: user.name,
        createdAt: new Date(),
      };
      const updatedPosts = [newPost, ...allPosts];
      setAllPosts(updatedPosts);
      setUserPosts(posts => [newPost, ...posts]);
      localStorage.setItem('reflect-posts', JSON.stringify(updatedPosts));
      router.push('/profile');
    }
  };

  const updateProfile = (name: string, bio: string) => {
     if (user) {
        const updatedUser = { ...user, name, bio };
        setUser(updatedUser);
        localStorage.setItem('reflect-user', JSON.stringify(updatedUser));
        toast({
            title: "Profile Updated",
            description: "Your changes have been saved successfully.",
        });
     }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, signup, createPost, updateProfile, userPosts, allPosts }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
