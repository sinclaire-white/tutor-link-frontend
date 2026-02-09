"use client";

import { useMemo, useState } from 'react';
import StatsCards from '@/components/dashboard/admin/StatsCards';
import CategoryManager from '@/components/dashboard/admin/CategoryManager';

export default function AdminDashboard() {
  const [query, setQuery] = useState('');
  const users = useMemo(() => [
    { id: 'u1', name: 'Alice', role: 'student' },
    { id: 'u2', name: 'Bob', role: 'tutor' },
    { id: 'u3', name: 'Cara', role: 'student' },
  ].filter(u => u.name.toLowerCase().includes(query.toLowerCase())), [query]);

  const bookings = useMemo(() => [
    { id: 'b1', student: 'Alice', tutor: 'Bob', date: '2026-03-01' },
    { id: 'b2', student: 'Cara', tutor: 'Bob', date: '2026-03-05' },
  ], []);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">Admin Dashboard</h2>

      <section>
        <StatsCards />
      </section>

      <section>
        <h3 className="text-lg font-medium mb-3">Category Management</h3>
        <CategoryManager />
      </section>

      <section>
        <h3 className="text-lg font-medium mb-3">User Management</h3>
        <div className="flex gap-2 mb-3">
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search users" className="border px-2 py-1 rounded flex-1" />
        </div>
        <ul className="space-y-2">
          {users.map(u => (
            <li key={u.id} className="p-2 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-muted-foreground">{u.role}</div>
              </div>
              <div className="flex gap-2">
                <button className="px-3 py-1 rounded bg-amber-600 text-white">Suspend</button>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h3 className="text-lg font-medium mb-3">Booking Oversight</h3>
        <div className="space-y-2">
          {bookings.map(b => (
            <div key={b.id} className="p-2 border rounded flex justify-between items-center">
              <div>
                <div className="font-medium">{b.student} → {b.tutor}</div>
                <div className="text-sm text-muted-foreground">{b.date}</div>
              </div>
              <div>
                <a href={`/tutors/${b.tutor}`} className="text-primary underline">Tutor profile</a>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
