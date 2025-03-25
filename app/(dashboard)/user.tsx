"use client"

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import {
  Avatar,
  AvatarFallback,
  AvatarImage
} from '@/components/ui/avatar'
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export function User() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  // Load user data from localStorage on component mount (client-side only)
  useEffect(() => {
    const username = localStorage.getItem('username')
    setUsername(username as string);
  }, []);

  // Get user initials from username
  const getUserInitials = (name:string) => {
    if (!name) return '?';
    
    // Split by spaces and get first letter of each part
    const parts = name.split(' ');
    if (parts.length === 1) {
      // If single name, use first 2 letters or just first letter if name is only 1 character
      return name.length > 1 ? name.substring(0, 2).toUpperCase() : name.substring(0, 1).toUpperCase();
    }
    
    // Otherwise use first letter of first and last parts
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  const handleSignOut = () => {
    // Clear all auth tokens from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    localStorage.removeItem('email');
    document.cookie = `authToken=; Max-Age=0; path=/;`;
    // Redirect to login page
    router.push('/login');
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full"
        >
          <Avatar>
            <AvatarImage src="/avatar-placeholder.png" alt="User avatar" />
            <AvatarFallback className={`bg-primary text-primary-foreground ${!username && "text-[10px]"}`}>
              {username ? getUserInitials(username) : 'GUEST'}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        {username && <DropdownMenuItem disabled>{username?.toUpperCase()}</DropdownMenuItem>}
        <DropdownMenuSeparator />
        {/* <DropdownMenuItem>Settings</DropdownMenuItem>
        <DropdownMenuItem>Support</DropdownMenuItem> */}
        <DropdownMenuSeparator />
        {username ? (
          <DropdownMenuItem asChild>
            <button 
              className="w-full text-left cursor-pointer" 
              onClick={handleSignOut}
            >
              Sign Out
            </button>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/login">Sign In</Link>
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}