import useGetOrderBook from "../../hooks/useGetOrderBook";
import { Button } from "../ui/button";

const BinanceDataTesting = () => {
  useGetOrderBook();

  return (
    <div>
      <h1>Binance Data Testing</h1>
      <Button>Connect</Button>
    </div>
  );
};

export default BinanceDataTesting;
