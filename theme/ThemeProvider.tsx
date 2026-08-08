import { createContext, useContext, useMemo, type ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import { getColors, getShadows } from '@/theme';
import type { ColorScheme, ThemeColors } from '@/theme';
import type { ShadowName, ShadowStyleType } from '@/theme/shadows';

interface ThemeContextValue {
  scheme: ColorScheme;
  colors: ThemeColors;
  shadows: Record<ShadowName, ShadowStyleType>;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
  const systemScheme = useColorScheme();
  const scheme: ColorScheme = systemScheme === 'dark' ? 'dark' : 'light';

  const value = useMemo<ThemeContextValue>(() => {
    const colors = getColors(scheme);
    const shadows = getShadows(scheme);
    return { scheme, colors, shadows };
  }, [scheme]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}
