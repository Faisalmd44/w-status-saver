import { useState } from 'react';
import { Image, Pressable, RefreshControl, StyleSheet, Text, TextInput, View } from 'react-native';
import { useRouter } from 'expo-router';
import {
  Download,
  Heart,
  Play,
  RefreshCw,
  Check,
  Sparkles,
  ShieldCheck,
  FolderDown,
  Search,
  Settings,
  X,
  FolderSearch,
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppBar } from '@/components/ui/AppBar';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { StatusViewerModal } from '@/components/ui/StatusViewerModal';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing, typography } from '@/theme';
import { useStatuses } from '@/hooks/useStatuses';
import { StatusMetadataItem } from '@/lib/statusService';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { statuses, savedStatuses, toggleSave, toggleFavorite, saveAll, refresh } =
    useStatuses();
  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusMetadataItem | null>(null);

  const filteredStatuses = statuses.filter((item) => {
    if (activeFilter !== 'all' && item.type !== activeFilter) {
      return false;
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        item.sender.toLowerCase().includes(q) ||
        item.type.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const imageCount = statuses.filter((s) => s.type === 'image').length;
  const videoCount = statuses.filter((s) => s.type === 'video').length;
  const savedCount = savedStatuses.length;

  return (
    <ScreenContainer
      scrollable
      padded={false}
      refreshControl={
        <RefreshControl
          refreshing={isRefreshing}
          onRefresh={handleRefresh}
          colors={[colors.primary]}
          tintColor={colors.primary}
          progressBackgroundColor={colors.surface}
        />
      }
    >
      <AppBar
        brand
        subtitle={`${statuses.length} new statuses today`}
        actions={
          <View style={styles.appBarActions}>
            <IconButton label="Re-scan" onPress={handleRefresh}>
              <RefreshCw
                size={18}
                color={colors.foreground}
                style={isRefreshing ? styles.spin : undefined}
              />
            </IconButton>

            <IconButton label="Search" onPress={() => setShowSearch((prev) => !prev)}>
              <Search size={18} color={colors.foreground} />
            </IconButton>

            <IconButton label="Settings" onPress={() => router.push('/settings')}>
              <Settings size={18} color={colors.foreground} />
            </IconButton>
          </View>
        }
      />

      <View style={styles.body}>
        {/* Search Bar Overlay */}
        {showSearch ? (
          <View
            style={[
              styles.searchBarContainer,
              { backgroundColor: colors.surface, borderColor: colors.border },
            ]}
          >
            <Search size={18} color={colors.mutedForeground} />
            <TextInput
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholder="Search statuses..."
              placeholderTextColor={colors.mutedForeground}
              style={[styles.searchInput, { color: colors.foreground }]}
              autoFocus
            />
            {searchQuery ? (
              <Pressable onPress={() => setSearchQuery('')}>
                <X size={18} color={colors.mutedForeground} />
              </Pressable>
            ) : null}
          </View>
        ) : null}

        {/* Hero Card */}
        <Card style={styles.heroCard} shadow="glow">
          <View style={styles.heroHeader}>
            <View style={styles.heroBadge}>
              <Sparkles size={14} color={colors.primary} />
              <Text style={[typography.caption, { color: colors.primary, fontWeight: '700' }]}>
                STATUS SAVER
              </Text>
            </View>
            <View style={styles.shieldBadge}>
              <ShieldCheck size={14} color={colors.primary} />
              <Text style={[typography.caption, { color: colors.primary }]}>SAF Access</Text>
            </View>
          </View>

          <Text style={[typography.headingLarge, { color: colors.foreground, marginTop: spacing[3] }]}>
            {statuses.length} New Statuses Ready
          </Text>
          <Text style={[typography.bodySmall, { color: colors.mutedForeground, marginTop: spacing[1] }]}>
            Photos & videos scanned from WhatsApp & Business.
          </Text>

          <View style={styles.heroStatsRow}>
            <View style={styles.statBox}>
              <Text style={[typography.headingMedium, { color: colors.primary }]}>
                {imageCount}
              </Text>
              <Text style={[typography.caption, { color: colors.mutedForeground }]}>Photos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[typography.headingMedium, { color: colors.primary }]}>
                {videoCount}
              </Text>
              <Text style={[typography.caption, { color: colors.mutedForeground }]}>Videos</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statBox}>
              <Text style={[typography.headingMedium, { color: colors.primary }]}>
                {savedCount}
              </Text>
              <Text style={[typography.caption, { color: colors.mutedForeground }]}>Saved</Text>
            </View>
          </View>

          {statuses.length > 0 ? (
            <Pressable
              onPress={saveAll}
              style={({ pressed }) => [
                styles.saveAllBtn,
                {
                  backgroundColor: colors.primary,
                  transform: [{ scale: pressed ? 0.98 : 1 }],
                },
              ]}
            >
              <FolderDown size={18} color={colors.primaryForeground} strokeWidth={2.2} />
              <Text
                style={[
                  typography.labelMedium,
                  styles.saveAllBtnText,
                  { color: colors.primaryForeground },
                ]}
              >
                Save All Statuses
              </Text>
            </Pressable>
          ) : null}
        </Card>

        {/* Category Filter Tabs */}
        <View style={styles.filterRow}>
          {[
            { id: 'all', label: `All (${statuses.length})` },
            { id: 'image', label: `Photos (${imageCount})` },
            { id: 'video', label: `Videos (${videoCount})` },
          ].map((tab) => {
            const isActive = activeFilter === tab.id;
            return (
              <Pressable
                key={tab.id}
                onPress={() => setActiveFilter(tab.id as 'all' | 'image' | 'video')}
                style={[
                  styles.filterChip,
                  {
                    backgroundColor: isActive ? colors.primary : colors.secondary,
                    borderColor: isActive ? colors.primary : colors.border,
                  },
                ]}
              >
                <Text
                  style={[
                    typography.labelSmall,
                    { color: isActive ? colors.primaryForeground : colors.foreground },
                  ]}
                >
                  {tab.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {/* Section Header */}
        <View style={styles.sectionHeader}>
          <Text style={[typography.headingSmall, { color: colors.foreground }]}>Recent Media</Text>
          <Text style={[typography.caption, { color: colors.mutedForeground }]}>
            {statuses.length > 0 ? 'Tap to preview' : 'No media'}
          </Text>
        </View>

        {/* Empty State or Status Grid */}
        {filteredStatuses.length === 0 ? (
          <Card style={styles.emptyCard}>
            <FolderSearch size={44} color="#3DDC84" />
            <Text style={styles.emptyTitle}>No new statuses</Text>
            <Text style={styles.emptySubtitle}>
              View WhatsApp statuses first, then tap Refresh.
            </Text>
            <Pressable
              onPress={handleRefresh}
              style={({ pressed }) => [
                styles.refreshBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              <RefreshCw size={16} color="#0A140F" />
              <Text style={styles.refreshBtnText}>Refresh Statuses</Text>
            </Pressable>
          </Card>
        ) : (
          <View style={styles.grid}>
            {filteredStatuses.map((item) => (
              <Card key={item.id} padding="0" style={styles.gridCard}>
                <Pressable
                  onPress={() => setSelectedStatus(item)}
                  style={styles.imageWrapper}
                >
                  <Image source={{ uri: item.uri }} style={styles.thumbnail} />

                  {item.type === 'video' ? (
                    <View style={styles.videoOverlay}>
                      <View style={styles.playCircle}>
                        <Play size={16} color="#FFFFFF" fill="#FFFFFF" />
                      </View>
                      {item.duration ? (
                        <View style={styles.durationBadge}>
                          <Text style={styles.durationText}>{item.duration}</Text>
                        </View>
                      ) : null}
                    </View>
                  ) : null}

                  <Pressable
                    onPress={() => toggleFavorite(item.id)}
                    style={styles.favButton}
                  >
                    <Heart
                      size={16}
                      color={item.isFavorite ? colors.destructive : '#FFFFFF'}
                      fill={item.isFavorite ? colors.destructive : 'rgba(0,0,0,0.3)'}
                    />
                  </Pressable>
                </Pressable>

                <View style={styles.cardInfo}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={[typography.labelMedium, { color: colors.foreground }]}
                      numberOfLines={1}
                    >
                      {item.sender}
                    </Text>
                    <Text style={[typography.caption, { color: colors.mutedForeground }]}>
                      {item.time}
                    </Text>
                  </View>

                  <View style={styles.cardActions}>
                    <IconButton
                      label="Save"
                      onPress={() => toggleSave(item.id)}
                      active={item.isSaved}
                      size={34}
                    >
                      {item.isSaved ? (
                        <Check size={16} color={colors.primaryForeground} />
                      ) : (
                        <Download size={16} color={colors.foreground} />
                      )}
                    </IconButton>
                  </View>
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>

      {/* FULL-SCREEN STATUS VIEWER */}
      <StatusViewerModal
        status={selectedStatus}
        visible={!!selectedStatus}
        onClose={() => setSelectedStatus(null)}
        onToggleSave={toggleSave}
        onToggleFavorite={toggleFavorite}
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  appBarActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[3],
    height: 44,
    borderRadius: radius.full,
    borderWidth: 1,
    gap: spacing[2],
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    gap: spacing[4],
  },
  heroCard: {
    padding: spacing[4],
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  heroBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1.5],
  },
  shieldBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[1],
  },
  heroStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    marginTop: spacing[4],
    paddingVertical: spacing[2],
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
    borderRadius: radius.xl,
  },
  saveAllBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
    height: 48,
    borderRadius: radius.full,
    marginTop: spacing[4],
    width: '100%',
  },
  saveAllBtnText: {
    fontWeight: '700',
    fontSize: 15,
  },
  statBox: {
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
  },
  filterRow: {
    flexDirection: 'row',
    gap: spacing[2],
  },
  filterChip: {
    paddingHorizontal: spacing[3.5],
    paddingVertical: spacing[2],
    borderRadius: radius.full,
    borderWidth: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: spacing[1],
  },
  emptyCard: {
    padding: spacing[8],
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing[2],
  },
  emptyTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    marginTop: 4,
  },
  emptySubtitle: {
    color: '#8D9F96',
    fontSize: 14,
    textAlign: 'center',
    marginBottom: 8,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: '#3DDC84',
  },
  refreshBtnText: {
    color: '#0A140F',
    fontWeight: '700',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing[3],
  },
  gridCard: {
    width: '47.5%',
  },
  imageWrapper: {
    height: 160,
    width: '100%',
    position: 'relative',
    backgroundColor: '#1E2B22',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  videoOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  playCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.7)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: radius.md,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '600',
  },
  favButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[2.5],
  },
  cardActions: {
    flexDirection: 'row',
    gap: spacing[1],
  },
  spin: {
    transform: [{ rotate: '45deg' }],
  },
});
