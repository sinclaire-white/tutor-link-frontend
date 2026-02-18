// components/sections/Categories.tsx
'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { BookOpen, ArrowRight } from 'lucide-react';

export function Categories() {
  const { categories, isLoading } = useCategories();

  return (
    <section>
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-3">
          Popular Subjects
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Explore a wide range of subjects taught by expert tutors
        </p>
      </div>
      
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="p-6">
              <Skeleton className="h-10 w-10 rounded-lg mb-3 mx-auto" />
              <Skeleton className="h-4 w-full mb-2" />
              <Skeleton className="h-3 w-3/4 mx-auto" />
            </Card>
          ))}
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No subjects available yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.slice(0, 6).map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group"
            >
              <Card className="p-6 text-center transition-all duration-200 hover:shadow-lg hover:border-primary/50 hover:-translate-y-1">
                <div className="mb-3 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <BookOpen className="h-6 w-6" />
                </div>
                <h3 className="font-semibold text-sm mb-1 line-clamp-1">
                  {category.name}
                </h3>
                <p className="text-xs text-muted-foreground line-clamp-2">
                  {category.description || 'Find expert tutors'}
                </p>
              </Card>
            </Link>
          ))}
        </div>
      )}
      
      {!isLoading && categories.length > 6 && (
        <div className="text-center mt-8">
          <Link
            href="/categories"
            className="inline-flex items-center gap-2 text-primary hover:underline font-medium"
          >
            View All Subjects
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      )}
    </section>
  );
}