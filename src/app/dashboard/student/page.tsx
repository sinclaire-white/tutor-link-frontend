// app/dashboard/student/page.tsx
"use client";

import { Suspense, useEffect, useState } from 'react';
import TopTabs from '@/components/dashboard/TopTabs';
import BookingCalendar from '@/components/dashboard/BookingCalendar';
import Pagination from '@/components/dashboard/Pagination';
import { useSession } from '@/providers/SessionProvider';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios'; // Use axios instead of fetch
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Calendar, Clock, CheckCircle2, AlertCircle, Users, BookOpen, TrendingUp } from 'lucide-react';

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
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="p-6 max-w-6xl mx-auto"
    >
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2">My Dashboard</h2>
        <p className="text-muted-foreground">Welcome back, {profile?.name || 'Student'}! Here&apos;s your learning overview.</p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-linear-to-br from-yellow-50 to-orange-50 dark:from-yellow-950/20 dark:to-orange-950/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg">
              <AlertCircle className="w-6 h-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="text-3xl font-bold text-yellow-600 dark:text-yellow-400">{pendingBookings.length}</div>
          </div>
          <div className="text-sm font-medium text-yellow-900 dark:text-yellow-100">Pending Approval</div>
          <div className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">Awaiting tutor confirmation</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-linear-to-br from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 border border-green-200 dark:border-green-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <Calendar className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="text-3xl font-bold text-green-600 dark:text-green-400">{upcomingBookings.length}</div>
          </div>
          <div className="text-sm font-medium text-green-900 dark:text-green-100">Upcoming Sessions</div>
          <div className="text-xs text-green-700 dark:text-green-300 mt-1">Confirmed bookings</div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-linear-to-br from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border border-blue-200 dark:border-blue-800 rounded-xl p-6 hover:shadow-lg transition-shadow"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <CheckCircle2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">{pastBookings.length}</div>
          </div>
          <div className="text-sm font-medium text-blue-900 dark:text-blue-100">Completed</div>
          <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Total sessions finished</div>
        </motion.div>
      </div>

      {/* Bookings Section */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        id="bookings" 
        className="mb-8 scroll-mt-4"
      >
        <div className="mb-4">
          <h3 className="text-2xl font-semibold mb-3 flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-primary" />
            My Bookings
          </h3>
          <Suspense fallback={<div className="h-10 bg-muted rounded animate-pulse"></div>}>
            <TopTabs tabs={tabs} />
          </Suspense>
        </div>
        
        <div className="mb-6">
          <h4 className="text-lg font-medium mb-3 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-muted-foreground" />
            Calendar View
          </h4>
          <div className="border rounded-xl p-4 bg-card shadow-sm">
            <BookingCalendar bookings={bookings} />
          </div>
        </div>

        <div className="border rounded-xl p-6 bg-card shadow-sm">
          {bookings.length ? (
            <>
              <div className="space-y-3">
                {bookings.slice((bookingPage - 1) * 5, bookingPage * 5).map((b, index) => (
                  <motion.div 
                    key={b.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 border rounded-xl bg-linear-to-r from-card to-muted/30 hover:shadow-md transition-all duration-200 hover:scale-[1.01]"
                  >
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-4">
                        <Avatar className="w-12 h-12 border-2 border-primary/20">
                          <AvatarImage src={b.tutor?.image} alt={b.tutor?.name || 'Tutor'} />
                          <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {b.tutor?.name?.charAt(0).toUpperCase() || 'T'}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="font-semibold text-lg">{b.tutor?.name || 'Unknown Tutor'}</div>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <BookOpen className="w-3 h-3" />
                            {b.category?.name || 'General'}
                          </div>
                        </div>
                      </div>
                      <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${statusColors[b.status]} shadow-sm`}>
                        {statusLabels[b.status]}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground pl-16">
                      <Clock className="w-4 h-4" />
                      {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: '2-digit',
                      }) : 'No date scheduled'}
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6">
                <Pagination 
                  page={bookingPage} 
                  total={bookingPageTotal} 
                  onChange={setBookingPage} 
                />
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <BookOpen className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground mb-4">No bookings yet. Start your learning journey!</p>
              <a href="/tutors" className="inline-flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors font-medium shadow-sm">
                <Users className="w-4 h-4" />
                Find Tutors
              </a>
            </div>
          )}
        </div>
      </motion.section>

      {/* Quick Actions & Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Quick Actions */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-primary" />
            Quick Actions
          </h3>
          <div className="border rounded-xl p-6 bg-card shadow-sm space-y-3">
            <a href="/tutors" className="flex items-center gap-3 px-4 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.02] shadow-sm">
              <Users className="w-5 h-5" />
              <span className="font-medium">Find Tutors</span>
            </a>
            <a href="/dashboard/student/bookings" className="flex items-center gap-3 px-4 py-3 border rounded-lg hover:bg-muted transition-all hover:scale-[1.02]">
              <BookOpen className="w-5 h-5" />
              <span className="font-medium">View All Bookings</span>
            </a>
            <a href="/categories" className="flex items-center gap-3 px-4 py-3 border rounded-lg hover:bg-muted transition-all hover:scale-[1.02]">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Browse Categories</span>
            </a>
          </div>
        </motion.section>

        {/* Profile Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          id="profile" 
          className="scroll-mt-4"
        >
          <h3 className="text-xl font-semibold mb-4">My Profile</h3>
          <div className="border rounded-xl p-6 bg-card shadow-sm">
            {profile ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="w-16 h-16 border-2 border-primary/20">
                    <AvatarImage src={profile.image} alt={profile.name || 'User'} />
                    <AvatarFallback className="bg-linear-to-br from-primary/20 to-primary/10 text-primary text-2xl font-bold">
                      {profile.name?.charAt(0).toUpperCase() || 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-xl font-semibold">{profile.name || profile.displayName || 'N/A'}</div>
                    <div className="text-sm text-muted-foreground">{profile.email}</div>
                  </div>
                </div>
                <div className="pt-4 border-t">
                  <a href="/dashboard/student/profile" className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-all hover:scale-[1.02] font-medium shadow-sm w-full justify-center">
                    <Users className="w-4 h-4" />
                    Edit Profile
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">Loading profile...</p>
              </div>
            )}
          </div>
        </motion.section>
      </div>
    </motion.div>
  );
}