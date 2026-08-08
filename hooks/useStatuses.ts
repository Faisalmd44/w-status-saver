import { useCallback, useEffect, useState } from 'react';
import { Alert } from 'react-native';
import { useRouter } from 'expo-router';
import {
  StatusMetadataItem,
  loadFavoritesSet,
  loadSavedRecords,
  saveFavoritesSet,
  scanWhatsAppStatuses,
  saveStatusCopy,
  deleteSavedStatusCopy,
  processAutoSave,
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
      id: rec.id,
      type: rec.type,
      uri: rec.savedUri,
      savedUri: rec.savedUri,
      mediaLibraryAssetId: rec.mediaLibraryAssetId,
      sender: rec.sender,
      time: rec.time,
      isSaved: true,
      isFavorite: favSet.has(rec.id),
      fileSizeBytes: rec.fileSizeBytes,
      modifiedTimestamp: rec.savedAt,
    }));

    setSavedStatuses(savedItems);
  }, []);

  const scanFolder = useCallback(async () => {
    setIsLoading(true);
    const settings = loadSettings();

    if (!settings.folderAccessGranted || !settings.safUri) {
      setStatuses([]);
      syncSavedList();
      setIsLoading(false);
      return;
    }

    const { statuses: scanned, permissionError } = await scanWhatsAppStatuses(
      settings.safUri
    );

    if (permissionError) {
      // SAF Permission lost or revoked - send user to folder access screen
      saveSettings({
        ...settings,
        folderAccessGranted: false,
        safUri: '',
      });
      setStatuses([]);
      syncSavedList();
      setIsLoading(false);
      router.replace('/folder-access');
      return;
    }

    let finalScanned = scanned;

    // Process auto-save if setting enabled
    if (settings.autoSave && scanned.length > 0) {
      finalScanned = await processAutoSave(scanned);
    }

    setStatuses(finalScanned);
    syncSavedList();
    setIsLoading(false);
  }, [router, syncSavedList]);

  useEffect(() => {
    let isMounted = true;

    const executeScan = async () => {
      setIsLoading(true);
      const settings = loadSettings();

      if (!settings.folderAccessGranted || !settings.safUri) {
        if (isMounted) {
          setStatuses([]);
          syncSavedList();
          setIsLoading(false);
        }
        return;
      }

      const { statuses: scanned, permissionError } = await scanWhatsAppStatuses(
        settings.safUri
      );

      if (!isMounted) return;

      if (permissionError) {
        saveSettings({
          ...settings,
          folderAccessGranted: false,
          safUri: '',
        });
        if (isMounted) {
          setStatuses([]);
          syncSavedList();
          setIsLoading(false);
        }
        router.replace('/folder-access');
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

    return () => {
      isMounted = false;
    };
  }, [router, syncSavedList]);

  const toggleSave = useCallback(
    async (idOrItem: string | StatusMetadataItem) => {
      let targetItem: StatusMetadataItem | undefined;
      if (typeof idOrItem === 'string') {
        targetItem =
          statuses.find((s) => s.id === idOrItem) ||
          savedStatuses.find((s) => s.id === idOrItem);
      } else {
        targetItem = idOrItem;
      }

      if (!targetItem) return;

      if (!targetItem.isSaved) {
        // SAVE STATUS
        try {
          const record = await saveStatusCopy(targetItem);
          setStatuses((prev) =>
            prev.map((item) =>
              item.id === targetItem!.id
                ? {
                    ...item,
                    isSaved: true,
                    savedUri: record.savedUri,
                    mediaLibraryAssetId: record.mediaLibraryAssetId,
                  }
                : item
            )
          );
          syncSavedList();
        } catch (err) {
          Alert.alert('Save Failed', 'Could not copy status to saved gallery.');
        }
      } else {
        // PROMPT DELETE CONFIRMATION BEFORE DELETING SAVED COPY
        Alert.alert(
          'Delete saved status?',
          'Remove this saved copy from W Status Saver? The original WhatsApp status will not be affected.',
          [
            { text: 'Cancel', style: 'cancel' },
            {
              text: 'Delete',
              style: 'destructive',
              onPress: async () => {
                await deleteSavedStatusCopy(targetItem!);
                setStatuses((prev) =>
                  prev.map((item) =>
                    item.id === targetItem!.id
                      ? { ...item, isSaved: false, savedUri: undefined }
                      : item
                  )
                );
                syncSavedList();
              },
            },
          ]
        );
      }
    },
    [statuses, savedStatuses, syncSavedList]
  );

  const confirmAndDeleteSaved = useCallback(
    (item: StatusMetadataItem, onSuccess?: () => void) => {
      Alert.alert(
        'Delete saved status?',
        'Remove this saved copy from W Status Saver? The original WhatsApp status will not be affected.',
        [
          { text: 'Cancel', style: 'cancel' },
          {
            text: 'Delete',
            style: 'destructive',
            onPress: async () => {
              await deleteSavedStatusCopy(item);
              setStatuses((prev) =>
                prev.map((s) =>
                  s.id === item.id ? { ...s, isSaved: false, savedUri: undefined } : s
                )
              );
              syncSavedList();
              if (onSuccess) onSuccess();
            },
          },
        ]
      );
    },
    [syncSavedList]
  );

  const toggleFavorite = useCallback((id: string) => {
    const favSet = loadFavoritesSet();
    const isFav = favSet.has(id);
    if (isFav) {
      favSet.delete(id);
    } else {
      favSet.add(id);
    }
    saveFavoritesSet(favSet);

    setStatuses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !isFav } : item
      )
    );
    setSavedStatuses((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, isFavorite: !isFav } : item
      )
    );
  }, []);

  const saveAll = useCallback(async () => {
    const unsaved = statuses.filter((s) => !s.isSaved);
    for (const item of unsaved) {
      try {
        await saveStatusCopy(item);
      } catch (err) {
        console.warn('Save all error for item:', item.id, err);
      }
    }
    setStatuses((prev) => prev.map((item) => ({ ...item, isSaved: true })));
    syncSavedList();
  }, [statuses, syncSavedList]);

  return {
    statuses,
    savedStatuses,
    isLoading,
    refresh: scanFolder,
    toggleSave,
    confirmAndDeleteSaved,
    toggleFavorite,
    saveAll,
  };
}
