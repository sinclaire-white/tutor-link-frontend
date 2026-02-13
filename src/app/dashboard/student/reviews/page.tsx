// app/dashboard/student/reviews/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from '@/providers/SessionProvider';
import { api } from '@/lib/axios';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Loader2, Calendar } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface Review {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  booking: {
    id: string;
    scheduledAt: string;
    tutor: { name: string; image?: string };
    category: { name: string };
  };
}

interface PendingReview {
  bookingId: string;
  scheduledAt: string;
  tutor: { name: string; image?: string };
  category: { name: string };
}

export default function StudentReviewsPage() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [pendingReviews, setPendingReviews] = useState<PendingReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/sign-in?redirect=/dashboard/student/reviews');
      return;
    }
    if (user.role !== 'STUDENT') {
      router.push(`/dashboard/${user.role?.toLowerCase()}/reviews`);
      return;
    }

    const fetchData = async () => {
      try {
        // Get all bookings
        const { data: bookingsData } = await api.get('/bookings/my-bookings');
        const bookings = bookingsData.data || [];
        
        // Separate completed bookings without reviews (pending) and bookings with reviews
        const completed = bookings.filter((b: any) => b.status === 'COMPLETED');
        
        // For now, we'll assume reviews come with bookings or fetch separately
        // This is a simplified version - you may need to adjust based on your API
        
        const completedWithReviews = completed.filter((b: any) => b.review);
        const completedWithoutReviews = completed.filter((b: any) => !b.review);
        
        setReviews(completedWithReviews.map((b: any) => ({
          ...b.review,
          booking: {
            id: b.id,
            scheduledAt: b.scheduledAt,
            tutor: b.tutor,
            category: b.category,
          }
        })));
        
        setPendingReviews(completedWithoutReviews.map((b: any) => ({
          bookingId: b.id,
          scheduledAt: b.scheduledAt,
          tutor: b.tutor,
          category: b.category,
        })));
      } catch (error) {
        toast.error('Failed to load reviews');
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
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
      <h1 className="text-3xl font-bold">My Reviews</h1>

      {/* Pending Reviews Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Pending Reviews</h2>
        {pendingReviews.length === 0 ? (
          <p className="text-muted-foreground">No sessions waiting for review</p>
        ) : (
          <div className="space-y-3">
            {pendingReviews.map((pending) => (
              <Card key={pending.bookingId}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {pending.tutor.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <div className="font-medium">{pending.tutor.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(pending.scheduledAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    <Button asChild>
                      <Link href={`/dashboard/student/reviews/new?bookingId=${pending.bookingId}`}>
                        Write Review
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </section>

      {/* Completed Reviews Section */}
      <section>
        <h2 className="text-xl font-semibold mb-4">Submitted Reviews</h2>
        {reviews.length === 0 ? (
          <p className="text-muted-foreground">You haven&apos;t submitted any reviews yet</p>
        ) : (
          <div className="space-y-3">
            {reviews.map((review) => (
              <Card key={review.id}>
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                          {review.booking.tutor.name.charAt(0).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-medium">{review.booking.tutor.name}</div>
                          <div className="text-xs text-muted-foreground">{review.booking.category.name}</div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-1 text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${i < review.rating ? 'fill-current' : ''}`}
                          />
                        ))}
                        <span className="text-sm text-muted-foreground ml-2">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      
                      {review.comment && (
                        <p className="text-sm text-muted-foreground italic">&ldquo;{review.comment}&rdquo;</p>
                      )}
                    </div>
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