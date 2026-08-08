import { useState } from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { Download, Heart, Play, Check } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { AppBar } from '@/components/ui/AppBar';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { StatusViewerModal } from '@/components/ui/StatusViewerModal';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing, typography } from '@/theme';
import { useStatuses } from '@/hooks/useStatuses';
import { StatusMetadataItem } from '@/lib/statusService';

export default function VideosScreen() {
  const { colors } = useTheme();
  const { statuses, toggleSave, toggleFavorite } = useStatuses();
  const [selectedStatus, setSelectedStatus] = useState<StatusMetadataItem | null>(null);

  const videoStatuses = statuses.filter((item) => item.type === 'video');

  return (
    <ScreenContainer scrollable padded={false}>
      <AppBar title="Video Statuses" subtitle={`${videoStatuses.length} HD video clips available`} />

      <View style={styles.body}>
        <View style={styles.grid}>
          {videoStatuses.map((item) => (
            <Card key={item.id} padding="0" style={styles.gridCard}>
              <Pressable
                onPress={() => setSelectedStatus(item)}
                style={styles.imageWrapper}
              >
                <Image source={{ uri: item.uri }} style={styles.thumbnail} />

                <View style={styles.videoOverlay}>
                  <View style={styles.playCircle}>
                    <Play size={18} color="#FFFFFF" fill="#FFFFFF" />
                  </View>
                  <View style={styles.durationBadge}>
                    <Text style={styles.durationText}>{item.duration || '0:15'}</Text>
                  </View>
                </View>

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
                  <Text style={[typography.labelMedium, { color: colors.foreground }]} numberOfLines={1}>
                    {item.sender}
                  </Text>
                  <Text style={[typography.caption, { color: colors.mutedForeground }]}>
                    {item.time}
                  </Text>
                </View>

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
            </Card>
          ))}
        </View>
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
