'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export interface CustomUser {
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
  signInOAuthUser: (oauthUser: CustomUser) => Promise<void>;
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
      // Redirection will be handled by the login page's useEffect
    } else {
      toast({ title: 'Login Failed', description: 'Invalid username or password.', variant: 'destructive' });
      setUser(null); 
      sessionStorage.removeItem('currentUser');
    }
    setLoading(false);
  };

  const signInOAuthUser = async (oauthUser: CustomUser) => {
    setLoading(true);
    setUser(oauthUser);
    sessionStorage.setItem('currentUser', JSON.stringify(oauthUser));
    toast({ title: 'Login Successful', description: `Welcome, ${oauthUser.displayName || oauthUser.username}!` });
    // Redirection will be handled by the login page's useEffect
    setLoading(false);
  };

  const signOut = async () => {
    setLoading(true);
    await new Promise(resolve => setTimeout(resolve, 300));
    setUser(null);
    sessionStorage.removeItem('currentUser');
    toast({ title: 'Signed Out', description: 'You have been successfully signed out.' });
    router.push('/'); // Always go to homepage after logout
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
