import { useTranslation } from "react-i18next";
import "./App.css";
import MarketSelector from "@/components/MarketSelector/MarketSelector";
import OrderBook from "@/features/OrderBook/OrderBook";

function App() {
  const { t } = useTranslation();

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col md:flex-row gap-20">
        <div className="flex flex-1 flex-col w-full gap-2 h-full items-center">
          <p className="text-sm text-muted-foreground">{t("app.welcome")}</p>
          <MarketSelector />
        </div>
        <div className="flex flex-2 flex-col">
          <OrderBook />
        </div>
      </div>
    </main>
  );
}

export default App;
