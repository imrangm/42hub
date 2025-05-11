'use client'; // Add this if not already present, for useEffect

import type { ReactNode } from 'react'; // Keep this for type consistency
import { useEffect } from 'react'; // Import useEffect
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext'; 
import Head from 'next/head';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

// Metadata should be defined in a server component or page.tsx directly for App Router.
// If this file needs to be client component due to useEffect, metadata export here won't work as expected.
// For simplicity, I'm keeping it here, but in a real app, move to a server component parent or page.tsx.
// export const metadata: Metadata = { 
//   title: 'Campus Hub',
//   description: 'Your central place for campus events.',
//   manifest: '/manifest.json', // Link to manifest
// };

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/sw.js')
        .then((registration) => console.log('Service Worker registered with scope:', registration.scope))
        .catch((error) => console.error('Service Worker registration failed:', error));
    }
  }, []);

  useEffect(() => {
    document.title = '42 Abu Dhabi Campus Hub';
    
    const existingFavicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement | null;
    if (existingFavicon) {
      existingFavicon.href = '/favicon.svg';
      existingFavicon.type = 'image/svg+xml';
    } else {
      const favicon = document.createElement('link') as HTMLLinkElement;
      favicon.type = 'image/svg+xml';
      favicon.rel = 'icon';
      favicon.href = '/favicon.svg';
      document.getElementsByTagName('head')[0].appendChild(favicon);
    }
  }, []);

  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#002e5d" />
        <link rel="manifest" href="/manifest.json" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

