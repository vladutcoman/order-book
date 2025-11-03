import { useTranslation } from 'react-i18next';

import type { OrderBookDepthVisualization } from '@/types/orderBookTypes';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import useOrderBookStore from '@/stores/orderBook/useOrderBookStore';

const HeaderTopSection = () => {
  const { t } = useTranslation();
  const rounding = useOrderBookStore((s) => s.rounding);
  const setRounding = useOrderBookStore((s) => s.setRounding);
  const showBuySellRatio = useOrderBookStore((s) => s.showBuySellRatio);
  const setShowBuySellRatio = useOrderBookStore((s) => s.setShowBuySellRatio);
  const depthVisualization = useOrderBookStore((s) => s.depthVisualization);
  const setDepthVisualization = useOrderBookStore((s) => s.setDepthVisualization);
  const animationsEnabled = useOrderBookStore((s) => s.animationsEnabled);
  const setAnimationsEnabled = useOrderBookStore((s) => s.setAnimationsEnabled);

  return (
    <div className="flex items-center justify-between px-4">
      <h2 className="text-lg text-[14px] font-semibold">{t('orderBook.title')}</h2>
      <div className="flex items-center gap-2">
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className={cn(
              'flex justify-end',
              'border-none! bg-transparent! p-0! shadow-none! outline-none!',
              'hover:border-none! hover:outline-none!',
              'focus:border-none! focus:outline-none!',
              'focus-visible:border-none! focus-visible:shadow-none! focus-visible:ring-0! focus-visible:ring-offset-0! focus-visible:outline-none!',
              'active:border-none! active:outline-none!',
              'data-[state=open]:border-none! data-[state=open]:outline-none!',
            )}
          >
            <Button variant="ghost" size="icon">
              <MoreHorizontal className="text-muted-foreground size-4" />
              <span className="sr-only">{t('orderBook.openSettings')}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 border-[#2b3139] bg-[#1e2329] p-2">
            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold text-[#848e9c]">
              {t('orderBook.orderBookDisplay')}
            </DropdownMenuLabel>
            <DropdownMenuCheckboxItem
              checked={showBuySellRatio}
              onCheckedChange={setShowBuySellRatio}
              className="py-1.5 text-white"
            >
              {t('orderBook.showBuySellRatio')}
            </DropdownMenuCheckboxItem>
            <DropdownMenuCheckboxItem
              checked={rounding}
              onCheckedChange={setRounding}
              className="py-1.5 text-white"
            >
              {t('orderBook.rounding')}
            </DropdownMenuCheckboxItem>

            <DropdownMenuSeparator className="mx-1 h-px bg-[#2b3139]" />

            <DropdownMenuLabel className="px-2 py-1.5 text-[10px] font-semibold text-[#848e9c]">
              {t('orderBook.bookDepthVisualization')}
            </DropdownMenuLabel>
            <DropdownMenuRadioGroup
              value={depthVisualization}
              onValueChange={(value) => {
                setDepthVisualization(value as OrderBookDepthVisualization);
              }}
            >
              <DropdownMenuRadioItem value="amount" className="py-1.5 text-white">
                {t('orderBook.amount')}
              </DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="cumulative" className="py-1.5 text-white">
                {t('orderBook.cumulative')}
              </DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>

            <DropdownMenuSeparator className="mx-1 h-px bg-[#2b3139]" />

            <DropdownMenuCheckboxItem
              checked={animationsEnabled}
              onCheckedChange={setAnimationsEnabled}
              className="py-1.5 text-white"
            >
              {t('orderBook.enableAnimations')}
            </DropdownMenuCheckboxItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};

export default HeaderTopSection;
