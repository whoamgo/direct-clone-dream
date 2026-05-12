import { cn } from "@/lib/utils";

interface SkeletonProps {
  className?: string;
  count?: number;
}

export const Skeleton = ({ className, count = 1 }: SkeletonProps) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className={cn("animate-pulse rounded-md bg-muted", className)} />
    ))}
  </>
);

export const ProductCardSkeleton = () => (
  <div className="bg-card rounded-md border border-border overflow-hidden p-4 space-y-3">
    <Skeleton className="aspect-square w-full rounded-md" />
    <Skeleton className="h-4 w-3/4" />
    <Skeleton className="h-3 w-1/2" />
    <div className="flex justify-between items-center pt-2">
      <Skeleton className="h-5 w-16" />
      <Skeleton className="h-8 w-24 rounded-md" />
    </div>
  </div>
);

export const ProductRowSkeleton = ({ count = 5 }: { count?: number }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
    {Array.from({ length: count }).map((_, i) => (
      <ProductCardSkeleton key={i} />
    ))}
  </div>
);

export const TableRowSkeleton = ({ rows = 5 }: { rows?: number }) => (
  <div className="space-y-3">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="flex gap-4 items-center">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/2" />
        </div>
        <Skeleton className="h-4 w-20" />
      </div>
    ))}
  </div>
);
