import type { ReactNode } from "react";
import { useRef } from "react";
import { useVirtualizer } from "@tanstack/react-virtual";

interface VirtualizedListProps<T> {
  items: T[];
  children: (item: T, index: number) => ReactNode;
  estimateSize?: number;
  overscan?: number;
  className?: string;
  maxHeight?: string;
}

const VirtualizedList = <T,>({
  items,
  children,
  estimateSize = 50,
  overscan = 5,
  className = "",
  maxHeight = "min(400px,70vh)",
}: VirtualizedListProps<T>) => {
  const parentRef = useRef<HTMLUListElement>(null);

  const rowVirtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    overscan,
    estimateSize: () => estimateSize,
  });

  return (
    <ul
      ref={parentRef}
      className={`relative w-full overflow-y-auto ${className}`}
      style={{
        height: `${rowVirtualizer.getTotalSize()}px`,
        maxHeight,
        width: "100%",
        position: "relative",
        padding: 0,
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => {
        const item = items[virtualRow.index];
        if (!item) return null;

        return (
          <li
            key={virtualRow.index}
            data-index={virtualRow.index}
            ref={rowVirtualizer.measureElement}
            className="absolute left-0 top-0 w-full"
            style={{
              transform: `translateY(${virtualRow.start}px)`,
            }}
          >
            {children(item, virtualRow.index)}
          </li>
        );
      })}
    </ul>
  );
};

export default VirtualizedList;
