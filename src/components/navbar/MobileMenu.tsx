// components/navbar/MobileMenu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';

// Fake data
const categories = ['Math', 'Science', 'English', 'History', 'Languages'];
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];
const dashboardLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Upcoming Bookings', href: '/bookings' },
  { label: 'Hire Tutors', href: '/hire' },
  { label: 'Profile', href: '/profile' },
];
const fakeUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: '/placeholder-avatar.jpg',
};

interface MobileMenuProps {
  isLoggedIn: boolean;
}

export function MobileMenu({ isLoggedIn }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-75 sm:w-100">
        <motion.div
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 50 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          className="flex flex-col h-full"
        >
          {/* Top User Info */}
          {isLoggedIn && (
            <div className="flex items-center space-x-4 p-4 border-b">
              <Avatar className="h-10 w-10">
                <AvatarImage src={fakeUser.avatar || undefined} alt={fakeUser.name} />
                <AvatarFallback>{fakeUser.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{fakeUser.name}</p>
                <p className="text-xs text-muted-foreground">{fakeUser.email}</p>
              </div>
            </div>
          )}

          {/* Routes */}
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-medium hover:text-accent-foreground transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div>
              <p className="text-sm font-medium mb-2">Categories</p>
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/categories/${category.toLowerCase()}`}
                  className="block text-sm hover:text-accent-foreground transition-colors pl-4"
                  onClick={() => setIsOpen(false)}
                >
                  {category}
                </Link>
              ))}
            </div>
            {isLoggedIn && (
              <>
                <p className="text-sm font-medium mt-4">Dashboard</p>
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm hover:text-accent-foreground transition-colors pl-4"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </>
            )}
          </nav>

          {/* Bottom Auth */}
          <div className="p-4 border-t">
            {!isLoggedIn ? (
              <div className="flex space-x-4">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/signin" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
              </div>
            ) : (
              <Button variant="outline" className="w-full">
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            )}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}