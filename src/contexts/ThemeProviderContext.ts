import { createContext } from 'react';

import type { ThemeProviderState } from '@/types/themeTypes';

const initialState: ThemeProviderState = {
  theme: 'system',
  setTheme: () => null,
};

export const ThemeProviderContext = createContext<ThemeProviderState>(initialState);
