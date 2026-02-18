// components/navbar/ClientNavbar.tsx
'use client';

import { Navbar } from '@/components/navbar/Navbar';
import { useSession } from '@/providers/SessionProvider';

export function ClientNavbar() {
  const { isLoading, isLoggedIn } = useSession();

  // Show navbar immediately, it will handle loading state internally
  return <Navbar isLoggedIn={isLoggedIn} />;
}