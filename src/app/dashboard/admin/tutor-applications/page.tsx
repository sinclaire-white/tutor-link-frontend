// app/dashboard/admin/tutor-applications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle } from 'lucide-react';
import { toast } from 'sonner';

interface Application {
  id: string;
  user: { name: string; email: string };
  bio: string;
}

export default function AdminTutorApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const { user, isLoading } = useSession();
  const router = useRouter();

  // Function BEFORE useEffect
  const fetchApplications = () => {
    api.get('/tutors', { params: { approved: 'false' } })
      .then(({ data }) => setApplications(data.data?.items || []))
      .catch(console.error);
  };

  const handleDecision = async (id: string, approved: boolean) => {
    try {
      await api.patch(`/tutors/${id}/approve`, { approved });
      fetchApplications();
      toast.success(approved ? 'Approved' : 'Rejected');
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'student'}`);
      return;
    }
    fetchApplications();
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Tutor Applications</h1>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pending applications</p>
        ) : (
          applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <CardTitle className="text-lg">{app.user.name}</CardTitle>
                <p className="text-sm text-muted-foreground">{app.user.email}</p>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm">{app.bio}</p>
                <div className="flex gap-2">
                  <Button onClick={() => handleDecision(app.id, true)} className="flex-1">
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => handleDecision(app.id, false)} className="flex-1">
                    <XCircle className="h-4 w-4 mr-2" />
                    Reject
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}