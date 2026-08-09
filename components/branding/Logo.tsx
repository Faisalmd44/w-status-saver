import { Image, StyleSheet, Text, View } from 'react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme';

interface LogoProps {
  size?: number;
  glow?: boolean;
  showFreeBadge?: boolean;
}

export function Logo({
  size = 44,
  glow = false,
  showFreeBadge = false,
}: LogoProps) {
  const { shadows } = useTheme();

  const borderRadius = size * 0.25;

  return (
    <View style={styles.container}>
      <Image
        source={require('@/assets/images/Wlogo.png')}
        style={[
          styles.logo,
          {
            width: size,
            height: size,
            borderRadius,
            ...(glow ? shadows.glow : {}),
          },
        ]}
        resizeMode="cover"
      />

      {showFreeBadge ? (
        <View style={styles.freeBadge}>
          <Text style={styles.freeBadgeText}>FREE</Text>
        </View>
      ) : null}
    </View>
  );
}

export function Wordmark() {
  const { colors } = useTheme();

  return (
    <View style={styles.wordmarkContainer}>
      <Text
        style={[
          typography.headingSmall,
          { color: colors.foreground },
        ]}
      >
        W Status Saver
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  logo: {
    overflow: 'hidden',
  },
  freeBadge: {
    position: 'absolute',
    top: -3,
    right: -3,
    backgroundColor: '#E53935',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#FFFFFF',
    zIndex: 10,
  },
  freeBadgeText: {
    color: '#FFFFFF',
    fontSize: 7,
    fontWeight: '900',
    letterSpacing: 0.2,
  },
  wordmarkContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});
