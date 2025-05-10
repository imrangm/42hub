
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth, type CustomUser } from '@/contexts/AuthContext';
import { handle42Callback } from './actions';
import { Loader2, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function FortyTwoCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { signInOAuthUser, loading: authLoading, user: currentUser } = useAuth(); // Add signInOAuthUser to AuthContext

  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (currentUser && !authLoading) {
      // If user is already logged in, redirect them.
      router.push(currentUser.role === 'admin' ? '/admin' : '/dashboard');
      return;
    }

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (error) {
      setErrorMessage(errorDescription || error || '42 authentication failed.');
      setStatus('error');
      return;
    }

    if (!code) {
      setErrorMessage('No authorization code received from 42.');
      setStatus('error');
      router.push('/login'); // Or show an error page
      return;
    }

    async function processCallback() {
      const result = await handle42Callback(code as string);
      if (result.success && result.user) {
        await signInOAuthUser(result.user); // This will handle session, toast, and redirect
        setStatus('success');
        // Redirection is handled by signInOAuthUser
      } else {
        setErrorMessage(result.error || 'Failed to process 42 login.');
        setStatus('error');
      }
    }

    if (status === 'loading' && !currentUser) { // Only process if not already logged in
        processCallback();
    }
  }, [searchParams, router, signInOAuthUser, status, currentUser, authLoading]);

  let content;
  if (status === 'loading' || authLoading) {
    content = (
      <>
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <CardTitle className="text-2xl">Processing 42 Login...</CardTitle>
        <CardDescription>Please wait while we verify your 42 identity.</CardDescription>
      </>
    );
  } else if (status === 'success') {
    content = (
      <>
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <CardTitle className="text-2xl text-green-600">Login Successful!</CardTitle>
        <CardDescription>Redirecting you to your dashboard...</CardDescription>
      </>
    );
  } else { // status === 'error'
    content = (
      <>
        <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
        <CardTitle className="text-2xl text-destructive">Login Failed</CardTitle>
        <CardDescription>{errorMessage || 'An unknown error occurred.'}</CardDescription>
        <button onClick={() => router.push('/login')} className="mt-4 text-primary hover:underline">
          Try logging in again
        </button>
      </>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center">
          {/* Optional: Logo if desired */}
        </CardHeader>
        <CardContent className="flex flex-col items-center text-center space-y-2">
          {content}
        </CardContent>
      </Card>
    </div>
  );
}
