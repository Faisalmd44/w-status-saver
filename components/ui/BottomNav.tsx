import { ComponentType } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Home,
  Image as ImageIcon,
  Video,
  Download,
  Heart,
} from 'lucide-react-native';
import { useTheme } from '@/theme/ThemeProvider';
import { typography } from '@/theme';
import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { useStatuses } from '@/hooks/useStatuses';

interface TabConfig {
  key: string;
  name: string;
  label: string;
  icon: ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;
  badgeKey?: 'saved' | 'favorites';
}

const TAB_CONFIGS: TabConfig[] = [
  { key: 'home', name: 'home', label: 'Home', icon: Home },
  { key: 'images', name: 'images', label: 'Images', icon: ImageIcon },
  { key: 'videos', name: 'videos', label: 'Videos', icon: Video },
  { key: 'saved', name: 'saved', label: 'Saved', icon: Download, badgeKey: 'saved' },
  { key: 'favorites', name: 'favorites', label: 'Favorites', icon: Heart, badgeKey: 'favorites' },
];

export function BottomNav(props: Partial<BottomTabBarProps> & { activeRoute?: string; onTabPress?: (href: string) => void }) {
  const { colors, scheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { statuses } = useStatuses();

  const savedCount = statuses.filter((s) => s.isSaved).length;
  const favoritesCount = statuses.filter((s) => s.isFavorite).length;

  const activeIndex = props.state ? props.state.index : 0;
  const currentRouteName = props.state
    ? props.state.routes[activeIndex]?.name
    : props.activeRoute?.replace('/', '') || 'home';

  const handlePress = (name: string, routeKey?: string) => {
    if (props.navigation && routeKey) {
      const event = props.navigation.emit({
        type: 'tabPress',
        target: routeKey,
        canPreventDefault: true,
      });

      if (!event.defaultPrevented) {
        props.navigation.navigate(name);
      }
    } else if (props.onTabPress) {
      props.onTabPress(`/${name}`);
    }
  };

  return (
    <View
      style={[
        styles.floatingWrapper,
        { bottom: Math.max(insets.bottom + 8, 16) },
      ]}
      pointerEvents="box-none"
    >
      <View
        style={[
          styles.pillContainer,
          {
            backgroundColor: scheme === 'dark' ? '#141E19' : '#1A2620',
            borderColor: 'rgba(255, 255, 255, 0.12)',
          },
        ]}
      >
        {TAB_CONFIGS.map((tab) => {
          const routeObj = props.state?.routes.find((r) => r.name === tab.name);
          const routeKey = routeObj?.key;
          const isActive = currentRouteName === tab.name;
          const Icon = tab.icon;

          const badgeVal =
            tab.badgeKey === 'saved'
              ? savedCount
              : tab.badgeKey === 'favorites'
              ? favoritesCount
              : 0;

          return (
            <Pressable
              key={tab.name}
              onPress={() => handlePress(tab.name, routeKey)}
              style={styles.tabButton}
            >
              {isActive ? (
                <View
                  style={[
                    styles.activePill,
                    { backgroundColor: colors.primary },
                  ]}
                >
                  <Icon size={20} color={colors.primaryForeground} strokeWidth={2.2} />
                  <Text style={[typography.caption, styles.activeLabel, { color: colors.primaryForeground }]}>
                    {tab.label}
                  </Text>
                </View>
              ) : (
                <View style={styles.inactiveTab}>
                  <View style={styles.iconBadgeWrapper}>
                    <Icon size={20} color="rgba(255, 255, 255, 0.65)" strokeWidth={1.8} />
                    {badgeVal > 0 ? (
                      <View style={[styles.badge, { backgroundColor: colors.primary }]}>
                        <Text style={styles.badgeText}>{badgeVal}</Text>
                      </View>
                    ) : null}
                  </View>
                  <Text style={[typography.caption, styles.inactiveLabel]}>
                    {tab.label}
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  floatingWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
  },
  pillContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 6,
    paddingHorizontal: 6,
    borderRadius: 36,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 18,
    elevation: 14,
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activePill: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 28,
    width: '100%',
    gap: 3,
  },
  activeLabel: {
    fontWeight: '700',
    fontSize: 11,
  },
  inactiveTab: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    gap: 3,
  },
  inactiveLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '500',
    fontSize: 10,
  },
  iconBadgeWrapper: {
    position: 'relative',
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -8,
    minWidth: 14,
    height: 14,
    borderRadius: 7,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#000000',
    fontSize: 8,
    fontWeight: '800',
  },
});
