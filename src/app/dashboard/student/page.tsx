// app/dashboard/student/page.tsx
"use client";

import { Suspense, useEffect, useState } from 'react';
import TopTabs from '@/components/dashboard/TopTabs';
import BookingCalendar from '@/components/dashboard/BookingCalendar';
import Pagination from '@/components/dashboard/Pagination';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'next/navigation';

export const dynamic = 'force-dynamic';

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
  const [bookingPage, setBookingPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(true);
  const apiBase = process.env.NEXT_PUBLIC_API_URL || '';
  
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  // Single effect for role check and data fetch
  useEffect(() => {
    if (sessionLoading) return;

    // If no user, redirect to sign-in
    if (!user) {
      router.push('/sign-in');
      return;
    }

    // If wrong role, redirect to correct dashboard
    if (user.role !== 'STUDENT') {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'student'}`);
      return;
    }

    // Fetch data only after role confirmed
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
        }
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, sessionLoading, router, apiBase]);

  // Show loading while checking session
  if (sessionLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If no user, don't render (will redirect)
  if (!user) return null;

  const bookingPageTotal = Math.max(1, Math.ceil((bookings?.length || 0) / 5));

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-2">My Dashboard</h2>
      <p className="text-muted-foreground mb-6">Welcome back! Here&apos;s an overview of your activity.</p>

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

        <div className="border rounded-lg p-4 bg-card">
          {bookings.length ? (
            <>
              <div className="space-y-2">
                {bookings.slice((bookingPage - 1) * 5, bookingPage * 5).map((b) => (
                  <div key={b.id} className="p-3 border rounded bg-muted/50 hover:bg-muted transition-colors">
                    <div className="font-medium text-sm">{b.date || 'No date scheduled'}</div>
                    <div className="text-xs text-muted-foreground mt-1">Status: <span className="capitalize">{b.status || 'pending'}</span></div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Pagination 
                  page={bookingPage} 
                  total={bookingPageTotal} 
                  onChange={setBookingPage} 
                />
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground text-center py-6">No bookings yet. Start by searching for tutors!</p>
          )}
        </div>
      </section>

      {/* Reviews Section */}
      <section id="reviews" className="mb-8 scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">Reviews Given</h3>
        <div className="border rounded-lg p-4 bg-card text-center text-sm text-muted-foreground py-8">
          <p>Reviews you&apos;ve submitted will appear here.</p>
        </div>
      </section>

      {/* Profile Section */}
      <section id="profile" className="scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">My Profile</h3>
        <div className="border rounded-lg p-6 bg-card">
          {profile ? (
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium text-muted-foreground">Name</label>
                <p className="text-lg font-semibold">{profile.name || profile.displayName || 'N/A'}</p>
              </div>
              <div>
                <label className="text-xs font-medium text-muted-foreground">Email</label>
                <p className="text-sm">{profile.email}</p>
              </div>
              <div className="pt-4 border-t">
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded hover:bg-primary/90 transition-colors text-sm font-medium">
                  Edit Profile
                </button>
              </div>
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">Loading profile...</p>
          )}
        </div>
      </section>
    </div>
  );
}