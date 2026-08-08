import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Folder, EyeOff, HardDrive, Check } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Logo } from '@/components/branding/Logo';
import { radius, spacing } from '@/theme';
import { loadSettings, saveSettings } from '@/lib/settingsService';

export default function FolderAccessScreen() {
  const router = useRouter();

  const handleAllowAccess = () => {
    Alert.alert(
      'Storage Access Framework',
      'Select your WhatsApp Statuses directory in Android File Picker to grant permission:\n\nAndroid/media/com.whatsapp/WhatsApp/Media/.Statuses',
      [
        {
          text: 'Open Folder Picker',
          onPress: () => {
            const curr = loadSettings();
            saveSettings({
              ...curr,
              folderAccessGranted: true,
              onboardingCompleted: true,
            });
            Alert.alert(
              'Permission Verified',
              'WhatsApp status folder access has been granted.',
              [
                {
                  text: 'Continue',
                  onPress: () => router.replace('/home'),
                },
              ]
            );
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  const handleNotNow = () => {
    const curr = loadSettings();
    saveSettings({
      ...curr,
      onboardingCompleted: true,
    });
    router.replace('/home');
  };

  return (
    <ScreenContainer scrollable={false} padded={false}>
      <View style={styles.container}>
        {/* HEADER */}
        <View style={styles.headerSection}>
          {/* Logo glow background */}
          <View style={styles.logoGlowRing}>
            <Logo size={88} showFreeBadge={true} glow={true} />
          </View>

          <Text style={styles.titleText}>Allow folder access</Text>
          <Text style={styles.descText}>
            W Status Saver needs one-time access to the WhatsApp status folder to
            show what your contacts posted today.
          </Text>
        </View>

        {/* INFO CARDS */}
        <View style={styles.cardsGroup}>
          {/* CARD 1 */}
          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <Folder size={20} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Read the Statuses folder</Text>
              <Text style={styles.cardSub}>
                Only the WhatsApp status folder is scanned.
              </Text>
            </View>
            <Check size={20} color="#3DDC84" strokeWidth={2.5} />
          </View>

          {/* CARD 2 */}
          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <EyeOff size={20} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>No chats, no contacts</Text>
              <Text style={styles.cardSub}>
                Messages and personal data are never touched.
              </Text>
            </View>
            <Check size={20} color="#3DDC84" strokeWidth={2.5} />
          </View>

          {/* CARD 3 */}
          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <HardDrive size={20} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Saves stay local</Text>
              <Text style={styles.cardSub}>
                Downloads go to your gallery, offline.
              </Text>
            </View>
            <Check size={20} color="#3DDC84" strokeWidth={2.5} />
          </View>
        </View>

        {/* BOTTOM BUTTONS */}
        <View style={styles.buttonsGroup}>
          <Pressable
            onPress={handleAllowAccess}
            style={({ pressed }) => [
              styles.allowBtn,
              { opacity: pressed ? 0.88 : 1 },
            ]}
          >
            <Text style={styles.allowBtnText}>Allow access</Text>
          </Pressable>

          <Pressable
            onPress={handleNotNow}
            style={({ pressed }) => [
              styles.notNowBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <Text style={styles.notNowBtnText}>Not now</Text>
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
    paddingHorizontal: spacing[5],
    paddingTop: spacing[4],
    paddingBottom: spacing[6],
    justifyContent: 'space-between',
  },
  headerSection: {
    alignItems: 'center',
    paddingTop: spacing[2],
  },
  logoGlowRing: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 1,
    borderColor: 'rgba(61, 220, 132, 0.12)',
    backgroundColor: 'rgba(61, 220, 132, 0.03)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing[4],
  },
  titleText: {
    color: '#FFFFFF',
    fontSize: 24,
    fontWeight: '800',
    letterSpacing: -0.4,
    textAlign: 'center',
    marginBottom: spacing[2],
  },
  descText: {
    color: '#99A8A0',
    fontSize: 14,
    lineHeight: 20,
    textAlign: 'center',
    paddingHorizontal: spacing[2],
  },
  cardsGroup: {
    gap: spacing[3],
    marginVertical: spacing[3],
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing[4],
    backgroundColor: '#121C18',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    gap: spacing[3],
  },
  iconCircle: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(61, 220, 132, 0.12)',
    borderWidth: 1,
    borderColor: '#1A6B3E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  cardSub: {
    color: '#8D9F96',
    fontSize: 13,
    marginTop: 2,
  },
  buttonsGroup: {
    gap: spacing[2.5],
  },
  allowBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#3DDC84',
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowBtnText: {
    color: '#0A140F',
    fontSize: 16,
    fontWeight: '700',
  },
  notNowBtn: {
    height: 52,
    borderRadius: 26,
    backgroundColor: '#121A17',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  notNowBtnText: {
    color: '#A0B0A8',
    fontSize: 15,
    fontWeight: '600',
  },
});
