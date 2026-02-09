"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { authClient } from '@/lib/auth-client';

export default function DashboardIndex() {
  const router = useRouter();

  useEffect(() => {
    const redirectToDashboard = async () => {
      try {
        const result = await authClient.getSession();
        const session = result?.data;
        
        if (!session?.user) {
          router.push('/sign-in');
          return;
        }

        const userRole = ((session.user as any)?.role || 'STUDENT') as 'STUDENT' | 'TUTOR' | 'ADMIN';
        const dashboardPath: Record<'STUDENT' | 'TUTOR' | 'ADMIN', string> = {
          STUDENT: '/dashboard/student',
          TUTOR: '/dashboard/tutor',
          ADMIN: '/dashboard/admin',
        };

        router.push(dashboardPath[userRole] || '/dashboard/student');
      } catch (error) {
        console.error('Failed to get session:', error);
        router.push('/sign-in');
      }
    };

    redirectToDashboard();
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    </div>
  );
}
