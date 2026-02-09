'use client';

import { Navbar } from '@/components/navbar/Navbar';
import { useSession } from '@/providers/SessionProvider';

export function ClientNavbar() {
  const { isLoading, isLoggedIn } = useSession();

  if (isLoading) {
    return <Navbar isLoggedIn={false} />;
  }

  return <Navbar isLoggedIn={isLoggedIn} />;
}
