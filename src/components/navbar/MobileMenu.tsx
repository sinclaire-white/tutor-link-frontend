// components/navbar/MobileMenu.tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { LogoutDialog } from '@/components/auth/LogoutDialog';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'Tutors', href: '/tutors' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

const dashboardLinks = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Upcoming Bookings', href: '/bookings' },
  { label: 'Hire Tutors', href: '/tutors' },
  { label: 'Profile', href: '/profile' },
];

const fakeUser = {
  name: 'John Doe',
  email: 'john@example.com',
  avatar: undefined,
};

interface MobileMenuProps {
  isLoggedIn: boolean;
  isLoading?: boolean;
}

export function MobileMenu({ isLoggedIn, isLoading }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, isLoading: isCategoriesLoading } = useCategories();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-[300px]">
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col h-full"
        >
          {/* Top User Info - Loading State */}
          {isLoading ? (
            <div className="flex items-center space-x-4 p-4 border-b">
              <Skeleton className="h-10 w-10 rounded-full" />
              <div className="flex flex-col space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-3 w-32" />
              </div>
            </div>
          ) : isLoggedIn ? (
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
          ) : null}

          {/* Routes */}
          <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-medium hover:text-primary transition-colors py-1"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            
            <div className="pt-2">
              <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Categories</p>
              {isCategoriesLoading ? (
                <div className="space-y-2 pl-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              ) : categories.length === 0 ? (
                <p className="text-sm text-muted-foreground pl-2 italic">No categories found</p>
              ) : (
                <div className="grid grid-cols-1 gap-1 pl-2">
                  {categories.map((category) => (
                    <Link
                      key={category.id}
                      href={`/categories/${category.id}`}
                      className="block text-sm text-muted-foreground hover:text-foreground transition-colors py-1"
                      onClick={() => setIsOpen(false)}
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {/* Dashboard Links - Only show if logged in or loading (maybe?) - keeping logic simple: hide if not logged in */}
            {isLoading ? (
               <div className="pt-2 space-y-2">
                 <Skeleton className="h-4 w-20 mb-2" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
               </div>
            ) : isLoggedIn && (
              <div className="pt-2">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-2">Dashboard</p>
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm font-medium hover:text-primary transition-colors py-1 pl-2"
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            )}
          </nav>

          {/* Bottom Auth */}
          <div className="p-4 border-t mt-auto">
            {isLoading ? (
               <div className="flex gap-2">
                 <Skeleton className="h-10 w-full" />
                 <Skeleton className="h-10 w-full" />
               </div>
            ) : !isLoggedIn ? (
              <div className="flex flex-col gap-2 sm:flex-row">
                <Button variant="outline" className="flex-1" asChild>
                  <Link href="/signup" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
                <Button className="flex-1" asChild>
                  <Link href="/signin" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
              </div>
            ) : (
              <LogoutDialog 
                className="w-full justify-start text-destructive hover:bg-destructive/10 hover:text-destructive"
                variant="ghost" 
                trigger={
                  <Button variant="destructive" className="w-full">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                }
              />
            )}
          </div>
        </motion.div>
      </SheetContent>
    </Sheet>
  );
}