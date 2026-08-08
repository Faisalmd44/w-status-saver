import { Pressable, StyleSheet, Text, type ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing, typography } from '@/theme';
import type { ReactNode } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  label: string;
  onPress?: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  fullWidth?: boolean;
  style?: ViewStyle;
}

const sizeConfig: Record<ButtonSize, { height: number; paddingHorizontal: number; fontSize: number }> = {
  sm: { height: 36, paddingHorizontal: 14, fontSize: 13 },
  md: { height: 48, paddingHorizontal: 24, fontSize: 15 },
  lg: { height: 56, paddingHorizontal: 32, fontSize: 16 },
};

export function Button({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  leftIcon,
  rightIcon,
  fullWidth = false,
  style,
}: ButtonProps) {
  const { colors, shadows } = useTheme();
  const sz = sizeConfig[size];

  const isPrimary = variant === 'primary';
  const isDestructive = variant === 'destructive';
  const isOutline = variant === 'outline';
  const isSecondary = variant === 'secondary';

  if (isPrimary) {
    return (
      <Pressable
        onPress={onPress}
        disabled={disabled}
        style={({ pressed }) => [
          styles.base,
          { height: sz.height, borderRadius: radius['2xl'], opacity: disabled ? 0.5 : 1, ...shadows.glow },
          { transform: [{ scale: pressed ? 0.97 : 1 }] },
          fullWidth && { width: '100%' },
          style,
        ]}
      >
        <LinearGradient
          colors={[colors.primaryGlow, colors.primary]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.gradient}
        >
          {leftIcon}
          <Text style={[typography.labelMedium, { color: colors.primaryForeground, fontSize: sz.fontSize }]}>
            {label}
          </Text>
          {rightIcon}
        </LinearGradient>
      </Pressable>
    );
  }

  const bg = isDestructive
    ? colors.destructive
    : isSecondary
      ? colors.secondary
      : isOutline
        ? colors.surface
        : 'transparent';

  const fg = isDestructive
    ? colors.destructiveForeground
    : isSecondary
      ? colors.secondaryForeground
      : colors.foreground;

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.base,
        {
          height: sz.height,
          paddingHorizontal: sz.paddingHorizontal,
          borderRadius: radius['2xl'],
          backgroundColor: bg,
          borderWidth: isOutline ? 1 : 0,
          borderColor: isOutline ? colors.border : 'transparent',
          opacity: disabled ? 0.5 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
        },
        fullWidth && { width: '100%' },
        style,
      ]}
    >
      {leftIcon}
      <Text style={[typography.labelMedium, { color: fg, fontSize: sz.fontSize }]}>
        {label}
      </Text>
      {rightIcon}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    overflow: 'hidden',
  },
  gradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    borderRadius: radius['2xl'],
    paddingHorizontal: spacing[6],
  },
});
