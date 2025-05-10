
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { PlusCircle, LogOut, UserCircle, Loader2, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function Header() {
  const { user, signOut, loading } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={user ? "/dashboard" : "/"} className="text-2xl font-bold hover:opacity-90 transition-opacity">
          Campus Hub
        </Link>
        <div className="flex items-center gap-4">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
          ) : user ? (
            <>
              <Button asChild variant="secondary">
                <Link href="/events/create">
                  <PlusCircle className="mr-2 h-5 w-5" /> Create Event
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || undefined} alt={user.displayName || user.email || 'User'} />
                      <AvatarFallback>
                        {user.displayName ? user.displayName.charAt(0).toUpperCase() : <UserCircle className="h-5 w-5"/>}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || "User"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user.email}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/admin">
                      <ShieldCheck className="mr-2 h-4 w-4" />
                      Admin Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={signOut} className="cursor-pointer">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            // Login button is primarily on the landing page. Header might not need one if on unauthenticated pages.
            // Or it could link to the landing page if the user somehow lands on an auth-intended page without being logged in.
            // For now, if no user, this part of header might be minimal or guide to login.
            // This case should ideally be handled by AuthenticatedLayout redirecting.
             <Button asChild variant="secondary">
                <Link href="/">
                   Sign In
                </Link>
              </Button>
          )}
        </div>
      </div>
    </header>
  );
}
