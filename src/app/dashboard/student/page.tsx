"use client";

import { useEffect, useState } from 'react';
import TopTabs from '@/components/dashboard/TopTabs';

const tabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'previous', label: 'Previous' },
  { key: 'pending', label: 'Pending' },
];

type Booking = {
  id: string;
  date?: string;
  tutorId?: string;
  status?: string;
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';

  useEffect(() => {
    if (!apiBase) return;

    fetch(`${apiBase}/users/me`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setProfile(data.data || data))
      .catch(() => {});

    fetch(`${apiBase}/bookings/my-bookings`, { credentials: 'include' })
      .then((r) => r.json())
      .then((data) => setBookings(data.data || []))
      .catch(() => {});
  }, [apiBase]);

  return (
    <div className="p-6">
      <h2 className="text-xl font-semibold mb-4">Student Dashboard</h2>
      <TopTabs tabs={tabs} />
      
      <section className="mt-4">
        <h3 className="font-medium">Calendar</h3>
        <div className="mt-3">
          <BookingCalendar bookings={bookings} />
        </div>
      </section>
      <section className="mt-6">
        <h3 className="font-medium">Profile</h3>
        {profile ? (
          <div className="mt-2">
            <p className="font-semibold">{profile.name || profile.displayName}</p>
            <p className="text-sm text-muted-foreground">{profile.email}</p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">Not signed in or unable to fetch profile.</p>
        )}
      </section>

      <section className="mt-6">
        <h3 className="font-medium">Bookings</h3>
        {bookings.length ? (
          <div className="mt-2 space-y-2">
            {bookings.map((b) => (
              <div key={b.id} className="p-3 border rounded">
                <div className="text-sm">{b.date || 'No date'}</div>
                <div className="text-xs text-muted-foreground">Status: {b.status}</div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">No bookings found.</p>
        )}
        <div className="mt-4">
          <Pagination page={1} total={Math.max(1, Math.ceil((bookings||[]).length / 5))} onChange={() => {}} />
        </div>
      </section>

      <section className="mt-6">
        <h3 className="font-medium">Reviews Given</h3>
        <p className="text-sm text-muted-foreground">List of reviews you've given.</p>
      </section>
    </div>
  );
}
