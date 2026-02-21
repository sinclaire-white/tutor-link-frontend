'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/SessionProvider';
import { api } from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Star, Loader2, Calendar, User } from 'lucide-react';
import { toast } from 'sonner';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  booking: {
    id: string;
    scheduledAt: string;
    student: { name: string; image?: string };
    category: { name: string };
  };
}

export default function TutorReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState({ averageRating: 0, totalReviews: 0 });
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/sign-in?redirect=/dashboard/tutor/reviews');
      return;
    }
    if (user.role !== 'TUTOR') {
      router.push(`/dashboard/${user.role?.toLowerCase()}/reviews`);
      return;
    }

    const fetchReviews = async () => {
      try {
        // Get tutor profile which includes reviews
        const { data } = await api.get('/users/me');
        const tutorData = data.data?.tutor;
        
        if (tutorData) {
          // Fetch public profile to get reviews
          const { data: publicData } = await api.get(`/tutors/public/${tutorData.id}`);
          const reviewsData = publicData.data?.reviews || [];
          setReviews(reviewsData);
          
          const total = reviewsData.length;
          const average = total > 0 
            ? reviewsData.reduce((sum: number, r: Review) => sum + r.rating, 0) / total 
            : 0;
          
          setStats({
            averageRating: Math.round(average * 10) / 10,
            totalReviews: total,
          });
        }
      } catch (error) {
        toast.error('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReviews();
  }, [user, sessionLoading, router]);

  if (sessionLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-100">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-8">
      <h1 className="text-3xl font-bold">Reviews from Students</h1>

      {/* Stats Card */}
      <Card className="bg-linear-to-r from-yellow-50 to-orange-50 dark:from-yellow-950 dark:to-orange-950">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground mb-1">Average Rating</p>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{stats.averageRating || 'N/A'}</span>
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-6 w-6 ${i < Math.round(stats.averageRating) ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                    />
                  ))}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-muted-foreground">Total Reviews</p>
              <p className="text-3xl font-bold">{stats.totalReviews}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <section>
        <h2 className="text-xl font-semibold mb-4">All Reviews</h2>
        {reviews.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center text-muted-foreground">
              <p>No reviews yet.</p>
              <p className="text-sm mt-2">Reviews will appear here after students complete sessions with you.</p>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-4">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {review.booking.student.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{review.booking.student.name}</div>
                        <div className="text-xs text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(review.booking.scheduledAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-yellow-500">
                      <Star className="h-4 w-4 fill-current" />
                      <span className="font-medium">{review.rating}</span>
                    </div>
                  </div>
                  
                  {review.comment && (
                    <p className="text-sm text-muted-foreground italic border-l-2 border-primary/20 pl-3">
                      &ldquo;{review.comment}&rdquo;
                    </p>
                  )}
                  
                  <div className="mt-3 text-xs text-muted-foreground">
                    Session: {review.booking.category.name}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}