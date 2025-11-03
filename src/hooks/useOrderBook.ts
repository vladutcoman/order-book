import { useEffect } from "react";
import useGetSnapshot from "../api/orderBook/hooks/useGetSnapshot";
import useStreamOrders from "../api/orderBook/hooks/useStreamOrders";
import useOrderBookStore from "@/stores/orderBook/useOrderBookStore";

const useOrderBook = (symbol: string = "btcusdt") => {
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

  // Disconnect and reset when symbol changes
  useEffect(() => {
    disconnect();
    reset();
  }, [symbol, disconnect, reset]);

  useEffect(() => {
    if (snapshot && !isConnected) {
      connect(symbol);
    }
  }, [snapshot, isConnected, connect, symbol]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
      reset();
    };
  }, [disconnect, reset]);

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

export default useOrderBook;
