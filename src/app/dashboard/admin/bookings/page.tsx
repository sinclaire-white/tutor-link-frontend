'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Booking {
  id: string;
  student: { name: string };
  tutor: { name: string };
  scheduledAt?: string;
  status: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const { user, isLoading } = useSession();
  const router = useRouter();

  const fetchBookings = useCallback(() => {
    api.get('/bookings')
      .then(({ data }) => setBookings(data.data?.items || []))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    
    if (!user) {
      router.push('/sign-in');
      return;
    }

    if (!user.role || user.role !== 'ADMIN') {
      const targetPath = user.role ? `/dashboard/${user.role.toLowerCase()}` : '/';
      router.push(targetPath);
      return;
    }

    fetchBookings();
  }, [user, isLoading, router, fetchBookings]);

  if (isLoading || !user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bookings</h1>

      <div className="space-y-3">
        {bookings.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No bookings found</p>
        ) : (
          bookings.map((b) => (
            <Card key={b.id}>
              <CardHeader className="flex flex-row items-center justify-between py-4">
                <div>
                  <p className="font-medium">
                    {b.student.name} → {b.tutor.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {b.scheduledAt ? new Date(b.scheduledAt).toLocaleString() : 'No date'}
                  </p>
                </div>
                <Badge>{b.status}</Badge>
              </CardHeader>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}