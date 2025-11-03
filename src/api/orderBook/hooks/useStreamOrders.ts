import { useEffect, useRef, useCallback, useState } from "react";
import { toast } from "sonner";
import type { DepthUpdate } from "../types";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";

const useStreamOrders = () => {
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const applyUpdate = useOrderBookStore((s) => s.applyUpdate);

  const connect = useCallback(
    (symbol: string = "btcusdt") => {
      // Check if already connected or connecting
      if (
        wsRef.current?.readyState === WebSocket.OPEN ||
        wsRef.current?.readyState === WebSocket.CONNECTING
      ) {
        console.log("WebSocket already connected or connecting, skipping...");
        return;
      }

      // Close any existing connection before creating a new one
      if (wsRef.current) {
        wsRef.current.close();
        wsRef.current = null;
      }

      const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@depth@1000ms`;
      console.log("Connecting to WebSocket:", wsUrl);

      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("WebSocket connected for", symbol);
        setIsConnected(true);
        setError(null);
      };

      ws.onmessage = (event) => {
        const data: DepthUpdate = JSON.parse(event.data);
        applyUpdate(data);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        const errorMessage = "Failed to connect to order book stream";
        setError(errorMessage);
        setIsConnected(false);
        toast.error("WebSocket connection error", {
          description:
            "Could not establish connection to Binance WebSocket. Please try again.",
        });
      };
    },
    [applyUpdate],
  );

  const disconnect = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  }, []);

  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  return {
    connect,
    disconnect,
    isConnected,
    error,
  };
};

export default useStreamOrders;
