// src/components/dashboard/Sidebar.tsx
'use client';

import Link from 'next/link';
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
  Shield,
  BookOpen,
} from 'lucide-react';
import { useSession } from '@/providers/SessionProvider';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { LogoutDialog } from '@/components/auth/LogoutDialog';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'framer-motion';

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

export default function Sidebar() {
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

  const getRoleBadgeColor = () => {
    switch (userRole) {
      case 'ADMIN':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      case 'TUTOR':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'STUDENT':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20';
      default:
        return 'bg-muted text-muted-foreground border-border';
    }
  };

  const getRoleIcon = () => {
    switch (userRole) {
      case 'ADMIN':
        return <Shield className="h-3.5 w-3.5" />;
      case 'TUTOR':
        return <GraduationCap className="h-3.5 w-3.5" />;
      case 'STUDENT':
        return <BookOpen className="h-3.5 w-3.5" />;
      default:
        return null;
    }
  };

  return (
    <aside className="w-72 border-r bg-card h-screen sticky top-0 flex flex-col shadow-sm">
      {/* Header with User Info */}
      <div className="p-6 border-b bg-linear-to-br from-primary/5 via-primary/3 to-background">
        <Link href="/" className="block mb-4">
          <h2 className="font-bold text-2xl bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            TutorLink
          </h2>
        </Link>
        
        <div className="flex items-center gap-3 mt-4">
          <Avatar className="h-12 w-12 border-2 border-primary/20 shadow-sm">
            <AvatarImage src={user.image} alt={user.name || 'User'} />
            <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary font-semibold">
              {user.name?.charAt(0).toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="font-semibold truncate text-sm">{user.name || 'User'}</p>
            <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-xs font-medium border ${getRoleBadgeColor()} mt-1`}>
              {getRoleIcon()}
              <span className="capitalize">{userRole.toLowerCase()}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
        {items.map((item, index) => {
          const active = isActive(item.href);
          return (
            <motion.div
              key={item.name}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  active
                    ? 'bg-primary text-primary-foreground shadow-md shadow-primary/20 scale-[1.02]'
                    : 'text-muted-foreground hover:bg-muted hover:text-foreground hover:scale-[1.01]'
                }`}
              >
                <item.icon className="h-4.5 w-4.5 shrink-0" />
                <span className="flex-1">{item.name}</span>
                {active && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="h-1.5 w-1.5 rounded-full bg-primary-foreground"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            </motion.div>
          );
        })}
      </nav>

      {/* Footer with Theme Toggle & Logout */}
      <div className="p-4 border-t bg-muted/30 space-y-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="w-full justify-start gap-3 px-3.5 hover:bg-muted/80 transition-all"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="h-4 w-4" />
              <span className="flex-1 text-left">Light Mode</span>
            </>
          ) : (
            <>
              <Moon className="h-4 w-4" />
              <span className="flex-1 text-left">Dark Mode</span>
            </>
          )}
        </Button>

        <LogoutDialog
          trigger={
            <button className="flex w-full items-center gap-3 px-3.5 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-lg transition-all hover:scale-[1.01]">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0"
              >
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" x2="9" y1="12" y2="12" />
              </svg>
              <span className="flex-1 text-left">Sign Out</span>
            </button>
          }
        />
      </div>
    </aside>
  );
}