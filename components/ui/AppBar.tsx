import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft } from 'lucide-react-native';
import { Logo } from '@/components/branding/Logo';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing, typography } from '@/theme';
import type { ReactNode } from 'react';

interface AppBarProps {
  title?: string;
  subtitle?: string;
  back?: boolean;
  actions?: ReactNode;
  brand?: boolean;
  centerTitle?: boolean;
}

export function AppBar({ title, subtitle, back, actions, brand, centerTitle }: AppBarProps) {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.glassBg,
          borderColor: colors.glassBorder,
        },
      ]}
    >
      {back ? (
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.backButton,
            { backgroundColor: colors.secondary, opacity: pressed ? 0.7 : 1 },
          ]}
        >
          <ChevronLeft size={20} color={colors.foreground} strokeWidth={2} />
        </Pressable>
      ) : null}

      {brand ? (
        <View style={styles.brandRow}>
          <Logo size={38} />
          <View style={styles.titleContainer}>
            <Text style={[typography.headingSmall, { color: colors.foreground }]}>
              W Status Saver
            </Text>
            {subtitle ? (
              <Text style={[typography.caption, { color: colors.mutedForeground }]}>
                {subtitle}
              </Text>
            ) : null}
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.titleContainer,
            centerTitle && styles.titleContainerCentered,
          ]}
        >
          <Text
            style={[
              typography.headingSmall,
              { color: colors.foreground },
              centerTitle && styles.textCentered,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {subtitle ? (
            <Text
              style={[
                typography.caption,
                { color: colors.mutedForeground },
                centerTitle && styles.textCentered,
              ]}
              numberOfLines={1}
            >
              {subtitle}
            </Text>
          ) : null}
        </View>
      )}

      {actions ? <View style={styles.actions}>{actions}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[2.5],
    marginHorizontal: spacing[4],
    marginTop: spacing[1],
    borderRadius: radius['3xl'],
    borderWidth: 1,
  },
  brandRow: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
    minWidth: 0,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.xl,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleContainer: {
    flex: 1,
    minWidth: 0,
  },
  titleContainerCentered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCentered: {
    textAlign: 'center',
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
});
