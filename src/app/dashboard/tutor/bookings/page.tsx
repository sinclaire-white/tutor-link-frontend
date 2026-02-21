"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "@/providers/SessionProvider";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Calendar,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import BookingCalendar from "@/components/dashboard/BookingCalendar";

interface Booking {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "ONGOING";
  scheduledAt: string;
  duration: number;
  student: { id: string; name: string; email: string; image?: string };
  category: { name: string };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

const statusColors: Record<string, string> = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  ONGOING: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending Approval",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ONGOING: "Ongoing",
};

function formatTimeRange(scheduledAt: string, duration: number) {
  const start = new Date(scheduledAt);
  const end = new Date(start.getTime() + (duration || 1) * 3600000);
  const fmt = (d: Date) => d.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  return `${fmt(start)} to ${fmt(end)}`;
}

interface BookingCardProps {
  booking: Booking;
  processingId: string | null;
  onStatusUpdate?: (id: string, status: "CONFIRMED" | "CANCELLED") => void;
  onComplete?: (id: string) => void;
}

function BookingCard({ booking, processingId, onStatusUpdate, onComplete }: BookingCardProps) {
  const { student, status, scheduledAt, duration, category } = booking;
  const isProcessing = processingId === booking.id;
  return (
    <Card className="hover:shadow-md transition-shadow h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <div className="flex items-center gap-3 min-w-0 flex-1">
            {student.image ? (
              <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                <Image src={student.image} alt={student.name} fill sizes="48px" className="object-cover" />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
                {student.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="min-w-0 flex-1">
              <Link href={`/profile/${student.id}`}>
                <p className="font-semibold hover:underline hover:text-primary truncate">{student.name}</p>
              </Link>
              <p className="text-xs text-muted-foreground truncate">{student.email}</p>
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
          <span>{new Date(scheduledAt).toLocaleDateString([], { weekday: "short", month: "short", day: "numeric", year: "numeric" })}</span>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          <span>{formatTimeRange(scheduledAt, duration)} &middot; {duration}h</span>
        </div>
        <div className="mt-auto pt-3 flex justify-end gap-2">
          {status === "PENDING" && onStatusUpdate && (
            <>
              <Button size="sm" onClick={() => onStatusUpdate(booking.id, "CONFIRMED")} disabled={isProcessing}>
                {isProcessing ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : <CheckCircle className="h-3.5 w-3.5 mr-1" />}
                Accept
              </Button>
              <Button size="sm" variant="destructive" onClick={() => onStatusUpdate(booking.id, "CANCELLED")} disabled={isProcessing}>
                <XCircle className="h-3.5 w-3.5 mr-1" />
                Reject
              </Button>
            </>
          )}
          {["CONFIRMED", "ONGOING"].includes(status) && onComplete && (
            <Button size="sm" variant="outline" onClick={() => onComplete(booking.id)} disabled={isProcessing}>
              {isProcessing ? <Loader2 className="h-3.5 w-3.5 mr-1 animate-spin" /> : null}
              Mark Complete
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

export default function TutorBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  const fetchBookings = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/bookings/my-bookings");
      setBookings(data.data || []);
    } catch (err) {
      toast.error("Failed to load bookings");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push("/sign-in?redirect=/dashboard/tutor/bookings");
      return;
    }
    if (user.role !== "TUTOR") {
      router.push(`/dashboard/${user.role?.toLowerCase()}`);
      return;
    }
    fetchBookings();
  }, [user, sessionLoading, router, fetchBookings]);

  const handleStatusUpdate = async (
    bookingId: string,
    status: "CONFIRMED" | "CANCELLED",
  ) => {
    setProcessingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status });
      toast.success(
        status === "CONFIRMED" ? "Booking confirmed!" : "Booking rejected",
      );
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  const handleComplete = async (bookingId: string) => {
    setProcessingId(bookingId);
    try {
      await api.patch(`/bookings/${bookingId}/status`, { status: "COMPLETED" });
      toast.success("Session marked as completed");
      fetchBookings();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to complete");
    } finally {
      setProcessingId(null);
    }
  };

  if (sessionLoading || isLoading) return <LoadingState />;

  const pending = bookings.filter((b) => b.status === "PENDING");
  const upcoming = bookings.filter((b) => ["CONFIRMED", "ONGOING"].includes(b.status));
  const past = bookings.filter((b) => ["COMPLETED", "CANCELLED"].includes(b.status));

  // Prepare calendar events
  const calendarEvents = bookings
    .filter(b => ['CONFIRMED', 'ONGOING', 'COMPLETED'].includes(b.status))
    .map(b => ({
      ...b,
      date: b.scheduledAt,
      studentName: b.student.name
    }));

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Bookings</h1>

       {/* Calendar View */}
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-4">Teaching Schedule</h2>
          <BookingCalendar bookings={calendarEvents} />
        </CardContent>
      </Card>

      {/* Pending Requests */}
      {pending.length > 0 && (
        <section>
          <h2 className="text-xl font-semibold mb-4 text-yellow-600 dark:text-yellow-400">
            Pending Requests ({pending.length})
          </h2>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {pending.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                processingId={processingId}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </section>
      )}

      {/* Upcoming Sessions */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Upcoming Sessions</h2>
        {upcoming.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              No upcoming sessions
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcoming.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                processingId={processingId}
                onComplete={handleComplete}
              />
            ))}
          </div>
        )}
      </section>

      {/* History */}
      <section>
        <h2 className="text-xl font-semibold mb-4">History</h2>
        {past.length === 0 ? (
          <p className="text-muted-foreground">No past bookings</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {past.map((booking) => (
              <BookingCard
                key={booking.id}
                booking={booking}
                processingId={processingId}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
