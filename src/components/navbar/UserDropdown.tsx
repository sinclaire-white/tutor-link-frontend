// components/navbar/UserDropdown.tsx
'use client';

import Link from 'next/link';
import { LogOut } from 'lucide-react';
import { motion } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown-menu';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Fake user data
const fakeUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/placeholder-avatar.jpg',
};

const dashboardLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Upcoming Bookings', href: '/bookings' },
  { label: 'Hire Tutors', href: '/hire' },
  { label: 'Profile', href: '/profile' },
];

export function UserDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage src={fakeUser.avatar || undefined} alt={fakeUser.name} />
            <AvatarFallback>{fakeUser.name.charAt(0)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56"
        align="end"
        forceMount
        asChild
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15 }}
        >
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{fakeUser.name}</p>
              <p className="text-xs leading-none text-muted-foreground">{fakeUser.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          {dashboardLinks.map((link) => (
            <DropdownMenuItem key={link.label} asChild>
              <Link href={link.href}>{link.label}</Link>
            </DropdownMenuItem>
          ))}
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </motion.div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}