import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Alert } from 'react-native';
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
        }
      } catch (err) {
        console.warn('SAF directory picker error:', err);
      }
    }

    // Direct system picker retry if cancelled
    Alert.alert(
      'Storage Permission Needed',
      'Please select your WhatsApp or Media folder in the file picker and tap "USE THIS FOLDER" to show statuses.',
      [
        {
          text: 'Open Picker',
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
        {/* HEADER SECTION */}
        <View style={styles.headerSection}>
          <View style={styles.logoRing}>
            <Logo size={90} glow={true} />
          </View>
          <Text style={styles.titleText}>Allow folder access</Text>
          <Text style={styles.descText}>
            W Status Saver needs one-time access to the WhatsApp status folder to show what your contacts posted today.
          </Text>
        </View>

        {/* CARDS LIST */}
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
              <Text style={styles.cardSub}>Downloads go to your gallery, offline.</Text>
            </View>
            <Check size={20} color="#3DDC84" strokeWidth={2.5} />
          </View>
        </View>

        {/* BOTTOM BUTTONS */}
        <View style={styles.bottomSection}>
          <Pressable style={styles.allowButton} onPress={handleAllowAccess}>
            <Text style={styles.allowBtnText}>Allow access</Text>
          </Pressable>
          <Pressable style={styles.notNowButton} onPress={handleNotNow}>
            <Text style={styles.notNowText}>Not now</Text>
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
    marginTop: spacing.sm,
  },
  logoRing: {
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
    paddingHorizontal: spacing.xs,
  },
  cardsGroup: {
    gap: spacing.md,
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
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: 'rgba(61, 220, 132, 0.08)',
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
    gap: spacing.sm,
    marginBottom: spacing.xs,
  },
  allowButton: {
    backgroundColor: '#3DDC84',
    paddingVertical: 16,
    borderRadius: radius.xl,
    alignItems: 'center',
  },
  allowBtnText: {
    color: '#0D1412',
    fontSize: 16,
    fontWeight: '700',
  },
  notNowButton: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  notNowText: {
    color: '#8D9F96',
    fontSize: 14,
  },
});
