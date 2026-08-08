import { ScrollView, StyleSheet, View, type ViewStyle, type RefreshControlProps } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing } from '@/theme';
import type { ReactElement, ReactNode } from 'react';

interface ScreenContainerProps {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  scrollable?: boolean;
  refreshControl?: ReactElement<RefreshControlProps>;
}

export function ScreenContainer({
  children,
  style,
  padded = true,
  scrollable = false,
  refreshControl,
}: ScreenContainerProps) {
  const { colors } = useTheme();
  const insets = useSafeAreaInsets();

  const containerStyle: ViewStyle = {
    backgroundColor: colors.background,
    paddingTop: insets.top + spacing[2],
    paddingBottom: insets.bottom + 96,
    paddingHorizontal: padded ? spacing[4] : 0,
  };

  if (scrollable) {
    return (
      <ScrollView
        style={[styles.base, { backgroundColor: colors.background }]}
        contentContainerStyle={[containerStyle, style]}
        showsVerticalScrollIndicator={false}
        refreshControl={refreshControl}
      >
        {children}
      </ScrollView>
    );
  }

  return (
    <View style={[styles.base, containerStyle, style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
  },
});
