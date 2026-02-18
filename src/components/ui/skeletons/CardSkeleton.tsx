import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export function CardSkeleton() {
  return (
    <Card>
      <CardContent className="p-6">
        <Skeleton className="h-6 w-3/4 mb-4" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-5/6" />
      </CardContent>
    </Card>
  );
}

export function TutorCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full" />
      <CardContent className="p-5">
        <Skeleton className="h-5 w-2/3 mb-2" />
        <Skeleton className="h-4 w-1/2 mb-3" />
        <Skeleton className="h-4 w-1/3 mb-3" />
        <Skeleton className="h-8 w-20" />
      </CardContent>
    </Card>
  );
}

export function StatSkeleton() {
  return (
    <div className="text-center">
      <Skeleton className="h-12 w-24 mx-auto mb-2" />
      <Skeleton className="h-4 w-32 mx-auto" />
    </div>
  );
}
