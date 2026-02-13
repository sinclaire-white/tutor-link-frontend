
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { usePathname } from 'next/dist/client/components/navigation';

export function AuthButtons() {
   const pathname = usePathname();
  //  Redirect back to the current page after sign-in
   const redirectPath = pathname.startsWith('/sign-') ? '/' : pathname;
  return (
    <>
      <Button variant="outline" asChild>
        <Link href="/sign-up">Sign Up</Link>
      </Button>
      <Button asChild>
        <Link href={`/sign-in?redirect=${encodeURIComponent(redirectPath)}`}>Sign In</Link>
      </Button>
    </>
  );
}