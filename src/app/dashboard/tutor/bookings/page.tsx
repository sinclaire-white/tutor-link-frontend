// app/dashboard/tutor/bookings/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Calendar,
  Clock,
  User,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import BookingCalendar from '@/components/dashboard/BookingCalendar';

interface Booking {
  id: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "ONGOING";
  scheduledAt: string;
  student: { name: string; email: string; image?: string };
  category: { name: string };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

const statusLabels = {
  PENDING: "Pending Approval",
  CONFIRMED: "Confirmed",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
};

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
          <div className="space-y-3">
            {pending.map((booking) => (
              <Card
                key={booking.id}
                className="border-yellow-200 dark:border-yellow-800"
              >
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
                        <span className="font-medium">
                          {booking.student.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(booking.scheduledAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "CONFIRMED")
                        }
                        disabled={processingId === booking.id}
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Accept
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() =>
                          handleStatusUpdate(booking.id, "CANCELLED")
                        }
                        disabled={processingId === booking.id}
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
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
                        <span className="font-medium">
                          {booking.student.name}
                        </span>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {new Date(booking.scheduledAt).toLocaleDateString()}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-4 w-4" />
                          {new Date(booking.scheduledAt).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </div>
                    </div>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleComplete(booking.id)}
                      disabled={processingId === booking.id}
                    >
                      Mark Complete
                    </Button>
                  </div>
                </CardContent>
              </Card>
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
          <div className="space-y-3">
            {past.map((booking) => (
              <Card key={booking.id} className="opacity-75">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge className={statusColors[booking.status]}>
                      {statusLabels[booking.status]}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {booking.category.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 mb-1">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{booking.student.name}</span>
                  </div>

                  <div className="text-sm text-muted-foreground">
                    {new Date(booking.scheduledAt).toLocaleDateString()} at{" "}
                    {new Date(booking.scheduledAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
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
