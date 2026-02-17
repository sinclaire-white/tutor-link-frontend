// app/dashboard/tutor/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TopTabs from "@/components/dashboard/TopTabs";
import BookingCalendar from "@/components/dashboard/BookingCalendar";
import Pagination from "@/components/dashboard/Pagination";
import { useSession } from "@/providers/SessionProvider";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  CheckCircle,
  XCircle,
  Star,
} from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

const tabs = [
  { key: "upcoming", label: "Upcoming" },
  { key: "previous", label: "Previous" },
  { key: "pending", label: "Pending" },
];

type Booking = {
  id: string;
  scheduledAt?: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "ONGOING";
  student?: { name: string; image?: string };
  category?: { name: string };
};

// Status badge colors
const statusColors = {
  PENDING:
    "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100",
  CONFIRMED:
    "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100",
  COMPLETED: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100",
  CANCELLED: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-100",
  ONGOING:
    "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-100",
};

// Status labels for display
const statusLabels = {
  PENDING: "Pending Approval",
  CONFIRMED: "Upcoming",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
  ONGOING: "In Progress",
};

export default function TutorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [bookingPage, setBookingPage] = useState(1);
  const [dataLoading, setDataLoading] = useState(true);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      router.push("/sign-in?redirect=/dashboard/tutor");
      return;
    }

    if (user.role !== "TUTOR") {
      router.push(`/dashboard/${user.role?.toLowerCase() || "student"}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/bookings/my-bookings"),
        ]);

        const profileData = profileRes.data.data || profileRes.data;

        // Check if tutor is approved
        if (profileData?.tutor?.isApproved === false) {
          router.push("/pending-approval");
          return;
        }

        setProfile(profileData);
        setBookings(bookingsRes.data.data || []);
      } catch (error: any) {
        console.error("Failed to fetch tutor data:", error);
        if (error.response?.status === 403) {
          toast.error("Session expired. Please sign in again.");
          router.push("/sign-in?redirect=/dashboard/tutor");
        } else {
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, sessionLoading, router]);

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
      // Refresh bookings
      const { data } = await api.get("/bookings/my-bookings");
      setBookings(data.data || []);
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setProcessingId(null);
    }
  };

  if (sessionLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const bookingPageTotal = Math.max(1, Math.ceil((bookings?.length || 0) / 5));

  // Filter bookings by status
  const upcomingBookings = bookings.filter((b) =>
    ["CONFIRMED", "ONGOING"].includes(b.status),
  );
  const pendingBookings = bookings.filter((b) => b.status === "PENDING");

  return (
    <div className="p-6 max-w-4xl">
      <h2 className="text-3xl font-bold mb-2">Tutor Dashboard</h2>
      <p className="text-muted-foreground mb-6">
        Welcome back! Manage your sessions.
      </p>

      {/* Stats Overview */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {pendingBookings.length}
          </div>
          <div className="text-sm text-muted-foreground">Pending Requests</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-green-600">
            {upcomingBookings.length}
          </div>
          <div className="text-sm text-muted-foreground">Upcoming</div>
        </div>
        <div className="bg-card border rounded-lg p-4">
          <div className="text-2xl font-bold text-blue-600 flex items-center gap-1">
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
            {profile?.tutor?.rating || "N/A"}
          </div>
          <div className="text-sm text-muted-foreground">Rating</div>
        </div>
      </div>

      {/* Bookings Section */}
      <section id="bookings" className="mb-8 scroll-mt-4">
        <div className="mb-4">
          <h3 className="text-xl font-semibold mb-3">Recent Bookings</h3>
          <Suspense
            fallback={
              <div className="h-10 bg-muted rounded animate-pulse"></div>
            }
          >
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
                {bookings
                  .slice((bookingPage - 1) * 5, bookingPage * 5)
                  .map((b) => (
                    <div
                      key={b.id}
                      className="p-4 border rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                            {b.student?.name?.charAt(0).toUpperCase() || "S"}
                          </div>
                          <div>
                            <div className="font-medium">
                              {b.student?.name || "Unknown Student"}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {b.category?.name || "General"}
                            </div>
                          </div>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[b.status]}`}
                        >
                          {statusLabels[b.status]}
                        </span>
                      </div>

                      <div className="text-sm text-muted-foreground mb-3">
                        {b.scheduledAt
                          ? new Date(b.scheduledAt).toLocaleString()
                          : "No date scheduled"}
                      </div>

                      {/* Action buttons for pending bookings */}
                      {b.status === "PENDING" && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() =>
                              handleStatusUpdate(b.id, "CONFIRMED")
                            }
                            disabled={processingId === b.id}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() =>
                              handleStatusUpdate(b.id, "CANCELLED")
                            }
                            disabled={processingId === b.id}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      )}
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
              No bookings yet. Students will book your available slots.
            </p>
          )}
        </div>
      </section>

      {/* Quick Actions */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
        <div className="flex gap-3">
          <Link href="/dashboard/tutor/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
          <Link href="/dashboard/tutor/bookings">
            <Button variant="outline">View All Bookings</Button>
          </Link>
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
                  {profile.name?.charAt(0).toUpperCase() || "T"}
                </div>
                <div>
                  <div className="text-lg font-semibold">
                    {profile.name || profile.displayName || "N/A"}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {profile.email}
                  </div>
                  {profile.tutor?.isApproved ? (
                    <Badge className="bg-green-100 text-green-800 mt-1">
                      Approved Tutor
                    </Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800 mt-1">
                      Pending Approval
                    </Badge>
                  )}
                </div>
              </div>
              <div className="pt-4 border-t flex gap-3">
                <Link href="/dashboard/tutor/profile">
                  <Button>Edit Profile</Button>
                </Link>
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
