'use client';

import type { ReactNode } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext'; 
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

export default function AdminLayout({ children }: { children: ReactNode }) {
  const { user, loading, role } = useAuth(); 
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.replace('/');
        return;
      }
      if (role !== 'admin') {
        toast({
          title: 'Access Denied',
          description: 'You do not have permission to access the admin area.',
          variant: 'destructive',
        });
        router.replace('/');
      }
    }
  }, [user, loading, role, router, toast]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading...</p>
      </div>
    );
  }

  if (!user || role !== 'admin') {
    return null;
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-muted text-muted-foreground py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Campus Hub - Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}
