import { Separator } from '@/components/ui/separator';

import HeaderBottomSection from './HeaderBottomSection/HeaderBottomSection';
import HeaderTopSection from './HeaderTopSection/HeaderTopSection';

const OrderBookHeader = () => {
  return (
    <div className="flex flex-col pt-1">
      <HeaderTopSection />
      <Separator className="my-1" />
      <HeaderBottomSection />
    </div>
  );
};

export default OrderBookHeader;
