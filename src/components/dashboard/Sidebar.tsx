// src/components/dashboard/Sidebar.tsx
"use client";

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
  LogOut 
} from 'lucide-react';
import { useSession } from '@/providers/SessionProvider';
import { authClient } from '@/lib/auth-client';

const navigation = {
  STUDENT: [
    { name: 'Overview', href: '/dashboard/student', icon: LayoutDashboard },
    { name: 'Bookings', href: '/dashboard/student/bookings', icon: Calendar },
    { name: 'Reviews', href: '/dashboard/student/reviews', icon: Star },
    { name: 'Profile', href: '/dashboard/student/profile', icon: User },
  ],
  TUTOR: [
    { name: 'Overview', href: '/dashboard/tutor', icon: LayoutDashboard },
    { name: 'Bookings', href: '/dashboard/tutor/bookings', icon: Calendar },
    { name: 'Reviews', href: '/dashboard/tutor/reviews', icon: Star },
    { name: 'Profile', href: '/dashboard/tutor/profile', icon: User },
  ],
  ADMIN: [
    { name: 'Overview', href: '/dashboard/admin', icon: LayoutDashboard },
    { name: 'Categories', href: '/dashboard/admin/categories', icon: FolderOpen },
    { name: 'Users', href: '/dashboard/admin/users', icon: Users },
    { name: 'Bookings', href: '/dashboard/admin/bookings', icon: Calendar },
    { name: 'Applications', href: '/dashboard/admin/tutor-applications', icon: ClipboardList },
  ],
};

export default function Sidebar() {
  const pathname = usePathname();
  const { user, isLoading } = useSession();

  // Don't show skeleton - let global loading handle it
  if (isLoading || !user) return null;

  const userRole = user.role as 'STUDENT' | 'TUTOR' | 'ADMIN';
  const items = navigation[userRole];

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = '/sign-in';
  };

  return (
    <aside className="w-64 border-r bg-card h-screen sticky top-0 flex flex-col">
      <div className="p-4 border-b">
        <h2 className="font-bold text-lg">TutorLink</h2>
        <p className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()}</p>
      </div>

      <nav className="flex-1 p-2 space-y-1">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`);
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-muted hover:text-foreground'
              }`}
            >
              <item.icon className="h-4 w-4" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t">
        <button
          onClick={handleLogout}
          className="flex w-full items-center gap-3 px-3 py-2 text-sm font-medium text-destructive hover:bg-destructive/10 rounded-md transition-colors"
        >
          <LogOut className="h-4 w-4" />
          Sign Out
        </button>
      </div>
    </aside>
  );
}