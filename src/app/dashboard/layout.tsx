import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import Sidebar from '@/components/dashboard/Sidebar';

export const metadata = {
  title: 'Dashboard',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-card sticky top-0 z-40">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link 
            href="/" 
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </div>
      </div>
      <div className="container mx-auto py-8 flex gap-6">
        <Sidebar />
        <main className="flex-1">{children}</main>
      </div>
    </div>
  );
}
