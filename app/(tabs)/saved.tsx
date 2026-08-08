import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Trash2, Play, Heart, Download } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppBar } from '@/components/ui/AppBar';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { StatusViewerModal } from '@/components/ui/StatusViewerModal';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing, typography } from '@/theme';
import { useStatuses } from '@/hooks/useStatuses';
import { StatusMetadataItem } from '@/lib/statusService';

export default function SavedScreen() {
  const { colors } = useTheme();
  const { statuses, savedStatuses, confirmAndDeleteSaved, toggleSave, toggleFavorite } =
    useStatuses();
  const [selectedStatus, setSelectedStatus] = useState<StatusMetadataItem | null>(null);

  // Combine saved items from active scan + stored saved records
  const savedMap = new Map<string, StatusMetadataItem>();
  savedStatuses.forEach((item) => savedMap.set(item.id, item));
  statuses.filter((s) => s.isSaved).forEach((item) => savedMap.set(item.id, item));

  const savedList = Array.from(savedMap.values());

  return (
    <ScreenContainer scrollable padded={false}>
      <AppBar
        title="Saved Gallery"
        subtitle={`${savedList.length} downloaded media files`}
        centerTitle
      />

      <View style={styles.body}>
        {savedList.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Download size={48} color={colors.mutedForeground} />
            <Text
              style={[
                typography.headingMedium,
                { color: colors.foreground, marginTop: spacing[3] },
              ]}
            >
              No Saved Media
            </Text>
            <Text
              style={[
                typography.bodyMedium,
                { color: colors.mutedForeground, textAlign: 'center', marginTop: spacing[1] },
              ]}
            >
              Statuses you save from Home, Images or Videos tabs will appear here and in your gallery.
            </Text>
          </View>
        ) : (
          <View style={styles.grid}>
            {savedList.map((item) => (
              <Card key={item.id} padding="0" style={styles.gridCard}>
                <Pressable
                  onPress={() => setSelectedStatus(item)}
                  style={styles.imageWrapper}
                >
                  <Image source={{ uri: item.savedUri || item.uri }} style={styles.thumbnail} />

                  {item.type === 'video' ? (
                    <View style={styles.videoOverlay}>
                      <View style={styles.playCircle}>
                        <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
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

                  <IconButton
                    label="Delete"
                    onPress={() => confirmAndDeleteSaved(item)}
                    size={34}
                  >
                    <Trash2 size={16} color={colors.destructive} />
                  </IconButton>
                </View>
              </Card>
            ))}
          </View>
        )}
      </View>

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
  body: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
  },
  emptyContainer: {
    paddingVertical: spacing[12],
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[6],
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
    height: 180,
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
    backgroundColor: 'rgba(0,0,0,0.25)',
  },
  playCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.65)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  durationBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0,0,0,0.75)',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  durationText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
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
});
