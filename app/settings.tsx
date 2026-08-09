import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Pressable, ScrollView, Platform, Modal, Alert, Image } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { 
  ChevronLeft, Download, HardDrive, Bell, Folder, 
  ShieldCheck, Info, Sparkles, ChevronRight, X, Moon, Globe 
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { loadSettings, saveSettings, AppSettings } from '@/lib/settingsService';
import { useStatuses } from '@/hooks/useStatuses';
import { radius, spacing } from '@/theme';

export default function SettingsScreen() {
  const router = useRouter();
  const [settings, setSettingsState] = useState<AppSettings>(loadSettings());
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [privacyModalVisible, setPrivacyModalVisible] = useState(false);
  const { statuses, refresh } = useStatuses();

  useEffect(() => {
    setSettingsState(loadSettings());
  }, []);

  const toggleSetting = (key: keyof AppSettings) => {
    const updated = { ...settings, [key]: !settings[key] };
    setSettingsState(updated);
    saveSettings(updated);
  };

  const handleGrantFolderAccess = async () => {
    try {
      const StorageAccessFramework = (FileSystem as any).StorageAccessFramework;
      if (Platform.OS === 'android' && StorageAccessFramework) {
        const permissions = await StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (permissions && permissions.granted && permissions.directoryUri) {
          const updated = {
            ...settings,
            folderAccessGranted: true,
            safUri: permissions.directoryUri,
          };
          setSettingsState(updated);
          saveSettings(updated);
          refresh();
        }
      }
    } catch (err: any) {
      Alert.alert('Notice', 'System folder picker cancelled or closed.');
    }
  };

  const savedItems = statuses.filter((item) => item.isSaved);
  const totalBytes = savedItems.reduce((acc, curr) => acc + (curr.fileSizeBytes || 0), 0);
  const formattedStorage = (totalBytes / (1024 * 1024 * 1024)).toFixed(1); // GB calculation

  return (
    <ScreenContainer scrollable={false} padded={false}>
      {/* HEADER */}
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </Pressable>
        <View style={styles.headerTitleContainer}>
            <Text style={styles.headerTitle}>Settings</Text>
            <Text style={styles.headerSub}>Version 3.2.0 · Premium</Text>
        </View>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
        
        {/* PRO CARD */}
        <View style={styles.proCard}>
          <Image source={require('@/assets/images/icon.png')} style={styles.proLogo} />
          <View style={styles.proTextCol}>
             <Text style={styles.proTitle}>W Status Saver</Text>
             <Text style={styles.proSub}>{savedItems.length} saved · {formattedStorage} GB used</Text>
          </View>
          <View style={styles.proBadge}>
             <Text style={styles.proBadgeText}>PRO</Text>
          </View>
        </View>

        {/* APPEARANCE */}
        <Text style={styles.sectionTitle}>APPEARANCE</Text>
        <View style={styles.cardGroup}>
          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <Moon size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>AMOLED black theme</Text>
              <Text style={styles.itemSub}>True black for deeper contrast</Text>
            </View>
            <Switch
              value={true} // Hardcoded for design
              onValueChange={() => {}}
              trackColor={{ false: '#121D18', true: 'rgba(61, 220, 132, 0.4)' }}
              thumbColor={'#3DDC84'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <Globe size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>Language</Text>
              <Text style={styles.itemSub}>English (device)</Text>
            </View>
            <ChevronRight size={18} color="#8D9F96" />
          </View>
        </View>

        {/* DOWNLOADS */}
        <Text style={styles.sectionTitle}>DOWNLOADS</Text>
        <View style={styles.cardGroup}>
          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <Download size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>Auto-save new statuses</Text>
              <Text style={styles.itemSub}>Keep everything for 30 days</Text>
            </View>
            <Switch
              value={settings.autoSave}
              onValueChange={() => toggleSetting('autoSave')}
              trackColor={{ false: '#1E2C26', true: 'rgba(61, 220, 132, 0.4)' }}
              thumbColor={settings.autoSave ? '#3DDC84' : '#8D9F96'}
            />
          </View>

          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <HardDrive size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>Save location</Text>
              <Text style={styles.itemSub}>Gallery / W Status Saver</Text>
            </View>
            <ChevronRight size={18} color="#8D9F96" />
          </View>

          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <Bell size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>New status alerts</Text>
              <Text style={styles.itemSub}>Get notified when new status is available</Text>
            </View>
            <Switch
              value={settings.statusAlerts}
              onValueChange={() => toggleSetting('statusAlerts')}
              trackColor={{ false: '#1E2C26', true: 'rgba(61, 220, 132, 0.4)' }}
              thumbColor={settings.statusAlerts ? '#3DDC84' : '#8D9F96'}
            />
          </View>
        </View>

        {/* PERMISSIONS */}
        <Text style={styles.sectionTitle}>PERMISSIONS</Text>
        <View style={styles.cardGroup}>
          <Pressable 
            style={({ pressed }) => [styles.cardRow, pressed && { opacity: 0.7 }]} 
            onPress={handleGrantFolderAccess}
          >
            <View style={styles.iconBox}>
              <Folder size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>WhatsApp Status folder access</Text>
              <Text style={[styles.itemSub, settings.folderAccessGranted && { color: '#3DDC84' }]}>
                {settings.folderAccessGranted ? 'Access granted' : 'Tap to select folder'}
              </Text>
            </View>
            <View style={styles.actionBadge}>
              <Text style={styles.actionBadgeText}>
                {settings.folderAccessGranted ? 'Change' : 'Grant'}
              </Text>
            </View>
          </Pressable>
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
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#0A0F0D',
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: '#121D18',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleContainer: {
     alignItems: 'center'
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  headerSub: {
    fontSize: 12,
    color: '#8D9F96',
    marginTop: 2
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 80,
  },
  proCard: {
     flexDirection: 'row',
     backgroundColor: '#121D18',
     borderRadius: 24,
     padding: 16,
     alignItems: 'center',
     marginBottom: 10
  },
  proLogo: {
     width: 48,
     height: 48,
     borderRadius: 12,
     marginRight: 14
  },
  proTextCol: {
     flex: 1
  },
  proTitle: {
     fontSize: 16,
     fontWeight: '700',
     color: '#FFFFFF',
     marginBottom: 2
  },
  proSub: {
     fontSize: 13,
     color: '#8D9F96'
  },
  proBadge: {
     backgroundColor: 'rgba(61, 220, 132, 0.1)',
     paddingHorizontal: 10,
     paddingVertical: 4,
     borderRadius: 8,
     borderWidth: 1,
     borderColor: 'rgba(61, 220, 132, 0.3)'
  },
  proBadgeText: {
     color: '#3DDC84',
     fontWeight: '700',
     fontSize: 11,
     letterSpacing: 0.5
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8D9F96',
    letterSpacing: 1,
    marginTop: 20,
    marginBottom: 10,
    paddingHorizontal: 4
  },
  cardGroup: {
    backgroundColor: '#121D18',
    borderRadius: 24,
    overflow: 'hidden',
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    gap: 14,
  },
  iconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(61, 220, 132, 0.08)',
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
    fontSize: 13,
    color: '#8D9F96',
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.04)',
    marginLeft: 68,
  },
  actionBadge: {
    backgroundColor: '#1E2C26',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
  },
  actionBadgeText: {
    color: '#3DDC84',
    fontSize: 13,
    fontWeight: '600',
  },
});
