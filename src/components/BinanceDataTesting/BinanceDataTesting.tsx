import useGetOrderBook from "../../hooks/useGetOrderBook";

const BinanceDataTesting = () => {
  useGetOrderBook();

  return (
    <div>
      <h1>Binance Data Testing</h1>
    </div>
  )
}

export default BinanceDataTesting;