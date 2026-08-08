import type { ViewStyle } from 'react-native';

/**
 * W Status Saver — Shadow System
 * Translated from the reference design's box-shadow tokens.
 * Uses platform-appropriate shadow props.
 */

export type ShadowName = 'none' | 'soft' | 'lift' | 'glow';

interface ShadowStyle {
  shadowColor: string;
  shadowOffset: { width: number; height: number };
  shadowOpacity: number;
  shadowRadius: number;
  elevation: number;
}

const lightShadows: Record<ShadowName, ShadowStyle> = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#2B3A33',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.14,
    shadowRadius: 32,
    elevation: 3,
  },
  lift: {
    shadowColor: '#2B3A33',
    shadowOffset: { width: 0, height: 24 },
    shadowOpacity: 0.22,
    shadowRadius: 60,
    elevation: 6,
  },
  glow: {
    shadowColor: '#1B9E5C',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.55,
    shadowRadius: 46,
    elevation: 8,
  },
};

const darkShadows: Record<ShadowName, ShadowStyle> = {
  none: {
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  soft: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.8,
    shadowRadius: 34,
    elevation: 4,
  },
  lift: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 28 },
    shadowOpacity: 0.9,
    shadowRadius: 70,
    elevation: 8,
  },
  glow: {
    shadowColor: '#3DDC84',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.45,
    shadowRadius: 48,
    elevation: 10,
  },
};

export function getShadows(scheme: 'light' | 'dark'): Record<ShadowName, ShadowStyle> {
  return scheme === 'dark' ? darkShadows : lightShadows;
}

export type ShadowStyleType = ShadowStyle;
