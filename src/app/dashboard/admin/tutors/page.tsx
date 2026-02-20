// app/dashboard/admin/tutors/page.tsx
"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from 'next/link';
import { api } from "@/lib/axios";
import { useSession } from "@/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Loader2, Trash2, Star, DollarSign } from "lucide-react";
import { toast } from "sonner";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { PaginationControls } from "@/components/ui/pagination-controls";

interface Tutor {
  id: string;
  userId: string;
  user: { name: string; email: string; image?: string };
  bio?: string;
  hourlyRate: number;
  isApproved: boolean;
  isFeatured: boolean;
  categories: { id: string; name: string }[];
  _count?: { reviews: number };
}

function LoadingState() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<Tutor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteTarget, setDeleteTarget] = useState<Tutor | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalTutors, setTotalTutors] = useState(0);

  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  const fetchTutors = useCallback(async () => {
    try {
      setIsLoading(true);
      const { data } = await api.get("/tutors", { 
        params: { 
          page,
          perPage: 10
        }
      });
      setTutors(data.data?.items || []);
      setTotalPages(data.data?.meta?.totalPages || 1);
      setTotalTutors(data.data?.meta?.total || 0);

    } catch (err: any) {
      toast.error("Failed to load tutors");
    } finally {
      setIsLoading(false);
    }
  }, [page]);

  const handleDelete = async () => {
    if (!deleteTarget) return;

    setIsDeleting(true);
    try {
      await api.delete(`/tutors/${deleteTarget.id}`);
      toast.success(`Tutor "${deleteTarget.user.name}" deleted successfully`);
      setDeleteTarget(null);
      fetchTutors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to delete tutor");
    } finally {
      setIsDeleting(false);
    }
  };

  const toggleFeatured = async (tutorId: string, currentStatus: boolean) => {
    try {
      await api.patch(`/tutors/${tutorId}/featured`, {
        featured: !currentStatus,
      });
      toast.success(
        !currentStatus
          ? "Tutor added to featured list"
          : "Tutor removed from featured list"
      );
      fetchTutors();
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Failed to update featured status");
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push("/sign-in");
      return;
    }
    if (user.role !== "ADMIN") {
      router.push(`/dashboard/${user.role?.toLowerCase() || "student"}`);
      return;
    }
    fetchTutors();
  }, [user, sessionLoading, router, fetchTutors]);

  if (sessionLoading || isLoading) {
    return <LoadingState />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">All Tutors</h1>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tutors.map((tutor) => (
          <Card key={tutor.id} className="flex flex-col">
            <CardHeader className="pb-3">
              <div className="flex flex-col gap-2">
                <div>
                  <CardTitle className="text-lg truncate hover:underline">
                    <Link href={`/profile/${tutor.userId}`}>
                      {tutor.user.name}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-muted-foreground truncate">
                    {tutor.user.email}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge
                    variant={tutor.isApproved ? "default" : "secondary"}
                    className="w-fit"
                  >
                    {tutor.isApproved ? "Approved" : "Pending"}
                  </Badge>
                  {tutor.isFeatured && (
                    <Badge variant="outline" className="w-fit bg-yellow-50 text-yellow-700 border-yellow-300">
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      Featured
                    </Badge>
                  )}
                </div>
              </div>
            </CardHeader>

            <CardContent className="flex-1 flex flex-col pt-0">
              {/* Bio */}
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                {tutor.bio || "No bio provided"}
              </p>

              {/* Categories */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {tutor.categories.map((cat) => (
                  <Badge
                    key={cat.id}
                    variant="outline"
                    className="text-xs font-normal"
                  >
                    {cat.name}
                  </Badge>
                ))}
              </div>

              {/* Stats - pushed to bottom with mt-auto */}
              <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto mb-4">
                <span className="flex items-center gap-1">
                  <DollarSign className="h-4 w-4" />${tutor.hourlyRate}/hr
                </span>
                <span className="flex items-center gap-1">
                  <Star className="h-4 w-4" />
                  {tutor._count?.reviews || 0} reviews
                </span>
              </div>

              {/* Featured Toggle - only for approved tutors */}
              {tutor.isApproved && (
                <div className="flex items-center justify-between mb-3 p-3 bg-muted/50 rounded-md">
                  <Label htmlFor={`featured-${tutor.id}`} className="text-sm font-medium cursor-pointer">
                    Featured Tutor
                  </Label>
                  <Switch
                    id={`featured-${tutor.id}`}
                    checked={tutor.isFeatured}
                    onCheckedChange={() => toggleFeatured(tutor.id, tutor.isFeatured)}
                  />
                </div>
              )}

              {/* Button - always at bottom */}
              <Button
                variant="destructive"
                size="sm"
                className="w-full cursor-pointer"
                onClick={() => setDeleteTarget(tutor)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Tutor
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {tutors.length === 0 && (
        <p className="text-center text-muted-foreground py-12">
          No tutors found
        </p>
      )}

      <div className="mt-8">
        <PaginationControls
          currentPage={page}
          totalPages={totalPages}
          onPageChange={setPage}
        />
      </div>

      {/* Delete Confirmation */ }
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={() => !isDeleting && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Tutor?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete{" "}
              <strong>{deleteTarget?.user.name}</strong>&apos;s tutor profile
              and revert their role to Student.
              <br />
              <br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90 cursor-pointer"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
