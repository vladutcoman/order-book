import { Skeleton } from "@/components/ui/skeleton";

const OrdersListRowSkeleton = () => {
  return (
    <div className="grid grid-cols-3 gap-2 text-sm px-4 relative py-1">
      <Skeleton className="h-[18px] w-20" />
      <Skeleton className="h-[18px] w-16 ml-auto" />
      <Skeleton className="h-[18px] w-20 ml-auto" />
    </div>
  );
};

export default OrdersListRowSkeleton;
