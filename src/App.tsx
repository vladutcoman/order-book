import { useTranslation } from 'react-i18next';

import './App.css';

import MarketSelector from '@/components/MarketSelector/MarketSelector';
import OrderBook from '@/features/OrderBook/OrderBook';

function App() {
  const { t } = useTranslation();

  return (
    <main className="container mx-auto p-4 md:p-6 lg:p-8">
      <div className="flex flex-col gap-20 md:flex-row">
        <div className="flex h-full w-full flex-1 flex-col items-center gap-2">
          <p className="text-muted-foreground text-sm">{t('app.welcome')}</p>
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
