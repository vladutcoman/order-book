import { useEffect } from "react";
import useGetSnapshot from "../api/orders/hooks/useGetSnapshot";
import useStreamOrders from "../api/orders/hooks/useStreamOrders";

const useGetOrderBook = (symbol: string = "btcusdt") => {
  const {
    data: snapshot,
    isLoading: snapshotLoading,
    error: snapshotError,
    refetch: refetchSnapshot,
  } = useGetSnapshot(symbol);

  const {
    connect,
    disconnect,
    isConnected,
    error: streamError,
  } = useStreamOrders();

  useEffect(() => {
    // First get the snapshot, then connect to WebSocket
    if (snapshot && !isConnected) {
      console.log("Snapshot loaded, connecting to WebSocket...");
      connect(symbol);
    }
  }, [snapshot, isConnected, connect, symbol]);

  useEffect(() => {
    // Cleanup on unmount
    return () => {
      disconnect();
    };
  }, [disconnect]);

  console.log("snapshot", snapshot);

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
