import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type { OrderBookDecimal } from "@/types/orderBookTypes";

const DECIMAL_OPTIONS: { label: string; value: OrderBookDecimal }[] = [
  { label: "0.01", value: 0.01 },
  { label: "0.1", value: 0.1 },
  { label: "1", value: 1 },
  { label: "10", value: 10 },
  { label: "50", value: 50 },
  { label: "100", value: 100 },
];

const OrderBookHeader = () => {
  const decimal = useOrderBookStore((s) => s.decimal);
  const setDecimal = useOrderBookStore((s) => s.setDecimal);
  const rounding = useOrderBookStore((s) => s.rounding);
  const setRounding = useOrderBookStore((s) => s.setRounding);
  const showBuySellRatio = useOrderBookStore((s) => s.showBuySellRatio);
  const setShowBuySellRatio = useOrderBookStore((s) => s.setShowBuySellRatio);

  return (
    <div className="flex flex-col items-center justify-between mb-5">
      <h2 className="text-lg font-semibold">Order Book</h2>
      <div className="flex flex-col items-center gap-4">
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={showBuySellRatio}
            onChange={(e) => setShowBuySellRatio(e.target.checked)}
            className="cursor-pointer"
          />
          <span>Show Buy/Sell Ratio</span>
        </label>
        <label className="flex items-center gap-2 text-sm cursor-pointer">
          <input
            type="checkbox"
            checked={rounding}
            onChange={(e) => setRounding(e.target.checked)}
            className="cursor-pointer"
          />
          <span>Rounding</span>
        </label>
        <Select
          value={decimal.toString()}
          onValueChange={(value) =>
            setDecimal(parseFloat(value) as OrderBookDecimal)
          }
        >
          <SelectTrigger
            className="w-[120px]"
            aria-label="Select decimal precision"
          >
            <SelectValue placeholder="Select decimal" />
          </SelectTrigger>
          <SelectContent>
            {DECIMAL_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value.toString()}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default OrderBookHeader;
