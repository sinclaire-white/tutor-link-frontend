'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';
import {
  CategoryForm,
  CategoryGrid,
  EditCategoryDialog,
  DeleteCategoryDialog,
} from '@/components/dashboard/admin/categories';

interface Category {
  id: string;
  name: string;
  description?: string;
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-100">
      <Loader2 className="h-12 w-12 animate-spin text-primary" />
    </div>
  );
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isCategoriesLoading, setIsCategoriesLoading] = useState(true);
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteCategory, setDeleteCategory] = useState<Category | null>(null);
  
  const { user, isLoading: sessionLoading } = useSession();
  const router = useRouter();

  const fetchCategories = async () => {
    setIsCategoriesLoading(true);
    try {
      const { data } = await api.get('/categories');
      setCategories(data.data || []);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCategoriesLoading(false);
    }
  };

  useEffect(() => {
    if (sessionLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'student'}`);
      return;
    }
    fetchCategories();
  }, [user, sessionLoading, router]);

  // Show loading while checking session
  if (sessionLoading || !user) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>
      
      <CategoryForm onSuccess={fetchCategories} />
      
      {/* Show loader while fetching categories */}
      {isCategoriesLoading ? (
        <LoadingSpinner />
      ) : (
        <CategoryGrid
          categories={categories}
          onEdit={setEditCategory}
          onDelete={setDeleteCategory}
        />
      )}

      <EditCategoryDialog
        category={editCategory}
        open={!!editCategory}
        onOpenChange={(open) => !open && setEditCategory(null)}
        onSuccess={fetchCategories}
      />

      <DeleteCategoryDialog
        category={deleteCategory}
        open={!!deleteCategory}
        onOpenChange={(open) => !open && setDeleteCategory(null)}
        onSuccess={fetchCategories}
      />
    </div>
  );
}