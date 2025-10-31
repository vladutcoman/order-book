import { useEffect } from "react";
import useGetSnapshot from "../api/orderBook/hooks/useGetSnapshot";
import useStreamOrders from "../api/orderBook/hooks/useStreamOrders";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";

const useGetOrderBook = (symbol: string = "btcusdt") => {
  const {
    data: snapshot,
    isLoading: snapshotLoading,
    error: snapshotError,
    refetch: refetchSnapshot,
  } = useGetSnapshot(symbol);

  const setBidsAndAsks = useOrderBookStore((s) => s.setBidsAndAsks);
  const reset = useOrderBookStore((s) => s.reset);

  const {
    connect,
    disconnect,
    isConnected,
    error: streamError,
  } = useStreamOrders();

  useEffect(() => {
    if (snapshot) {
      setBidsAndAsks(snapshot.bids, snapshot.asks, snapshot.lastUpdateId);
    }
  }, [snapshot, setBidsAndAsks]);

  useEffect(() => {
    if (snapshot && !isConnected) {
      console.log("Snapshot loaded, connecting to WebSocket...");
      connect(symbol);
    }
  }, [snapshot, isConnected, connect, symbol]);

  useEffect(() => {
    return () => {
      reset();
      disconnect();
    };
  }, [symbol, reset, disconnect]);

  return {
    snapshot,
    snapshotLoading,
    snapshotError,
    isConnected,
    streamError,
    refetchSnapshot,
    connect,
    disconnect,
  };
};

export default useGetOrderBook;
