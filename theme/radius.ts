/**
 * W Status Saver — Border Radius System
 * Base radius: 20px (1.25rem from the reference design)
 */

export const radius = {
  none: 0,
  sm: 8,
  md: 16,
  lg: 20,
  xl: 24,
  '2xl': 28,
  '3xl': 32,
  '4xl': 36,
  full: 9999,
} as const;

export type Radius = keyof typeof radius;

export function rd(value: Radius): number {
  return radius[value];
}
