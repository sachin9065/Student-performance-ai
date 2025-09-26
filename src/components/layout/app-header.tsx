'use client';

import { useAuth } from '@/lib/auth';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Button } from '../ui/button';
import { SidebarTrigger } from '../ui/sidebar';
import { LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
  } from "@/components/ui/dropdown-menu"

export function AppHeader() {
  const { user, signOut } = useAuth();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:border-0 sm:bg-transparent sm:px-6">
       <SidebarTrigger className="sm:hidden" />
      <div className="relative ml-auto flex-1 md:grow-0">
        {/* Search can go here if needed */}
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
            <Button variant="outline" size="icon" className="overflow-hidden rounded-full">
                <Avatar>
                    <AvatarImage src={user?.photoURL || undefined} alt={user?.displayName || 'User'} />
                    <AvatarFallback>{user?.displayName?.[0] || user?.email?.[0]}</AvatarFallback>
                </Avatar>
            </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
            <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem disabled>{user?.email}</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={signOut}>
                <LogOut className="mr-2 h-4 w-4" />
                Logout
            </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}
