
'use client';

import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Image from 'next/image';
import { BookOpen, Users, Zap, LogIn, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function LandingPage() {
  const { user, signInWithGoogle, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const handleSignIn = async () => {
    await signInWithGoogle();
    // Navigation to /dashboard is handled by useEffect or AuthProvider
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900 text-white">
      {/* Hero Section */}
      <section className="relative flex flex-col items-center justify-center flex-grow px-4 py-16 text-center bg-cover bg-center"
               style={{ backgroundImage: "url('https://picsum.photos/seed/campus-hero/1920/1080')" }}
               data-ai-hint="modern university campus">
        <div className="absolute inset-0 bg-black opacity-60"></div>
        <div className="relative z-10 max-w-3xl">
          <h1 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight">
            Unlock Your Campus Potential
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            Discover events, connect with peers, and supercharge your university experience with Campus Hub.
          </p>
          {loading ? (
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-lg shadow-xl" disabled>
              <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Authenticating...
            </Button>
          ) : !user ? (
            <Button 
              onClick={handleSignIn} 
              size="lg" 
              className="bg-accent hover:bg-accent/80 text-accent-foreground text-lg px-8 py-3 rounded-lg shadow-xl transform transition-transform hover:scale-105"
            >
              <LogIn className="mr-3 h-6 w-6" /> Login with Google
            </Button>
          ) : (
             <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-3 rounded-lg shadow-xl" asChild>
               <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          )}
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary-foreground">Why Campus Hub?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-700 p-8 rounded-xl shadow-2xl transform transition-transform hover:scale-105 hover:shadow-accent/30">
              <div className="flex items-center justify-center mb-6">
                <BookOpen className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center text-primary-foreground">Discover Events</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Never miss out on workshops, seminars, club meetings, or social gatherings on campus.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-2xl transform transition-transform hover:scale-105 hover:shadow-accent/30">
              <div className="flex items-center justify-center mb-6">
                <Users className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center text-primary-foreground">Connect with Peers</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Find like-minded individuals and build your network by attending events that match your interests.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-2xl transform transition-transform hover:scale-105 hover:shadow-accent/30">
              <div className="flex items-center justify-center mb-6">
                <Zap className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center text-primary-foreground">Stay Organized</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Keep track of your event registrations and campus activities all in one place.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-gray-900 border-t border-gray-700">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} Campus Hub. Inspired by innovation.</p>
      </footer>
    </div>
  );
}
