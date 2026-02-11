'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Calendar, GraduationCap } from 'lucide-react';

export default function AdminOverviewPage() {
  const [stats, setStats] = useState({ users: 0, tutors: 0, bookings: 0 });
  const { user, isLoading } = useSession();
  const router = useRouter();

  const fetchStats = useCallback(() => {
    api.get('/admin/stats')
      .then(({ data }) => setStats(data.data))
      .catch(console.error);
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (!user.role || user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role?.toLowerCase() || ''}`);
      return;
    }

    fetchStats();
  }, [user, isLoading, router, fetchStats]);

  if (isLoading || !user) return null;

  const cards = [
    { title: 'Users', value: stats.users, icon: Users },
    { title: 'Tutors', value: stats.tutors, icon: GraduationCap },
    { title: 'Bookings', value: stats.bookings, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Overview</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        {cards.map((card) => (
          <Card key={card.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{card.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}