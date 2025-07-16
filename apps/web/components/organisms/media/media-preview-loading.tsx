import { Separator } from "@/components/atoms/separator";
import { Skeleton } from "@/components/atoms/skeleton";

export default function MediaPreviewLoading() {
  return (
    <div className="w-full mt-5 px-5">
      <div className="animate-pulse space-y-4">
        <Skeleton className="h-60 w-full rounded-lg" />
        <div className="flex gap-2">
          <Skeleton className="h-6 w-1/5 rounded" />
          <Skeleton className="h-6 w-1/5 rounded" />
          <Skeleton className="h-6 w-1/5 rounded" />
        </div>

        <Separator className="my-4" />

        {/* loop for 6 times */}
        <div className="grid grid-cols-2 gap-10">
          {Array.from({ length: 6 }).map((_, index) => (
            <div className="space-y-2" key={`loading-item-${index}`}>
              <Skeleton className="h-4 w-3/4 rounded" />
              <Skeleton className="h-4 w-2/2 rounded" />
            </div>
          ))}
        </div>

        <Separator className="my-4" />

        <Skeleton className="h-6 w-2/5 rounded" />

        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-6 w-full rounded" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-4 w-1/4 rounded" />
          <Skeleton className="h-6 w-full rounded" />
        </div>

        <Separator className="my-4" />

        <Skeleton className="h-6 w-2/5 rounded" />

        <Skeleton className="h-10 w-full rounded" />
      </div>
    </div>
  );
}
