'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  User as FirebaseUser,
} from 'firebase/auth';
import {
  doc,
  setDoc,
  getDoc,
  addDoc,
  collection,
  query,
  orderBy,
  onSnapshot,
  Timestamp,
  serverTimestamp,
} from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import type { User, Post } from '@/lib/types';
import { useToast } from "@/hooks/use-toast";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password_unused: string) => void;
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
  const { toast } = useToast();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: FirebaseUser | null) => {
      if (firebaseUser) {
        const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
        if (userDoc.exists()) {
          setUser({ id: firebaseUser.uid, ...userDoc.data() } as User);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) {
      setUserPosts([]);
      // Optionally clear all posts or fetch public posts
      // setAllPosts([]); 
      return;
    };
    
    const postsQuery = query(collection(db, 'posts'), orderBy('createdAt', 'desc'));
    
    const unsubscribe = onSnapshot(postsQuery, (querySnapshot) => {
      const posts = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        createdAt: (doc.data().createdAt as Timestamp).toDate(),
      } as Post));
      setAllPosts(posts);
      setUserPosts(posts.filter(p => p.authorId === user.id));
    });

    return () => unsubscribe();
  }, [user]);

  const login = async (email: string) => {
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, 'password'); // Using dummy password as per original logic
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const signup = async (name: string, email: string) => {
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, 'password'); // Dummy password
      const newUser: User = {
        id: userCredential.user.uid,
        name,
        email,
        bio: 'New to ReflectZen!',
      };
      await setDoc(doc(db, 'users', newUser.id), { name: newUser.name, email: newUser.email, bio: newUser.bio });
      setUser(newUser);
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await signOut(auth);
    router.push('/login');
  };

  const createPost = async (postData: Omit<Post, 'id' | 'authorId' | 'authorName' | 'createdAt'>) => {
    if (user) {
      const newPost = {
        ...postData,
        authorId: user.id,
        authorName: user.name,
        createdAt: serverTimestamp(),
      };
      await addDoc(collection(db, 'posts'), newPost);
      router.push('/profile');
       toast({
        title: "Post Created",
        description: "Your new post has been published.",
      });
    }
  };

  const updateProfile = async (name: string, bio: string) => {
     if (user) {
        const userRef = doc(db, 'users', user.id);
        await setDoc(userRef, { name, bio }, { merge: true });
        setUser(prevUser => prevUser ? { ...prevUser, name, bio } : null);
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
