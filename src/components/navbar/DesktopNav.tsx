
'use client'; 

import Link from 'next/link';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils'; // assuming you have cn from shadcn

const categories = ['Math', 'Science', 'English', 'History', 'Languages'];
const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function DesktopNav() {
  return (
    <nav className="hidden md:flex flex-1 items-center justify-center">
      <NavigationMenu>
        <NavigationMenuList className="gap-2 lg:gap-4">
          {navLinks.map((link) => (
            <NavigationMenuItem key={link.label}>
              <NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
                <Link
                  href={link.href}
                  className={cn(
                    "text-sm font-medium transition-colors",
                    "hover:text-primary data-active:text-primary data-active:font-semibold"
                  )}
                >
                  {link.label}
                </Link>
              </NavigationMenuLink>
            </NavigationMenuItem>
          ))}

          <NavigationMenuItem>
            <NavigationMenuTrigger className={cn(
              navigationMenuTriggerStyle(),
              "data-[state=open]:bg-accent/70 data-[state=open]:text-primary"
            )}>
              Categories
            </NavigationMenuTrigger>
            <NavigationMenuContent>
              <motion.ul
                initial={{ opacity: 0, y: 8, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 4, scale: 0.97 }}
                transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
                className="grid w-[380px] sm:w-[420px] gap-2 p-4 md:w-[480px] lg:w-[520px] md:grid-cols-2"
              >
                {categories.map((category) => (
                  <li key={category}>
                    <NavigationMenuLink asChild>
                      <Link
                        href={`/categories/${category.toLowerCase()}`}
                        className={cn(
                          "block select-none rounded-md px-4 py-2.5 text-sm",
                          "no-underline outline-none transition-all",
                          "hover:bg-accent hover:text-accent-foreground",
                          "focus:bg-accent focus:text-accent-foreground"
                        )}
                      >
                        {category}
                      </Link>
                    </NavigationMenuLink>
                  </li>
                ))}
              </motion.ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}