
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, UserCircle, Mail, Shield } from 'lucide-react';
import Image from 'next/image';

export default function ProfilePage() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-200px)] items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
        <p className="mt-4 text-lg text-muted-foreground">Loading profile...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex flex-col min-h-[calc(100vh-200px)] items-center justify-center text-center">
        <UserCircle className="h-16 w-16 text-destructive mb-4" />
        <h1 className="text-2xl font-semibold text-destructive mb-2">Profile Not Found</h1>
        <p className="text-muted-foreground">Please log in to view your profile.</p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="shadow-xl overflow-hidden">
        <div className="relative h-48 bg-gradient-to-r from-primary to-accent">
           <Image 
            src={`https://picsum.photos/seed/${user.id}/800/200`} 
            alt="Profile banner" 
            fill
            style={{objectFit:"cover"}}
            className="opacity-50"
            data-ai-hint="abstract geometric"
            />
          <div className="absolute bottom-0 left-0 p-6 transform translate-y-1/2">
            <Avatar className="h-32 w-32 border-4 border-background shadow-lg">
              <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.username}/128`} alt={user.displayName || user.username} />
              <AvatarFallback className="text-4xl bg-muted">
                {(user.displayName || user.username) ? (user.displayName || user.username).charAt(0).toUpperCase() : <UserCircle />}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
        
        <CardHeader className="pt-20 text-center"> {/* Add padding top to account for avatar */}
          <CardTitle className="text-3xl font-bold text-primary">{user.displayName || user.username}</CardTitle>
          <CardDescription className="text-md text-muted-foreground">{user.username}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-6 py-6 px-6 md:px-10">
          <div className="flex items-center space-x-3">
            <Mail className="h-5 w-5 text-accent" />
            <span className="text-foreground">{user.email || 'No email provided'}</span>
          </div>
          <div className="flex items-center space-x-3">
            <Shield className="h-5 w-5 text-accent" />
            <span className="text-foreground capitalize">Role: {user.role}</span>
          </div>

          {/* Placeholder for more profile details or actions */}
          {/* 
          <Separator />
          <div>
            <h4 className="text-lg font-semibold text-primary mb-2">Registered Events</h4>
            <p className="text-muted-foreground">Coming soon: A list of events you've registered for.</p>
          </div>
           */}
        </CardContent>
      </Card>
    </div>
  );
}
