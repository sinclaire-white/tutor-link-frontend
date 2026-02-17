// app/tutors/page.tsx
"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, Star } from "lucide-react";
import Link from "next/link";

interface Tutor {
  id: string;
  user: { name: string; image?: string };
  bio?: string;
  hourlyRate: number;
  categories: { id: string; name: string }[];
  reviewCount?: number;
  reviews?: any[];
  _count?: { reviews: number };
}

export default function PublicTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>(
    [],
  );
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [tutorsRes, catsRes] = await Promise.all([
          api.get("/tutors", { params: { approved: true, perPage: 100 } }),
          api.get("/categories"),
        ]);
        setTutors(tutorsRes.data.data?.items || []);
        setCategories(catsRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredTutors = selectedCategory
    ? tutors.filter((t) => t.categories.some((c) => c.id === selectedCategory))
    : tutors;

  const getReviewCount = (tutor: Tutor) => {
    return (
      tutor.reviewCount ?? tutor._count?.reviews ?? tutor.reviews?.length ?? 0
    );
  };

  // FIX: Always render layout wrapper, conditionally render content
  return (
    <div className="min-h-screen flex flex-col">
      <div className="container mx-auto px-4 py-12 flex-1">
        {isLoading ? (
          <div className="fixed inset-0 flex items-center justify-center">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
          </div>
        ) : (
          <>
            <h1 className="text-3xl font-bold mb-8">Our Tutors</h1>

            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mb-8">
              <Button
                variant={selectedCategory === "" ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedCategory("")}
              >
                All
              </Button>
              {categories.map((cat) => (
                <Button
                  key={cat.id}
                  variant={selectedCategory === cat.id ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  {cat.name}
                </Button>
              ))}
            </div>

            {/* Tutors Grid */}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {filteredTutors.map((tutor) => (
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
                            variant="secondary"
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

            {filteredTutors.length === 0 && (
              <p className="text-center text-muted-foreground py-12">
                No tutors found
              </p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
