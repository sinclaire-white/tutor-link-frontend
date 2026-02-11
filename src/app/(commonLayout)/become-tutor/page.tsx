// src/app/(commonLayout)/become-tutor/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { authClient } from "@/lib/auth-client";
import { api } from "@/lib/axios"; // Use your axios instance
import Link from "next/link";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
}

export default function BecomeTutorPage() {
  const [user, setUser] = useState<{ name?: string; role?: string } | null>(
    null,
  );
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);
  const router = useRouter();

  const [formData, setFormData] = useState({
    bio: "",
    qualifications: "",
    hourlyRate: "",
    categoryIds: [] as string[],
  });
  const handleCategoryToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(id)
        ? prev.categoryIds.filter((itemId) => itemId !== id)
        : [...prev.categoryIds, id],
    }));
  };

  // Check session
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const result = await authClient.getSession();
        const sessionData = result?.data;
        if (!sessionData?.user) {
          router.push("/sign-in");
          return;
        }
        setUser(sessionData.user);
      } catch {
        router.push("/sign-in");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  // Fetch real categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        const cats = data.data || [];
        setCategories(cats);
        if (cats.length > 0) {
          setFormData((prev) => ({ ...prev, categoryId: cats[0].id }));
        }
      } catch (err) {
        toast.error("Failed to load categories");
      } finally {
        setCategoriesLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Use your axios instance with proper error handling
      await api.post("/tutors/apply", {
        categoryIds: formData.categoryIds,
        bio: formData.bio,
        qualifications: formData.qualifications,
        hourlyRate: parseFloat(formData.hourlyRate),
      });

      toast.success("Application submitted! Redirecting...");
      setTimeout(() => router.push("/dashboard"), 1500);
    } catch (err: any) {
      toast.error(err.message || "Failed to submit application");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (user?.role === "TUTOR") {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Already a Tutor</CardTitle>
            <CardDescription>
              You&apos;re already registered as a tutor!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Visit your tutor dashboard to manage your profile and bookings.
            </p>
            <Button className="w-full" asChild>
              <Link href="/dashboard">Go to Dashboard</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Home
        </Link>

        <Card>
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Become a Tutor</CardTitle>
            <CardDescription>
              Share your expertise and start earning. Fill out the form below to
              apply.
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Category */}
              <div className="space-y-2">
                <label className="text-sm font-medium">Expertise Areas</label>
                <div className="grid grid-cols-2 gap-3 p-4 border rounded-md max-h-48 overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat.id} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={cat.id}
                        checked={formData.categoryIds.includes(cat.id)}
                        onChange={() => handleCategoryToggle(cat.id)}
                        className="h-4 w-4 rounded border-gray-300"
                      />
                      <label
                        htmlFor={cat.id}
                        className="text-sm cursor-pointer"
                      >
                        {cat.name}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <label htmlFor="bio" className="text-sm font-medium">
                  Bio / About You
                </label>
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleInputChange}
                  placeholder="Tell students about yourself and your teaching experience..."
                  rows={4}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  required
                />
              </div>

              {/* Qualifications */}
              <div className="space-y-2">
                <label htmlFor="qualifications" className="text-sm font-medium">
                  Qualifications
                </label>
                <textarea
                  id="qualifications"
                  name="qualifications"
                  value={formData.qualifications}
                  onChange={handleInputChange}
                  placeholder="E.g., Bachelor's in Mathematics, 5 years teaching experience..."
                  rows={2}
                  className="w-full px-3 py-2 border border-input rounded-md bg-background focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                />
              </div>

              {/* Hourly Rate */}
              <div className="space-y-2">
                <label htmlFor="hourlyRate" className="text-sm font-medium">
                  Hourly Rate ($)
                </label>
                <Input
                  id="hourlyRate"
                  name="hourlyRate"
                  type="number"
                  step="0.01"
                  min="1"
                  placeholder="50.00"
                  value={formData.hourlyRate}
                  onChange={handleInputChange}
                  required
                />
                <p className="text-xs text-muted-foreground">
                  Set your rate. You can change this later.
                </p>
              </div>

              {/* Submit */}
              <Button
                type="submit"
                disabled={submitting || categoriesLoading}
                className="w-full"
                size="lg"
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Application"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Your application will be reviewed by our team.
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
