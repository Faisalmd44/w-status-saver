import React from 'react';
import { StyleSheet, Text, View, Pressable, Platform, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { Folder, EyeOff, HardDrive, Check } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Logo } from '@/components/branding/Logo';
import { loadSettings, saveSettings } from '@/lib/settingsService';

export default function FolderAccessScreen() {
  const router = useRouter();

  const handleAllowAccess = async () => {
    try {
      if (Platform.OS !== 'android') return;
      
      // Safety check taaki undefined error na aaye
      if (!FileSystem.StorageAccessFramework) {
        Alert.alert('Error', 'Storage API is missing on this device.');
        return;
      }

      // Direct official call bina destructure kiye
      const permissions = await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
      
      if (permissions && permissions.granted && permissions.directoryUri) {
        const curr = loadSettings();
        saveSettings({
          ...curr,
          folderAccessGranted: true,
          safUri: permissions.directoryUri,
          onboardingCompleted: true,
        });
        router.replace('/home');
      } else {
        Alert.alert('Cancelled', 'Aapne folder select nahi kiya. Please "Use this folder" par tap karein.');
      }
    } catch (e: any) {
      Alert.alert('System Error', e.message || 'File picker open nahi ho paya.');
    }
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
          <View style={styles.logoWrapper}>
            <Logo size={96} glow={true} />
          </View>
          <Text style={styles.titleText}>Allow folder access</Text>
          <Text style={styles.descText}>
            W Status Saver needs one-time access to the WhatsApp status folder to show what your contacts posted today.
          </Text>
        </View>

        <View style={styles.cardsGroup}>
          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <Folder size={22} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Read the Statuses folder</Text>
              <Text style={styles.cardSub}>Only the WhatsApp status folder is scanned.</Text>
            </View>
            <Check size={22} color="#3DDC84" strokeWidth={2.5} />
          </View>

          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <EyeOff size={22} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>No chats, no contacts</Text>
              <Text style={styles.cardSub}>Messages and personal data are never touched.</Text>
            </View>
            <Check size={22} color="#3DDC84" strokeWidth={2.5} />
          </View>

          <View style={styles.cardItem}>
            <View style={styles.iconCircle}>
              <HardDrive size={22} color="#3DDC84" strokeWidth={2} />
            </View>
            <View style={styles.cardTextCol}>
              <Text style={styles.cardTitle}>Saves stay local</Text>
              <Text style={styles.cardSub}>Downloads go to your gallery, offline.</Text>
            </View>
            <Check size={22} color="#3DDC84" strokeWidth={2.5} />
          </View>
        </View>

        <View style={styles.bottomSection}>
          <Pressable 
            style={({ pressed }) => [styles.allowButton, pressed && { opacity: 0.7 }]} 
            onPress={handleAllowAccess}
          >
            <Text style={styles.allowBtnText}>Allow access</Text>
          </Pressable>
          <Pressable 
            style={({ pressed }) => [styles.notNowButton, pressed && { opacity: 0.7 }]} 
            onPress={handleNotNow}
          >
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
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 24,
    justifyContent: 'space-between',
    backgroundColor: '#0A0F0D',
  },
  headerSection: {
    alignItems: 'center',
    marginTop: 10,
  },
  logoWrapper: {
    marginBottom: 20,
  },
  titleText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  descText: {
    fontSize: 14,
    color: '#8D9F96',
    textAlign: 'center',
    lineHeight: 20,
    paddingHorizontal: 10,
  },
  cardsGroup: {
    gap: 12,
    marginVertical: 10,
  },
  cardItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#121D18',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 18,
    gap: 14,
  },
  iconCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(61, 220, 132, 0.08)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardTextCol: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 3,
  },
  cardSub: {
    fontSize: 13,
    color: '#8D9F96',
  },
  bottomSection: {
    gap: 10,
  },
  allowButton: {
    backgroundColor: '#3DDC84',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  allowBtnText: {
    color: '#0A0F0D',
    fontSize: 17,
    fontWeight: '700',
  },
  notNowButton: {
    backgroundColor: '#121D18',
    paddingVertical: 16,
    borderRadius: 28,
    alignItems: 'center',
  },
  notNowText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});
