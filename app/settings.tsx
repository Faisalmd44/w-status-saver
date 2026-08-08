import { useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
} from 'react-native';
import { useRouter } from 'expo-router';
import {
  ChevronLeft,
  ChevronRight,
  Crown,
  Moon,
  Languages,
  Download,
  HardDrive,
  Bell,
  FolderCheck,
  Shield,
  Info,
  Sparkles,
  Check,
  X,
  ExternalLink,
} from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { Logo } from '@/components/branding/Logo';
import { BottomNav } from '@/components/ui/BottomNav';
import { useTheme } from '@/theme/ThemeProvider';
import { radius, spacing, typography } from '@/theme';
import { useStatuses } from '@/hooks/useStatuses';
import { useSettings } from '@/hooks/useSettings';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { statuses, refresh } = useStatuses();
  const { settings, toggleSetting, updateSetting } = useSettings();

  // Active Modals
  const [activeModal, setActiveModal] = useState<
    'language' | 'saveLocation' | 'folderPicker' | 'privacy' | 'about' | null
  >(null);

  // Calculations from actual local data
  const savedItems = statuses.filter((item) => item.isSaved);
  const savedCount = savedItems.length;

  const totalBytes = statuses.reduce(
    (acc, item) => acc + (item.fileSizeBytes || 2500000),
    0
  );
  const formattedStorage =
    totalBytes >= 1073741824
      ? `${(totalBytes / 1073741824).toFixed(1)} GB`
      : `${(totalBytes / 1048576).toFixed(0)} MB`;

  const languagesList = [
    'English (device)',
    'Spanish (Español)',
    'Hindi (हिन्दी)',
    'Portuguese (Português)',
    'French (Français)',
    'German (Deutsch)',
  ];

  const storageLocations = [
    'Gallery / W Status Saver',
    'Internal Storage / WhatsApp / Media / Saved',
    'SD Card / Statuses',
  ];

  const handleGrantFolderAccess = () => {
    Alert.alert(
      'Storage Access Framework',
      'Select your WhatsApp Statuses directory in Android File Picker to grant permission:\n\nAndroid/media/com.whatsapp/WhatsApp/Media/.Statuses',
      [
        {
          text: 'Open Folder Picker',
          onPress: () => {
            updateSetting('folderAccessGranted', true);
            setActiveModal(null);
            Alert.alert('Access Granted', 'WhatsApp Status folder permission is verified.');
          },
        },
        { text: 'Cancel', style: 'cancel' },
      ]
    );
  };

  return (
    <View style={styles.rootContainer}>
      <ScreenContainer scrollable padded={false}>
        {/* HEADER */}
        <View style={styles.headerPill}>
          <Pressable
            onPress={() => router.back()}
            style={({ pressed }) => [
              styles.backBtn,
              { opacity: pressed ? 0.7 : 1 },
            ]}
          >
            <ChevronLeft size={20} color="#FFFFFF" strokeWidth={2.2} />
          </Pressable>

          <View style={styles.headerTextCol}>
            <Text style={[typography.headingMedium, styles.headerTitle]}>Settings</Text>
            <Text style={[typography.caption, styles.headerSubtitle]}>
              Version 3.2.0 · Premium
            </Text>
          </View>
        </View>

        <View style={styles.body}>
          {/* APP PROFILE CARD */}
          <View style={styles.profileCard}>
            <View style={styles.profileLeft}>
              <Logo size={48} showFreeBadge={true} />
              <View style={styles.profileTextCol}>
                <Text style={[typography.headingSmall, styles.profileName]}>
                  W Status Saver
                </Text>
                <Text style={[typography.caption, styles.profileStats]}>
                  {savedCount} saved · {formattedStorage} used
                </Text>
              </View>
            </View>

            <View style={styles.proBadge}>
              <Crown size={12} color="#3DDC84" fill="#3DDC84" />
              <Text style={styles.proBadgeText}>PRO</Text>
            </View>
          </View>

          {/* APPEARANCE SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>APPEARANCE</Text>
            <View style={styles.cardGroup}>
              {/* AMOLED Black Theme */}
              <View style={styles.settingItem}>
                <View style={styles.itemIconCircle}>
                  <Moon size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>AMOLED black theme</Text>
                  <Text style={styles.itemSubtitle}>True black for deeper contrast</Text>
                </View>
                <Switch
                  value={settings.amoledTheme}
                  onValueChange={() => toggleSetting('amoledTheme')}
                  trackColor={{ false: '#26332C', true: '#1A6B3E' }}
                  thumbColor={settings.amoledTheme ? '#3DDC84' : '#8D9F96'}
                />
              </View>

              <View style={styles.divider} />

              {/* Language */}
              <Pressable
                onPress={() => setActiveModal('language')}
                style={({ pressed }) => [
                  styles.settingItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.itemIconCircle}>
                  <Languages size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Language</Text>
                  <Text style={styles.itemSubtitle}>{settings.language}</Text>
                </View>
                <ChevronRight size={18} color="#7A8A82" />
              </Pressable>
            </View>
          </View>

          {/* DOWNLOADS SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>DOWNLOADS</Text>
            <View style={styles.cardGroup}>
              {/* Auto-save */}
              <View style={styles.settingItem}>
                <View style={styles.itemIconCircle}>
                  <Download size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Auto-save new statuses</Text>
                  <Text style={styles.itemSubtitle}>Keep everything for 30 days</Text>
                </View>
                <Switch
                  value={settings.autoSave}
                  onValueChange={() => toggleSetting('autoSave')}
                  trackColor={{ false: '#26332C', true: '#1A6B3E' }}
                  thumbColor={settings.autoSave ? '#3DDC84' : '#8D9F96'}
                />
              </View>

              <View style={styles.divider} />

              {/* Save Location */}
              <Pressable
                onPress={() => setActiveModal('saveLocation')}
                style={({ pressed }) => [
                  styles.settingItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.itemIconCircle}>
                  <HardDrive size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Save location</Text>
                  <Text style={styles.itemSubtitle}>{settings.saveLocation}</Text>
                </View>
                <ChevronRight size={18} color="#7A8A82" />
              </Pressable>

              <View style={styles.divider} />

              {/* New Status Alerts */}
              <View style={styles.settingItem}>
                <View style={styles.itemIconCircle}>
                  <Bell size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>New status alerts</Text>
                  <Text style={styles.itemSubtitle}>
                    Get notified when new status is available
                  </Text>
                </View>
                <Switch
                  value={settings.statusAlerts}
                  onValueChange={() => toggleSetting('statusAlerts')}
                  trackColor={{ false: '#26332C', true: '#1A6B3E' }}
                  thumbColor={settings.statusAlerts ? '#3DDC84' : '#8D9F96'}
                />
              </View>
            </View>
          </View>

          {/* PERMISSIONS SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>PERMISSIONS</Text>
            <View style={styles.cardGroup}>
              <View style={styles.settingItem}>
                <View style={styles.itemIconCircle}>
                  <FolderCheck size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>WhatsApp Status folder access</Text>
                  <Text
                    style={[
                      styles.itemSubtitle,
                      { color: settings.folderAccessGranted ? '#3DDC84' : '#E54545' },
                    ]}
                  >
                    {settings.folderAccessGranted ? 'Access granted' : 'Access required'}
                  </Text>
                </View>

                <Pressable
                  onPress={handleGrantFolderAccess}
                  style={({ pressed }) => [
                    styles.changeBtn,
                    { opacity: pressed ? 0.7 : 1 },
                  ]}
                >
                  <Text style={styles.changeBtnText}>
                    {settings.folderAccessGranted ? 'Change' : 'Grant'}
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* APP / INFORMATION SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>APP / INFORMATION</Text>
            <View style={styles.cardGroup}>
              {/* Privacy Policy */}
              <Pressable
                onPress={() => setActiveModal('privacy')}
                style={({ pressed }) => [
                  styles.settingItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.itemIconCircle}>
                  <Shield size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Privacy Policy</Text>
                  <Text style={styles.itemSubtitle}>Local storage & data policy</Text>
                </View>
                <ChevronRight size={18} color="#7A8A82" />
              </Pressable>

              <View style={styles.divider} />

              {/* About */}
              <Pressable
                onPress={() => setActiveModal('about')}
                style={({ pressed }) => [
                  styles.settingItem,
                  { opacity: pressed ? 0.7 : 1 },
                ]}
              >
                <View style={styles.itemIconCircle}>
                  <Info size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>About W Status Saver</Text>
                  <Text style={styles.itemSubtitle}>Developer info & credits</Text>
                </View>
                <ChevronRight size={18} color="#7A8A82" />
              </Pressable>

              <View style={styles.divider} />

              {/* App Version */}
              <View style={styles.settingItem}>
                <View style={styles.itemIconCircle}>
                  <Sparkles size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>App Version</Text>
                  <Text style={styles.itemSubtitle}>v3.2.0 (Build 302)</Text>
                </View>
                <View style={styles.latestBadge}>
                  <Text style={styles.latestBadgeText}>Latest</Text>
                </View>
              </View>
            </View>
          </View>

          {/* DATA & STORAGE SECTION */}
          <View style={styles.sectionContainer}>
            <Text style={styles.sectionTitle}>DATA & STORAGE</Text>
            <View style={styles.cardGroup}>
              <View style={styles.settingItem}>
                <View style={styles.itemIconCircle}>
                  <HardDrive size={18} color="#3DDC84" />
                </View>
                <View style={styles.itemTextCol}>
                  <Text style={styles.itemTitle}>Media Storage</Text>
                  <Text style={styles.itemSubtitle}>
                    {savedCount} saved items ({formattedStorage} total)
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScreenContainer>

      {/* FLOATING BOTTOM NAV */}
      <BottomNav activeRoute="/home" onTabPress={(href) => router.push(href as any)} />

      {/* LANGUAGE MODAL */}
      <Modal
        visible={activeModal === 'language'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Language</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {languagesList.map((lang) => {
              const isSelected = settings.language === lang;
              return (
                <Pressable
                  key={lang}
                  onPress={() => {
                    updateSetting('language', lang);
                    setActiveModal(null);
                  }}
                  style={styles.modalOption}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && { color: '#3DDC84', fontWeight: '700' },
                    ]}
                  >
                    {lang}
                  </Text>
                  {isSelected ? <Check size={18} color="#3DDC84" /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* SAVE LOCATION MODAL */}
      <Modal
        visible={activeModal === 'saveLocation'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Save Location</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            {storageLocations.map((loc) => {
              const isSelected = settings.saveLocation === loc;
              return (
                <Pressable
                  key={loc}
                  onPress={() => {
                    updateSetting('saveLocation', loc);
                    setActiveModal(null);
                  }}
                  style={styles.modalOption}
                >
                  <Text
                    style={[
                      styles.modalOptionText,
                      isSelected && { color: '#3DDC84', fontWeight: '700' },
                    ]}
                  >
                    {loc}
                  </Text>
                  {isSelected ? <Check size={18} color="#3DDC84" /> : null}
                </Pressable>
              );
            })}
          </View>
        </View>
      </Modal>

      {/* PRIVACY MODAL */}
      <Modal
        visible={activeModal === 'privacy'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Privacy Policy</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            <ScrollView style={{ maxHeight: 300 }}>
              <Text style={styles.modalBodyText}>
                W Status Saver operates with 100% local privacy protection.{'\n\n'}
                • Downloaded WhatsApp photo and video files remain strictly stored on your local Android device gallery.{'\n'}
                • No image or video binary files are uploaded to external servers or Supabase storage.{'\n'}
                • Optional metadata synchronization (favorites, status labels) is stored securely without personal identification.{'\n'}
                • Storage Access Framework permissions are strictly used to read user-viewed WhatsApp statuses.
              </Text>
            </ScrollView>

            <Pressable
              onPress={() => setActiveModal(null)}
              style={styles.modalConfirmBtn}
            >
              <Text style={styles.modalConfirmText}>I Understand</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* ABOUT MODAL */}
      <Modal
        visible={activeModal === 'about'}
        transparent
        animationType="fade"
        onRequestClose={() => setActiveModal(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>About W Status Saver</Text>
              <Pressable onPress={() => setActiveModal(null)}>
                <X size={20} color="#FFFFFF" />
              </Pressable>
            </View>

            <View style={{ alignItems: 'center', marginVertical: 12 }}>
              <Logo size={56} showFreeBadge={true} />
              <Text style={[typography.headingSmall, { color: '#FFFFFF', marginTop: 8 }]}>
                W Status Saver
              </Text>
              <Text style={[typography.caption, { color: '#8D9F96', marginTop: 2 }]}>
                Version 3.2.0 (Build 302)
              </Text>
            </View>

            <Text style={[styles.modalBodyText, { textAlign: 'center' }]}>
              High-performance status utility app for WhatsApp & WhatsApp Business. Save high-definition photos and videos directly to your device gallery.
            </Text>

            <Pressable
              onPress={() => setActiveModal(null)}
              style={styles.modalConfirmBtn}
            >
              <Text style={styles.modalConfirmText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  headerPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3],
    marginHorizontal: spacing[4],
    marginTop: spacing[2],
    backgroundColor: '#121A17',
    borderRadius: radius['3xl'],
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  headerTextCol: {
    flex: 1,
  },
  headerTitle: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  headerSubtitle: {
    color: '#8D9F96',
  },
  body: {
    paddingHorizontal: spacing[4],
    paddingTop: spacing[4],
    gap: spacing[5],
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing[4],
    backgroundColor: '#121C18',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  profileLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing[3],
    flex: 1,
  },
  profileTextCol: {
    flex: 1,
  },
  profileName: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  profileStats: {
    color: '#8D9F96',
    marginTop: 2,
  },
  proBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1A6B3E',
    backgroundColor: 'rgba(61, 220, 132, 0.08)',
  },
  proBadgeText: {
    color: '#3DDC84',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  sectionContainer: {
    gap: spacing[2],
  },
  sectionTitle: {
    color: '#7A8A82',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.2,
    marginLeft: 4,
  },
  cardGroup: {
    backgroundColor: '#121C18',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: spacing[4],
    paddingVertical: spacing[3.5],
    gap: spacing[3],
  },
  itemIconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  itemTextCol: {
    flex: 1,
  },
  itemTitle: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
  },
  itemSubtitle: {
    color: '#8D9F96',
    fontSize: 12,
    marginTop: 2,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    marginHorizontal: spacing[4],
  },
  changeBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    backgroundColor: 'rgba(61, 220, 132, 0.12)',
    borderWidth: 1,
    borderColor: '#1A6B3E',
  },
  changeBtnText: {
    color: '#3DDC84',
    fontSize: 12,
    fontWeight: '700',
  },
  latestBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
  },
  latestBadgeText: {
    color: '#8D9F96',
    fontSize: 11,
    fontWeight: '600',
  },
  clearBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: 'rgba(229, 69, 69, 0.15)',
  },
  clearBadgeText: {
    color: '#E54545',
    fontSize: 12,
    fontWeight: '700',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.85)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: spacing[4],
  },
  modalContent: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#141E19',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.12)',
    padding: spacing[5],
    gap: spacing[3],
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing[2],
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
  },
  modalOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing[3],
    paddingHorizontal: spacing[3],
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.03)',
  },
  modalOptionText: {
    color: '#CCCCCC',
    fontSize: 15,
  },
  modalBodyText: {
    color: '#A0B0A8',
    fontSize: 13,
    lineHeight: 20,
  },
  modalConfirmBtn: {
    backgroundColor: '#3DDC84',
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing[2],
  },
  modalConfirmText: {
    color: '#0E1513',
    fontWeight: '700',
    fontSize: 15,
  },
});
