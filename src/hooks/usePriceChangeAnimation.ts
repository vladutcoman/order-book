import { useMemo, useRef, useEffect } from "react";

const ANIMATION_DURATION = 800;

/**
 * Custom hook to check if a price was recently changed for animation highlighting
 * @param changedPrices - Map of changed prices with timestamps
 * @param animationsEnabled - Whether animations are enabled
 * @returns Function that checks if a price was recently changed
 */
const usePriceChangeAnimation = (
  changedPrices: Map<string, number>,
  animationsEnabled: boolean,
) => {
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
      const timestamp = changedPrices.get(price);

      if (!timestamp) {
        return false;
      }

      return timeRef.current - timestamp < ANIMATION_DURATION;
    };
  }, [changedPrices, animationsEnabled]);
};

export default usePriceChangeAnimation;
