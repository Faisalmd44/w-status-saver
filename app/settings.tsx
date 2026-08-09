import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Pressable, ScrollView, Alert, Platform, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { 
  ChevronLeft, Moon, Globe, Download, HardDrive, Bell, Folder, 
  ShieldCheck, Info, Sparkles, Check, ChevronRight, X 
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { radius, spacing } from '@/theme';
import { loadSettings, saveSettings, AppSettings } from '@/lib/settingsService';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings());
  const [aboutModalVisible, setAboutModalVisible] = useState(false);

  useEffect(() => {
    setSettingsState(loadSettings());
  }, []);

  const toggleSetting = (key: keyof AppSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const handleGrantFolderAccess = async () => {
    const StorageAccessFramework = (FileSystem as any).StorageAccessFramework;
    if (Platform.OS === 'android' && StorageAccessFramework) {
      try {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions.granted && permissions.directoryUri) {
          const updated = {
            ...settings,
            folderAccessGranted: true,
            safUri: permissions.directoryUri,
          };
          setSettingsState(updated);
          saveSettings(updated);
          Alert.alert('Access Granted', 'WhatsApp Status folder permission is verified.');
          return;
        }
      } catch (err) {
        console.warn('SAF permission request error:', err);
      }
    }

    Alert.alert(
      'Storage Access Required',
      'Please select your WhatsApp or Media folder in the Android system file picker and tap "USE THIS FOLDER".',
      [
        { text: 'Try Again', onPress: () => handleGrantFolderAccess() },
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <ScreenContainer scrollable={false} padded={false}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* PERMISSIONS SECTION */}
        <Text style={styles.sectionTitle}>PERMISSIONS</Text>
        <View style={styles.cardGroup}>
          <Pressable style={styles.cardRow} onPress={handleGrantFolderAccess}>
            <View style={styles.iconBox}>
              <Folder size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>WhatsApp Status folder access</Text>
              <Text style={styles.itemSub}>
                {settings.folderAccessGranted ? 'Access granted' : 'Tap to select WhatsApp folder'}
              </Text>
            </View>
            <Pressable style={styles.actionBadge} onPress={handleGrantFolderAccess}>
              <Text style={styles.actionBadgeText}>
                {settings.folderAccessGranted ? 'Change' : 'Grant'}
              </Text>
            </Pressable>
          </Pressable>
        </View>

        {/* DOWNLOADS SECTION */}
        <Text style={styles.sectionTitle}>DOWNLOADS</Text>
        <View style={styles.cardGroup}>
          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <Download size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>Auto-save new statuses</Text>
              <Text style={styles.itemSub}>Automatically keep statuses for 30 days</Text>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={() => toggleSetting('autoSave')}
              trackColor={{ false: '#26332D', true: 'rgba(61, 220, 132, 0.4)' }}
              thumbColor={settings.autoSave ? '#3DDC84' : '#8D9F96'}
            />
          </View>
        </View>
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: '#0D1412',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#16221E',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollBody: {
    padding: spacing.md,
    gap: spacing.md,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8D9F96',
    letterSpacing: 1,
    marginTop: spacing.xs,
  },
  cardGroup: {
    backgroundColor: '#16221E',
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.md,
    gap: spacing.md,
  },
  iconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(61, 220, 132, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowTextCol: {
    flex: 1,
  },
  itemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  itemSub: {
    fontSize: 12,
    color: '#8D9F96',
    marginTop: 2,
  },
  actionBadge: {
    backgroundColor: 'rgba(61, 220, 132, 0.15)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: radius.md,
  },
  actionBadgeText: {
    color: '#3DDC84',
    fontSize: 13,
    fontWeight: '600',
  },
});
