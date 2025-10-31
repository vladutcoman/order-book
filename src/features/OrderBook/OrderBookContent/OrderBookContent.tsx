import { useMemo } from "react";
import useGetOrderBook from "@/hooks/useGetOrderBook";
import useMarketStore from "@/stores/market/useMarketStore";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";

interface ProcessedOrder {
  price: number;
  quantity: number;
  total: number;
}

const OrderBookContent = () => {
  const market = useMarketStore((s) => s.market);
  const decimal = useOrderBookStore((s) => s.decimal);
  const bids = useOrderBookStore((s) => s.bids);
  const asks = useOrderBookStore((s) => s.asks);

  useGetOrderBook(market);

  // Group orders by decimal step
  const groupByDecimal = (
    orders: [string, string][],
    step: number,
  ): Map<number, number> => {
    const grouped = new Map<number, number>();

    for (const [priceStr, quantityStr] of orders) {
      const price = parseFloat(priceStr);
      const quantity = parseFloat(quantityStr);

      // Round price to nearest step bucket
      // Binance groups to the lower bound of each bucket (Math.floor)
      const bucket = Math.floor(price / step);
      const groupedPrice = bucket * step;

      const existing = grouped.get(groupedPrice) || 0;
      grouped.set(groupedPrice, existing + quantity);
    }

    return grouped;
  };

  // Process bids and asks
  const { processedBids, processedAsks } = useMemo(() => {
    if (bids.length === 0 && asks.length === 0) {
      return { processedBids: [], processedAsks: [] };
    }

    // Group by decimal step
    const groupedBids = groupByDecimal(bids, decimal);
    const groupedAsks = groupByDecimal(asks, decimal);

    // Convert to arrays and sort
    const bidsArray: ProcessedOrder[] = Array.from(groupedBids.entries())
      .map(([price, quantity]) => ({ price, quantity, total: 0 }))
      .sort((a, b) => b.price - a.price); // Descending for bids

    const asksArray: ProcessedOrder[] = Array.from(groupedAsks.entries())
      .map(([price, quantity]) => ({ price, quantity, total: 0 }))
      .sort((a, b) => a.price - b.price); // Ascending for asks

    // Calculate cumulative totals
    let bidTotal = 0;
    const bidsWithTotal = bidsArray.map((bid) => {
      bidTotal += bid.quantity;
      return { ...bid, total: bidTotal };
    });

    let askTotal = 0;
    const asksWithTotal = asksArray.map((ask) => {
      askTotal += ask.quantity;
      return { ...ask, total: askTotal };
    });

    return {
      processedBids: bidsWithTotal.slice(0, 17),
      processedAsks: asksWithTotal.slice(0, 17).reverse(), // Reverse only the displayed 17
    };
  }, [bids, asks, decimal]);

  const formatPrice = (price: number) => {
    // Determine decimal places based on decimal step
    if (decimal >= 1) return price.toFixed(0);
    if (decimal >= 0.1) return price.toFixed(1);
    if (decimal >= 0.01) return price.toFixed(2);
    return price.toFixed(3);
  };

  const formatQuantity = (quantity: number) => {
    return quantity.toFixed(5);
  };

  if (bids.length === 0 && asks.length === 0) {
    return <div className="p-4">Loading order book...</div>;
  }

  return (
    <div className="flex flex-col gap-2">
      {/* Asks (Sell Orders) */}
      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground pb-1">
          <div>Price (USDT)</div>
          <div>Amount</div>
          <div>Total</div>
        </div>
        {processedAsks.map((ask, index) => (
          <div
            key={`ask-${ask.price}-${index}`}
            className="grid grid-cols-3 gap-2 text-sm"
          >
            <div className="text-destructive">{formatPrice(ask.price)}</div>
            <div>{formatQuantity(ask.quantity)}</div>
            <div>{formatQuantity(ask.total)}</div>
          </div>
        ))}
      </div>

      {/* Spacer or current price can go here */}
      <div className="border-t border-b py-2 text-center text-lg font-semibold">
        {/* Current price would go here */}
      </div>

      {/* Bids (Buy Orders) */}
      <div className="flex flex-col">
        <div className="grid grid-cols-3 gap-2 text-sm font-medium text-muted-foreground pb-1">
          <div>Price (USDT)</div>
          <div>Amount</div>
          <div>Total</div>
        </div>
        {processedBids.map((bid, index) => (
          <div
            key={`bid-${bid.price}-${index}`}
            className="grid grid-cols-3 gap-2 text-sm"
          >
            <div className="text-green-500">{formatPrice(bid.price)}</div>
            <div>{formatQuantity(bid.quantity)}</div>
            <div>{formatQuantity(bid.total)}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderBookContent;
