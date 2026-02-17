// components/navbar/ClientNavbar.tsx
'use client';

import { Navbar } from '@/components/navbar/Navbar';
import { useSession } from '@/providers/SessionProvider';
import { Loader2 } from 'lucide-react';

export function ClientNavbar() {
  const { isLoading, isLoggedIn } = useSession();

  if (isLoading) {
    return (
      <div className="h-16 border-b flex items-center justify-center bg-background">
        <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return <Navbar isLoggedIn={isLoggedIn} />;
}