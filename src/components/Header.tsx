'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { LogOut, UserCircle, Loader2, ShieldCheck, LayoutDashboard } from 'lucide-react'; // Removed PlusCircle
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
  const { user, signOut, loading, role } = useAuth();

  return (
    <header className="bg-primary text-primary-foreground shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href={user ? (role === 'admin' ? "/admin" : "/dashboard") : "/"} className="text-2xl font-bold hover:opacity-90 transition-opacity">
          Campus Hub
        </Link>
        <div className="flex items-center gap-4">
          {loading ? (
            <Loader2 className="h-6 w-6 animate-spin text-primary-foreground" />
          ) : user ? (
            <>
              {/* Removed Create Event button from here for admin, it's available on admin pages */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-9 w-9">
                      <AvatarImage src={user.photoURL || `https://picsum.photos/seed/${user.username}/128`} alt={user.displayName || user.username} />
                      <AvatarFallback>
                        {(user.displayName || user.username) ? (user.displayName || user.username).charAt(0).toUpperCase() : <UserCircle className="h-5 w-5"/>}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user.displayName || user.username}
                      </p>
                      {user.email && (
                        <p className="text-xs leading-none text-muted-foreground">
                          {user.email}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {role === 'admin' && (
                    <DropdownMenuItem asChild className="cursor-pointer">
                      <Link href="/admin"> 
                        <ShieldCheck className="mr-2 h-4 w-4" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  )}
                   <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard">
                      <LayoutDashboard className="mr-2 h-4 w-4" /> 
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/profile">
                      <UserCircle className="mr-2 h-4 w-4" />
                      Profile
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
             <Button asChild variant="secondary">
                <Link href="/login"> 
                   Sign In
                </Link>
              </Button>
          )}
        </div>
      </div>
    </header>
  );
}

