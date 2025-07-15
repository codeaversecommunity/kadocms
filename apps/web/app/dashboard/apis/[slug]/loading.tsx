import { Skeleton } from "@/components/atoms/skeleton";

export default function ContentApiLoading() {
  return (
    <>
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-96 w-full mt-4" />
    </>
  );
}
