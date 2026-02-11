// app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/SessionProvider';

export default function DashboardIndex() {
  const router = useRouter();
  const { user, isLoading } = useSession();

  useEffect(() => {
    if (isLoading) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Redirect to role-specific dashboard
    const role = user.role?.toLowerCase() || 'student';
    router.push(`/dashboard/${role}`);
  }, [user, isLoading, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
        <p className="text-muted-foreground">Redirecting to your dashboard...</p>
      </div>
    </div>
  );
}