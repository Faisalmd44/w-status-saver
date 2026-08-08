import { Platform } from 'react-native';
import type { TextStyle } from 'react-native';

/**
 * W Status Saver — Typography System
 * Display font: Sora (headings)
 * Body font: Manrope (body text)
 */

export const fontFamilies = {
  display: 'Sora-SemiBold',
  displayBold: 'Sora-Bold',
  body: 'Manrope-Regular',
  bodyMedium: 'Manrope-Medium',
  bodySemiBold: 'Manrope-SemiBold',
  bodyBold: 'Manrope-Bold',
} as const;

export const fontSizes = {
  xs: 10,
  sm: 12,
  base: 14,
  md: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
  '6xl': 64,
} as const;

export const lineHeights = {
  xs: 14,
  sm: 16,
  base: 21,
  md: 22,
  lg: 24,
  xl: 28,
  '2xl': 32,
  '3xl': 38,
  '4xl': 44,
  '5xl': 56,
  '6xl': 72,
} as const;

export const letterSpacings = {
  tight: -0.5,
  tightest: -0.8,
  normal: 0,
  wide: 0.5,
  wider: 1.4,
} as const;

export const fontWeights = {
  regular: '400' as TextStyle['fontWeight'],
  medium: '500' as TextStyle['fontWeight'],
  semiBold: '600' as TextStyle['fontWeight'],
  bold: '700' as TextStyle['fontWeight'],
} as const;

export type TypographyVariant =
  | 'displayLarge'
  | 'displayMedium'
  | 'displaySmall'
  | 'headingLarge'
  | 'headingMedium'
  | 'headingSmall'
  | 'bodyLarge'
  | 'bodyMedium'
  | 'bodySmall'
  | 'labelLarge'
  | 'labelMedium'
  | 'labelSmall'
  | 'caption';

export const typography: Record<TypographyVariant, TextStyle> = {
  displayLarge: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['5xl'],
    lineHeight: lineHeights['5xl'],
    letterSpacing: letterSpacings.tightest,
  fontWeight: fontWeights.bold,
  includeFontPadding: false,
  ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  displayMedium: {
    fontFamily: fontFamilies.displayBold,
    fontSize: fontSizes['4xl'],
    lineHeight: lineHeights['4xl'],
    letterSpacing: letterSpacings.tightest,
    fontWeight: fontWeights.bold,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  displaySmall: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['3xl'],
    lineHeight: lineHeights['3xl'],
    letterSpacing: letterSpacings.tight,
    fontWeight: fontWeights.semiBold,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  headingLarge: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes['2xl'],
    lineHeight: lineHeights['2xl'],
    letterSpacing: letterSpacings.tight,
    fontWeight: fontWeights.semiBold,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  headingMedium: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.xl,
    lineHeight: lineHeights.xl,
    letterSpacing: letterSpacings.tight,
    fontWeight: fontWeights.semiBold,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  headingSmall: {
    fontFamily: fontFamilies.display,
    fontSize: fontSizes.lg,
    lineHeight: lineHeights.lg,
    letterSpacing: letterSpacings.tight,
    fontWeight: fontWeights.semiBold,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  bodyLarge: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.md,
    lineHeight: 22,
    fontWeight: fontWeights.regular,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  bodyMedium: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.base,
    lineHeight: 21,
    fontWeight: fontWeights.regular,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  bodySmall: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.sm,
    lineHeight: 18,
    fontWeight: fontWeights.regular,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  labelLarge: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.md,
    lineHeight: 20,
    fontWeight: fontWeights.semiBold,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  labelMedium: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.base,
    lineHeight: 18,
    fontWeight: fontWeights.semiBold,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  labelSmall: {
    fontFamily: fontFamilies.bodySemiBold,
    fontSize: fontSizes.sm,
    lineHeight: 16,
    fontWeight: fontWeights.semiBold,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
  caption: {
    fontFamily: fontFamilies.body,
    fontSize: fontSizes.xs,
    lineHeight: 14,
    fontWeight: fontWeights.regular,
    includeFontPadding: false,
    ...Platform.select({ android: { textAlignVertical: 'center' } }),
  },
};
