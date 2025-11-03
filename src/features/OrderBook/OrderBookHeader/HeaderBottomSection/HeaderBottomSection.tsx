import { useTranslation } from 'react-i18next';

import type { OrderBookDecimal } from '@/types/orderBookTypes';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { cn } from '@/lib/utils';
import useOrderBookStore from '@/stores/orderBook/useOrderBookStore';

import TabIcon from './TabIcon/TabIcon';

const DECIMAL_OPTIONS: { label: string; value: OrderBookDecimal }[] = [
  { label: '0.01', value: 0.01 },
  { label: '0.1', value: 0.1 },
  { label: '1', value: 1 },
  { label: '10', value: 10 },
  { label: '50', value: 50 },
  { label: '100', value: 100 },
];

const HeaderBottomSection = () => {
  const { t } = useTranslation();
  const decimal = useOrderBookStore((s) => s.decimal);
  const setDecimal = useOrderBookStore((s) => s.setDecimal);

  return (
    <div className="flex w-full items-center justify-between gap-2 px-4">
      <div className="flex items-center gap-1">
        <TabIcon tabValue="both" />
        <TabIcon tabValue="bids" />
        <TabIcon tabValue="asks" />
      </div>
      <Select
        value={decimal.toString()}
        onValueChange={(value) => setDecimal(parseFloat(value) as OrderBookDecimal)}
      >
        <SelectTrigger
          className={cn(
            'border-none! bg-transparent! p-0! shadow-none! outline-none!',
            'hover:border-none! hover:outline-none!',
            'focus:border-none! focus:outline-none!',
            'focus-visible:border-none! focus-visible:outline-none!',
            'active:border-none! active:outline-none!',
            'data-[state=open]:border-none! data-[state=open]:outline-none!',
            'text-[12px]!',
          )}
          aria-label={t('headerBottomSection.selectDecimalPrecision')}
        >
          <SelectValue
            className="text-[12px]"
            placeholder={t('headerBottomSection.selectDecimal')}
          />
        </SelectTrigger>
        <SelectContent>
          {DECIMAL_OPTIONS.map((option) => (
            <SelectItem key={option.value} value={option.value.toString()} className="text-[12px]">
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default HeaderBottomSection;
