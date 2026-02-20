'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Card, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PaginationControls } from "@/components/ui/pagination-controls";
import Link from 'next/link';
import { toast } from 'sonner';

interface Booking {
  id: string;
  student: { id: string; name: string; email: string };
  tutor: { id: string; name: string; email: string };
  scheduledAt: string;
  duration: number; // in hours
  status: string;
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalBookings, setTotalBookings] = useState(0);

  const { user, isLoading } = useSession();
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    try {
      const { data } = await api.get('/bookings', {
        params: {
          page,
          perPage: 10
        }
      });
      setBookings(data.data?.items || []);
      setTotalPages(data.data?.meta?.totalPages || 1);
      setTotalBookings(data.data?.meta?.total || 0);
    } catch (err: any) {
      toast.error("Failed to load bookings");
    }
  }, [page]);

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
          <div className="space-y-4">
            {bookings.map((b) => {
              const start = new Date(b.scheduledAt);
              const end = new Date(start.getTime() + (b.duration || 1) * 3600000); // 1 hour if not specified
              return (
                <Card key={b.id}>
                  <CardHeader className="flex flex-row items-center justify-between py-4">
                    <div>
                      <div className="font-medium flex flex-col gap-1">
                        <span className="flex items-center gap-1">
                          Student: 
                          <Link href={`/profile/${b.student.id}`} className="hover:underline text-primary">
                            {b.student.name}
                          </Link> 
                          <span className="text-muted-foreground text-sm">({b.student.email})</span>
                        </span>
                        <span className="flex items-center gap-1">
                          Tutor: 
                          <Link href={`/profile/${b.tutor.id}`} className="hover:underline text-primary">
                            {b.tutor.name}
                          </Link>
                          <span className="text-muted-foreground text-sm">({b.tutor.email})</span>
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        Start: {start.toLocaleString()}
                        <br />
                        End: {end.toLocaleString()}
                      </p>
                    </div>
                    <Badge variant={b.status === 'CONFIRMED' ? 'default' : b.status === 'CANCELLED' ? 'destructive' : 'secondary'}>
                      {b.status}
                    </Badge>
                  </CardHeader>
                </Card>
              );
            })}

            <PaginationControls
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </div>
        )}
      </div>
    </div>
  );
}