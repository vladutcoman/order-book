import { useEffect, useMemo, useRef } from 'react';

import type { ChangedPrices } from '@/types/orderBookTypes';

const ANIMATION_DURATION = 800;

/**
 * Custom hook to check if a price was recently changed for animation highlighting
 * @param changedPrices - Object mapping price strings to timestamps
 * @param animationsEnabled - Whether animations are enabled
 * @returns Function that checks if a price was recently changed
 */
const usePriceChangeAnimation = (changedPrices: ChangedPrices, animationsEnabled: boolean) => {
  // Use ref to track current time for animation checks (updates only when changedPrices changes)
  const timeRef = useRef(Date.now());
  useEffect(() => {
    timeRef.current = Date.now();
  }, [changedPrices]);

  return useMemo(() => {
    if (!animationsEnabled) {
      return () => false;
    }

    return (price: string) => {
      const timestamp = changedPrices[price];

      if (timestamp === undefined) {
        return false;
      }

      return timeRef.current - timestamp < ANIMATION_DURATION;
    };
  }, [changedPrices, animationsEnabled]);
};

export default usePriceChangeAnimation;
