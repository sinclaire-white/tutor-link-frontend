// app/dashboard/student/page.tsx
"use client";

import { Suspense, useEffect, useState } from 'react';
import TopTabs from '@/components/dashboard/TopTabs';
import BookingCalendar from '@/components/dashboard/BookingCalendar';
import Pagination from '@/components/dashboard/Pagination';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios'; 
import { toast } from 'sonner';

export const dynamic = 'force-dynamic';

const tabs = [
  { key: 'upcoming', label: 'Upcoming' },
  { key: 'previous', label: 'Previous' },
  { key: 'pending', label: 'Pending' },
];

type Booking = {
  id: string;
  scheduledAt?: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'ONGOING';
  tutor?: { name: string; image?: string };
  category?: { name: string };
};

// Status badge colors
const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  ONGOING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
};

// Status labels for display
const statusLabels = {
  PENDING: 'Pending Approval',
  CONFIRMED: 'Upcoming',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  ONGOING: 'In Progress',
};

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingPage, setBookingPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(true);
  
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      router.push('/sign-in?redirect=/dashboard/student');
      return;
    }

    if (user.role !== 'STUDENT') {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'student'}`);
      return;
    }

    const fetchData = async () => {
      try {
        // Use api (axios) instead of fetch - it handles cookies automatically
        const [profileRes, bookingsRes] = await Promise.all([
          api.get('/users/me'),
          api.get('/bookings/my-bookings'),
        ]);

        setProfile(profileRes.data.data || profileRes.data);
        setBookings(bookingsRes.data.data || []);
      } catch (error: any) {
        console.error('Failed to fetch dashboard data:', error);
        if (error.response?.status === 403) {
          toast.error('Session expired. Please sign in again.');
          router.push('/sign-in?redirect=/dashboard/student');
        } else {
          toast.error('Failed to load dashboard data');
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, sessionLoading, router]);

  if (sessionLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) return null;

  const bookingPageTotal = Math.max(1, Math.ceil((bookings?.length || 0) / 5));

  // Filter bookings by status
  const upcomingBookings = bookings.filter(b => ['CONFIRMED', 'ONGOING'].includes(b.status));
  const pendingBookings = bookings.filter(b => b.status === 'PENDING');
  const pastBookings = bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status));

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-2">My Dashboard</h2>
      <p className="text-muted-foreground mb-6">Welcome back! Here&apos;s an overview of your activity.</p>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">{pendingBookings.length}</div>
          <div className="text-sm text-muted-foreground">Pending Approval</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">{upcomingBookings.length}</div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600">{pastBookings.length}</div>
          <div className="text-sm text-muted-foreground">Completed</div>
        </div>
      </div>

      {/* Bookings Section */}
      <section id="bookings" className="mb-8 scroll-mt-4">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Recent Bookings</h3>
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
              <div className="space-y-3">
                {bookings.slice((bookingPage - 1) * 5, bookingPage * 5).map((b) => (
                  <div key={b.id} className="p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {b.tutor?.name?.charAt(0).toUpperCase() || 'T'}
                        </div>
                        <div>
                          <div className="font-medium">{b.tutor?.name || 'Unknown Tutor'}</div>
                          <div className="text-xs text-muted-foreground">{b.category?.name || 'General'}</div>
                        </div>
                      </div>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}>
                        {statusLabels[b.status]}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : 'No date scheduled'}
                    </div>
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
            <p className="text-sm text-muted-foreground text-center py-6">
              No bookings yet. <a href="/tutors" className="text-primary hover:underline">Find tutors</a>
            </p>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-3">
          <a href="/tutors" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
            Find Tutors
          </a>
          <a href="/dashboard/student/bookings" className="px-4 py-2 border rounded-lg hover:bg-muted transition-colors text-sm font-medium">
            View All Bookings
          </a>
        </div>
      </section>

      {/* Profile Section */}
      <section id="profile" className="scroll-mt-4">
        <h3 className="text-xl font-semibold mb-4">My Profile</h3>
        <div className="border rounded-lg p-6 bg-card">
          {profile ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {profile.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="text-lg font-semibold">{profile.name || profile.displayName || 'N/A'}</div>
                  <div className="text-sm text-muted-foreground">{profile.email}</div>
                </div>
              </div>
              <div className="pt-4 border-t flex gap-3">
                <a href="/dashboard/student/profile" className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                  Edit Profile
                </a>
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