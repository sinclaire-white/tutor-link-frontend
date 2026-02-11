// app/dashboard/tutor/page.tsx
"use client";

import { Suspense, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import TopTabs from '@/components/dashboard/TopTabs';
import ProfileForm from '@/components/dashboard/ProfileForm';
import BookingCard from '@/components/dashboard/BookingCard';
import ReviewsList from '@/components/dashboard/ReviewsList';
import ConfirmSheet from '@/components/dashboard/ConfirmSheet';
import Pagination from '@/components/dashboard/Pagination';
import BookingCalendar from '@/components/dashboard/BookingCalendar';
import { useSession } from '@/providers/SessionProvider';

export const dynamic = 'force-dynamic';

const tabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'previous', label: 'Previous' },
  { key: 'pending', label: 'Pending' },
];

export default function TutorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<any[]>([]);
  const [bookingPage, setBookingPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(true);
  
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  // Single effect for role check and data fetch
  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      router.push('/sign-in');
      return;
    }

    // Redirect if not tutor
    if (user.role !== 'TUTOR') {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'student'}`);
      return;
    }

    // Fetch data
    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          fetch(`${apiBase}/users/me`, { credentials: 'include' }),
          fetch(`${apiBase}/bookings/my-bookings`, { credentials: 'include' })
        ]);

        if (profileRes.ok) {
          const profileData = await profileRes.json();
          setProfile(profileData.data || profileData);
        }

        if (bookingsRes.ok) {
          const bookingsData = await bookingsRes.json();
          setBookings(bookingsData.data || []);
        } else {
          // Fallback data for demo
          setBookings([
            { id: 'b1', date: '2026-03-01 10:00', studentName: 'Alice', status: 'pending' },
            { id: 'b2', date: '2026-03-05 14:00', studentName: 'Bob', status: 'approved' },
          ]);
        }
      } catch (error) {
        console.error('Failed to fetch tutor data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, sessionLoading, router, apiBase]);

  async function handleAction(id: string, status: string) {
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
      console.error('Failed to update booking:', e);
    }
  }

  if (sessionLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const bookingPageTotal = Math.max(1, Math.ceil((bookings?.length || 0) / 5));

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-2">Tutor Dashboard</h2>
      <p className="text-muted-foreground mb-6">Manage your profile, bookings, and student reviews.</p>

      {/* Profile Section */}
      <section id="profile" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">My Profile</h3>
        <div className="border rounded-lg p-6 bg-card">
          <ProfileForm initial={profile} />
        </div>
      </section>

      {/* Bookings Section */}
      <section id="bookings" className="mb-8 scroll-mt-4">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Bookings</h3>
          <Suspense fallback={<div className="h-10 bg-muted rounded animate-pulse"></div>}>
            <TopTabs tabs={tabs} />
          </Suspense>
        </div>
        
        <div className="mb-6">
          <h4 className="text-sm font-medium mb-3">Calendar View</h4>
          <div className="border rounded-lg p-4 bg-card">
            <BookingCalendar bookings={bookings} />
          </div>
        </div>

        <div className="space-y-3">
          {bookings.length ? (
            <>
              {bookings.slice((bookingPage - 1) * 5, bookingPage * 5).map((b) => (
                <div key={b.id}>
                  <ConfirmSheet 
                    title="Confirm action" 
                    description={`Change status for ${b.studentName || 'booking'} on ${b.date}?`} 
                    onConfirm={() => handleAction(b.id, 'approved')}
                  >
                    <BookingCard booking={b} onAction={handleAction} />
                  </ConfirmSheet>
                </div>
              ))}
              <div className="mt-4">
                <Pagination 
                  page={bookingPage} 
                  total={bookingPageTotal} 
                  onChange={setBookingPage} 
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-8 border rounded">No bookings yet.</p>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">Reviews From Students</h3>
        <div className="border rounded-lg p-4 bg-card">
          <ReviewsList />
        </div>
      </section>
    </div>
  );
}