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

    const role = user.role?.toLowerCase() || 'student';
    router.push(`/dashboard/${role}`);
  }, [user, isLoading, router]);

  
  return null;
}