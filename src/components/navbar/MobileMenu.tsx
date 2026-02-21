'use client';

import { useState } from 'react';
import Link from 'next/link';
import { LogOut, Menu} from 'lucide-react';
import { motion } from 'framer-motion';
import { Sheet, SheetContent, SheetTrigger, SheetTitle, SheetDescription } from '../ui/sheet';
import { Button } from '../ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { useCategories } from '@/hooks/useCategories';
import { Skeleton } from '@/components/ui/skeleton';
import { LogoutDialog } from '@/components/auth/LogoutDialog';
import { useSession } from '@/providers/SessionProvider';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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

interface MobileMenuProps {
  isLoggedIn: boolean;
  isLoading?: boolean;
}

export function MobileMenu({ isLoggedIn, isLoading }: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { categories, isLoading: isCategoriesLoading } = useCategories();
  const { user } = useSession();

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-full sm:w-80 overflow-y-auto">
        <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
        <SheetDescription className="sr-only">
          Main navigation menu for mobile devices
        </SheetDescription>

        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 20 }}
          transition={{ duration: 0.2 }}
          className="flex flex-col min-h-full pb-6"
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
          ) : isLoggedIn && user ? (
            <div className="flex items-center space-x-4 p-4 border-b">
              <Avatar className="h-10 w-10">
                <AvatarImage src={user.image || undefined} alt={user.name} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <p className="text-sm font-medium">{user.name}</p>
                <p className="text-xs text-muted-foreground">{user.email}</p>
              </div>
            </div>
          ) : null}

          {/* Routes */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            <Link
              href="/tutors"
              className="block text-sm font-medium hover:text-primary transition-colors py-2"
              onClick={() => setIsOpen(false)}
            >
              Tutors
            </Link>

            <Accordion type="single" collapsible className="w-full">
              <AccordionItem value="categories" className="border-b-0">
                <AccordionTrigger className="py-2 text-sm font-medium hover:text-primary hover:no-underline">
                  Categories
                </AccordionTrigger>
                <AccordionContent>
                  <div className="flex flex-col space-y-1 pl-4 pt-1">
                    {isCategoriesLoading ? (
                      <div className="space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ) : categories.length === 0 ? (
                      <p className="text-sm text-muted-foreground italic">No categories found</p>
                    ) : (
                      categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.id}`}
                          className="block text-sm text-muted-foreground hover:text-primary transition-colors py-2"
                          onClick={() => setIsOpen(false)}
                        >
                          {category.name}
                        </Link>
                      ))
                    )}
                  </div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>

            {navLinks.slice(1).map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block text-sm font-medium hover:text-primary transition-colors py-2"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            {/* Dashboard Links */}
            {isLoading ? (
               <div className="pt-2 space-y-2">
                 <Skeleton className="h-4 w-20 mb-2" />
                 <Skeleton className="h-4 w-full" />
                 <Skeleton className="h-4 w-full" />
               </div>
            ) : isLoggedIn && (
              <div className="pt-4 mt-4 border-t">
                <p className="text-xs uppercase tracking-wider text-muted-foreground font-semibold mb-3">Dashboard</p>
                {dashboardLinks.map((link) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="block text-sm font-medium hover:text-primary transition-colors py-2"
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
              <div className="flex flex-col gap-2">
                <Button variant="outline" className="w-full" asChild>
                  <Link href="/sign-up" onClick={() => setIsOpen(false)}>Sign Up</Link>
                </Button>
                <Button className="w-full" asChild>
                  <Link href="/sign-in" onClick={() => setIsOpen(false)}>Sign In</Link>
                </Button>
              </div>
            ) : (
              <LogoutDialog 
                trigger={
                  <Button variant="destructive" className="w-full justify-start">
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