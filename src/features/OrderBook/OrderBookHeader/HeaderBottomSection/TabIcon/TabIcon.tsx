import { cn } from "@/lib/utils";
import type { OrderBookTab } from "@/types/orderBookTypes";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";

const TabIcon = ({ tabValue }: { tabValue: OrderBookTab }) => {
  const tab = useOrderBookStore((s) => s.tab);
  const setTab = useOrderBookStore((s) => s.setTab);
  const isActive = tab === tabValue;

  return (
    <button
      onClick={() => setTab(tabValue)}
      className={cn(
        "rounded transition-colors p-1!",
        isActive
          ? "bg-accent text-accent-foreground"
          : "hover:bg-accent/50 text-muted-foreground",
      )}
      aria-label={`Show ${tabValue}`}
    >
      {tabValue === "both" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 2x2 grid with red/green */}
          <rect x="2" y="2" width="6" height="6" fill="#ef4444" />
          <rect x="2" y="8" width="6" height="6" fill="#22c55e" />
          <rect
            x="8"
            y="2"
            width="6"
            height="6"
            fill="#9ca3af"
            opacity="0.5"
          />
          <rect
            x="8"
            y="8"
            width="6"
            height="6"
            fill="#9ca3af"
            opacity="0.5"
          />
        </svg>
      )}
      {tabValue === "bids" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Green rectangle on left */}
          <rect x="2" y="2" width="6" height="12" fill="#22c55e" />
          <rect
            x="8"
            y="2"
            width="6"
            height="6"
            fill="#9ca3af"
            opacity="0.5"
          />
          <rect
            x="8"
            y="8"
            width="6"
            height="6"
            fill="#9ca3af"
            opacity="0.5"
          />
        </svg>
      )}
      {tabValue === "asks" && (
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Red rectangle on left */}
          <rect x="2" y="2" width="6" height="12" fill="#ef4444" />
          <rect
            x="8"
            y="2"
            width="6"
            height="6"
            fill="#9ca3af"
            opacity="0.5"
          />
          <rect
            x="8"
            y="8"
            width="6"
            height="6"
            fill="#9ca3af"
            opacity="0.5"
          />
        </svg>
      )}
    </button>
  );
};

export default TabIcon;