'use client';

import { Navbar } from '@/components/navbar/Navbar';
import { useSession } from '@/providers/SessionProvider';

export function ClientNavbar() {
  const { isLoading, isLoggedIn } = useSession();

  return <Navbar isLoggedIn={isLoggedIn} isLoading={isLoading} />;
}