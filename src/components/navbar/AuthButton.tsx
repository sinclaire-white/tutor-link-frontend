
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function AuthButtons() {
  return (
    <>
      <Button variant="outline" asChild>
        <Link href="/signup">Sign Up</Link>
      </Button>
      <Button asChild>
        <Link href="/signin">Sign In</Link>
      </Button>
    </>
  );
}