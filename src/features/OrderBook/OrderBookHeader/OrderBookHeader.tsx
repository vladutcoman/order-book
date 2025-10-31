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

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-semibold">Order Book</h2>
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
  );
};

export default OrderBookHeader;
