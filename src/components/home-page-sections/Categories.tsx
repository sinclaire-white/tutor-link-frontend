// components/sections/Categories.tsx
'use client';

import Link from 'next/link';
import { useCategories } from '@/hooks/useCategories';
import { Loader2} from 'lucide-react';

// Map category names to icons (fallback to BookOpen)


export function Categories() {
  const { categories, isLoading } = useCategories();

  return (
    <section className="py-12">
      <h2 className="text-3xl font-bold text-center mb-10">Subjects</h2>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <p className="text-center text-muted-foreground">No subjects available yet</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.id}`}
              className="group bg-card hover:bg-primary/10 border rounded-xl p-6 text-center transition-colors"
            >
              
              <h3 className="font-medium">{category.name}</h3>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-1">
                {category.description || 'Find tutors'}
              </p>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}