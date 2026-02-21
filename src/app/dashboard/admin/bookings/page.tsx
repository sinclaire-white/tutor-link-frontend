'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
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
import { PaginationControls } from '@/components/ui/pagination-controls';
import { Loader2, Calendar, Clock, BookOpen, Trash2, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

interface Booking {
  id: string;
  student: { id: string; name: string; email: string; image?: string };
  tutor: { id: string; name: string; email: string; image?: string };
  scheduledAt: string;
  duration: number;
  status: string;
  category: { name: string };
}

const statusColors: Record<string, string> = {
  PENDING: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100',
  CONFIRMED: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100',
  COMPLETED: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100',
  CANCELLED: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100',
  ONGOING: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100',
};

function formatTimeRange(scheduledAt: string, duration: number) {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + (duration || 1) * 3600000);
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
  return `${fmt(start)} to ${fmt(end)}`;
}

function UserAvatar({ user }: { user: { name: string; image?: string } }) {
  return user.image ? (
    <div className="relative w-8 h-8 rounded-full overflow-hidden shrink-0">
      <Image src={user.image} alt={user.name} fill sizes="32px" className="object-cover" />
    </div>
  ) : (
    <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary shrink-0">
      {user.name.charAt(0).toUpperCase()}
    </div>
  );
}

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isFetching, setIsFetching] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user, isLoading } = useSession();
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    setIsFetching(true);
    try {
      const { data } = await api.get('/bookings', { params: { page, perPage: 12 } });
      setBookings(data.data?.items || []);
      const total = data.data?.total || 0;
      const perPage = data.data?.perPage || 12;
      setTotalPages(Math.ceil(total / perPage) || 1);
    } catch (err: any) {
      toast.error('Failed to load bookings');
    } finally {
      setIsFetching(false);
    }
  }, [page]);

  useEffect(() => {
    if (isLoading) return;
    if (!user) { router.push('/sign-in'); return; }
    if (user.role !== 'ADMIN') {
      router.push(user.role ? `/dashboard/${user.role.toLowerCase()}` : '/');
      return;
    }
    fetchBookings();
  }, [user, isLoading, router, fetchBookings]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeletingId(deleteTarget);
    setDeleteTarget(null);
    try {
      await api.delete(`/bookings/${deleteTarget}`);
      toast.success('Booking deleted successfully');
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Failed to delete booking');
    } finally {
      setDeletingId(null);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="space-y-6">
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Booking</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to permanently delete this booking? Any associated review will also be removed. This cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <h1 className="text-3xl font-bold">Bookings</h1>

      {isFetching ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : bookings.length === 0 ? (
        <p className="text-muted-foreground text-center py-8">No bookings found</p>
      ) : (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {bookings.map((b) => (
              <Card key={b.id} className="hover:shadow-md transition-shadow flex flex-col">
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-2 min-w-0 flex-wrap">
                    <UserAvatar user={b.student} />
                    <Link href={`/profile/${b.student.id}`} className="font-semibold text-sm hover:underline hover:text-primary truncate max-w-24">
                      {b.student.name}
                    </Link>
                    <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                    <UserAvatar user={b.tutor} />
                    <Link href={`/profile/${b.tutor.id}`} className="font-semibold text-sm hover:underline hover:text-primary truncate max-w-24">
                      {b.tutor.name}
                    </Link>
                  </div>
                  <Badge className={`w-fit text-xs mt-1 ${statusColors[b.status] || 'bg-gray-100 text-gray-800'}`}>
                    {b.status}
                  </Badge>
                </CardHeader>
                <CardContent className="pt-0 flex-1 flex flex-col gap-2">
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <BookOpen className="h-3.5 w-3.5 shrink-0" />
                    <span>{b.category?.name || 'N/A'}</span>
                    <span className="ml-auto text-xs font-medium">{b.duration || 1}h</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Calendar className="h-3.5 w-3.5 shrink-0" />
                    <span>{new Date(b.scheduledAt).toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    <span>{formatTimeRange(b.scheduledAt, b.duration || 1)}</span>
                  </div>
                  <div className="text-xs text-muted-foreground font-mono truncate">
                    {b.student.email} → {b.tutor.email}
                  </div>
                  <div className="mt-auto pt-3 flex justify-end">
                    <Button
                      size="sm"
                      variant="destructive"
                      disabled={deletingId === b.id}
                      onClick={() => setDeleteTarget(b.id)}
                    >
                      {deletingId === b.id
                        ? <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        : <><Trash2 className="h-3.5 w-3.5 mr-1" />Delete</>}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <PaginationControls
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </>
      )}
    </div>
  );
}