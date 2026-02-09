"use client";

import { useState, useEffect } from 'react';
import StatsCards from '@/components/dashboard/admin/StatsCards';
import CategoryManager from '@/components/dashboard/admin/CategoryManager';
import Pagination from '@/components/dashboard/Pagination';

export const dynamic = 'force-dynamic';

const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

export default function AdminDashboard() {
  const [query, setQuery] = useState('');
  const [usersPage, setUsersPage] = useState(1);
  const [usersPerPage] = useState(10);
  const [usersResult, setUsersResult] = useState<any>({ items: [], total: 0, page: 1, perPage: 10 });

  const [bookingsPage, setBookingsPage] = useState(1);
  const [bookingsPerPage] = useState(10);
  const [bookingsResult, setBookingsResult] = useState<any>({ items: [], total: 0, page: 1, perPage: 10 });

  const [stats, setStats] = useState<any>(null);
  const [tutorsResult, setTutorsResult] = useState<any>({ items: [], total: 0, page: 1, perPage: 10 });

  useEffect(() => {
    if (!apiBase) return;
    fetch(`${apiBase}/admin/stats`, { credentials: 'include' })
      .then(r => r.json()).then(d => setStats(d.data || d)).catch(() => {});
  }, []);

  useEffect(() => {
    if (!apiBase) return;
    fetch(`${apiBase}/users?q=${encodeURIComponent(query)}&page=${usersPage}&perPage=${usersPerPage}`, { credentials: 'include' })
      .then(r => r.json()).then(d => setUsersResult(d.data || d)).catch(() => {});
  }, [query, usersPage]);

  useEffect(() => {
    if (!apiBase) return;
    fetch(`${apiBase}/bookings?page=${bookingsPage}&perPage=${bookingsPerPage}`, { credentials: 'include' })
      .then(r => r.json()).then(d => setBookingsResult(d.data || d)).catch(() => {});
  }, [bookingsPage]);

  useEffect(() => {
    if (!apiBase) return;
    fetch(`${apiBase}/tutors?approved=false&page=1&perPage=10`, { credentials: 'include' })
      .then(r => r.json()).then(d => setTutorsResult(d.data || d)).catch(() => {});
  }, []);

  const users = usersResult.items || [];
  const bookings = bookingsResult.items || [];

  return (
    <div className="p-6 max-w-6xl">
      <h2 className="text-3xl font-bold mb-2">Admin Dashboard</h2>
      <p className="text-muted-foreground mb-8">Manage platform users, tutors, bookings, and categories.</p>

      {/* Stats Section */}
      <section id="stats" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">Platform Statistics</h3>
        <div className="bg-card rounded-lg p-6 border">
          <StatsCards stats={stats} />
        </div>
      </section>

      {/* Tutor Applications Section */}
      <section id="tutors" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">Tutor Applications</h3>
        <div className="border rounded-lg p-4 bg-card">
          {(tutorsResult.items || []).length > 0 ? (
            <div className="space-y-2">
              {(tutorsResult.items || []).map((t: any) => (
                <div key={t.id} className="p-3 border rounded-sm flex justify-between items-center hover:bg-muted/50 transition">
                  <div className="flex-1">
                    <div className="font-medium">{t.user?.name}</div>
                    <div className="text-sm text-muted-foreground">{t.bio}</div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <button 
                      onClick={() => {
                        fetch(`${apiBase}/tutors/${t.id}/approve`, { 
                          method: 'PATCH', 
                          credentials: 'include', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify({ approved: true }) 
                        })
                          .then(() => {
                            setTutorsResult((prev: any) => ({ 
                              ...prev, 
                              items: prev.items.filter((x: any) => x.id !== t.id) 
                            }));
                          });
                      }} 
                      className="px-3 py-1 rounded bg-emerald-600 text-white text-sm hover:bg-emerald-700"
                    >
                      Approve
                    </button>
                    <button 
                      onClick={() => {
                        fetch(`${apiBase}/tutors/${t.id}/approve`, { 
                          method: 'PATCH', 
                          credentials: 'include', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify({ approved: false }) 
                        })
                          .then(() => {
                            setTutorsResult((prev: any) => ({ 
                              ...prev, 
                              items: prev.items.filter((x: any) => x.id !== t.id) 
                            }));
                          });
                      }} 
                      className="px-3 py-1 rounded bg-red-600 text-white text-sm hover:bg-red-700"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No pending tutor applications.</p>
          )}
        </div>
      </section>

      {/* Categories Section */}
      <section id="categories" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">Category Management</h3>
        <div className="border rounded-lg p-4 bg-card">
          <CategoryManager />
        </div>
      </section>

      {/* Users Section */}
      <section id="users" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">User Management</h3>
        <div className="border rounded-lg p-4 bg-card">
          <div className="mb-4">
            <input 
              value={query} 
              onChange={(e) => { setQuery(e.target.value); setUsersPage(1); }} 
              placeholder="Search users by name or email..." 
              className="w-full border px-3 py-2 rounded text-sm"
            />
          </div>
          {users.length > 0 ? (
            <>
              <ul className="space-y-2 max-h-96 overflow-y-auto">
                {users.map((u: any) => (
                  <li key={u.id} className="p-3 border rounded-sm flex justify-between items-center hover:bg-muted/50 transition">
                    <div className="flex-1">
                      <div className="font-medium">{u.name}</div>
                      <div className="text-sm text-muted-foreground">{u.email} • {u.role}</div>
                    </div>
                    <button 
                      onClick={() => {
                        fetch(`${apiBase}/users/${u.id}/suspend`, { 
                          method: 'PATCH', 
                          credentials: 'include', 
                          headers: { 'Content-Type': 'application/json' }, 
                          body: JSON.stringify({ suspended: !u.isSuspended }) 
                        })
                          .then(r => r.json()).then(() => {
                            fetch(`${apiBase}/users?q=${encodeURIComponent(query)}&page=${usersPage}&perPage=${usersPerPage}`, { credentials: 'include' })
                              .then(r => r.json()).then(d => setUsersResult(d.data || d)).catch(() => {});
                          });
                      }} 
                      className={`px-3 py-1 rounded text-white text-sm ${
                        u.isSuspended 
                          ? 'bg-blue-600 hover:bg-blue-700' 
                          : 'bg-amber-600 hover:bg-amber-700'
                      }`}
                    >
                      {u.isSuspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                  </li>
                ))}
              </ul>
              <div className="mt-4">
                <Pagination 
                  page={usersResult.page || 1} 
                  total={Math.max(1, Math.ceil((usersResult.total || 0) / (usersResult.perPage || 10)))} 
                  onChange={(p) => setUsersPage(p)} 
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No users found.</p>
          )}
        </div>
      </section>

      {/* Bookings Section */}
      <section id="bookings" className="scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">Booking Oversight</h3>
        <div className="border rounded-lg p-4 bg-card">
          {bookings.length > 0 ? (
            <>
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {bookings.map((b: any) => (
                  <div key={b.id} className="p-3 border rounded-sm flex justify-between items-center hover:bg-muted/50 transition">
                    <div className="flex-1">
                      <div className="font-medium">{b.student?.name} → {b.tutor?.name}</div>
                      <div className="text-sm text-muted-foreground">
                        {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : b.date}
                        {b.status && ` • Status: ${b.status}`}
                      </div>
                    </div>
                    <a 
                      href={`/tutors/${b.tutor?.id}`} 
                      className="text-primary underline hover:no-underline text-sm"
                    >
                      Tutor profile
                    </a>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Pagination 
                  page={bookingsResult.page || 1} 
                  total={Math.max(1, Math.ceil((bookingsResult.total || 0) / (bookingsResult.perPage || 10)))} 
                  onChange={(p) => setBookingsPage(p)} 
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8">No bookings found.</p>
          )}
        </div>
      </section>
    </div>
  );
}
