
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

interface CustomUser {
  id: string;
  username: string;
  role: 'admin' | 'user';
  email?: string; 
  displayName?: string;
  photoURL?: string | null;
}

interface AuthContextType {
  user: CustomUser | null;
  loading: boolean;
  signInWithCredentials: (username: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  role: 'admin' | 'user' | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const MOCK_USERS: Record<string, { passwordHash: string; user: CustomUser }> = {
  admin: {
    passwordHash: 'admin',
    user: {
      id: 'admin-001',
      username: 'admin',
      role: 'admin',
      displayName: 'Administrator',
      email: 'admin@example.com',
      photoURL: null, 
    },
  },
  user1: {
    passwordHash: 'userpass',
    user: {
      id: 'user-001',
      username: 'user1',
      role: 'user',
      displayName: 'User One',
      email: 'user1@example.com',
      photoURL: null, 
    },
  },
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<CustomUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const { toast } = useToast();

  useEffect(() => {
    const sessionUserJson = sessionStorage.getItem('currentUser');
    if (sessionUserJson) {
      try {
        const sessionUser = JSON.parse(sessionUserJson) as CustomUser;
        setUser(sessionUser);
      } catch (error) {
        console.error("Failed to parse session user:", error);
        sessionStorage.removeItem('currentUser');
      }
    }
    setLoading(false);
  }, []);

  const signInWithCredentials = async (username: string, password: string) => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 500));

    const matchedUserEntry = MOCK_USERS[username.toLowerCase()];

    if (matchedUserEntry && matchedUserEntry.passwordHash === password) {
      setUser(matchedUserEntry.user);
      sessionStorage.setItem('currentUser', JSON.stringify(matchedUserEntry.user));
      toast({ title: 'Login Successful', description: `Welcome, ${matchedUserEntry.user.displayName || matchedUserEntry.user.username}!` });
      
      if (matchedUserEntry.user.role === 'admin') {
        // const intendedPath = sessionStorage.getItem('intendedAdminPath') || '/admin';
        // if (pathname.startsWith('/admin') && pathname !== '/admin/login') {
        //   router.push(pathname); // Redirect to originally intended admin page if applicable
        // } else {
        //   router.push('/admin');
        // }
        // sessionStorage.removeItem('intendedAdminPath');
        router.push('/admin');
      } else {
        // const intendedPath = sessionStorage.getItem('intendedPath') || '/dashboard';
        // if (!pathname.startsWith('/admin')) { // Don't redirect to non-admin page if trying to access admin
        //    router.push(intendedPath);
        // } else {
        //    router.push('/dashboard');
        // }
        // sessionStorage.removeItem('intendedPath');
        router.push('/dashboard');
      }
    } else {
      toast({ title: 'Login Failed', description: 'Invalid username or password.', variant: 'destructive' });
      setUser(null);
      sessionStorage.removeItem('currentUser');
    }
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const isAdminPage = pathname.startsWith('/admin');
    setUser(null);
    sessionStorage.removeItem('currentUser');
    toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    
    if (isAdminPage) {
      router.push('/admin/login');
    } else {
      router.push('/login');
    }
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithCredentials, signOut, role: user?.role || null }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
