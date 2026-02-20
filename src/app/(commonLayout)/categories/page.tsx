// app/categories/page.tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { api } from "@/lib/axios";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, BookOpen, ArrowRight } from "lucide-react";

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl font-bold mb-3">Browse Categories</h1>
        <p className="text-muted-foreground text-lg max-w-xl mx-auto">
          Explore all available subject areas and find expert tutors in each field.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-24 text-muted-foreground">
          No categories available yet.
        </div>
      ) : (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <Card className="group h-full hover:shadow-md hover:border-primary/50 transition-all duration-200 cursor-pointer">
                <CardContent className="p-6 flex flex-col gap-3 h-full">
                  <div className="flex items-center justify-between">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      <BookOpen className="h-5 w-5" />
                    </div>
                    <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-base mb-1">{category.name}</h2>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
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
