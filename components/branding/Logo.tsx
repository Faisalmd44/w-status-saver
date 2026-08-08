import { StyleSheet, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MessageSquare } from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme';

interface LogoProps {
  size?: number;
  glow?: boolean;
  showFreeBadge?: boolean;
}

export function Logo({ size = 44, glow = false, showFreeBadge = true }: LogoProps) {
  const { colors, shadows } = useTheme();

  const borderRadius = size * 0.25;
  const bubbleSize = size * 0.52;
  const fontSize = size * 0.30;

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.logo,
          {
            width: size,
            height: size,
            borderRadius,
            ...shadows.glow,
            opacity: glow ? 1 : 1,
          },
        ]}
      >
        <LinearGradient
          colors={['#25D366', '#128C7E']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.gradient, { borderRadius }]}
        >
          <View style={[styles.bubbleWrapper, { width: bubbleSize, height: bubbleSize }]}>
            <MessageSquare size={bubbleSize} color="#FFFFFF" fill="#FFFFFF" opacity={0.2} />
            <Text
              style={[
                typography.headingSmall,
                styles.wText,
                { fontSize, color: '#FFFFFF', fontWeight: '800' },
              ]}
            >
              W
            </Text>
          </View>
          {size >= 36 ? (
            <Text style={[styles.subLabel, { fontSize: Math.max(7, size * 0.14) }]}>
              W Status Saver
            </Text>
          ) : null}
        </LinearGradient>
      </View>

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
      <LinearGradient
        colors={[colors.primaryGlow, colors.primary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[typography.headingSmall, { color: colors.primaryForeground }]}>W</Text>
      </LinearGradient>
      <Text style={[typography.headingSmall, { color: colors.foreground }]}> Status Saver</Text>
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
  gradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 2,
  },
  bubbleWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  wText: {
    position: 'absolute',
    textAlign: 'center',
    lineHeight: 22,
  },
  subLabel: {
    color: '#FFFFFF',
    fontWeight: '700',
    marginTop: -2,
    letterSpacing: -0.2,
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

