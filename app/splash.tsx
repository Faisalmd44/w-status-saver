import { useState } from 'react';
import {
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ShieldCheck, X, ChevronRight } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Logo } from '@/components/branding/Logo';
import { radius, spacing, typography } from '@/theme';

export default function SplashScreen() {
  const router = useRouter();
  const [showScreenPicker, setShowScreenPicker] = useState(false);

  const screensList = [
    { title: 'Welcome / Splash Screen', route: '/splash' },
    { title: 'Onboarding Flow (3 Slides)', route: '/onboarding' },
    { title: 'Allow Folder Access Screen', route: '/folder-access' },
    { title: 'Home Dashboard (5 Tabs)', route: '/home' },
    { title: 'App Settings & Preferences', route: '/settings' },
  ];

  return (
    <ScreenContainer scrollable={false} padded={false}>
      <View style={styles.container}>
        {/* Glow rings background */}
        <View style={styles.ringOuter}>
          <View style={styles.ringMiddle}>
            <View style={styles.ringInner}>
              <Logo size={110} showFreeBadge={true} glow={true} />
            </View>
          </View>
        </View>

        {/* Content area */}
        <View style={styles.content}>
          {/* Title */}
          <Text style={styles.titleText}>
            <Text style={{ color: '#3DDC84' }}>W</Text>
            <Text style={{ color: '#FFFFFF' }}> Status Saver</Text>
          </Text>

          {/* Subtitle */}
          <Text style={styles.subtitleText}>
            Save every status in original quality — private, instant, effortless.
          </Text>

          {/* Progress bar line */}
          <View style={styles.progressTrack}>
            <View style={styles.progressFill} />
          </View>

          {/* Get started button */}
          <Pressable
            onPress={() => router.push('/onboarding')}
            style={({ pressed }) => [
              styles.getStartedBtn,
              { opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Text style={styles.getStartedText}>Get started</Text>
          </Pressable>

          {/* Privacy badge */}
          <View style={styles.privacyRow}>
            <ShieldCheck size={16} color="#3DDC84" strokeWidth={2.2} />
            <Text style={styles.privacyText}>
              No account. Nothing leaves your phone.
            </Text>
          </View>

          {/* Browse all screens link */}
          <Pressable
            onPress={() => setShowScreenPicker(true)}
            style={({ pressed }) => [
              styles.browseBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.browseText}>Browse all screens</Text>
          </Pressable>
        </View>
      </View>

      {/* BROWSE ALL SCREENS MODAL */}
      <Modal
        visible={showScreenPicker}
        transparent
        animationType="slide"
        onRequestClose={() => setShowScreenPicker(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>App Screen Navigator</Text>
              <Pressable onPress={() => setShowScreenPicker(false)}>
                <X size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            <Text style={styles.modalSub}>
              Jump directly to any preview screen:
            </Text>

            {screensList.map((item) => (
              <Pressable
                key={item.route}
                onPress={() => {
                  setShowScreenPicker(false);
                  router.push(item.route as any);
                }}
                style={({ pressed }) => [
                  styles.screenItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <Text style={styles.screenItemTitle}>{item.title}</Text>
                <ChevronRight size={18} color="#3DDC84" />
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing[5],
    position: 'relative',
  },
  ringOuter: {
    width: 320,
    height: 320,
    borderRadius: 160,
    borderWidth: 1,
    borderColor: 'rgba(61, 220, 132, 0.05)',
    backgroundColor: 'rgba(61, 220, 132, 0.02)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[6],
  },
  ringMiddle: {
    width: 250,
    height: 250,
    borderRadius: 125,
    borderWidth: 1,
    borderColor: 'rgba(61, 220, 132, 0.09)',
    backgroundColor: 'rgba(61, 220, 132, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {
    width: 180,
    height: 180,
    borderRadius: 90,
    borderWidth: 1,
    borderColor: 'rgba(61, 220, 132, 0.16)',
    backgroundColor: 'rgba(61, 220, 132, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    width: '100%',
    maxWidth: 360,
    alignItems: 'center',
  },
  titleText: {
    fontSize: 30,
    fontWeight: '800',
    letterSpacing: -0.5,
    marginBottom: spacing[2.5],
  },
  subtitleText: {
    color: '#99A8A0',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
    marginBottom: spacing[6],
    paddingHorizontal: spacing[2],
  },
  progressTrack: {
    width: 220,
    height: 3,
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 2,
    overflow: 'hidden',
    marginBottom: spacing[8],
  },
  progressFill: {
    width: 30,
    height: '100%',
    backgroundColor: '#3DDC84',
    borderRadius: 2,
  },
  getStartedBtn: {
    width: '100%',
    height: 54,
    borderRadius: 27,
    backgroundColor: '#3DDC84',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  getStartedText: {
    color: '#0A140F',
    fontSize: 16,
    fontWeight: '700',
  },
  privacyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[5],
  },
  privacyText: {
    color: '#8D9F96',
    fontSize: 13,
  },
  browseBtn: {
    paddingVertical: spacing[2],
    paddingHorizontal: spacing[4],
  },
  browseText: {
    color: '#3DDC84',
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#141E19',
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: spacing[5],
    gap: spacing[3],
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalSub: {
    color: '#8D9F96',
    fontSize: 13,
    marginBottom: spacing[2],
  },
  screenItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3.5],
    paddingHorizontal: spacing[4],
    backgroundColor: '#1A2620',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  screenItemTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
});
