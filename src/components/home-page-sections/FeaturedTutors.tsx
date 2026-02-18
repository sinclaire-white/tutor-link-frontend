"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { TutorCardSkeleton } from "@/components/ui/skeletons/CardSkeleton";
import { Star, ArrowRight } from "lucide-react";

interface Tutor {
  id: string;
  userId: string;
  hourlyRate: number;
  isFeatured?: boolean;
  user: {
    name: string;
    image?: string;
  };
  categories: Array<{
    id: string;
    name: string;
  }>;
}

export function FeaturedTutors() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchTutors = async () => {
      try {
        const { data } = await api.get("/tutors?perPage=4&approved=true");
        // Filter for featured tutors only
        const featuredTutors = data.data?.items?.filter((t: Tutor) => t.isFeatured) || [];
        setTutors(featuredTutors);
      } catch (error) {
        console.error("Failed to fetch tutors:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTutors();
  }, []);

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Featured Tutors
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Connect with expert tutors ready to help you achieve your learning goals
        </p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <TutorCardSkeleton key={i} />
          ))}
        </div>
      ) : tutors.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No tutors available yet</p>
          <Button asChild>
            <Link href="/become-tutor">Become a tutor</Link>
          </Button>
        </div>
      ) : (
        <>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {tutors.map((tutor) => (
              <Card 
                key={tutor.id}
                className="group hover:shadow-lg transition-all duration-200 overflow-hidden border hover:border-primary/50"
              >
                <CardContent className="p-0">
                  <div className="p-6 pb-4">
                    <div className="flex items-start gap-3 mb-4">
                      <Avatar className="h-12 w-12 border-2 border-muted">
                        <AvatarImage src={tutor.user.image} />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                          {tutor.user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-base truncate">
                          {tutor.user.name}
                        </h3>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Star className="h-3 w-3 fill-yellow-500 text-yellow-500" />
                          <span className="font-medium">New</span>
                        </p>
                      </div>
                    </div>

                    {tutor.categories.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {tutor.categories.slice(0, 2).map((cat) => (
                          <Badge 
                            key={cat.id} 
                            variant="secondary" 
                            className="text-xs font-normal"
                          >
                            {cat.name}
                          </Badge>
                        ))}
                        {tutor.categories.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{tutor.categories.length - 2}
                          </Badge>
                        )}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-3 border-t">
                      <div>
                        <span className="text-2xl font-bold text-primary">
                          ${tutor.hourlyRate}
                        </span>
                        <span className="text-sm text-muted-foreground">/hr</span>
                      </div>
                      <Button 
                        size="sm" 
                        asChild
                        className="group-hover:bg-primary group-hover:text-primary-foreground"
                      >
                        <Link href={`/tutors/${tutor.id}`}>
                          View
                          <ArrowRight className="ml-1 h-3 w-3" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" variant="outline" asChild>
              <Link href="/tutors">
                Browse All Tutors
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </>
      )}
    </section>
  );
}