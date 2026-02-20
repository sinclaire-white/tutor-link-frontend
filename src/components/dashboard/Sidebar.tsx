// src/components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Users,
  Calendar,
  FolderOpen,
  ClipboardList,
  User,
  Star,
  GraduationCap,
  Moon,
  Sun,
  BookOpen,
  LogOut,
} from 'lucide-react';
import { useSession } from '@/providers/SessionProvider';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { LogoutDialog } from '@/components/auth/LogoutDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const navigation = {
  STUDENT: [
    { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/student/bookings', icon: Calendar },
    { name: 'Browse Tutors', href: '/tutors', icon: GraduationCap },
    { name: 'My Reviews', href: '/dashboard/student/reviews', icon: Star },
    { name: 'My Profile', href: '/dashboard/student/profile', icon: User },
  ],
  TUTOR: [
    { name: 'Overview', href: '/dashboard/tutor', icon: LayoutDashboard },
    { name: 'My Bookings', href: '/dashboard/tutor/bookings', icon: Calendar },
    { name: 'My Reviews', href: '/dashboard/tutor/reviews', icon: Star },
    { name: 'Categories', href: '/categories', icon: BookOpen },
    { name: 'My Profile', href: '/dashboard/tutor/profile', icon: User },
  ],
  ADMIN: [
    { name: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'User Management', href: '/dashboard/admin/users', icon: Users },
    { name: 'Tutor Management', href: '/dashboard/admin/tutors', icon: GraduationCap },
    { name: 'Category Management', href: '/dashboard/admin/categories', icon: FolderOpen },
    { name: 'All Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
    { name: 'Tutor Applications', href: '/dashboard/admin/tutor-applications', icon: ClipboardList },
    { name: 'My Profile', href: '/dashboard/admin/profile', icon: User },
  ],
};

export function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useSession();
  const { theme, setTheme } = useTheme();

  if (isLoading || !user) return null;

  const userRole = user.role as 'STUDENT' | 'TUTOR' | 'ADMIN';
  const items = navigation[userRole];

  const isActive = (href: string) => {
    if (href === `/dashboard/${userRole.toLowerCase()}`) {
      return pathname === href;
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <div className="flex flex-col h-full bg-background border-r">
      {/* Header with User Info */}
      <div className="h-16 flex items-center px-6 border-b shrink-0">
         <Link href="/" className="flex items-center gap-2 font-bold text-xl">
           <div className="relative h-8 w-8">
             <Image 
               src="/Gemini_Generated_Image_hj5p24hj5p24hj5p.png" 
               alt="TutorLink" 
               fill
               sizes="32px"
               className="object-contain"
             />
           </div>
           <span>TutorLink</span>
         </Link>
      </div>

      <div className="p-4 shrink-0">
        <div className="flex items-center gap-3 p-3 bg-muted/40 rounded-lg border">
          <Avatar className="h-9 w-9 border-2 border-background">
            <AvatarImage src={user.image || ''} />
            <AvatarFallback className="bg-primary/10 text-primary">
              {user.name?.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
             <span className="text-sm font-semibold truncate text-foreground">
              {user.name}
             </span>
             <div className="flex items-center gap-1.5 min-w-0">
                <span className="text-xs text-muted-foreground capitalize truncate">
                 {userRole.toLowerCase()} Account
                </span>
             </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-2 space-y-1">
        {items?.map((item) => {
          const active = isActive(item.href);
           return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                active
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer Actions */}
      <div className="p-4 border-t mt-auto space-y-2 shrink-0">
         <div className="flex items-center justify-between px-2 pb-2">
             <span className="text-xs font-medium text-muted-foreground">Theme</span>
            <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 rounded-full"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                <span className="sr-only">Toggle theme</span>
            </Button>
         </div>
         <div className="pt-2">
            <LogoutDialog 
              trigger={
                <button className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              }
            /> 
         </div>
      </div>
    </div>
  );
}
