// app/dashboard/student/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Loader2,
  TrendingUp,
  Clock,
  BookOpen,
  Calendar,
} from "lucide-react";
import Link from "next/link";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";

export const dynamic = "force-dynamic";

type Booking = {
  id: string;
  scheduledAt?: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "ONGOING";
  tutor?: { name: string; image?: string };
  category?: { name: string };
};

const COLORS = [
  "#16a34a", // Green (Accepted)
  "#dc2626", // Red (Rejected) 
  "#d97706", // Amber (Pending)
];

export default function StudentDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;

    if (!user) {
      router.push("/sign-in?redirect=/dashboard/student");
      return;
    }

    if (user.role !== "STUDENT") {
      router.push(`/dashboard/${user.role?.toLowerCase() || "student"}`);
      return;
    }

    const fetchData = async () => {
      try {
        const [profileRes, bookingsRes] = await Promise.all([
          api.get("/users/me"),
          api.get("/bookings/my-bookings"),
        ]);

        setProfile(profileRes.data.data || profileRes.data);
        setBookings(bookingsRes.data.data || []);
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
        if (error.response?.status === 403) {
          toast.error("Session expired. Please sign in again.");
          router.push("/sign-in?redirect=/dashboard/student");
        } else {
          toast.error("Failed to load dashboard data");
        }
      } finally {
        setDataLoading(false);
      }
    };

    fetchData();
  }, [user, sessionLoading, router]);

  // --- Analytics Logic ---

  // 1. Most Hired Tutors (Top 3)
  const topTutors = useMemo(() => {
    const tutorCounts: Record<string, { count: number; image?: string }> = {};
    bookings.forEach((b) => {
      const name = b.tutor?.name || "Unknown Tutor";
      if (!tutorCounts[name]) {
        tutorCounts[name] = { count: 0, image: b.tutor?.image };
      }
      tutorCounts[name].count += 1;
    });
    return Object.entries(tutorCounts)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 3)
      .map(([name, data]) => ({ name, ...data }));
  }, [bookings]);

  // 2. Favorite Subject (Top 1)
  const favoriteSubject = useMemo(() => {
    const subjectCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const name = b.category?.name || "General";
      subjectCounts[name] = (subjectCounts[name] || 0) + 1;
    });
    const sorted = Object.entries(subjectCounts).sort(([, a], [, b]) => b - a);
    return sorted.length > 0 ? sorted[0] : null; // [subjectName, count]
  }, [bookings]);

  // 3. Status Distribution (Pie Chart Data)
  const statusData = useMemo(() => {
    let accepted = 0;
    let rejected = 0;
    let pending = 0;

    bookings.forEach((b) => {
      if (["CONFIRMED", "COMPLETED", "ONGOING"].includes(b.status)) {
        accepted++;
      } else if (b.status === "CANCELLED") {
        rejected++;
      } else if (b.status === "PENDING") {
        pending++;
      }
    });

    // Only return data if there are bookings to show
    if (accepted === 0 && rejected === 0 && pending === 0) return [];

    return [
      { name: "Accepted", value: accepted },
      { name: "Rejected", value: rejected },
      { name: "Pending", value: pending },
    ];
  }, [bookings]);

  // Quick Stats
  const upcomingCount = bookings.filter((b) =>
    ["CONFIRMED", "ONGOING"].includes(b.status)
  ).length;
  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;

  if (sessionLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Student Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name}! Track your learning progress.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/student/bookings">
            <Button>My Bookings</Button>
          </Link>
          <Link href="/tutors">
            <Button variant="outline">Find Tutors</Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Sessions</CardTitle>
            <BookOpen className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{bookings.length}</div>
            <p className="text-xs text-muted-foreground">Lifetime bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Calendar className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {upcomingCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Confirmed sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting confirmation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Section */}
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <TrendingUp className="h-5 w-5 text-primary" /> 
        Learning Insights
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Chart: Request Status Ratio */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Request Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-62.5 w-full min-w-0">
              {statusData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {statusData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                          strokeWidth={0}
                        />
                      ))}
                    </Pie>
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'var(--popover)', 
                        color: 'var(--popover-foreground)',
                        borderRadius: '8px', 
                        border: '1px solid var(--border)', 
                        boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                      }}
                    />
                    <Legend verticalAlign="bottom" height={36} iconType="circle" />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                  No booking data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* List: Top 3 Tutors */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Most Hired Tutors</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {topTutors.length > 0 ? (
              <div className="space-y-4">
                {topTutors.map((tutor) => (
                  <div key={tutor.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarImage src={tutor.image} />
                        <AvatarFallback>{tutor.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium truncate max-w-35" title={tutor.name}>
                        {tutor.name}
                      </span>
                    </div>
                    <Badge variant="secondary">{tutor.count} sessions</Badge>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <p className="text-sm text-muted-foreground italic">
                  You haven&apos;t hired any tutors yet.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Card: Favorite Subject */}
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="text-base">Favorite Subject</CardTitle>
          </CardHeader>
          <CardContent className="flex-1">
            {favoriteSubject ? (
              <div className="h-full flex flex-col justify-center items-center text-center space-y-2">
                <BookOpen className="h-12 w-12 text-blue-500 mx-auto opacity-80" />
                <h4 className="text-2xl font-bold">{favoriteSubject[0]}</h4>
                <p className="text-muted-foreground">
                  {favoriteSubject[1]} sessions booked
                </p>
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                 <div className="text-sm text-muted-foreground italic">
                  No favorite subject yet.
                 </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
