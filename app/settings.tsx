import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Switch, Pressable, ScrollView, Platform, Modal, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as FileSystem from 'expo-file-system';
import { 
  ChevronLeft, Download, HardDrive, Bell, Folder, 
  ShieldCheck, Info, Sparkles, ChevronRight, X 
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { loadSettings, saveSettings, AppSettings } from '@/lib/settingsService';
import { useStatuses } from '@/hooks/useStatuses';

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
  const formattedStorage = (totalBytes / (1024 * 1024)).toFixed(1);

  return (
    <ScreenContainer scrollable={false} padded={false}>
      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => router.back()}>
          <ChevronLeft size={24} color="#FFFFFF" />
        </Pressable>
        <Text style={styles.headerTitle}>Settings</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody} showsVerticalScrollIndicator={false}>
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

        {/* APP / INFORMATION */}
        <Text style={styles.sectionTitle}>APP / INFORMATION</Text>
        <View style={styles.cardGroup}>
          <Pressable style={styles.cardRow} onPress={() => setPrivacyModalVisible(true)}>
            <View style={styles.iconBox}>
              <ShieldCheck size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>Privacy Policy</Text>
              <Text style={styles.itemSub}>Local storage & data policy</Text>
            </View>
            <ChevronRight size={18} color="#8D9F96" />
          </Pressable>

          <View style={styles.divider} />

          <Pressable style={styles.cardRow} onPress={() => setAboutModalVisible(true)}>
            <View style={styles.iconBox}>
              <Info size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>About W Status Saver</Text>
              <Text style={styles.itemSub}>Developer info & credits</Text>
            </View>
            <ChevronRight size={18} color="#8D9F96" />
          </Pressable>

          <View style={styles.divider} />

          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <Sparkles size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>App Version</Text>
            </View>
            <View style={styles.versionBadge}>
              <Text style={styles.versionBadgeText}>Latest</Text>
            </View>
          </View>
        </View>

        {/* DATA & STORAGE */}
        <Text style={styles.sectionTitle}>DATA & STORAGE</Text>
        <View style={styles.cardGroup}>
          <View style={styles.cardRow}>
            <View style={styles.iconBox}>
              <HardDrive size={20} color="#3DDC84" />
            </View>
            <View style={styles.rowTextCol}>
              <Text style={styles.itemTitle}>Media Storage</Text>
              <Text style={styles.itemSub}>{savedItems.length} saved items ({formattedStorage} MB total)</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* ABOUT MODAL */}
      <Modal visible={aboutModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About W Status Saver</Text>
              <Pressable onPress={() => setAboutModalVisible(false)}>
                <X size={20} color="#8D9F96" />
              </Pressable>
            </View>
            <Text style={styles.modalText}>
              High-performance status utility app for WhatsApp & WhatsApp Business. Save high-definition photos and videos directly to your device gallery.
            </Text>
          </View>
        </View>
      </Modal>

      {/* PRIVACY MODAL */}
      <Modal visible={privacyModalVisible} transparent animationType="fade">
        <View style={styles.modalBg}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <Pressable onPress={() => setPrivacyModalVisible(false)}>
                <X size={20} color="#8D9F96" />
              </Pressable>
            </View>
            <Text style={styles.modalText}>
              W Status Saver operates with 100% local privacy protection. Personal chats, messages, and contacts are never accessed or uploaded. Storage access permissions are used strictly to read viewed WhatsApp status files.
            </Text>
          </View>
        </View>
      </Modal>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  scrollBody: {
    padding: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#8D9F96',
    letterSpacing: 1,
    marginTop: 18,
    marginBottom: 8,
  },
  cardGroup: {
    backgroundColor: '#121D18',
    borderRadius: 20,
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
    fontSize: 12,
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
  versionBadge: {
    backgroundColor: '#1E2C26',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  versionBadgeText: {
    color: '#8D9F96',
    fontSize: 12,
  },
  modalBg: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    padding: 20,
  },
  modalContent: {
    backgroundColor: '#121D18',
    borderRadius: 20,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  modalText: {
    fontSize: 14,
    color: '#8D9F96',
    lineHeight: 22,
  },
});
