
'use client'; // Add this if not already present, for useEffect

import type { ReactNode } from 'react'; // Keep this for type consistency
import { useEffect } from 'react'; // Import useEffect
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from '@/contexts/AuthContext'; 

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

  // If metadata needs to be dynamic or depend on client-side logic, it's more complex.
  // For static metadata, it's best in page.tsx or a server component layout.
  // Adding a simple dynamic title update as an example if needed, though manifest is static.
  useEffect(() => {
    document.title = 'Campus Hub';
    const link = document.createElement('link');
    link.rel = 'manifest';
    link.href = '/manifest.json';
    document.head.appendChild(link);
    return () => {
      document.head.removeChild(link);
    }
  }, []);


  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased flex flex-col min-h-screen bg-background`}>
        <AuthProvider>
          {children}
          <Toaster />
        </AuthProvider>
      </body>
    </html>
  );
}

