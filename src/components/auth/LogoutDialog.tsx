// components/auth/LogoutDialog.tsx
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Loader2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

interface LogoutDialogProps {
  trigger?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'ghost' | 'outline';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  onLogout?: () => void; // Optional callback for additional cleanup
}

export function LogoutDialog({
  trigger,
  variant = 'default',
  size = 'default',
  className = '',
  onLogout,
}: LogoutDialogProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const router = useRouter();

  const handleLogout = async (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent default if inside a form/button
    setIsLoading(true);
    
    try {
      // 1. Perform sign out
      await authClient.signOut();
      
      // 2. Call optional callback
      onLogout?.();
      
      // 3. Initiate navigation
      router.push('/');
      router.refresh(); 

      // 4. Intentional delay/Optimistic UI: 
      // Don't close the dialog immediately. Let the router handle the page transition.
      // If we close it now, the user sees the private page again before redirect.
      // We will purely rely on the page unmounting.
      
    } catch (error) {
      console.error('Failed to sign out:', error);
      // Only close on error so they can try again
      setIsLoading(false);
      setOpen(false);
    }
  };

  const defaultTrigger = (
    <Button variant={variant} size={size} className={className}>
      <LogOut className="mr-2 h-4 w-4" />
      Log out
    </Button>
  );

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {trigger || defaultTrigger}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure you want to log out?</AlertDialogTitle>
          <AlertDialogDescription>
            You will be signed out of your account and redirected to the home page.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleLogout}
            disabled={isLoading}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Confirm Logout
              </>
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}