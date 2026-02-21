'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, Loader2, DollarSign, BookOpen, User } from 'lucide-react';
import { toast } from 'sonner';

interface Application {
  id: string;
  user: { id: string; name: string; email: string };
  bio: string;
  hourlyRate: number;
  categories: { id: string; name: string }[];
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-10rem)]">
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
      <div className="flex items-center gap-3">
        <h1 className="text-3xl font-bold">Tutor Applications</h1>
        {applications.length > 0 && (
          <span className="inline-flex items-center justify-center rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-100 text-sm font-semibold px-3 py-1">
            {applications.length} pending
          </span>
        )}
      </div>

      <div className="space-y-4">
        {applications.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No pending applications</p>
        ) : (
          applications.map((app) => (
            <Card key={app.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg hover:underline decoration-primary">
                      <Link href={`/profile/${app.user.id}`}>
                        {app.user.name}
                      </Link>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">{app.user.email}</p>
                  </div>
                  <Badge variant="outline" className="flex items-center gap-1">
                    <DollarSign className="h-3 w-3" />
                    {app.hourlyRate}/hr
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                   <h4 className="text-sm font-medium flex items-center gap-2">
                    <User className="h-4 w-4" /> Bio
                   </h4>
                   <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md line-clamp-3">
                     {app.bio || "No bio provided."}
                   </p>
                </div>

                <div className="space-y-2">
                  <h4 className="text-sm font-medium flex items-center gap-2">
                    <BookOpen className="h-4 w-4" /> Subjects
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {app.categories.map((cat) => (
                      <Badge key={cat.id} variant="secondary">
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div className="pt-4 flex gap-3">
                  <Button 
                    onClick={() => handleDecision(app.id, true)} 
                    className="flex-1 bg-green-600 hover:bg-green-700"
                    disabled={processingId === app.id}
                  >
                    {processingId === app.id ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <CheckCircle className="mr-2 h-4 w-4" />
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
                        <XCircle className="mr-2 h-4 w-4" />
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