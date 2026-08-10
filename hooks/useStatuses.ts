import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  StatusMetadataItem, loadFavoritesSet, loadSavedRecords, saveFavoritesSet,
  scanWhatsAppStatuses, saveStatusCopy, deleteSavedStatusCopy, processAutoSave,
} from '@/lib/statusService';
import { loadSettings, saveSettings } from '@/lib/settingsService';

export function useStatuses() {
  const router = useRouter();
  const [statuses, setStatuses] = useState<StatusMetadataItem[]>([]);
  const [savedStatuses, setSavedStatuses] = useState<StatusMetadataItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const syncSavedList = useCallback(() => {
    const savedRecords = loadSavedRecords();
    const favSet = loadFavoritesSet();

    const savedItems: StatusMetadataItem[] = savedRecords.map((rec) => ({
      id: rec.id, type: rec.type, uri: rec.savedUri, savedUri: rec.savedUri,
      mediaLibraryAssetId: rec.mediaLibraryAssetId, sender: rec.sender, time: rec.time,
      isSaved: true, isFavorite: favSet.has(rec.id), fileSizeBytes: rec.fileSizeBytes,
      modifiedTimestamp: rec.savedAt,
    }));
    setSavedStatuses(savedItems);
  }, []);

  const scanFolder = useCallback(async () => {
    setIsLoading(true);
    const settings = loadSettings();

    if (!settings.folderAccessGranted || !settings.safUri) {
      setStatuses([]); syncSavedList(); setIsLoading(false);
      return;
    }

    const { statuses: scanned, permissionError } = await scanWhatsAppStatuses(settings.safUri);

    // FIX: Removed aggressive redirect logic. If permission fails temporarily, we just show empty states, not loop.
    if (permissionError) {
      setStatuses([]); syncSavedList(); setIsLoading(false);
      return;
    }

    let finalScanned = scanned;
    if (settings.autoSave && scanned.length > 0) {
      finalScanned = await processAutoSave(scanned);
    }

    setStatuses(finalScanned);
    syncSavedList();
    setIsLoading(false);
  }, [syncSavedList]);

  useEffect(() => {
    let isMounted = true;
    const executeScan = async () => {
      setIsLoading(true);
      const settings = loadSettings();

      if (!settings.folderAccessGranted || !settings.safUri) {
        if (isMounted) { setStatuses([]); syncSavedList(); setIsLoading(false); }
        return;
      }

      const { statuses: scanned, permissionError } = await scanWhatsAppStatuses(settings.safUri);
      if (!isMounted) return;

      // FIX: Removed aggressive redirect logic here as well.
      if (permissionError) {
        if (isMounted) { setStatuses([]); syncSavedList(); setIsLoading(false); }
        return;
      }

      let finalScanned = scanned;
      if (settings.autoSave && scanned.length > 0) {
        finalScanned = await processAutoSave(scanned);
      }

      if (isMounted) {
        setStatuses(finalScanned);
        syncSavedList();
        setIsLoading(false);
      }
    };

    executeScan();
    return () => { isMounted = false; };
  }, [syncSavedList]);

  const toggleSave = useCallback(
    async (idOrItem: string | StatusMetadataItem) => {
      let targetItem = typeof idOrItem === 'string'
          ? statuses.find((s) => s.id === idOrItem) || savedStatuses.find((s) => s.id === idOrItem)
          : idOrItem;
      if (!targetItem) return;

      if (!targetItem.isSaved) {
        try {
          const record = await saveStatusCopy(targetItem);
          setStatuses((prev) => prev.map((item) => item.id === targetItem!.id ? { ...item, isSaved: true, savedUri: record.savedUri, mediaLibraryAssetId: record.mediaLibraryAssetId } : item ));
          syncSavedList();
        } catch (err) { Alert.alert('Save Failed', 'Could not copy status to saved gallery.'); }
      } else {
        Alert.alert('Delete saved status?', 'Remove this saved copy from W Status Saver?', [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Delete', style: 'destructive', onPress: async () => {
              await deleteSavedStatusCopy(targetItem!);
              setStatuses((prev) => prev.map((item) => item.id === targetItem!.id ? { ...item, isSaved: false, savedUri: undefined } : item ));
              syncSavedList();
            }
          }
        ]);
      }
    }, [statuses, savedStatuses, syncSavedList]
  );

  const confirmAndDeleteSaved = useCallback(
    (item: StatusMetadataItem, onSuccess?: () => void) => {
      Alert.alert('Delete saved status?', 'Remove this saved copy from W Status Saver?', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: async () => {
            await deleteSavedStatusCopy(item);
            setStatuses((prev) => prev.map((s) => s.id === item.id ? { ...s, isSaved: false, savedUri: undefined } : s ));
            syncSavedList();
            if (onSuccess) onSuccess();
          }
        }
      ]);
    }, [syncSavedList]
  );

  const toggleFavorite = useCallback((id: string) => {
    const favSet = loadFavoritesSet();
    const isFav = favSet.has(id);
    if (isFav) { favSet.delete(id); } else { favSet.add(id); }
    saveFavoritesSet(favSet);
    setStatuses((prev) => prev.map((item) => item.id === id ? { ...item, isFavorite: !isFav } : item ));
    setSavedStatuses((prev) => prev.map((item) => item.id === id ? { ...item, isFavorite: !isFav } : item ));
  }, []);

  const saveAll = useCallback(async () => {
    const unsaved = statuses.filter((s) => !s.isSaved);
    for (const item of unsaved) { try { await saveStatusCopy(item); } catch (err) {} }
    setStatuses((prev) => prev.map((item) => ({ ...item, isSaved: true })));
    syncSavedList();
  }, [statuses, syncSavedList]);

  return { statuses, savedStatuses, isLoading, refresh: scanFolder, toggleSave, confirmAndDeleteSaved, toggleFavorite, saveAll };
}
