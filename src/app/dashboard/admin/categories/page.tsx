// app/dashboard/admin/categories/page.tsx
'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Plus, Trash2, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false); // Loading state for add
  const [deleteTarget, setDeleteTarget] = useState<Category | null>(null); // For modal
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete
  const { user, isLoading } = useSession();
  const router = useRouter();

  const fetchCategories = () => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || []))
      .catch((err: Error) => toast.error(err.message));
  };

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Category name is required');
      return;
    }
    
    setIsAdding(true); // Start loading
    
    try {
      await api.post('/categories', { 
        name: newName,
        description: newDescription.trim() || undefined
      });
      
      setNewName('');
      setNewDescription('');
      fetchCategories();
      toast.success('Category created successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAdding(false); // Stop loading regardless of outcome
    }
  };

  const openDeleteDialog = (category: Category) => {
    setDeleteTarget(category);
  };

  const closeDeleteDialog = () => {
    if (!isDeleting) { // Prevent closing while deleting
      setDeleteTarget(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    
    setIsDeleting(true); // Start loading
    
    try {
      await api.delete(`/categories/${deleteTarget.id}`);
      fetchCategories();
      toast.success(`"${deleteTarget.name}" deleted successfully`);
      setDeleteTarget(null);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsDeleting(false); // Stop loading
    }
  };

  // Handle Enter key to submit (only if not loading)
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isAdding) {
      e.preventDefault();
      handleCreate();
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role?.toLowerCase() || 'student'}`);
      return;
    }
    fetchCategories();
  }, [user, isLoading, router]);

  if (isLoading || !user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>

      {/* Form Section */}
      <div className="space-y-3 max-w-lg">
        <Input
          placeholder="Category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isAdding}
        />
        <Textarea
          placeholder="Description (optional)"
          value={newDescription}
          onChange={(e) => setNewDescription(e.target.value)}
          onKeyDown={handleKeyDown}
          rows={3}
          className="resize-none"
          disabled={isAdding}
        />
        <Button 
          onClick={handleCreate} 
          disabled={isAdding || !newName.trim()}
          className="w-full sm:w-auto min-w-35"
        >
          {isAdding ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Adding...
            </>
          ) : (
            <>
              <Plus className="h-4 w-4 mr-2" />
              Add Category
            </>
          )}
        </Button>
      </div>

      {/* Categories Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id} className="group">
            <CardHeader className="flex flex-row items-start justify-between space-y-0">
              <div className="space-y-1 flex-1 min-w-0">
                <CardTitle className="text-lg truncate">{cat.name}</CardTitle>
                {cat.description && (
                  <CardDescription className="line-clamp-2">
                    {cat.description}
                  </CardDescription>
                )}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={() => openDeleteDialog(cat)}
                className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteTarget} onOpenChange={closeDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>&quot;{deleteTarget?.name}&quot;</strong>.
              {deleteTarget?.description && (
                <span className="block mt-2 text-muted-foreground italic">
                  &quot;{deleteTarget.description}&quot;
                </span>
              )}
              <br /><br />
              This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-destructive hover:bg-destructive/90"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Deleting...
                </>
              ) : (
                'Delete'
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}