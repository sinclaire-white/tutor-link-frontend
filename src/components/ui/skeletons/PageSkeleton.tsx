import { Skeleton } from "@/components/ui/skeleton";

export function PageSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6 max-w-7xl">
      <Skeleton className="h-8 w-64 mb-4" />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8 space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-32 rounded-lg" />
        ))}  
      </div>
      <Skeleton className="h-96 rounded-lg" />
    </div>
  );
}
