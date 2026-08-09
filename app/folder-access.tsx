import { Alert, Pressable, StyleSheet, Text, View, Platform } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Folder, EyeOff, HardDrive, Check } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Logo } from '@/components/branding/Logo';
import { radius, spacing } from '@/theme';
import { loadSettings, saveSettings } from '@/lib/settingsService';

export default function FolderAccessScreen() {
  const router = useRouter();

  const handleAllowAccess = async () => {
    const StorageAccessFramework = (FileSystem as any).StorageAccessFramework;

    if (Platform.OS === 'android' && StorageAccessFramework) {
      try {
        // First try requesting directory permission directly from system file picker
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        
        if (permissions.granted && permissions.directoryUri) {
          const curr = loadSettings();
          saveSettings({
            ...curr,
            folderAccessGranted: true,
            safUri: permissions.directoryUri,
            onboardingCompleted: true,
          });
          router.replace('/home');
          return;
        } else {
          Alert.alert('Permission Required', 'You need to select a folder and tap "USE THIS FOLDER" to grant access.');
          return;
        }
      } catch (err: any) {
        console.warn('SAF folder selection error:', err);
      }
    }

    Alert.alert(
      'Storage Access Required',
      'Please select your WhatsApp or Media folder in the system picker and tap "USE THIS FOLDER" at the bottom.',
      [
        {
          text: 'Try Again',
          onPress: () => handleAllowAccess(),
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
        <View style={styles.headerSection}>
          <View style={styles.logoGlowRing}>
            <Logo size={88} glow={true} />
          </View>
          <Text style={styles.titleText}>Allow folder access</Text>
          <Text style={styles.descText}>
            W Status Saver needs one-time access to the WhatsApp status folder to show what your contacts posted today.
          </Text>
        </View>

        <View style={styles.cardsGroup}>
          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <Folder size={20} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Read the Statuses folder</Text>
              <Text style={styles.cardSub}>Only the WhatsApp status folder is scanned.</Text>
            </View>
            <Check size={20} color="#3DDC84" strokeWidth={2.5} />
          </View>

          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <EyeOff size={20} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>No chats, no contacts</Text>
              <Text style={styles.cardSub}>Messages and personal data are never touched.</Text>
            </View>
            <Check size={20} color="#3DDC84" strokeWidth={2.5} />
          </View>

          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <HardDrive size={20} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Saves stay local</Text>
              <Text style={styles.cardSub}>Your media never leaves your phone.</Text>
            </View>
            <Check size={20} color="#3DDC84" strokeWidth={2.5} />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Pressable style={styles.allowButton} onPress={handleAllowAccess}>
            <Text style={styles.allowBtnText}>Grant Access</Text>
          </Pressable>
          <Pressable style={styles.notNowButton} onPress={handleNotNow}>
            <Text style={styles.notNowText}>Not Now</Text>
          </Pressable>
        </View>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
    paddingBottom: spacing.lg,
    justifyContent: 'space-between',
    backgroundColor: '#0D1412',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: spacing.md,
  },
  logoGlowRing: {
    marginBottom: spacing.md,
  },
  titleText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: spacing.xs,
  },
  descText: {
    fontSize: 14,
    color: '#A0AEA6',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: spacing.md,
  },
  cardsGroup: {
    gap: spacing.sm,
    marginVertical: spacing.md,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#16221E',
    borderRadius: radius.lg,
    padding: spacing.md,
    gap: spacing.sm,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(61, 220, 132, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  cardSub: {
    fontSize: 12,
    color: '#8D9F96',
  },
  bottomSection: {
    gap: spacing.xs,
  },
  allowButton: {
    backgroundColor: '#3DDC84',
    paddingVertical: 14,
    borderRadius: radius.md,
    alignItems: 'center',
  },
  allowBtnText: {
    color: '#0D1412',
    fontSize: 16,
    fontWeight: '700',
  },
  notNowButton: {
    paddingVertical: 12,
    alignItems: 'center',
  },
  notNowText: {
    color: '#8D9F96',
    fontSize: 14,
  },
});
