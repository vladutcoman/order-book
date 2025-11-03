import { Skeleton } from '@/components/ui/skeleton';

const OrdersListRowSkeleton = () => {
  return (
    <div className="relative grid grid-cols-3 gap-2 px-4 py-1 text-sm">
      <Skeleton className="h-[18px] w-20" />
      <Skeleton className="ml-auto h-[18px] w-16" />
      <Skeleton className="ml-auto h-[18px] w-20" />
    </div>
  );
};

export default OrdersListRowSkeleton;
