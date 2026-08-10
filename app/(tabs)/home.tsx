import { useState, useMemo, useEffect, useRef } from 'react';
import { Image, Pressable, RefreshControl, ScrollView, StyleSheet, Text, TextInput, View, Switch, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { Download, Heart, Play, RefreshCw, Check, Search, Settings, X, FolderSearch, Flame, HardDrive, MessageSquarePlus, Share2, ShieldCheck } from 'lucide-react-native';
import { ScreenContainer } from '@/components/ui/ScreenContainer';
import { StatusViewerModal } from '@/components/ui/StatusViewerModal';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, typography } from '@/theme';
import { useStatuses } from '@/hooks/useStatuses';
import { StatusMetadataItem } from '@/lib/statusService';
import { Logo } from '@/components/branding/Logo';

export default function HomeScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { statuses, savedStatuses, toggleSave, toggleFavorite, refresh } = useStatuses();

  const [activeFilter, setActiveFilter] = useState<'all' | 'image' | 'video'>('all');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<StatusMetadataItem | null>(null);
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);

  // FIX: Entrance Animation (Fade + Slide Up)
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 600, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 600, useNativeDriver: true })
    ]).start();
  }, []);

  const filteredStatuses = statuses.filter((item) => {
    if (activeFilter !== 'all' && item.type !== activeFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return item.sender.toLowerCase().includes(q) || item.type.toLowerCase().includes(q);
    }
    return true;
  });

  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refresh();
    setTimeout(() => setIsRefreshing(false), 300);
  };

  const savedCount = savedStatuses.length;
  const totalBytes = savedStatuses.reduce((acc, curr) => acc + (curr.fileSizeBytes || 0), 0);
  const storageText = totalBytes > 0 ? (totalBytes / (1024 * 1024 * 1024)).toFixed(1) + ' GB' : '0.0 MB';

  const recentContacts = useMemo(() => {
    const contactMap = new Map();
    statuses.forEach(s => {
      if (!contactMap.has(s.sender)) {
        contactMap.set(s.sender, { count: 1, uri: s.uri });
      } else {
        contactMap.get(s.sender).count += 1;
      }
    });
    return Array.from(contactMap.entries()).slice(0, 8).map(([sender, c]) => ({
      ...c,
      name: sender,
    }));
  }, [statuses]);

  return (
    <ScreenContainer scrollable padded={false} refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} colors={['#3DDC84']} tintColor={'#3DDC84'} />}>
      <Animated.View style={[styles.body, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        
        {/* HEADER */}
        <View style={styles.premiumHeader}>
          <View style={styles.headerLeft}>
            <View style={{ marginRight: 10 }}><Logo size={42} /></View>
            <View>
              <View style={styles.brandRow}>
                <Text style={styles.brandTitle}><Text style={{color: '#3DDC84'}}>W</Text> Status Saver</Text>
              </View>
              <Text style={styles.brandSubtitle}>{statuses.length} new statuses today</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <Pressable style={styles.iconBtn} onPress={() => setShowSearch(!showSearch)}>
              <Search size={20} color="#FFFFFF" />
            </Pressable>
            <Pressable style={styles.iconBtn} onPress={() => router.push('/settings')}>
              <Settings size={20} color="#FFFFFF" />
            </Pressable>
          </View>
        </View>

        {showSearch && (
          <View style={styles.searchBarContainer}>
            <Search size={18} color="#8D9F96" />
            <TextInput value={searchQuery} onChangeText={setSearchQuery} placeholder="Search statuses..." placeholderTextColor="#8D9F96" style={styles.searchInput} autoFocus />
            {searchQuery ? (<Pressable onPress={() => setSearchQuery('')}><X size={18} color="#8D9F96" /></Pressable>) : null}
          </View>
        )}

        {/* STATS */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <View style={styles.statIconWrapStreak}><Flame size={16} color="#3DDC84" /></View>
            <Text style={styles.statValue}>7d</Text>
            <Text style={styles.statLabel}>Streak</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconWrapSaved}><Download size={16} color="#3DDC84" /></View>
            <Text style={styles.statValue}>{savedCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statCard}>
            <View style={styles.statIconWrapStorage}><HardDrive size={16} color="#3DDC84" /></View>
            <Text style={styles.statValue}>{storageText}</Text>
            <Text style={styles.statLabel}>Storage</Text>
          </View>
        </View>

        {/* RECENT CONTACTS */}
        {recentContacts.length > 0 && (
          <View style={styles.contactsSection}>
            <Text style={styles.sectionHeading}>RECENT CONTACTS</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contactsScroll}>
              {recentContacts.map((contact, index) => (
                <View key={index} style={styles.contactItem}>
                  <View style={styles.contactAvatarWrap}>
                    <Image source={{ uri: contact.uri }} style={styles.contactAvatar} />
                    <View style={styles.contactBadge}><Text style={styles.contactBadgeText}>{contact.count}</Text></View>
                  </View>
                  <Text style={styles.contactName} numberOfLines={1}>{contact.name}</Text>
                </View>
              ))}
            </ScrollView>
          </View>
        )}

        {/* AUTO SAVE */}
        <View style={styles.autoSaveBanner}>
          <View style={styles.autoSaveIcon}>
            <Play size={20} color="#3DDC84" fill="#3DDC84" />
          </View>
          <View style={styles.autoSaveTexts}>
            <Text style={styles.autoSaveTitle}>Auto-save is {autoSaveEnabled ? 'on' : 'off'}</Text>
            <Text style={styles.autoSaveSub}>New statuses are kept for 30 days automatically.</Text>
          </View>
          <Switch value={autoSaveEnabled} onValueChange={setAutoSaveEnabled} trackColor={{ false: '#1A2421', true: 'rgba(61, 220, 132, 0.4)' }} thumbColor={autoSaveEnabled ? '#3DDC84' : '#8D9F96'} />
        </View>

        <View style={styles.newTodayHeader}>
          <Text style={styles.sectionHeading}>NEW TODAY</Text>
          <Text style={styles.seeAllText}>See all</Text>
        </View>

        {filteredStatuses.length === 0 ? (
          <View style={styles.emptyContainer}>
            <FolderSearch size={44} color="#3DDC84" />
            <Text style={styles.emptyTitle}>No new statuses</Text>
            <Text style={styles.emptySubtitle}>View WhatsApp statuses first, then tap Refresh.</Text>
          </View>
        ) : (
          <View style={styles.mediaGrid}>
            {filteredStatuses.map((item, index) => {
              const isVideo = item.type === 'video' || item.uri.toLowerCase().endsWith('.mp4');
              const sizeLabel = item.fileSizeBytes ? (item.fileSizeBytes / (1024 * 1024)).toFixed(1) + ' MB' : '0.1 MB';
              const displayName = item.sender;

              return (
                <Pressable key={item.id} style={styles.mediaCard} onPress={() => setSelectedStatus(item)}>
                  <Image source={{ uri: item.uri }} style={styles.mediaThumbnail} />
                  <View style={styles.mediaTopOverlay}>
                    <View style={styles.mediaSizeBadge}>
                      <Text style={styles.mediaSizeText}>{isVideo ? item.duration || '0:15' : sizeLabel}</Text>
                    </View>
                    <View style={styles.mediaActions}>
                      <Pressable onPress={() => toggleFavorite(item.id)} style={styles.mediaCircleBtn}>
                        <Heart size={14} color={item.isFavorite ? '#FF4444' : '#FFFFFF'} fill={item.isFavorite ? '#FF4444' : 'transparent'} />
                      </Pressable>
                      <Pressable onPress={() => toggleSave(item.id)} style={[styles.mediaCircleBtn, item.isSaved && { backgroundColor: '#3DDC84', borderColor: '#3DDC84' }]}>
                        {item.isSaved ? <Check size={14} color="#0A0F0D" strokeWidth={3} /> : <Download size={14} color="#FFFFFF" />}
                      </Pressable>
                    </View>
                  </View>
                  {isVideo && (
                    <View style={styles.centerPlayBtn}>
                      <Play size={20} color="#FFFFFF" fill="#FFFFFF" />
                    </View>
                  )}
                  <View style={styles.mediaBottomOverlay}>
                    <View style={styles.mediaBottomLeft}>
                      <View style={styles.miniAvatar}><Image source={{ uri: item.uri }} style={styles.miniAvatarImg} /></View>
                      <View>
                        <Text style={styles.mediaSenderName} numberOfLines={1}>{displayName}</Text>
                        <Text style={styles.mediaTime}>{item.time}</Text>
                      </View>
                    </View>
                    <Pressable style={styles.shareBtnMin}><Share2 size={14} color="#FFFFFF" /></Pressable>
                  </View>
                </Pressable>
              );
            })}
          </View>
        )}
      </Animated.View>

      <StatusViewerModal status={selectedStatus} visible={!!selectedStatus} onClose={() => setSelectedStatus(null)} onToggleSave={toggleSave} onToggleFavorite={toggleFavorite} />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  body: { paddingHorizontal: 16, paddingTop: 10, paddingBottom: 40, backgroundColor: '#0A0F0D' },
  premiumHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, backgroundColor: '#121D18', padding: 12, borderRadius: 100 },
  headerLeft: { flexDirection: 'row', alignItems: 'center', paddingLeft: 4 },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  brandTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700' },
  brandSubtitle: { color: '#8D9F96', fontSize: 12, marginTop: 2 },
  headerActions: { flexDirection: 'row', gap: 8 },
  iconBtn: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255, 255, 255, 0.05)', alignItems: 'center', justifyContent: 'center' },
  searchBarContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#121D18', paddingHorizontal: 16, height: 46, borderRadius: 23, marginBottom: 20, gap: 10 },
  searchInput: { flex: 1, fontSize: 14, color: '#FFFFFF' },
  statsRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 10, marginBottom: 24 },
  statCard: { flex: 1, backgroundColor: '#121D18', borderRadius: 24, padding: 16 },
  statIconWrapStreak: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(61, 220, 132, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  statIconWrapSaved: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(61, 220, 132, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  statIconWrapStorage: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(61, 220, 132, 0.1)', alignItems: 'center', justifyContent: 'center', marginBottom: 16 },
  statValue: { color: '#FFFFFF', fontSize: 20, fontWeight: '800', marginBottom: 2 },
  statLabel: { color: '#8D9F96', fontSize: 12, fontWeight: '500' },
  sectionHeading: { color: '#8D9F96', fontSize: 12, fontWeight: '700', letterSpacing: 1.2, marginBottom: 16, marginLeft: 4 },
  contactsSection: { marginBottom: 24 },
  contactsScroll: { gap: 16, paddingRight: 20 },
  contactItem: { alignItems: 'center', width: 66 },
  contactAvatarWrap: { position: 'relative', marginBottom: 8 },
  contactAvatar: { width: 62, height: 62, borderRadius: 31, borderWidth: 2, borderColor: '#3DDC84', backgroundColor: '#121D18' },
  contactBadge: { position: 'absolute', bottom: -2, right: -2, backgroundColor: '#0A0F0D', width: 22, height: 22, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  contactBadgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  contactName: { color: '#A0AEA6', fontSize: 12, fontWeight: '500', textAlign: 'center' },
  autoSaveBanner: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#121D18', padding: 16, borderRadius: 24, marginBottom: 30, gap: 12 },
  autoSaveIcon: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(61, 220, 132, 0.1)', alignItems: 'center', justifyContent: 'center' },
  autoSaveTexts: { flex: 1 },
  autoSaveTitle: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginBottom: 3 },
  autoSaveSub: { color: '#8D9F96', fontSize: 12, lineHeight: 18, paddingRight: 10 },
  newTodayHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingHorizontal: 4 },
  seeAllText: { color: '#3DDC84', fontSize: 13, fontWeight: '600' },
  mediaGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  mediaCard: { width: '48%', height: 260, borderRadius: 24, backgroundColor: '#121D18', overflow: 'hidden', position: 'relative' },
  mediaThumbnail: { width: '100%', height: '100%', resizeMode: 'cover' },
  mediaTopOverlay: { position: 'absolute', top: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', padding: 10 },
  mediaSizeBadge: { backgroundColor: 'rgba(0, 0, 0, 0.5)', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  mediaSizeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '700' },
  mediaActions: { flexDirection: 'row', gap: 6 },
  mediaCircleBtn: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(0, 0, 0, 0.5)', alignItems: 'center', justifyContent: 'center' },
  centerPlayBtn: { position: 'absolute', top: '50%', left: '50%', transform: [{ translateX: -24 }, { translateY: -24 }], width: 48, height: 48, borderRadius: 24, backgroundColor: 'rgba(0,0,0,0.6)', alignItems: 'center', justifyContent: 'center' },
  mediaBottomOverlay: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', backgroundColor: 'rgba(0,0,0,0.4)' },
  mediaBottomLeft: { flexDirection: 'row', alignItems: 'center', gap: 8, flex: 1 },
  miniAvatar: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#FFFFFF', overflow: 'hidden' },
  miniAvatarImg: { width: '100%', height: '100%' },
  mediaSenderName: { color: '#FFFFFF', fontSize: 13, fontWeight: '700', marginBottom: 2 },
  mediaTime: { color: '#A0AEA6', fontSize: 10 },
  shareBtnMin: { width: 32, height: 32, borderRadius: 16, backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center' },
  emptyContainer: { padding: 40, alignItems: 'center', backgroundColor: '#121D18', borderRadius: 24 },
  emptyTitle: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 16 },
  emptySubtitle: { color: '#8D9F96', fontSize: 14, textAlign: 'center', marginTop: 8, lineHeight: 22 },
});
