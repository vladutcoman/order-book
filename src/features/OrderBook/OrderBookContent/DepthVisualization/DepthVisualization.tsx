import type { ProcessedOrder } from "@/types/orderBookTypes";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";

interface DepthVisualizationProps {
  order: ProcessedOrder;
  type: "bid" | "ask";
  maxTotal?: number;
  cumulativeTotal?: number;
  maxCumulativeTotal?: number;
}

const DepthVisualization = ({
  order,
  type,
  maxTotal,
  cumulativeTotal,
  maxCumulativeTotal,
}: DepthVisualizationProps) => {
  const depthVisualization = useOrderBookStore((s) => s.depthVisualization);

  const barColor = type === "bid" ? "bg-green-500/15" : "bg-red-500/15";

  let barScale = 0;
  if (depthVisualization === "amount") {
    barScale = maxTotal && maxTotal > 0 ? order.total / maxTotal : 0;
  } else if (depthVisualization === "cumulative") {
    barScale =
      maxCumulativeTotal &&
      maxCumulativeTotal > 0 &&
      cumulativeTotal !== undefined
        ? cumulativeTotal / maxCumulativeTotal
        : 0;
  }

  if (depthVisualization !== "amount" && depthVisualization !== "cumulative") {
    return null;
  }

  return (
    <div
      className={`absolute top-0 bottom-0 right-0 left-0 ${barColor} transition-all duration-200 pointer-events-none origin-right`}
      style={{
        transform: `scaleX(${barScale})`,
      }}
    />
  );
};

export default DepthVisualization;
