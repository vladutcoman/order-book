import { useEffect, useRef, useCallback, useState } from "react";
import type { DepthUpdate } from "../types";

interface UseStreamOrdersOptions {
  onUpdate?: (update: DepthUpdate) => void;
}

const useStreamOrders = (options: UseStreamOrdersOptions = {}) => {
  const { onUpdate } = options;
  const [error, setError] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);

  const connect = useCallback(
    (symbol: string = "btcusdt") => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        return;
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
        console.log("Received depth update:", data);

        if (onUpdate) {
          onUpdate(data);
        }
      };

      ws.onclose = (event) => {
        console.log("WebSocket closed:", event.code, event.reason);
        setIsConnected(false);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
        setError("WebSocket connection error");
        setIsConnected(false);
      };
    },
    [onUpdate],
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
