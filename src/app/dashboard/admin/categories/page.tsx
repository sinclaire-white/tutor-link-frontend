'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/axios';
import { useSession } from '@/providers/SessionProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';
import { toast } from 'sonner';

interface Category {
  id: string;
  name: string;
  description?: string;
}

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [newName, setNewName] = useState('');
  const { user, isLoading } = useSession();
  const router = useRouter();

  const fetchCategories = useCallback(() => {
    api.get('/categories')
      .then(({ data }) => setCategories(data.data || []))
      .catch((err) => toast.error(err.message));
  }, []);

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.push('/sign-in');
      return;
    }
    if (!user.role || user.role !== 'ADMIN') {
      router.push(`/dashboard/${user.role?.toLowerCase() || ''}`);
      return;
    }
    fetchCategories();
  }, [user, isLoading, router, fetchCategories]);

  const handleCreate = async () => {
    if (!newName.trim()) return;
    try {
      await api.post('/categories', { name: newName });
      setNewName('');
      fetchCategories();
      toast.success('Category created');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast.error(message);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this category?')) return;
    try {
      await api.delete(`/categories/${id}`);
      fetchCategories();
      toast.success('Category deleted');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'An error occurred';
      toast.error(message);
    }
  };

  if (isLoading || !user) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Categories</h1>

      <div className="flex gap-2">
        <Input
          placeholder="New category name"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
        />
        <Button onClick={handleCreate}>
          <Plus className="h-4 w-4 mr-2" />
          Add
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Card key={cat.id}>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">{cat.name}</CardTitle>
              <Button variant="ghost" size="icon" onClick={() => handleDelete(cat.id)}>
                <Trash2 className="h-4 w-4 text-destructive" />
              </Button>
            </CardHeader>
          </Card>
        ))}
      </div>
    </div>
  );
}