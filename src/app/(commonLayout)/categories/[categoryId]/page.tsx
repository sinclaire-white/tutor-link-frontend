// app/categories/[categoryId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, Star, ArrowLeft } from "lucide-react";
import Link from "next/link";

interface Tutor {
  id: string;
  user: { name: string; image?: string };
  bio?: string;
  hourlyRate: number;
  isApproved: boolean;
  categories: { id: string; name: string }[];
  reviewCount?: number;
  reviews?: any[];
  _count?: { reviews: number };
}

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoryTutorsPage() {
  const { categoryId } = useParams();
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [category, setCategory] = useState<Category | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const catsRes = await api.get("/categories");
        const cats = catsRes.data.data || [];
        const currentCat = cats.find((c: Category) => c.id === categoryId);
        setCategory(currentCat);

        const tutorsRes = await api.get("/tutors", {
          params: { approved: true, perPage: 100 },
        });

        const allTutors = tutorsRes.data.data?.items || [];
        const filtered = allTutors.filter((tutor: Tutor) =>
          tutor.categories.some((cat) => cat.id === categoryId),
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

  const getReviewCount = (tutor: Tutor) => {
    return (
      tutor.reviewCount ?? tutor._count?.reviews ?? tutor.reviews?.length ?? 0
    );
  };

  // FIX: Always render the layout wrapper, conditionally render content inside
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          // Actual content
          <>
            {/* Header */}
            <div className="mb-8">
              <Link
                href="/"
                className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-4"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Home
              </Link>
              <h1 className="text-3xl font-bold mb-2">
                {category?.name || "Category"} Tutors
              </h1>
              <p className="text-muted-foreground">
                {category?.description ||
                  `Find expert ${category?.name || ""} tutors`}
              </p>
            </div>

            {/* Tutors Grid */}
            {tutors.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-muted-foreground mb-4">
                  No tutors available for this category yet.
                </p>
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
                          <div className="min-w-0 flex-1">
                            <CardTitle className="text-lg truncate">
                              {tutor.user.name}
                            </CardTitle>
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Star className="h-3 w-3" />
                              {getReviewCount(tutor)} reviews
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                          {tutor.bio || "No bio available"}
                        </p>
                        <div className="flex flex-wrap gap-1 mb-3">
                          {tutor.categories.slice(0, 3).map((cat) => (
                            <Badge
                              key={cat.id}
                              variant={
                                cat.id === categoryId ? "default" : "secondary"
                              }
                              className="text-xs"
                            >
                              {cat.name}
                            </Badge>
                          ))}
                        </div>
                        <div className="flex items-center gap-1 text-sm font-medium">
                          <DollarSign className="h-4 w-4" />${tutor.hourlyRate}
                          /hour
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
