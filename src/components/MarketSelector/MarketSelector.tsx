import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useMarketStore from "@/stores/market/useMarketStore";

const MARKETS = [
  { label: "BTC/USDT", value: "btcusdt" },
  { label: "ETH/USDT", value: "ethusdt" },
  { label: "SOL/USDT", value: "solusdt" },
];

const MarketSelector = () => {
  const market = useMarketStore((s) => s.market);
  const setMarket = useMarketStore((s) => s.setMarket);

  return (
    <div className="flex flex-col">
      <Select value={market} onValueChange={setMarket}>
        <SelectTrigger aria-label="Select market">
          <SelectValue placeholder="Select market" />
        </SelectTrigger>
        <SelectContent>
          {MARKETS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-sm text-muted-foreground"> Market: {market}</p>
    </div>
  );
};

export default MarketSelector;
