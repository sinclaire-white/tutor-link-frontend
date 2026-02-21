'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useSession } from '@/providers/SessionProvider';
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Loader2, Calendar, Clock, BookOpen, Star } from 'lucide-react';
import { toast } from 'sonner';
import BookingCalendar from '@/components/dashboard/BookingCalendar';
import Link from 'next/link';

interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED' | 'ONGOING';
  scheduledAt: string;
  duration: number;
  tutor: { id: string; name: string; email: string; image?: string };
  category: { name: string };
  review?: { rating: number; comment?: string };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  ONGOING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
};

const statusLabels: Record<string, string> = {
  PENDING: 'Pending',
  CONFIRMED: 'Confirmed',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled',
  ONGOING: 'Ongoing',
};

function formatTimeRange(scheduledAt: string, duration: number) {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + (duration || 1) * 3600000);
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${fmt(start)} to ${fmt(end)}`;
}

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  cancellingId?: string | null;
}

function BookingCard({ booking, onCancel, cancellingId }: BookingCardProps) {
  const { tutor, status, scheduledAt, duration, category, review } = booking;
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {tutor.image ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image src={tutor.image} alt={tutor.name} fill sizes="48px" className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                {tutor.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${tutor.id}`}>
                <p className="font-semibold hover:underline hover:text-primary truncate">{tutor.name}</p>
              </Link>
              <p className="text-xs text-muted-foreground truncate">{tutor.email}</p>
            </div>
          </div>
          <Badge className={`shrink-0 text-xs ${statusColors[status]}`}>{statusLabels[status]}</Badge>
        </div>
      </CardHeader>
      <CardContent className="pt-0 flex-1 flex flex-col gap-2">
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <BookOpen className="h-3.5 w-3.5 shrink-0" />
          <span>{category.name}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Calendar className="h-3.5 w-3.5 shrink-0" />
          <span>{new Date(scheduledAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{formatTimeRange(scheduledAt, duration)} &middot; {duration}h</span>
        </div>
        <div className="mt-auto pt-3 flex items-center justify-between">
          {status === 'COMPLETED' && review && (
            <div className="flex items-center gap-1 text-yellow-500 text-sm">
              <Star className="h-3.5 w-3.5 fill-current" />
              <span className="font-medium">{review.rating}/5</span>
              <span className="text-muted-foreground">&mdash; Reviewed</span>
            </div>
          )}
          {status === 'COMPLETED' && !review && (
            <Button size="sm" asChild>
              <Link href={`/dashboard/student/reviews/new?bookingId=${booking.id}`}>
                <Star className="h-3.5 w-3.5 mr-1" />
                Leave Review
              </Link>
            </Button>
          )}
          <div className="ml-auto">
            {['PENDING', 'CONFIRMED'].includes(status) && onCancel && (
              <Button
                variant="destructive"
                size="sm"
                disabled={cancellingId === booking.id}
                onClick={() => onCancel(booking.id)}
              >
                {cancellingId === booking.id
                  ? <><Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" />Cancelling...</>
                  : 'Cancel'}
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [confirmBookingId, setConfirmBookingId] = useState<string | null>(null);
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data.data || []);
    } catch (err) {
      console.error('Failed to fetch bookings:', err);
      toast.error('Failed to load bookings');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (user.role !== 'STUDENT') {
      router.push(`/dashboard/${user.role?.toLowerCase()}`);
      return;
    }
    fetchBookings();
  }, [user, sessionLoading, router, fetchBookings]);

  const handleCancel = async () => {
    if (!confirmBookingId) return;
    setCancellingId(confirmBookingId);
    setConfirmBookingId(null);
    try {
      await api.patch(`/bookings/${confirmBookingId}/status`, { status: 'CANCELLED' });
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    } finally {
      setCancellingId(null);
    }
  };

  if (sessionLoading || isLoading) return <LoadingState />;

  const pending = bookings.filter(b => b.status === 'PENDING');
  const upcoming = bookings.filter(b => ['CONFIRMED', 'ONGOING'].includes(b.status));
  const past = bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status));

  // Prepare calendar events - mapping scheduledAt to date property expected by Calendar
  const calendarEvents = bookings
    .filter(b => ['CONFIRMED', 'ONGOING', 'COMPLETED'].includes(b.status))
    .map(b => ({
      ...b,
      date: b.scheduledAt,
      tutorName: b.tutor.name
    }));

  return (
    <div className="space-y-6">
      {/* Confirm Cancel Dialog */}
      <AlertDialog open={!!confirmBookingId} onOpenChange={(open) => !open && setConfirmBookingId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this booking? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Keep Booking</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancel}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Yes, Cancel It
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Button asChild>
          <Link href="/tutors">Find Tutors</Link>
        </Button>
      </div>

       {/* Calendar View */}
       <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Calendar</h2>
          <BookingCalendar bookings={calendarEvents} />
        </CardContent>
      </Card>

      {/* Pending Requests */}
      <section>
        <h2 className="text-xl font-semibold mb-4">
          Pending Requests
          {pending.length > 0 && (
            <span className="ml-2 text-yellow-600 dark:text-yellow-400">({pending.length})</span>
          )}
        </h2>
        {pending.length === 0 ? (
          <p className="text-muted-foreground">No pending requests.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                onCancel={(id) => setConfirmBookingId(id)}
                cancellingId={cancellingId}
              />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Sessions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <p className="text-muted-foreground">No upcoming confirmed sessions.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <h2 className="text-xl font-semibold mb-4">History</h2>
        {past.length === 0 ? (
          <p className="text-muted-foreground">No past bookings.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}