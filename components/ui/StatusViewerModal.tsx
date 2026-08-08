import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Modal,
  Pressable,
  Share,
  StyleSheet,
  Text,
  View,
  Image,
  Alert,
  Dimensions,
} from 'react-native';
import {
  X,
  Download,
  Check,
  Heart,
  Share2,
  Send,
  Play,
  Pause,
  Sparkles,
  ShieldCheck,
} from 'lucide-react-native';
import { StatusMetadataItem } from '@/lib/statusService';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing, typography } from '@/theme';

interface StatusViewerModalProps {
  status: StatusMetadataItem | null;
  visible: boolean;
  onClose: () => void;
  onToggleSave: (id: string) => void;
  onToggleFavorite: (id: string) => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export const StatusViewerModal: React.FC<StatusViewerModalProps> = ({
  status,
  visible,
  onClose,
  onToggleSave,
  onToggleFavorite,
}) => {
  const { colors } = useTheme();
  const [isPlaying, setIsPlaying] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Animation values for shared element style transition
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.82)).current;
  const translateYAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    if (visible) {
      setIsPlaying(status?.type === 'video');
      // Trigger opening animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 250,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
        Animated.spring(translateYAnim, {
          toValue: 0,
          friction: 7,
          tension: 65,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      fadeAnim.setValue(0);
      scaleAnim.setValue(0.82);
      translateYAnim.setValue(50);
    }
  }, [visible]);

  const handleClose = () => {
    // Closing shared element transition animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 0.88,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(translateYAnim, {
        toValue: 30,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onClose();
    });
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleShare = async () => {
    if (!status) return;
    try {
      const shareOptions = {
        title: `Status by ${status.sender}`,
        message: `Check out this status posted by ${status.sender} on WhatsApp! Saved with W Status Saver.`,
        url: status.uri,
      };

      const result = await Share.share(shareOptions);
      if (result.action === Share.sharedAction) {
        showToast('Shared successfully!');
      }
    } catch (error: any) {
      Alert.alert('Share Error', error.message || 'Could not trigger social share.');
    }
  };

  const handleDirectWhatsAppShare = async () => {
    if (!status) return;
    try {
      await Share.share({
        title: `WhatsApp Status`,
        message: status.uri,
      });
      showToast('Forwarding to WhatsApp...');
    } catch (error: any) {
      Alert.alert('WhatsApp Share', 'Opening share options...');
    }
  };

  if (!status) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalRoot}>
        {/* Animated Dark Backdrop */}
        <Animated.View
          style={[
            styles.backdrop,
            {
              opacity: fadeAnim,
            },
          ]}
        >
          <Pressable style={StyleSheet.absoluteFill} onPress={handleClose} />
        </Animated.View>

        {/* Animated Shared Element Viewport Container */}
        <Animated.View
          style={[
            styles.container,
            {
              opacity: fadeAnim,
              transform: [
                { scale: scaleAnim },
                { translateY: translateYAnim },
              ],
            },
          ]}
        >
          {/* TOP BAR */}
          <View style={styles.topHeader}>
            <View style={styles.userInfoRow}>
              {/* Sender Avatar Circle */}
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>
                  {status.sender.charAt(0).toUpperCase()}
                </Text>
              </View>

              <View style={styles.userTextCol}>
                <Text style={styles.senderName}>{status.sender}</Text>
                <View style={styles.metaRow}>
                  <Text style={styles.timeText}>{status.time}</Text>
                  <View style={styles.bulletDot} />
                  <View style={styles.qualityBadge}>
                    <Sparkles size={10} color="#3DDC84" />
                    <Text style={styles.qualityText}>Original HD</Text>
                  </View>
                </View>
              </View>
            </View>

            {/* CLOSE BUTTON */}
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.closeButton,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <X size={20} color="#FFFFFF" />
            </Pressable>
          </View>

          {/* MAIN MEDIA PREVIEW BOX */}
          <View style={styles.mediaContainer}>
            <Image
              source={{ uri: status.uri }}
              style={styles.fullImage}
              resizeMode="contain"
            />

            {/* Video Play Overlay */}
            {status.type === 'video' ? (
              <Pressable
                onPress={() => setIsPlaying(!isPlaying)}
                style={styles.videoControlOverlay}
              >
                <View style={styles.playPauseCircle}>
                  {isPlaying ? (
                    <Pause size={28} color="#FFFFFF" fill="#FFFFFF" />
                  ) : (
                    <Play size={28} color="#FFFFFF" fill="#FFFFFF" />
                  )}
                </View>
                {status.duration ? (
                  <View style={styles.durationPill}>
                    <Text style={styles.durationPillText}>{status.duration}</Text>
                  </View>
                ) : null}
              </Pressable>
            ) : null}

            {/* TOAST OVERLAY */}
            {toastMessage ? (
              <View style={styles.toastBanner}>
                <ShieldCheck size={16} color="#3DDC84" />
                <Text style={styles.toastText}>{toastMessage}</Text>
              </View>
            ) : null}
          </View>

          {/* BOTTOM ACTION BAR */}
          <View style={styles.bottomBar}>
            {/* SAVE BUTTON */}
            <Pressable
              onPress={() => {
                onToggleSave(status.id);
                showToast(
                  status.isSaved ? 'Removed from Gallery' : 'Saved to Gallery!'
                );
              }}
              style={({ pressed }) => [
                styles.actionBtn,
                status.isSaved && styles.activeSaveBtn,
                { opacity: pressed ? 0.8 : 1 },
              ]}
            >
              {status.isSaved ? (
                <Check size={18} color="#0A140F" strokeWidth={2.5} />
              ) : (
                <Download size={18} color="#FFFFFF" strokeWidth={2} />
              )}
              <Text
                style={[
                  styles.actionBtnText,
                  status.isSaved && styles.activeSaveBtnText,
                ]}
              >
                {status.isSaved ? 'Saved' : 'Save'}
              </Text>
            </Pressable>

            {/* FAVORITE BUTTON */}
            <Pressable
              onPress={() => {
                onToggleFavorite(status.id);
                showToast(
                  status.isFavorite
                    ? 'Removed from Favorites'
                    : 'Added to Starred Favorites'
                );
              }}
              style={({ pressed }) => [
                styles.iconActionBtn,
                { opacity: pressed ? 0.7 : 1 },
              ]}
            >
              <Heart
                size={20}
                color={status.isFavorite ? colors.destructive : '#FFFFFF'}
                fill={status.isFavorite ? colors.destructive : 'transparent'}
              />
            </Pressable>

            {/* SHARE BUTTON (REACT NATIVE SHARE API) */}
            <Pressable
              onPress={handleShare}
              style={({ pressed }) => [
                styles.shareActionBtn,
                { opacity: pressed ? 0.88 : 1 },
              ]}
            >
              <Share2 size={18} color="#FFFFFF" strokeWidth={2.2} />
              <Text style={styles.shareBtnText}>Share</Text>
            </Pressable>

            {/* REPOST BUTTON */}
            <Pressable
              onPress={handleDirectWhatsAppShare}
              style={({ pressed }) => [
                styles.repostActionBtn,
                { opacity: pressed ? 0.88 : 1 },
              ]}
            >
              <Send size={16} color="#3DDC84" strokeWidth={2.2} />
            </Pressable>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalRoot: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.94)',
  },
  container: {
    width: '94%',
    maxWidth: 480,
    maxHeight: '92%',
    backgroundColor: '#0E1712',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.5,
    shadowRadius: 24,
    elevation: 20,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3.5],
    backgroundColor: '#141E18',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.08)',
  },
  userInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
  },
  avatarCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(61, 220, 132, 0.18)',
    borderWidth: 1.5,
    borderColor: '#3DDC84',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#3DDC84',
    fontSize: 16,
    fontWeight: '700',
  },
  userTextCol: {
    gap: 2,
  },
  senderName: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  timeText: {
    color: '#8D9F96',
    fontSize: 12,
  },
  bulletDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: '#8D9F96',
  },
  qualityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  qualityText: {
    color: '#3DDC84',
    fontSize: 11,
    fontWeight: '600',
  },
  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mediaContainer: {
    height: 420,
    width: '100%',
    backgroundColor: '#000000',
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  fullImage: {
    width: '100%',
    height: '100%',
  },
  videoControlOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.25)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  playPauseCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    borderWidth: 1.5,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  durationPill: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
  },
  durationPillText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  toastBanner: {
    position: 'absolute',
    top: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: 'rgba(18, 30, 23, 0.95)',
    borderWidth: 1,
    borderColor: '#3DDC84',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  toastText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2.5],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3.5],
    backgroundColor: '#141E18',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.08)',
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#202E26',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  activeSaveBtn: {
    backgroundColor: '#3DDC84',
    borderColor: '#3DDC84',
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  activeSaveBtnText: {
    color: '#0A140F',
    fontWeight: '700',
  },
  iconActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#202E26',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  shareActionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#265C3D',
    borderWidth: 1,
    borderColor: 'rgba(61, 220, 132, 0.4)',
  },
  shareBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  repostActionBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(61, 220, 132, 0.12)',
    borderWidth: 1,
    borderColor: '#3DDC84',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
