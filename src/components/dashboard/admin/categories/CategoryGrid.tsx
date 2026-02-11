// src/components/dashboard/admin/categories/CategoryGrid.tsx
'use client';

import { CategoryCard } from './CategoryCard';

interface Category {
  id: string;
  name: string;
  description?: string;
}

interface CategoryGridProps {
  categories: Category[];
  onEdit: (category: Category) => void;
  onDelete: (category: Category) => void;
}

export function CategoryGrid({ categories, onEdit, onDelete }: CategoryGridProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {categories.map((category) => (
        <CategoryCard
          key={category.id}
          category={category}
          onEdit={onEdit}
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}