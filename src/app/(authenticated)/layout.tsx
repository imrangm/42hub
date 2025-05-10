
'use client';

import type { ReactNode } from 'react';
import Header from '@/components/Header';
import { useAuth } from '@/contexts/AuthContext'; 
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';

export default function AuthenticatedLayout({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth(); 
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading && !user) {
      // Store intended path to redirect after login, if desired
      // localStorage.setItem('intendedPath', pathname);
      router.push('/'); // Redirect to landing/login page
    }
  }, [user, loading, router, pathname]);

  if (loading || !user) { 
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading user session...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-muted text-muted-foreground py-6 text-center">
        <p>&copy; {new Date().getFullYear()} Campus Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}

