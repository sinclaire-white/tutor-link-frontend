import { Sidebar } from '@/components/dashboard/Sidebar';
import { MobileSidebar } from '@/components/dashboard/MobileSidebar';

export const metadata = {
  title: 'Dashboard',
  description: 'Manage your learning journey',
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* Sidebar - Desktop (Hidden on Mobile) */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-background shrink-0 h-full fixed inset-y-0 z-50">
        <Sidebar />
      </aside>

      {/* spacer for fixed sidebar */}
      <div className="hidden md:block w-64 shrink-0" />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden h-full relative">
        {/* Mobile Header (Visible only on Mobile) */}
        <header className="md:hidden flex items-center justify-between px-4 py-3 border-b bg-background shrink-0 sticky top-0 z-40 shadow-sm">
           <span className="font-bold text-lg text-primary">TutorLink</span>
           <MobileSidebar />
        </header>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto w-full p-4 md:p-8 space-y-6 scroll-smooth">
            <div className="max-w-7xl mx-auto w-full pb-20 md:pb-8">
              {children}
            </div>
        </div>
      </main>
    </div>
  );
}
