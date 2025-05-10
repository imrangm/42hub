
'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export interface CustomUser { // Exporting for use in actions.ts
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
  signInOAuthUser: (oauthUser: CustomUser) => Promise<void>; // New method for OAuth
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
    await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API call

    const matchedUserEntry = MOCK_USERS[username.toLowerCase()];

    if (matchedUserEntry && matchedUserEntry.passwordHash === password) {
      setUser(matchedUserEntry.user);
      sessionStorage.setItem('currentUser', JSON.stringify(matchedUserEntry.user));
      toast({ title: 'Login Successful', description: `Welcome, ${matchedUserEntry.user.displayName || matchedUserEntry.user.username}!` });
      
      if (matchedUserEntry.user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      toast({ title: 'Login Failed', description: 'Invalid username or password.', variant: 'destructive' });
      setUser(null); // Ensure user state is cleared on failure
      sessionStorage.removeItem('currentUser');
    }
    setLoading(false);
  };

  const signInOAuthUser = async (oauthUser: CustomUser) => {
    setLoading(true);
    // Here, you might want to check if this OAuth user already exists in your system
    // or create/update their record. For this mock, we'll just use the provided user.
    setUser(oauthUser);
    sessionStorage.setItem('currentUser', JSON.stringify(oauthUser));
    toast({ title: 'Login Successful', description: `Welcome, ${oauthUser.displayName || oauthUser.username}!` });
    
    // OAuth users are typically regular users, redirect to dashboard
    router.push('/dashboard');
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    const isAdminPage = pathname.startsWith('/admin');
    setUser(null);
    sessionStorage.removeItem('currentUser');
    toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    
    if (isAdminPage && pathname !== '/admin/login') {
      router.push('/admin/login');
    } else if (!isAdminPage && pathname !== '/login') {
      router.push('/login');
    }
    // If already on a login page, no need to push again.
    setLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, loading, signInWithCredentials, signInOAuthUser, signOut, role: user?.role || null }}>
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
