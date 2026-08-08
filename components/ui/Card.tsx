import { StyleSheet, View, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme';
import type { ShadowName, Spacing, Radius } from '@/theme';
import type { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  style?: ViewStyle;
  padding?: Spacing;
  radiusKey?: Radius;
  shadow?: ShadowName;
  glass?: boolean;
}

export function Card({
  children,
  style,
  padding = '4',
  radiusKey = '3xl',
  shadow = 'soft',
  glass = false,
}: CardProps) {
  const { colors, shadows } = useTheme();

  return (
    <View
      style={[
        styles.base,
        {
          backgroundColor: glass ? colors.glassBg : colors.card,
          borderRadius: radius[radiusKey],
          padding: spacing[padding],
          borderWidth: 1,
          borderColor: glass ? colors.glassBorder : colors.border,
          ...shadows[shadow],
        },
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    overflow: 'hidden',
  },
});
