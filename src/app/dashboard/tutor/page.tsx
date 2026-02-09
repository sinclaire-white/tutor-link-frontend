"use client";

import { useEffect, useState } from 'react';
import TopTabs from '@/components/dashboard/TopTabs';
import ProfileForm from '@/components/dashboard/ProfileForm';
import BookingCard from '@/components/dashboard/BookingCard';
import ReviewsList from '@/components/dashboard/ReviewsList';
import ConfirmSheet from '@/components/dashboard/ConfirmSheet';
import Pagination from '@/components/dashboard/Pagination';
import BookingCalendar from '@/components/dashboard/BookingCalendar';

const tabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'previous', label: 'Previous' },
  { key: 'pending', label: 'Pending' },
];

export default function TutorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (!apiBase) return;
    fetch(`${apiBase}/users/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setProfile(d.data || d))
      .catch(() => setProfile(null));

    fetch(`${apiBase}/bookings/my-bookings`, { credentials: 'include' })
      .then((r) => r.json())
      .then((d) => setBookings(d.data || []))
      .catch(() => {
        // fallback fake data
        setBookings([
          { id: 'b1', date: '2026-03-01 10:00', studentName: 'Alice', status: 'pending' },
          { id: 'b2', date: '2026-03-05 14:00', studentName: 'Bob', status: 'approved' },
        ]);
      });
  }, [apiBase]);

  async function handleAction(id: string, status: string) {
    // optimistic update
    setBookings((b) => b.map((x) => (x.id === id ? { ...x, status } : x)));
    try {
      if (!apiBase) throw new Error('no api');
      await fetch(`${apiBase}/bookings/${id}/status`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
    } catch (e) {
      // ignore - already optimistic
    }
  }

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Tutor Dashboard</h2>
      <TopTabs tabs={tabs} />

      <section className="mt-6">
        <h3 className="font-medium">Profile (Subjects, Bio, Pricing)</h3>
        <ProfileForm initial={profile} />
      </section>

      <section className="mt-6">
        <h3 className="font-medium">Bookings</h3>
        <div className="mt-3">
          <div className="mb-4">
            <BookingCalendar bookings={bookings} />
          </div>
          <div className="space-y-3">
            {bookings.length ? bookings.map((b) => (
              <div key={b.id}>
                <ConfirmSheet title="Confirm action" description={`Change status for booking ${b.id}?`} onConfirm={() => handleAction(b.id, 'approved')}>
                  <BookingCard booking={b} onAction={handleAction} />
                </ConfirmSheet>
              </div>
            )) : <p className="text-sm text-muted-foreground">No bookings.</p>}
          </div>
          <div className="mt-4">
            <Pagination page={1} total={Math.max(1, Math.ceil((bookings||[]).length / 5))} onChange={() => {}} />
          </div>
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-medium">Reviews Received</h3>
        <div className="mt-3"><ReviewsList /></div>
      </section>
    </div>
  );
}
