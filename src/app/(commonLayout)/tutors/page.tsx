"use client";

import { useEffect, useState, useCallback } from "react";
import { api } from "@/lib/axios";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Loader2, DollarSign, Star, Search, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface Tutor {
  id: string;
  user: { name: string; image?: string };
  bio?: string;
  hourlyRate: number;
  categories: { id: string; name: string }[];
  _count?: { reviews: number };
}

export default function PublicTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const PER_PAGE = 9;

  // Fetch categories once
  useEffect(() => {
    api.get("/categories").then((res) => {
      setCategories(res.data.data || []);
    }).catch(() => {});
  }, []);

  // Fetch tutors whenever page / filters change
  const fetchTutors = useCallback(async () => {
    setIsLoading(true);
    try {
      const params: Record<string, unknown> = { approved: true, page, perPage: PER_PAGE };
      if (searchQuery) params.search = searchQuery;
      if (selectedCategory) params.category = selectedCategory;
      const { data } = await api.get("/tutors", { params });
      setTutors(data.data?.items || []);
      const total = data.data?.total || 0;
      setTotalPages(Math.ceil(total / PER_PAGE) || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [page, searchQuery, selectedCategory]);

  useEffect(() => {
    fetchTutors();
  }, [fetchTutors]);

  // Reset to page 1 when filters change
  const handleCategoryChange = (catId: string) => {
    setSelectedCategory(catId);
    setPage(1);
  };

  const handleSearch = () => {
    setSearchQuery(searchInput);
    setPage(1);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
    setPage(1);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-3xl font-bold mb-8">Our Tutors</h1>

      {/* Search Bar */}
      <div className="flex gap-2 mb-6 max-w-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            placeholder="Search by name..."
            className="pl-9 pr-9"
          />
          {searchInput && (
            <button
              onClick={handleClearSearch}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} size="sm" variant="outline">Search</Button>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-8">
        <Button
          variant={selectedCategory === "" ? "default" : "outline"}
          size="sm"
          onClick={() => handleCategoryChange("")}
        >
          All
        </Button>
        {categories.map((cat) => (
          <Button
            key={cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(cat.id)}
          >
            {cat.name}
          </Button>
        ))}
      </div>

      {/* Tutors Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
        </div>
      ) : tutors.length === 0 ? (
        <p className="text-center text-muted-foreground py-12">No tutors found</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <Link key={tutor.id} href={`/tutors/${tutor.id}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      {tutor.user.image ? (
                        <div className="relative w-12 h-12 rounded-full overflow-hidden shrink-0">
                          <Image src={tutor.user.image} alt={tutor.user.name} fill sizes="48px" className="object-cover" />
                        </div>
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-lg font-bold text-primary shrink-0">
                          {tutor.user.name.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <CardTitle className="text-lg truncate">{tutor.user.name}</CardTitle>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3" />{tutor._count?.reviews ?? 0} reviews
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
                        <Badge key={cat.id} variant="secondary" className="text-xs">{cat.name}</Badge>
                      ))}
                    </div>
                    <div className="flex items-center gap-1 text-sm font-medium">
                      <DollarSign className="h-4 w-4" />${tutor.hourlyRate}/hour
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          <div className="mt-8">
            <PaginationControls currentPage={page} totalPages={totalPages} onPageChange={setPage} />
          </div>
        </>
      )}
    </div>
  );
}