import { useTranslation } from 'react-i18next';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import useMarketStore from '@/stores/market/useMarketStore';

const MARKETS = [
  { label: 'BTC/USDT', value: 'btcusdt' },
  { label: 'ETH/USDT', value: 'ethusdt' },
  { label: 'SOL/USDT', value: 'solusdt' },
];

const MarketSelector = () => {
  const { t } = useTranslation();
  const market = useMarketStore((s) => s.market);
  const setMarket = useMarketStore((s) => s.setMarket);

  return (
    <div className="flex flex-col items-center gap-2">
      <Select value={market} onValueChange={setMarket}>
        <SelectTrigger aria-label={t('marketSelector.selectMarket')}>
          <SelectValue placeholder={t('marketSelector.selectMarket')} />
        </SelectTrigger>
        <SelectContent>
          {MARKETS.map((m) => (
            <SelectItem key={m.value} value={m.value}>
              {m.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-muted-foreground text-sm">
        {t('marketSelector.market')}: {market}
      </p>
    </div>
  );
};

export default MarketSelector;
