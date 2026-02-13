// app/tutors/[tutorId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Loader2, Star, Phone, Mail, Calendar, Clock } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  booking: {
    student: {
      name: string;
      image?: string;
    };
  };
}

interface TutorProfile {
  id: string;
  user: {
    name: string;
    email: string;
    image?: string;
    phoneNumber?: string;
    age?: number;
  };
  bio?: string;
  qualifications?: string;
  hourlyRate: number;
  categories: { id: string; name: string }[];
  availabilities: {
    id: string;
    dayOfWeek: string;
    startTime: string;
    endTime: string;
  }[];
  reviews: Review[];
  _count: { reviews: number };
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

export default function TutorDetailPage() {
  const { tutorId } = useParams();
  const router = useRouter();
  const { user, isLoading: sessionLoading } = useSession();
  const [tutor, setTutor] = useState<TutorProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (sessionLoading) return;
    
    // Redirect to sign in if not logged in
    if (!user) {
      router.push('/sign-in');
      return;
    }

    const fetchTutor = async () => {
      try {
        const { data } = await api.get(`/tutors/public/${tutorId}`);
        setTutor(data.data);
      } catch (err: any) {
        toast.error('Failed to load tutor profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTutor();
  }, [tutorId, user, sessionLoading, router]);

  if (sessionLoading || isLoading) return <LoadingState />;
  if (!tutor) return <div className="container py-12 text-center">Tutor not found</div>;

  const handleBook = (availabilityId: string) => {
    // Navigate to booking page with pre-selected tutor and slot
    router.push(`/bookings/new?tutorId=${tutorId}&availabilityId=${availabilityId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      {/* Header */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <Avatar className="h-24 w-24">
              <AvatarImage src={tutor.user.image} />
              <AvatarFallback className="text-2xl">{tutor.user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-2xl font-bold mb-2">{tutor.user.name}</h1>
              
              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground mb-4">
                <span className="flex items-center gap-1">
                  <Mail className="h-4 w-4" />
                  {tutor.user.email}
                </span>
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4" />
                  {tutor.user.phoneNumber || <NotUpdated label="Phone" />}
                </span>
                <span className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  {tutor.user.age ? `${tutor.user.age} years old` : <NotUpdated label="Age" />}
                </span>
              </div>

              <div className="flex flex-wrap gap-2">
                {tutor.categories.map((cat) => (
                  <Badge key={cat.id}>{cat.name}</Badge>
                ))}
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold text-primary">${tutor.hourlyRate}</div>
              <div className="text-sm text-muted-foreground">per hour</div>
              <div className="flex items-center gap-1 mt-2 text-sm">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{tutor._count.reviews} reviews</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Left Column - Bio & Qualifications */}
        <div className="md:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>About</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {tutor.bio || <NotUpdated label="Bio" />}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Qualifications</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                {tutor.qualifications || <NotUpdated label="Qualifications" />}
              </p>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle>Reviews ({tutor._count.reviews})</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {tutor.reviews.length === 0 ? (
                <p className="text-muted-foreground italic">No reviews yet</p>
              ) : (
                tutor.reviews.map((review) => (
                  <div key={review.id} className="border-b last:border-0 pb-4 last:pb-0">
                    <div className="flex items-center gap-2 mb-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={review.booking.student.image} />
                        <AvatarFallback>{review.booking.student.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{review.booking.student.name}</span>
                      <div className="flex items-center gap-1 ml-auto">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        {review.rating}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {review.comment || 'No comment'}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Availability */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Availability</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {tutor.availabilities.length === 0 ? (
                <p className="text-muted-foreground italic">No availability set</p>
              ) : (
                tutor.availabilities.map((slot) => (
                  <div
                    key={slot.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div className="text-sm">
                      <div className="font-medium">{slot.dayOfWeek}</div>
                      <div className="text-muted-foreground flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {slot.startTime} - {slot.endTime}
                      </div>
                    </div>
                    <Button size="sm" onClick={() => handleBook(slot.id)}>
                      Book
                    </Button>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}