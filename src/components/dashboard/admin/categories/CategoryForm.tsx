// src/components/dashboard/admin/categories/CategoryForm.tsx
'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/lib/axios';

interface CategoryFormProps {
  onSuccess: () => void;
}

export function CategoryForm({ onSuccess }: CategoryFormProps) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = async () => {
    if (!name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setIsAdding(true);

    try {
      await api.post('/categories', {
        name: name.trim(),
        description: description.trim() || undefined,
      });

      setName('');
      setDescription('');
      onSuccess();
      toast.success('Category created successfully');
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsAdding(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && !isAdding) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="space-y-3 max-w-lg">
      <Input
        placeholder="Category name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={isAdding}
      />
      <Textarea
        placeholder="Description (optional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        onKeyDown={handleKeyDown}
        rows={3}
        className="resize-none"
        disabled={isAdding}
      />
      <Button
        onClick={handleSubmit}
        disabled={isAdding || !name.trim()}
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
  );
}