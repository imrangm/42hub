
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
import { Loader2, LogIn, ShieldAlert } from 'lucide-react';
import Image from 'next/image';

const loginSchema = z.object({
  username: z.string().min(1, { message: 'Username is required.' }),
  password: z.string().min(1, { message: 'Password is required.' }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function AdminLoginPage() {
  const router = useRouter();
  const { signInWithCredentials, user, loading: authLoading, role } = useAuth();
  const [isSubmittingForm, setIsSubmittingForm] = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
  });

  useEffect(() => {
    if (!authLoading && user) {
      if (role === 'admin') {
        // Redirect to admin dashboard or intended admin page
        // const intendedPath = sessionStorage.getItem('intendedAdminPath') || '/admin';
        // sessionStorage.removeItem('intendedAdminPath');
        router.push('/admin');
      } else {
        // If a non-admin somehow logs in via admin login, redirect to general dashboard
        router.push('/dashboard');
      }
    }
  }, [user, authLoading, role, router]);

  const onSubmit: SubmitHandler<LoginFormValues> = async (data) => {
    setIsSubmittingForm(true);
    await signInWithCredentials(data.username, data.password);
    setIsSubmittingForm(false);
    // Redirection is handled by useEffect or signInWithCredentials
  };

  if (authLoading || (!authLoading && user && role === 'admin') ) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">
          { user ? 'Redirecting to Admin Dashboard...' : 'Loading admin session...' }
        </p>
      </div>
    );
  }
  
  // If user is logged in but not admin, they shouldn't see this page.
  // This case should ideally be handled by the admin layout if they try to access /admin/* first.
  // If they directly navigate to /admin/login and are logged in as non-admin, redirect them.
   useEffect(() => {
    if (!authLoading && user && role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, role, router]);


  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-primary via-secondary to-accent p-4">
      <Card className="w-full max-w-md shadow-2xl">
        <CardHeader className="text-center">
           <Image 
            src="https://picsum.photos/seed/admin-logo/150/50" 
            alt="Campus Hub Admin Logo" 
            width={150} 
            height={50} 
            className="mx-auto mb-4"
            data-ai-hint="shield logo"
          />
          <CardTitle className="text-3xl font-bold text-primary flex items-center justify-center">
            <ShieldAlert className="mr-2 h-8 w-8 text-accent" /> Admin Sign In
          </CardTitle>
          <CardDescription>Access the Campus Hub Administration Panel.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Admin Username</Label>
              <Input 
                id="username" 
                {...register('username')} 
                placeholder="Enter admin username" 
                autoComplete="username"
              />
              {errors.username && <p className="text-sm text-destructive">{errors.username.message}</p>}
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Admin Password</Label>
              <Input 
                id="password" 
                type="password" 
                {...register('password')} 
                placeholder="Enter admin password" 
                autoComplete="current-password"
              />
              {errors.password && <p className="text-sm text-destructive">{errors.password.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button type="submit" className="w-full text-lg py-3" disabled={isSubmittingForm || authLoading}>
              {isSubmittingForm || authLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : <LogIn className="mr-2 h-5 w-5" />}
              Sign In to Admin Panel
            </Button>
             <p className="mt-4 text-xs text-muted-foreground text-center">
              Admin credentials: admin/admin
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
