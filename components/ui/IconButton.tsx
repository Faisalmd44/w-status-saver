import { Pressable, StyleSheet, type ViewStyle } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing } from '@/theme';
import type { ShadowName } from '@/theme';
import type { ReactNode } from 'react';

interface IconButtonProps {
  children: ReactNode;
  label: string;
  onPress?: () => void;
  active?: boolean;
  size?: number;
  shadow?: ShadowName;
  style?: ViewStyle;
}

export function IconButton({
  children,
  label,
  onPress,
  active = false,
  size = 40,
  shadow = 'none',
  style,
}: IconButtonProps) {
  const { colors, shadows } = useTheme();

  return (
    <Pressable
      accessibilityLabel={label}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          width: size,
          height: size,
          borderRadius: radius.xl,
          backgroundColor: active ? colors.primary : colors.secondary,
          borderWidth: 1,
          borderColor: active ? 'transparent' : colors.border,
          opacity: pressed ? 0.7 : 1,
          transform: [{ scale: pressed ? 0.97 : 1 }],
          ...shadows[shadow],
        },
        style,
      ]}
    >
      {children}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});
