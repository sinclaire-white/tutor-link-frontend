
import { Logo } from './Logo';
import { ThemeToggle } from '../theme/ThemeToggle';

import { UserDropdown } from './UserDropdown';
import { DesktopNav } from './DesktopNav';
import { MobileMenu } from './MobileMenu';
import { AuthButtons } from './AuthButton';
import { Skeleton } from '@/components/ui/skeleton';

interface NavbarProps {
  isLoggedIn: boolean;
  isLoading?: boolean;
}

export function Navbar({ isLoggedIn, isLoading }: NavbarProps) {
  return (
   <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md supports-backdrop-filter:bg-background/60 shadow-sm transition-shadow duration-300">
  <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
    <Logo />           {/* make font-bold text-xl or add icon */}
    <DesktopNav />
    <div className="flex items-center gap-3 sm:gap-4">
      <ThemeToggle />
      {isLoading ? (
        <div className="flex items-center gap-2">
            <Skeleton className="h-9 w-20" />
            <Skeleton className="h-9 w-20" />
        </div>
      ) : (
        !isLoggedIn ? <AuthButtons /> : <UserDropdown />
      )}
      <MobileMenu isLoggedIn={isLoggedIn} />
    </div>
  </div>
</header>
  );
}