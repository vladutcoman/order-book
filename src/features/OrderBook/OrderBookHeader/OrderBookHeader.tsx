import { Separator } from "@/components/ui/separator";
import HeaderTopSection from "./HeaderTopSection/HeaderTopSection";
import HeaderBottomSection from "./HeaderBottomSection/HeaderBottomSection";

const OrderBookHeader = () => {
  return (
    <div className="flex flex-col mb-1 pt-1">
      <HeaderTopSection />
      <Separator className="my-1" />
      <HeaderBottomSection />
    </div>
  );
};

export default OrderBookHeader;
