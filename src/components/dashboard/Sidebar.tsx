"use client";

import Link from 'next/link';
import { Home, User, Users, Settings } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="w-72 border-r pr-4">
      <div className="py-6 px-4">
        <h3 className="text-lg font-semibold">Dashboard</h3>
      </div>
      <nav className="px-4 space-y-1">
        <Link href="/dashboard/student" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
          <Home className="h-4 w-4" />
          <span>Student</span>
        </Link>
        <Link href="/dashboard/tutor" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
          <User className="h-4 w-4" />
          <span>Tutor</span>
        </Link>
        <Link href="/dashboard/admin" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
          <Users className="h-4 w-4" />
          <span>Admin</span>
        </Link>
        <Link href="/profile" className="flex items-center gap-3 px-3 py-2 rounded hover:bg-muted">
          <Settings className="h-4 w-4" />
          <span>Profile</span>
        </Link>
      </nav>
    </aside>
  );
}
