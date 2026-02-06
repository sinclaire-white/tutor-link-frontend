
import Link from 'next/link';

export function Logo() {
  return (
    <Link href="/" className="flex items-center space-x-2 text-lg font-bold">
      <span>TutorLink</span>
    </Link>
  );
}