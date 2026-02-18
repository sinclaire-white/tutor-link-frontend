import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <Skeleton className="h-10 w-64 mb-8" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}