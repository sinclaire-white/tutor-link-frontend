'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, GraduationCap, TrendingUp, Loader2, CheckCircle, XCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stats {
  users: number;
  tutors: number;
  students: number;
  bookings: number;
  completedBookings: number;
  pendingBookings: number;
  cancelledBookings: number;
}

export default function AdminOverviewPage() {
  const [stats, setStats] = useState<Stats>({ 
    users: 0, 
    tutors: 0, 
    students: 0,
    bookings: 0, 
    completedBookings: 0,
    pendingBookings: 0,
    cancelledBookings: 0
  });
  const [isLoading, setIsLoading] = useState(true);
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'student'}`);
      return;
    }

    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data || data))
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, [user, sessionLoading, router]);

  if (sessionLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) return null;

  const userRatio = stats.tutors + stats.students > 0 
    ? (stats.tutors / (stats.tutors + stats.students)) * 100 
    : 50;

  const bookingStatusData = [
    { label: 'Completed', value: stats.completedBookings, color: 'bg-green-500', percentage: 0 },
    { label: 'Pending', value: stats.pendingBookings, color: 'bg-yellow-500', percentage: 0 },
    { label: 'Cancelled', value: stats.cancelledBookings, color: 'bg-red-500', percentage: 0 },
  ];

  const totalBookingStatuses = stats.completedBookings + stats.pendingBookings + stats.cancelledBookings;
  if (totalBookingStatuses > 0) {
    bookingStatusData[0].percentage = (stats.completedBookings / totalBookingStatuses) * 100;
    bookingStatusData[1].percentage = (stats.pendingBookings / totalBookingStatuses) * 100;
    bookingStatusData[2].percentage = (stats.cancelledBookings / totalBookingStatuses) * 100;
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6 p-6 max-w-7xl mx-auto"
    >
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-muted-foreground mt-1">Platform overview and statistics</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.users}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All registered users
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Tutors</CardTitle>
              <GraduationCap className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-primary">{stats.tutors}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Active tutors
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{stats.students}</div>
              <p className="text-xs text-muted-foreground mt-1">
                Registered students
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
          <Card className="hover:shadow-md transition-shadow">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Bookings</CardTitle>
              <Calendar className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{stats.bookings}</div>
              <p className="text-xs text-muted-foreground mt-1">
                All-time bookings
              </p>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* User Distribution Pie Chart */}
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Student vs Tutor Ratio
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-center py-8">
                <div className="relative w-48 h-48">
                  {/* Pie Chart using SVG */}
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                    {/* Tutor segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="20"
                      strokeDasharray={`${userRatio * 2.51} ${(100 - userRatio) * 2.51}`}
                      className="transition-all duration-500"
                    />
                    {/* Student segment */}
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="hsl(217.2 91.2% 59.8%)"
                      strokeWidth="20"
                      strokeDasharray={`${(100 - userRatio) * 2.51} ${userRatio * 2.51}`}
                      strokeDashoffset={`${-userRatio * 2.51}`}
                      className="transition-all duration-500"
                    />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{stats.tutors + stats.students}</div>
                      <div className="text-xs text-muted-foreground">Total</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 mt-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-primary"></div>
                  <div>
                    <div className="text-sm font-medium">Tutors</div>
                    <div className="text-xs text-muted-foreground">{stats.tutors} ({userRatio.toFixed(1)}%)</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                  <div>
                    <div className="text-sm font-medium">Students</div>
                    <div className="text-xs text-muted-foreground">{stats.students} ({(100 - userRatio).toFixed(1)}%)</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Booking Status Bar Chart */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                Booking Status Distribution
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6 py-4">
                {bookingStatusData.map((item, index) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                    className="space-y-2"
                  >
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        {item.label === 'Completed' && <CheckCircle className="h-4 w-4 text-green-600" />}
                        {item.label === 'Pending' && <Clock className="h-4 w-4 text-yellow-600" />}
                        {item.label === 'Cancelled' && <XCircle className="h-4 w-4 text-red-600" />}
                        <span className="font-medium">{item.label}</span>
                      </div>
                      <span className="text-muted-foreground">{item.value} ({item.percentage.toFixed(1)}%)</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${item.percentage}%` }}
                        transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                        className={`h-full ${item.color} rounded-full`}
                      />
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="mt-6 pt-6 border-t">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Total Bookings</span>
                  <span className="text-2xl font-bold">{totalBookingStatuses}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
