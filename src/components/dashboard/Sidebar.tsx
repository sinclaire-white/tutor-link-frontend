"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, BarChart3, BookOpen, MessageSquare, Settings, LogOut, BookMarked } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function Sidebar() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  useEffect(() => {
    const getUser = async () => {
      try {
        const result = await authClient.getSession();
        const sessionData = result?.data;
        if (sessionData?.user) {
          setUser(sessionData.user);
        }
      } catch (error) {
        console.error("Failed to fetch user:", error);
      } finally {
        setLoading(false);
      }
    };
    getUser();
  }, []);

  const isActive = (path: string) => pathname === path;
  
  const getLinkClass = (path: string) => `
    flex items-center gap-3 px-3 py-2 rounded transition-colors
    ${isActive(path) 
      ? 'bg-primary text-primary-foreground' 
      : 'hover:bg-muted'
    }
  `;

  if (loading) {
    return (
      <aside className="w-72 border-r bg-muted/10 p-4">
        <div className="animate-pulse h-8 bg-muted rounded w-24"></div>
      </aside>
    );
  }

  const userRole = user?.role || 'STUDENT';

  const studentMenuItems = [
    { label: 'Profile', icon: Settings, path: '/dashboard/student#profile' },
    { label: 'Bookings', icon: BookMarked, path: '/dashboard/student#bookings' },
    { label: 'Reviews', icon: MessageSquare, path: '/dashboard/student#reviews' },
  ];

  const tutorMenuItems = [
    { label: 'Profile', icon: Settings, path: '/dashboard/tutor#profile' },
    { label: 'Bookings', icon: BookMarked, path: '/dashboard/tutor#bookings' },
    { label: 'Reviews', icon: MessageSquare, path: '/dashboard/tutor#reviews' },
  ];

  const adminMenuItems = [
    { label: 'Stats', icon: BarChart3, path: '/dashboard/admin#stats' },
    { label: 'Users', icon: Users, path: '/dashboard/admin#users' },
    { label: 'Bookings', icon: BookOpen, path: '/dashboard/admin#bookings' },
    { label: 'Tutors', icon: Users, path: '/dashboard/admin#tutors' },
    { label: 'Categories', icon: LayoutDashboard, path: '/dashboard/admin#categories' },
  ];

  let menuItems = studentMenuItems;
  if (userRole === 'TUTOR') menuItems = tutorMenuItems;
  if (userRole === 'ADMIN') menuItems = adminMenuItems;

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = '/sign-in';
  };

  return (
    <aside className="w-72 border-r pr-4 bg-linear-to-b from-muted/5 to-transparent">
      <div className="py-6 px-4 border-b">
        <div className="mb-2">
          <h3 className="text-lg font-semibold">TutorLink</h3>
          <p className="text-xs text-muted-foreground capitalize">{userRole.toLowerCase()} Dashboard</p>
        </div>
        {user?.name && (
          <p className="text-sm text-muted-foreground truncate">Welcome, {user.name.split(' ')[0]}</p>
        )}
      </div>

      <nav className="px-4 py-6 space-y-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.path} 
              href={item.path} 
              className={getLinkClass(item.path)}
            >
              <Icon className="h-4 w-4" />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t px-4 py-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 rounded text-sm font-medium hover:bg-destructive/10 text-destructive transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
}
