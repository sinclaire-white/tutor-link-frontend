// app/dashboard/tutor/page.tsx
"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "@/providers/SessionProvider";
import { api } from "@/lib/axios";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Loader2,
  Star,
  Clock,
  TrendingUp,
  BarChart3,
  Users,
} from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";

export const dynamic = "force-dynamic";

type Booking = {
  id: string;
  scheduledAt?: string;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED" | "ONGOING";
  student?: { name: string; image?: string };
  category?: { name: string };
};

const COLORS = [
  "#2563eb", // blue-600
  "#16a34a", // green-600
  "#d97706", // amber-600
  "#dc2626", // red-600
  "#9333ea", // purple-600
  "#0891b2", // cyan-600
];

export default function TutorDashboard() {
  const [profile, setProfile] = useState<any>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

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

  // --- Analytics Logic ---

  // 1. Monthly Activity (Bar Chart)
  const monthlyActivity = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const data = months.map((month) => ({ name: month, sessions: 0 }));

    bookings.forEach((b) => {
      if (!b.scheduledAt) return;
      const date = new Date(b.scheduledAt);
      const monthIndex = date.getMonth();
      data[monthIndex].sessions += 1;
    });

    // Determine current month index to slice the array if needed, 
    // or just show all months for overview. Let's show all months where data exists 
    // or just the last 6 months for cleaner view if data spans years.
    // For now, simple 12-month view.
    return data;
  }, [bookings]);

  // 2. Booking Status Distribution (Donut Chart)
  const statusData = useMemo(() => {
    let completed = 0;
    let cancelled = 0;
    let pending = 0;
    let upcoming = 0;

    bookings.forEach((b) => {
      if (b.status === "COMPLETED") completed++;
      else if (b.status === "CANCELLED") cancelled++;
      else if (b.status === "PENDING") pending++;
      else if (["CONFIRMED", "ONGOING"].includes(b.status)) upcoming++;
    });

    const data = [
      { name: "Completed", value: completed, color: COLORS[0] }, // Blue
      { name: "Upcoming", value: upcoming, color: COLORS[1] },   // Green
      { name: "Pending", value: pending, color: COLORS[2] },     // Amber
      { name: "Cancelled", value: cancelled, color: COLORS[3] }, // Red
    ];

    return data.filter((item) => item.value > 0);
  }, [bookings]);

  // 3. Subject Popularity (Radar Chart)
  const subjectPopularity = useMemo(() => {
    const subjectCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const name = b.category?.name || "General";
      subjectCounts[name] = (subjectCounts[name] || 0) + 1;
    });

    return Object.entries(subjectCounts)
      .map(([subject, count]) => ({ subject, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5); // Top 5 subjects
  }, [bookings]);

  // 4. Top 3 Returning Students (List)
  const returningStudents = useMemo(() => {
    const studentCounts: Record<string, number> = {};
    bookings.forEach((b) => {
      const name = b.student?.name || "Unknown Student";
      studentCounts[name] = (studentCounts[name] || 0) + 1;
    });
    return Object.entries(studentCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 3);
  }, [bookings]);

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const upcomingCount = bookings.filter((b) =>
    ["CONFIRMED", "ONGOING"].includes(b.status)
  ).length;

  if (sessionLoading || dataLoading) {
    return (
      <div className="flex items-center justify-center min-h-[calc(100vh-200px)]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold mb-1">Tutor Dashboard</h2>
          <p className="text-muted-foreground">
            Welcome back, {profile?.name}! Here&apos;s your performance analytics.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/dashboard/tutor/bookings">
            <Button>Manage Bookings</Button>
          </Link>
          <Link href="/dashboard/tutor/profile">
            <Button variant="outline">Edit Profile</Button>
          </Link>
        </div>
      </div>

      {/* Main Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Requests
            </CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {pendingCount}
            </div>
            <p className="text-xs text-muted-foreground">
              Awaiting your approval
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Upcoming Sessions
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {upcomingCount}
            </div>
            <p className="text-xs text-muted-foreground">Confirmed bookings</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rating</CardTitle>
            <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">
              {profile?.tutor?.rating || "N/A"}
            </div>
            <p className="text-xs text-muted-foreground">
              Average student rating
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Monthly Activity Bar Chart */}
        <Card className="col-span-1 lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-primary" />
              Monthly Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full min-w-0">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyActivity} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" />
                  <XAxis 
                    dataKey="name" 
                    tickLine={false}
                    axisLine={false}
                    tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }} 
                    dy={10}
                  />
                  <YAxis 
                     tickLine={false}
                     axisLine={false}
                     tick={{ fontSize: 12, fill: 'var(--muted-foreground)' }}
                  />
                  <Tooltip 
                     cursor={{ fill: 'var(--muted)' }}
                     contentStyle={{ 
                       backgroundColor: 'var(--popover)', 
                       color: 'var(--popover-foreground)',
                       borderRadius: '8px', 
                       border: '1px solid var(--border)', 
                       boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                     }}
                   />
                  <Bar 
                    dataKey="sessions" 
                    fill={COLORS[0]} 
                    radius={[4, 4, 0, 0]} 
                    barSize={40}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Booking Status Donut Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Booking Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full min-w-0">
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
                        <Cell key={`cell-${index}`} fill={entry.color} strokeWidth={0} />
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

        {/* Subject Popularity Radar Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Subject Popularity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-75 w-full min-w-0">
              {subjectPopularity.length > 0 ? (
                 <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={subjectPopularity}>
                    <PolarGrid stroke="var(--border)" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--muted-foreground)', fontSize: 12 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 'auto']} tick={false} axisLine={false} />
                    <Radar
                      name="Sessions"
                      dataKey="count"
                      stroke={COLORS[4]}
                      fill={COLORS[4]}
                      fillOpacity={0.3}
                    />
                    <Tooltip
                     contentStyle={{ 
                       backgroundColor: 'var(--popover)', 
                       color: 'var(--popover-foreground)',
                       borderRadius: '8px', 
                       border: '1px solid var(--border)', 
                       boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' 
                     }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              ) : (
                 <div className="h-full flex items-center justify-center text-muted-foreground italic text-sm">
                  No subject data available
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

       {/* Top Students List (Bottom Section) */}
       <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Users className="h-5 w-5 text-primary" />
              Top Returning Students
            </CardTitle>
          </CardHeader>
          <CardContent>
            {returningStudents.length > 0 ? (
               <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 {returningStudents.map(([name, count]) => (
                   <div key={name} className="flex items-center justify-between p-4 border rounded-lg bg-muted/20">
                      <div className="flex items-center gap-3">
                         <Avatar className="h-10 w-10 border border-border">
                           <AvatarFallback className="bg-primary/10 text-primary font-bold">
                              {name.charAt(0)}
                            </AvatarFallback>
                         </Avatar>
                         <div>
                            <span className="font-semibold block truncate max-w-37.5" title={name}>{name}</span>
                            <span className="text-xs text-muted-foreground">Frequent learner</span>
                         </div>
                      </div>
                      <Badge variant="secondary" className="px-3 py-1">{count} bookings</Badge>
                   </div>
                 ))}
               </div>
             ) : (
                <p className="text-sm text-muted-foreground italic py-8 text-center">No student data available yet</p>
             )}
          </CardContent>
        </Card>
    </div>
  );
}
