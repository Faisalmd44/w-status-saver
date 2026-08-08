import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme';

interface LogoProps {
  size?: number;
  glow?: boolean;
  showFreeBadge?: boolean;
}

export function Logo({ size = 44, glow = false }: LogoProps) {
  const { shadows } = useTheme();
  const borderRadius = Math.round(size * 0.22);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logoWrapper,
          {
            width: size,
            height: size,
            borderRadius,
            ...(glow ? shadows.glow : {}),
          },
        ]}
      >
        <Image
          source={require('@/assets/images/icon.png')}
          style={{ width: size, height: size, borderRadius }}
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

export function Wordmark() {
  const { colors } = useTheme();

  return (
    <View style={styles.wordmarkContainer}>
      <Text style={[typography.headingSmall, { color: '#3DDC84', fontWeight: '800' }]}>W</Text>
      <Text style={[typography.headingSmall, { color: colors.foreground, fontWeight: '700' }]}>
        {' '}Status Saver
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoWrapper: {
    overflow: 'hidden',
  },
  wordmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});


