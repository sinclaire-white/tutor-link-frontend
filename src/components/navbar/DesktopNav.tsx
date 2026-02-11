// components/navbar/DesktopNav.tsx
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
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';
import { Loader2 } from 'lucide-react';

const navLinks = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export function DesktopNav() {
  const { categories, isLoading } = useCategories();

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
                className="grid w-95 sm:w-105 gap-2 p-4 md:w-120 lg:w-130 md:grid-cols-2"
              >
                {isLoading ? (
                  <li className="col-span-full flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                  </li>
                ) : categories.length === 0 ? (
                  <li className="col-span-full text-center py-4 text-sm text-muted-foreground">
                    No categories available
                  </li>
                ) : (
                  categories.map((category) => (
                    <li key={category.id}>
                      <NavigationMenuLink asChild>
                        <Link
                          href={`/categories/${category.id}`}
                          className={cn(
                            "block select-none rounded-md px-4 py-2.5 text-sm",
                            "no-underline outline-none transition-all",
                            "hover:bg-accent hover:text-accent-foreground",
                            "focus:bg-accent focus:text-accent-foreground"
                          )}
                        >
                          <div className="font-medium">{category.name}</div>
                          {category.description && (
                            <div className="text-xs text-muted-foreground truncate">
                              {category.description}
                            </div>
                          )}
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  ))
                )}
              </motion.ul>
            </NavigationMenuContent>
          </NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </nav>
  );
}