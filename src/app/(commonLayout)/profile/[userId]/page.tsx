// app/profile/[userId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Mail, Phone, Calendar, GraduationCap } from 'lucide-react';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  image?: string;
  phoneNumber?: string;
  age?: number;
  role: string;
  tutor?: {
    bio?: string;
    qualifications?: string;
    hourlyRate: number;
    isApproved: boolean;
    categories: { name: string }[];
  };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

function NotUpdated({ label }: { label: string }) {
  return <span className="text-muted-foreground italic">{label} not updated</span>;
}

export default function UserProfilePage() {
  const { userId } = useParams();
  const router = useRouter();
  const { user: currentUser, isLoading: sessionLoading } = useSession();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    if (!currentUser) {
      router.push('/sign-in');
      return;
    }

    // If viewing own profile, redirect to dashboard
    if (userId === currentUser.id) {
      router.push('/dashboard');
      return;
    }

    const fetchProfile = async () => {
      try {
        // Use admin endpoint or create public user endpoint
        const { data } = await api.get(`/users/${userId}`);
        setProfile(data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userId, currentUser, sessionLoading, router]);

  if (sessionLoading || isLoading) return <LoadingState />;
  if (!profile) return <div className="container py-12 text-center">User not found</div>;

  const isTutor = profile.role === 'TUTOR' && profile.tutor;

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center text-center mb-6">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={profile.image} />
              <AvatarFallback className="text-2xl">{profile.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <h1 className="text-2xl font-bold mb-1">{profile.name}</h1>
            <Badge variant={isTutor ? 'default' : 'secondary'}>
              {profile.role}
            </Badge>
          </div>

          <div className="space-y-4">
            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Mail className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <p className="font-medium">{profile.email}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Phone className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Phone</p>
                <p className="font-medium">
                  {profile.phoneNumber || <NotUpdated label="Phone number" />}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-sm text-muted-foreground">Age</p>
                <p className="font-medium">
                  {profile.age ? `${profile.age} years` : <NotUpdated label="Age" />}
                </p>
              </div>
            </div>

            {isTutor && (
              <>
                <div className="flex items-center gap-3 p-3 bg-muted rounded-lg">
                  <GraduationCap className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Hourly Rate</p>
                    <p className="font-medium">${profile.tutor!.hourlyRate}/hour</p>
                  </div>
                </div>

                <Card className="mt-4">
                  <CardHeader>
                    <CardTitle className="text-lg">About</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">
                      {profile.tutor!.bio || <NotUpdated label="Bio" />}
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Subjects</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {profile.tutor!.categories.map((cat, idx) => (
                        <Badge key={idx} variant="outline">{cat.name}</Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}