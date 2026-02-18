// app/dashboard/admin/tutor-applications/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Application {
  id: string;
  user: { name: string; email: string };
  bio: string;
  categories: { id: string; name: string }[];
}

// Consistent loading component
function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function AdminTutorApplicationsPage() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);  
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { user, isLoading: sessionLoading } = useSession(); 
  const router = useRouter();

  const fetchApplications = async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get('/tutors', { params: { approved: 'false' } });
      setApplications(data.data?.items || []);
    } catch (err) {
      toast.error("Failed to load applications");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDecision = async (id: string, approved: boolean) => {
    try {
      setProcessingId(id);
      await api.patch(`/tutors/${id}/approve`, { approved });
      toast.success(approved ? 'Tutor Approved' : 'Tutor Rejected');
      fetchApplications();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Action failed");
    } finally {
      setProcessingId(null);
    }
  };

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
    fetchApplications();
  }, [user, sessionLoading, router]);

  // Consistent loading check
  if (sessionLoading || isLoading) {
    return <LoadingState />;
  }

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
                  <Button 
                    onClick={() => handleDecision(app.id, true)} 
                    className="flex-1"
                    disabled={processingId === app.id}
                  >
                    {processingId === app.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </>
                    )}
                  </Button>
                  <Button 
                    variant="destructive" 
                    onClick={() => handleDecision(app.id, false)} 
                    className="flex-1"
                    disabled={processingId === app.id}
                  >
                    {processingId === app.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </>
                    )}
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