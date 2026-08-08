import type { TextStyle } from 'react-native';

/**
 * W Status Saver — Color System
 * Palette: Emerald Green / White / AMOLED Black / Light Gray
 * Translated from the oklch values in the reference design system.
 */

export const lightColors = {
  background: '#F7FAF8',
  foreground: '#2B3A33',
  surface: '#FFFFFF',
  surfaceForeground: '#2B3A33',
  card: '#FFFFFF',
  cardForeground: '#2B3A33',
  popover: '#FFFFFF',
  popoverForeground: '#2B3A33',

  primary: '#1B9E5C',
  primaryForeground: '#F7FBF8',
  primarySoft: '#E3F5EC',
  primaryGlow: '#3DDC84',

  secondary: '#F1F5F2',
  secondaryForeground: '#3D4F47',
  muted: '#F1F5F2',
  mutedForeground: '#7A8A82',
  accent: '#E3F5EC',
  accentForeground: '#1A6B3E',
  destructive: '#D93636',
  destructiveForeground: '#F7FBF8',
  gold: '#D4A93B',

  border: '#D9E2DC',
  input: '#D9E2DC',
  ring: '#1B9E5C',

  glassBg: 'rgba(255, 255, 255, 0.62)',
  glassBorder: 'rgba(255, 255, 255, 0.70)',
} as const;

export const darkColors = {
  background: '#0E1513',
  foreground: '#F5F8F6',
  surface: '#1A2521',
  surfaceForeground: '#F5F8F6',
  card: '#1F2C27',
  cardForeground: '#F5F8F6',
  popover: '#1F2C27',
  popoverForeground: '#F5F8F6',

  primary: '#3DDC84',
  primaryForeground: '#0E1513',
  primarySoft: '#1A3D2C',
  primaryGlow: '#5AE89B',

  secondary: '#243530',
  secondaryForeground: '#EFF5F2',
  muted: '#243530',
  mutedForeground: '#9AAAA1',
  accent: '#1A3D2C',
  accentForeground: '#5AE89B',
  destructive: '#E54545',
  destructiveForeground: '#0E1513',
  gold: '#DDB34D',

  border: 'rgba(255, 255, 255, 0.10)',
  input: 'rgba(255, 255, 255, 0.14)',
  ring: '#3DDC84',

  glassBg: 'rgba(26, 37, 33, 0.62)',
  glassBorder: 'rgba(255, 255, 255, 0.12)',
} as const;

export type ColorScheme = 'light' | 'dark';

export interface ThemeColors {
  background: string;
  foreground: string;
  surface: string;
  surfaceForeground: string;
  card: string;
  cardForeground: string;
  popover: string;
  popoverForeground: string;
  primary: string;
  primaryForeground: string;
  primarySoft: string;
  primaryGlow: string;
  secondary: string;
  secondaryForeground: string;
  muted: string;
  mutedForeground: string;
  accent: string;
  accentForeground: string;
  destructive: string;
  destructiveForeground: string;
  gold: string;
  border: string;
  input: string;
  ring: string;
  glassBg: string;
  glassBorder: string;
}

export function getColors(scheme: ColorScheme): ThemeColors {
  return scheme === 'dark' ? darkColors : lightColors;
}
