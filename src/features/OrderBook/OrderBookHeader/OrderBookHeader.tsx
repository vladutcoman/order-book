import { MoreHorizontal } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";
import type {
  OrderBookDecimal,
  OrderBookDepthVisualization,
} from "@/types/orderBookTypes";
import { Separator } from "@/components/ui/separator";

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
  const depthVisualization = useOrderBookStore((s) => s.depthVisualization);
  const setDepthVisualization = useOrderBookStore(
    (s) => s.setDepthVisualization,
  );
  const animationsEnabled = useOrderBookStore((s) => s.animationsEnabled);
  const setAnimationsEnabled = useOrderBookStore((s) => s.setAnimationsEnabled);

  return (
    <div className="flex flex-col gap-2 mb-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Order Book</h2>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open order book settings</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-[#1e2329] border-[#2b3139] p-2"
            >
              <DropdownMenuLabel className="text-[#848e9c] text-[10px] font-semibold px-2 py-1.5">
                Order Book Display
              </DropdownMenuLabel>
              <DropdownMenuCheckboxItem
                checked={showBuySellRatio}
                onCheckedChange={setShowBuySellRatio}
                className="py-1.5 text-white"
              >
                Show Buy/Sell Ratio
              </DropdownMenuCheckboxItem>
              <DropdownMenuCheckboxItem
                checked={rounding}
                onCheckedChange={setRounding}
                className="py-1.5 text-white"
              >
                Rounding
              </DropdownMenuCheckboxItem>

              <DropdownMenuSeparator className="mx-1 bg-[#2b3139] h-px" />

              <DropdownMenuLabel className="text-[#848e9c] text-[10px] font-semibold px-2 py-1.5">
                Book Depth Visualization
              </DropdownMenuLabel>
              <DropdownMenuRadioGroup
                value={depthVisualization}
                onValueChange={(value) => {
                  setDepthVisualization(value as OrderBookDepthVisualization);
                  console.log("Depth visualization:", value);
                }}
              >
                <DropdownMenuRadioItem
                  value="amount"
                  className="py-1.5 text-white"
                >
                  Amount
                </DropdownMenuRadioItem>
                <DropdownMenuRadioItem
                  value="cumulative"
                  className="py-1.5 text-white"
                >
                  Cumulative
                </DropdownMenuRadioItem>
              </DropdownMenuRadioGroup>

              <DropdownMenuSeparator className="mx-1 bg-[#2b3139] h-px" />

              <DropdownMenuCheckboxItem
                checked={animationsEnabled}
                onCheckedChange={(checked) => {
                  setAnimationsEnabled(checked);
                  console.log("Animations:", checked);
                }}
                className="py-1.5 text-white"
              >
                Enable Animations
              </DropdownMenuCheckboxItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

      </div>
      <Separator className="my-1" />
      <Select
        value={decimal.toString()}
        onValueChange={(value) =>
          setDecimal(parseFloat(value) as OrderBookDecimal)
        }
      >
        <SelectTrigger
          className="w-[80px] h-8"
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
