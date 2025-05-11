'use client';

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter, useSearchParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LogIn, AlertTriangle } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator';
import { handle42Callback } from './actions';

// Dynamically import components that use browser APIs
const DynamicImage = dynamic(() => import('next/image'), { ssr: false });

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

// Placeholder 42 icon component
const Icon42 = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signInWithCredentials, signInOAuthUser, user, loading: authLoading, role } = useAuth();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [mounted, setMounted] = useState(false);

  const [oauthProcessing, setOAuthProcessing] = useState(false);
  const [oauthError, setOAuthError] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  // Set mounted state after component mounts
  useEffect(() => {
    setMounted(true);
    setIsClient(true);
  }, []);

  // Effect to handle 42 OAuth callback if 'code' or 'error' params are present
  useEffect(() => {
    if (!mounted) return;

    const code = searchParams.get('code');
    const error = searchParams.get('error');
    const errorDescription = searchParams.get('error_description');

    if (code || error) {
      setOAuthProcessing(true);
      setOAuthError(null);

      if (authLoading) return;

      if (user) {
        router.push(user.role === 'admin' ? '/admin' : '/dashboard');
        return;
      }

      if (error) {
        setOAuthError(errorDescription || error || '42 authentication failed.');
        setOAuthProcessing(false);
        return;
      }

      if (code) {
        async function processCallback() {
          const result = await handle42Callback(code as string);
          if (result.success && result.user) {
            await signInOAuthUser(result.user);
          } else {
            setOAuthError(result.error || 'Failed to process 42 login.');
            setOAuthProcessing(false);
          }
        }
        processCallback();
      } else {
        setOAuthError('Invalid OAuth callback state: No code received.');
        setOAuthProcessing(false);
      }
    }
  }, [searchParams, signInOAuthUser, router, user, authLoading, mounted]);

  // Effect to redirect already logged-in users
  useEffect(() => {
    if (!mounted) return;

    if (!authLoading && user) {
      if (!searchParams.get('code') && !searchParams.get('error')) {
        if (role === 'admin') router.push('/admin');
        else router.push('/dashboard');
      }
    }
  }, [user, authLoading, role, router, searchParams, mounted]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmittingForm(true);
    await signInWithCredentials(data.username, data.password);
    setIsSubmittingForm(false);
  };

  const handle42Login = () => {
    if (!mounted) return;

    const clientId = process.env.NEXT_PUBLIC_FORTYTWO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_FORTYTWO_REDIRECT_URI;
    
    if (!clientId || !redirectUri) {
      alert("42 OAuth is not configured correctly. Please check your environment variables.");
      return;
    }

    const scope = "public";
    const responseType = "code";
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  // Show loading state during SSR
  if (!mounted) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
        <Card className="w-full max-w-md shadow-2xl">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="mt-4 text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  // OAuth Callback Processing UI
  if (oauthProcessing) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center py-8">
            <Image 
              src="https://picsum.photos/seed/login-logo/150/50" 
              alt="Campus Hub Logo" 
              width={150} 
              height={50} 
              className="mx-auto mb-4"
              priority
            />
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-3 pb-8">
            <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
            <CardTitle className="text-2xl">Processing 42 Login...</CardTitle>
            <CardDescription>Please wait while we verify your identity.</CardDescription>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (oauthError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
        <Card className="w-full max-w-md shadow-xl">
          <CardHeader className="text-center py-8">
            <Image 
              src="https://picsum.photos/seed/login-logo/150/50" 
              alt="Campus Hub Logo" 
              width={150} 
              height={50} 
              className="mx-auto mb-4"
              priority
            />
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center space-y-3 pb-8">
            <AlertTriangle className="h-12 w-12 text-destructive mb-4" />
            <CardTitle className="text-2xl text-destructive">Login Failed</CardTitle>
            <CardDescription>{oauthError}</CardDescription>
            <Button onClick={() => router.push('/login')} variant="link" className="mt-4">
              Return to Login
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Loading state for auth check
  if (authLoading || (!authLoading && user)) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
          {user ? (role === 'admin' ? 'Redirecting to Admin...' : 'Redirecting to Dashboard...') : 'Loading session...'}
        </p>
      </div>
    );
  }

  // Standard Login Form UI
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
          <Image 
            src="https://picsum.photos/seed/login-logo/150/50" 
            alt="Campus Hub Logo" 
            width={150} 
            height={50} 
            className="mx-auto mb-4"
            priority
          />
          <CardTitle className="text-3xl font-bold text-primary">Welcome Back</CardTitle>
          <CardDescription>Sign in to access your Campus Hub account.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input 
                id="username" 
                {...register('username')} 
                placeholder="e.g., admin or user1" 
                autoComplete="username"
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...register('password')} 
                placeholder="Enter your password" 
                autoComplete="current-password"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full text-lg py-3" disabled={isSubmittingForm || authLoading}>
              {isSubmittingForm || authLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              Sign In with Credentials
            </Button>
            <p className="text-xs text-muted-foreground text-center">
              Admin: admin/admin <br /> User: user1/userpass
            </p>

            <div className="relative w-full my-2">
              <Separator />
              <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-card px-2 text-xs text-muted-foreground">
                OR
              </span>
            </div>

            <Button 
              type="button" 
              variant="outline" 
              className="w-full text-lg py-3" 
              onClick={handle42Login}
              disabled={authLoading}
            >
              <Icon42 className="mr-2 h-5 w-5" />
              Sign in with 42
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

