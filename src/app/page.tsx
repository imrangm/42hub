'use client';

import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { BookOpen, Users, Zap, ArrowRightCircle, LogIn, Loader2 } from 'lucide-react'; // Added Loader2
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

export default function LandingPage() {
  const router = useRouter();
  const { user, loading } = useAuth();

  const handleGetStartedClick = () => {
    if (user) {
      if (user.role === 'admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }
    } else {
      router.push('/login');
    }
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
            42 Abu Dhabi Campus Hub
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-10">
            Where coding meets community. Your hub for campus life and peer learning.
          </p>
          <Button 
            onClick={handleGetStartedClick}
            size="lg" 
            className="bg-accent hover:bg-accent/80 text-accent-foreground text-lg px-8 py-3 rounded-lg shadow-xl transform transition-transform hover:scale-105"
            disabled={loading}
          >
            {loading ? <Loader2 className="mr-3 h-6 w-6 animate-spin" /> : 
             user ? <ArrowRightCircle className="mr-3 h-6 w-6" /> : <LogIn className="mr-3 h-6 w-6" /> }
            {user ? (user.role === 'admin' ? 'Go to Admin Panel' : 'Go to Dashboard') : 'Sign In'}
          </Button>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-gray-800">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-12 text-primary-foreground">Why 42Hub?</h2>
          <div className="grid md:grid-cols-3 gap-10">
            <div className="bg-gray-700 p-8 rounded-xl shadow-2xl transform transition-transform hover:scale-105 hover:shadow-accent/30">
              <div className="flex items-center justify-center mb-6">
                <BookOpen className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center text-primary-foreground">Peer Learning</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Join coding workshops, peer evaluations, and collaborative learning sessions.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-2xl transform transition-transform hover:scale-105 hover:shadow-accent/30">
              <div className="flex items-center justify-center mb-6">
                <Users className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center text-primary-foreground">Community Events</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Connect through hackathons, tech talks, and social gatherings.
              </p>
            </div>
            <div className="bg-gray-700 p-8 rounded-xl shadow-2xl transform transition-transform hover:scale-105 hover:shadow-accent/30">
              <div className="flex items-center justify-center mb-6">
                <Zap className="h-12 w-12 text-accent" />
              </div>
              <h3 className="text-2xl font-semibold mb-3 text-center text-primary-foreground">Stay Updated</h3>
              <p className="text-gray-400 text-center leading-relaxed">
                Never miss important events, evaluations, or community activities.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center bg-gray-900 border-t border-gray-700">
        <p className="text-gray-500">&copy; {new Date().getFullYear()} 42Hub. All rights reserved.</p>
      </footer>
    </div>
  );
}
