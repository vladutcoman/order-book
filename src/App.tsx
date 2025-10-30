import "./App.css";
import MarketSelector from "@/components/MarketSelector/MarketSelector";
import OrderBook from "@/features/OrderBook/OrderBook";

function App() {
  return (
    <main className="container mx-auto max-w-6xl p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-10">
        <MarketSelector />
        <OrderBook />
      </div>
    </main>
  );
}

export default App;
