'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { authClient } from './auth-client';

interface SessionUser {
  id: string;
  name: string;
  email: string;
  role?: string;
  image?: string | null;
}

interface SessionContextType {
  user: SessionUser | null;
  isLoading: boolean;
  isLoggedIn: boolean;
  refetchSession: () => Promise<void>;
}

const SessionContext = createContext<SessionContextType | undefined>(undefined);

export function SessionProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<SessionUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refetchSession = async () => {
    try {
      const result = await authClient.getSession();
      const sessionData = result?.data;
      
      if (sessionData?.user) {
        setUser(sessionData.user as SessionUser);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Failed to fetch session:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch session on mount
  useEffect(() => {
    refetchSession();
  }, []);

  // Listen for visibility changes to refetch session when tab becomes active
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden) {
        refetchSession();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
  }, []);

  // Listen for storage changes (logout in another tab)
  useEffect(() => {
    const handleStorageChange = () => {
      refetchSession();
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const value: SessionContextType = {
    user,
    isLoading,
    isLoggedIn: !!user,
  };

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
}

export function useSession() {
  const context = useContext(SessionContext);
  if (context === undefined) {
    throw new Error('useSession must be used within SessionProvider');
  }
  return context;
}
