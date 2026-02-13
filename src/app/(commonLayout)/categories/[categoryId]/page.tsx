// app/categories/[categoryId]/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { api } from '@/lib/axios';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Loader2, DollarSign, Star, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface Tutor {
  id: string;
  user: { name: string; image?: string };
  bio?: string;
  hourlyRate: number;
  isApproved: boolean;
  categories: { id: string; name: string }[];
  _count?: { reviews: number };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function CategoryTutorsPage() {
  const { categoryId } = useParams();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch category details
        const catsRes = await api.get('/categories');
        const cats = catsRes.data.data || [];
        const currentCat = cats.find((c: Category) => c.id === categoryId);
        setCategory(currentCat);

        // Fetch tutors for this category
        const tutorsRes = await api.get('/tutors', {
          params: { approved: true, perPage: 100 }
        });
        
        // Filter tutors who have this category
        const allTutors = tutorsRes.data.data?.items || [];
        const filtered = allTutors.filter((tutor: Tutor) => 
          tutor.categories.some((cat) => cat.id === categoryId)
        );
        
        setTutors(filtered);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [categoryId]);

  if (isLoading) return <LoadingState />;

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link 
          href="/" 
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Home
        </Link>
        <h1 className="text-3xl font-bold mb-2">{category?.name || 'Category'} Tutors</h1>
        <p className="text-muted-foreground">
          {category?.description || `Find expert ${category?.name || ''} tutors`}
        </p>
      </div>

      {/* Tutors Grid */}
      {tutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tutors available for this category yet.</p>
          <Button asChild>
            <Link href="/tutors">Browse All Tutors</Link>
          </Button>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {tutors.map((tutor) => (
            <Link key={tutor.id} href={`/tutors/${tutor.id}`}>
              <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary">
                      {tutor.user.name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{tutor.user.name}</CardTitle>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Star className="h-3 w-3" />
                        {tutor._count?.reviews || 0} reviews
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                    {tutor.bio || 'No bio available'}
                  </p>
                  <div className="flex flex-wrap gap-1 mb-3">
                    {tutor.categories.slice(0, 3).map((cat) => (
                      <Badge 
                        key={cat.id} 
                        variant={cat.id === categoryId ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {cat.name}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <DollarSign className="h-4 w-4" />
                    ${tutor.hourlyRate}/hour
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}