// app/dashboard/student/bookings/page.tsx
'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/SessionProvider';
import { api } from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, Calendar, Clock, User, Star } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Booking {
  id: string;
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
  scheduledAt: string;
  tutor: { name: string; email: string; image?: string };
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

const statusColors = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
};

export default function StudentBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/bookings/my-bookings');
      setBookings(data.data || []);
    } catch (err) {
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

  const handleCancel = async (bookingId: string) => {
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: 'CANCELLED' });
      toast.success('Booking cancelled');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to cancel');
    }
  };

  if (sessionLoading || isLoading) return <LoadingState />;

  const upcoming = bookings.filter(b => ['PENDING', 'CONFIRMED'].includes(b.status));
  const past = bookings.filter(b => ['COMPLETED', 'CANCELLED'].includes(b.status));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <Button asChild>
          <Link href="/tutors">Find Tutors</Link>
        </Button>
      </div>

      {/* Upcoming Bookings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No upcoming bookings. <Link href="/tutors" className="text-primary hover:underline">Find a tutor</Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-3">
            {upcoming.map((booking) => (
              <Card key={booking.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {booking.category.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.tutor.name}</span>
                      </div>
                      
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    </div>
                    
                    {booking.status === 'PENDING' && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleCancel(booking.id)}
                      >
                        Cancel
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Past Bookings */}
      <section>
        <h2 className="text-xl font-semibold mb-4">History</h2>
        {past.length === 0 ? (
          <p className="text-muted-foreground">No past bookings</p>
        ) : (
          <div className="space-y-3">
            {past.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Badge className={statusColors[booking.status]}>
                          {booking.status}
                        </Badge>
                        <span className="text-sm text-muted-foreground">
                          {booking.category.name}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{booking.tutor.name}</span>
                      </div>
                      
                      <div className="text-sm text-muted-foreground">
                        {new Date(booking.scheduledAt).toLocaleDateString()} at{' '}
                        {new Date(booking.scheduledAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                    
                    {booking.status === 'COMPLETED' && !booking.review && (
                      <Button size="sm" asChild>
                        <Link href={`/dashboard/student/reviews/new?bookingId=${booking.id}`}>
                          <Star className="h-4 w-4 mr-1" />
                          Review
                        </Link>
                      </Button>
                    )}
                    
                    {booking.review && (
                      <div className="flex items-center gap-1 text-yellow-500">
                        <Star className="h-4 w-4 fill-current" />
                        {booking.review.rating}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}