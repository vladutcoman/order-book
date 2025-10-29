import { useEffect, useRef } from "react";

const useGetOrderBook = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const lastUpdateTime = useRef(0);
  const THROTTLE_MS = 1000; // Throttle updates to 200ms

  useEffect(() => {
    const wsUrl = "wss://stream.binance.com:9443/ws/btcusdt@depth20@100ms";

    console.log("Connecting to Binance WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("Connected to Binance WebSocket for BTC order book");
    };

    ws.onmessage = (event) => {
      const now = Date.now();

      // Throttle updates to prevent UI spam
      if (now - lastUpdateTime.current < THROTTLE_MS) {
        return; // Skip this update
      }

      lastUpdateTime.current = now;
      const data = JSON.parse(event.data);
      console.log("Received order book data:", data);
    };

    ws.onclose = (event) => {
      console.log("WebSocket closed:", event.code, event.reason);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Cleanup on unmount
    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  return {};
};

export default useGetOrderBook;
