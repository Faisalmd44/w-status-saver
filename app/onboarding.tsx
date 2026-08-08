import { useState } from 'react';
import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Download, Sparkles, Lock, ArrowRight } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Logo } from '@/components/branding/Logo';
import { radius, spacing } from '@/theme';
import { loadSettings, saveSettings } from '@/lib/settingsService';

export default function OnboardingScreen() {
  const router = useRouter();
  const [slideIndex, setSlideIndex] = useState(0);

  const slides = [
    {
      id: 'slide1',
      title: 'Save in original quality',
      description:
        'One tap keeps photos and videos exactly as they were shared — no compression, no watermark.',
      icon: Download,
      bgImage:
        'https://images.unsplash.com/photo-1516962215378-7fa2e137ae93?auto=format&fit=crop&q=80&w=800',
      buttonText: 'Next',
    },
    {
      id: 'slide2',
      title: 'Organised beautifully',
      description:
        'Images, videos, saved and favorites live in their own polished spaces with instant search.',
      icon: Sparkles,
      bgImage:
        'https://images.unsplash.com/photo-1518495973542-4542c06a5843?auto=format&fit=crop&q=80&w=800',
      buttonText: 'Next',
    },
    {
      id: 'slide3',
      title: 'Private by design',
      description:
        'Everything stays on your device. No sign-in, no uploads, no tracking — ever.',
      icon: Lock,
      bgImage:
        'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&q=80&w=800',
      buttonText: 'Continue',
    },
  ];

  const currentSlide = slides[slideIndex];
  const IconComponent = currentSlide.icon;

  const finishOnboarding = () => {
    const curr = loadSettings();
    saveSettings({ ...curr, onboardingCompleted: true });
    if (!curr.folderAccessGranted) {
      router.push('/folder-access');
    } else {
      router.push('/home');
    }
  };

  const handleNext = () => {
    if (slideIndex < slides.length - 1) {
      setSlideIndex((prev) => prev + 1);
    } else {
      finishOnboarding();
    }
  };

  return (
    <ScreenContainer scrollable={false} padded={false}>
      <View style={styles.container}>
        {/* TOP BAR */}
        <View style={styles.topBar}>
          <Logo size={34} showFreeBadge={true} />
          <Pressable
            onPress={finishOnboarding}
            style={({ pressed }) => [
              styles.skipBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.skipText}>Skip</Text>
          </Pressable>
        </View>

        {/* MAIN CARD FRAME */}
        <View style={styles.cardFrame}>
          <Image
            source={{ uri: currentSlide.bgImage }}
            style={styles.bgImage}
            resizeMode="cover"
          />

          {/* OVERLAY DARK CARD */}
          <View style={styles.overlayCard}>
            <View style={styles.iconCircle}>
              <IconComponent size={22} color="#0A140F" strokeWidth={2.5} />
            </View>

            <Text style={styles.slideTitle}>{currentSlide.title}</Text>
            <Text style={styles.slideDesc}>{currentSlide.description}</Text>
          </View>
        </View>

        {/* BOTTOM NAVIGATION BAR */}
        <View style={styles.bottomBar}>
          {/* PROGRESS INDICATOR */}
          <View style={styles.progressRow}>
            {slides.map((_, idx) => {
              const isActive = idx === slideIndex;
              return (
                <View
                  key={idx}
                  style={[
                    styles.pillDot,
                    isActive ? styles.pillDotActive : styles.pillDotInactive,
                  ]}
                />
              );
            })}
          </View>

          {/* NEXT / CONTINUE BUTTON */}
          <Pressable
            onPress={handleNext}
            style={({ pressed }) => [
              styles.nextBtn,
              { opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Text style={styles.nextBtnText}>{currentSlide.buttonText}</Text>
            <ArrowRight size={18} color="#0A140F" strokeWidth={2.5} />
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
    paddingHorizontal: spacing[4],
    paddingTop: spacing[3],
    paddingBottom: spacing[5],
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[1],
    height: 48,
  },
  skipBtn: {
    paddingHorizontal: spacing[3],
    paddingVertical: spacing[1.5],
  },
  skipText: {
    color: '#8D9F96',
    fontSize: 14,
    fontWeight: '500',
  },
  cardFrame: {
    flex: 1,
    marginVertical: spacing[2],
    borderRadius: 32,
    overflow: 'hidden',
    backgroundColor: '#121A17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    position: 'relative',
    justifyContent: 'flex-end',
  },
  bgImage: {
    ...StyleSheet.absoluteFillObject,
    width: '100%',
    height: '100%',
  },
  overlayCard: {
    backgroundColor: 'rgba(20, 28, 24, 0.92)',
    margin: spacing[3],
    borderRadius: 24,
    padding: spacing[5],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    gap: spacing[2.5],
  },
  iconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3DDC84',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[1],
  },
  slideTitle: {
    color: '#FFFFFF',
    fontSize: 22,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  slideDesc: {
    color: '#A0B0A8',
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing[2],
    paddingTop: spacing[2],
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pillDot: {
    height: 6,
    borderRadius: 3,
  },
  pillDotActive: {
    width: 28,
    backgroundColor: '#3DDC84',
  },
  pillDotInactive: {
    width: 6,
    backgroundColor: '#26332C',
  },
  nextBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[2],
    height: 48,
    paddingHorizontal: spacing[5],
    borderRadius: 24,
    backgroundColor: '#3DDC84',
  },
  nextBtnText: {
    color: '#0A140F',
    fontSize: 15,
    fontWeight: '700',
  },
});
