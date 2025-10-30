import { useEffect, useRef, useCallback, useState } from "react";
import type { DepthUpdate } from "../types";

const useStreamOrders = () => {
  const wsRef = useRef<WebSocket | null>(null);
  const lastUpdateTime = useRef(0);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const THROTTLE_MS = 1000;

  const connect = useCallback((symbol: string = "btcusdt") => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    const wsUrl = `wss://stream.binance.com:9443/ws/${symbol}@depth@100ms`;
    console.log("Connecting to WebSocket:", wsUrl);

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WebSocket connected for", symbol);
      setIsConnected(true);
      setError(null);
    };

    ws.onmessage = (event) => {
      const now = Date.now();

      if (now - lastUpdateTime.current < THROTTLE_MS) {
        return;
      }

      lastUpdateTime.current = now;
      const data: DepthUpdate = JSON.parse(event.data);
      console.log("Received depth update:", data);
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
  }, []);

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
export type { DepthUpdate };
