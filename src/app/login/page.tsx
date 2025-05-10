
'use client';

import { useEffect, useState } from 'react';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, LogIn } from 'lucide-react';
import Image from 'next/image';
import { Separator } from '@/components/ui/separator'; // Import Separator

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
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon> {/* Simple representation */}
  </svg>
);


export default function LoginPage() {
  const router = useRouter();
  const { signInWithCredentials, user, loading: authLoading, role } = useAuth();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!authLoading && user) {
      if (role === 'admin') router.push('/admin');
      else router.push('/dashboard');
    }
  }, [user, authLoading, role, router]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmittingForm(true);
    await signInWithCredentials(data.username, data.password);
    setIsSubmittingForm(false);
  };

  const handle42Login = () => {
    const clientId = process.env.NEXT_PUBLIC_FORTYTWO_CLIENT_ID;
    const redirectUri = process.env.NEXT_PUBLIC_FORTYTWO_REDIRECT_URI;
    
    if (!clientId || clientId === "YOUR_CLIENT_ID" || !redirectUri || redirectUri.includes("YOUR_REDIRECT_URI")) {
      alert("42 OAuth is not configured correctly. Please check environment variables.");
      return;
    }

    const scope = "public"; // Basic scope
    const responseType = "code";
    const authUrl = `https://api.intra.42.fr/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=${responseType}&scope=${encodeURIComponent(scope)}`;
    window.location.href = authUrl;
  };

  if (authLoading || (!authLoading && user) ) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
           { user ? (role === 'admin' ? 'Redirecting to Admin...' : 'Redirecting to Dashboard...') : 'Loading session...' }
        </p>
      </div>
    );
  }

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
            data-ai-hint="abstract logo"
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
