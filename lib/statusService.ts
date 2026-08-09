import * as FileSystem from 'expo-file-system';
import { Platform } from 'react-native';
import { safeCustomStorage } from './supabase';

let mediaLibraryModule: any = null;
let mediaLibraryAttempted = false;

function getMediaLibrary() {
  if (Platform.OS === 'web') return null;
  if (!mediaLibraryAttempted) {
    mediaLibraryAttempted = true;
    try {
      mediaLibraryModule = require('expo-media-library');
    } catch (err) {
      console.warn('MediaLibrary module not available:', err);
      mediaLibraryModule = null;
    }
  }
  return mediaLibraryModule;
}

export interface StatusMetadataItem {
  id: string;
  type: 'image' | 'video';
  uri: string; // Original SAF URI or local path
  savedUri?: string; // Local saved file URI if saved
  mediaLibraryAssetId?: string;
  sender: string; // 'WhatsApp Status' or 'WhatsApp Business'
  time: string; // Relative time string e.g. '10m ago'
  duration?: string;
  isSaved: boolean;
  isFavorite: boolean;
  fileSizeBytes?: number;
  modifiedTimestamp?: number;
}

export interface SavedRecord {
  id: string;
  originalUri: string;
  savedUri: string;
  mediaLibraryAssetId?: string;
  type: 'image' | 'video';
  sender: string;
  time: string;
  fileSizeBytes: number;
  savedAt: number;
}

const SAVED_DIR = `${(FileSystem as any).documentDirectory || ''}saved_statuses/`;
const SAVED_RECORDS_KEY = 'w_status_saver_saved_records_v1';
const FAVORITES_KEY = 'w_status_saver_favorites_v1';

/**
 * Load saved status records from local persistent storage.
 */
export function loadSavedRecords(): SavedRecord[] {
  try {
    const raw = safeCustomStorage.getItem(SAVED_RECORDS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.warn('Failed to load saved records:', err);
  }
  return [];
}

/**
 * Save records array to local storage.
 */
export function saveSavedRecords(records: SavedRecord[]): void {
  try {
    safeCustomStorage.setItem(SAVED_RECORDS_KEY, JSON.stringify(records));
  } catch (err) {
    console.warn('Failed to persist saved records:', err);
  }
}

/**
 * Load starred favorites set from local storage.
 */
export function loadFavoritesSet(): Set<string> {
  try {
    const raw = safeCustomStorage.getItem(FAVORITES_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return new Set<string>(parsed);
    }
  } catch (err) {
    console.warn('Failed to load favorites set:', err);
  }
  return new Set<string>();
}

/**
 * Save favorites set to local storage.
 */
export function saveFavoritesSet(favSet: Set<string>): void {
  try {
    safeCustomStorage.setItem(FAVORITES_KEY, JSON.stringify(Array.from(favSet)));
  } catch (err) {
    console.warn('Failed to persist favorites set:', err);
  }
}

/**
 * Format timestamp into human-readable relative time label.
 */
export function formatRelativeTime(timestamp: number): string {
  if (!timestamp) return 'Recent';
  const diffMs = Date.now() - timestamp;
  if (diffMs < 0) return 'Just now';
  const diffSec = Math.floor(diffMs / 1000);
  if (diffSec < 60) return 'Just now';
  const diffMin = Math.floor(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHour = Math.floor(diffMin / 60);
  if (diffHour < 24) return `${diffHour}h ago`;
  const diffDay = Math.floor(diffHour / 24);
  if (diffDay === 1) return 'Yesterday';
  return `${diffDay}d ago`;
}

/**
 * Scans WhatsApp Status folder using Android Storage Access Framework tree URI.
 */
export async function scanWhatsAppStatuses(safUri: string): Promise<{
  statuses: StatusMetadataItem[];
  permissionError: boolean;
}> {
  if (!safUri || Platform.OS !== 'android') {
    // Return saved statuses if on non-android or if safUri is missing
    const saved = loadSavedRecords();
    const favSet = loadFavoritesSet();
    const savedItems: StatusMetadataItem[] = saved.map((rec) => ({
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
    return { statuses: savedItems, permissionError: false };
  }

  try {
    const StorageAccessFramework = (FileSystem as any).StorageAccessFramework;
    if (!StorageAccessFramework) {
      return { statuses: [], permissionError: false };
    }

    let fileUris: string[] = [];

    try {
      const directFiles = await StorageAccessFramework.readDirectoryAsync(safUri);

      // Check if user granted access to parent folder containing '.Statuses'
      const statusSubFolderUri = directFiles.find((uri: string) => {
        const dec = decodeURIComponent(uri);
        return dec.includes('.Statuses');
      });

      if (statusSubFolderUri) {
        try {
          fileUris = await StorageAccessFramework.readDirectoryAsync(statusSubFolderUri);
        } catch {
          fileUris = directFiles;
        }
      } else {
        fileUris = directFiles;
      }
    } catch (e) {
      console.warn('Failed to read SAF directory:', e);
      return { statuses: [], permissionError: true };
    }

    if (!Array.isArray(fileUris)) {
      return { statuses: [], permissionError: false };
    }

    const savedRecords = loadSavedRecords();
    const savedMap = new Map<string, SavedRecord>();
    savedRecords.forEach((rec) => savedMap.set(rec.id, rec));

    const favoritesSet = loadFavoritesSet();
    const items: StatusMetadataItem[] = [];

    for (const fileUri of fileUris) {
      const decodedUri = decodeURIComponent(fileUri);
      const rawFileName = decodedUri.split('/').pop() || decodedUri.split('%2F').pop() || '';

      // Skip empty or nomedia files
      if (!rawFileName || rawFileName === '.nomedia' || rawFileName.includes('.nomedia')) {
        continue;
      }

      const lowerName = rawFileName.toLowerCase();
      let type: 'image' | 'video' | null = null;

      if (
        lowerName.includes('.jpg') ||
        lowerName.includes('.jpeg') ||
        lowerName.includes('.png') ||
        lowerName.includes('.webp') ||
        lowerName.includes('.gif')
      ) {
        type = 'image';
      } else if (
        lowerName.includes('.mp4') ||
        lowerName.includes('.3gp') ||
        lowerName.includes('.mkv') ||
        lowerName.includes('.webm') ||
        lowerName.includes('.avi') ||
        lowerName.includes('.mov')
      ) {
        type = 'video';
      }

      if (!type) continue;

      let modTimestamp = Date.now();
      let fileSizeBytes = 0;

      try {
        const info = await FileSystem.getInfoAsync(fileUri);
        if (info.exists) {
          fileSizeBytes = info.size || 0;
          if ('modificationTime' in info && typeof info.modificationTime === 'number') {
            modTimestamp = info.modificationTime * 1000;
          }
        }
      } catch {
        // Ignore fallback
      }

      const id = rawFileName;
      const sender = decodedUri.includes('com.whatsapp.w4b')
        ? 'WhatsApp Business'
        : 'WhatsApp Status';

      const savedRecord = savedMap.get(id);

      items.push({
        id,
        type,
        uri: fileUri,
        savedUri: savedRecord?.savedUri,
        mediaLibraryAssetId: savedRecord?.mediaLibraryAssetId,
        sender,
        time: formatRelativeTime(modTimestamp),
        duration: type === 'video' ? '0:15' : undefined,
        isSaved: Boolean(savedRecord),
        isFavorite: favoritesSet.has(id),
        fileSizeBytes,
        modifiedTimestamp: modTimestamp,
      });
    }

    // Sort newest statuses first
    items.sort((a, b) => (b.modifiedTimestamp || 0) - (a.modifiedTimestamp || 0));

    return { statuses: items, permissionError: false };
  } catch (error: any) {
    console.warn('SAF folder scan failed:', error);
    const errStr = String(error?.message || error).toLowerCase();
    if (
      errStr.includes('permission') ||
      errStr.includes('securityexception') ||
      errStr.includes('not accessible') ||
      errStr.includes('denied')
    ) {
      return { statuses: [], permissionError: true };
    }
    return { statuses: [], permissionError: false };
  }
}

/**
 * Saves a status copy to local device directory and MediaLibrary.
 */
export async function saveStatusCopy(item: StatusMetadataItem): Promise<SavedRecord> {
  // Ensure destination directory exists
  const dirInfo = await FileSystem.getInfoAsync(SAVED_DIR);
  if (!dirInfo.exists) {
    await FileSystem.makeDirectoryAsync(SAVED_DIR, { intermediates: true });
  }

  const destinationUri = `${SAVED_DIR}${item.id}`;

  // Copy status file from SAF URI or source URI to saved directory
  await FileSystem.copyAsync({
    from: item.uri,
    to: destinationUri,
  });

  let mediaLibraryAssetId: string | undefined;

  // Try saving to device MediaLibrary gallery
  try {
    const MediaLibrary = getMediaLibrary();
    if (MediaLibrary && typeof MediaLibrary.requestPermissionsAsync === 'function') {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted' && typeof MediaLibrary.createAssetAsync === 'function') {
        const asset = await MediaLibrary.createAssetAsync(destinationUri);
        mediaLibraryAssetId = asset?.id;
      }
    }
  } catch (err) {
    console.warn('MediaLibrary save notice:', err);
  }

  const record: SavedRecord = {
    id: item.id,
    originalUri: item.uri,
    savedUri: destinationUri,
    mediaLibraryAssetId,
    type: item.type,
    sender: item.sender,
    time: item.time,
    fileSizeBytes: item.fileSizeBytes || 0,
    savedAt: Date.now(),
  };

  const records = loadSavedRecords().filter((r) => r.id !== item.id);
  records.push(record);
  saveSavedRecords(records);

  return record;
}

/**
 * Deletes ONLY the saved copy created by W Status Saver.
 * NEVER deletes or modifies the original WhatsApp status in .Statuses.
 */
export async function deleteSavedStatusCopy(item: StatusMetadataItem): Promise<void> {
  const records = loadSavedRecords();
  const targetRecord = records.find((r) => r.id === item.id);

  const targetSavedUri = item.savedUri || targetRecord?.savedUri || `${SAVED_DIR}${item.id}`;

  // 1. Delete local file copy in saved_statuses/
  try {
    const fileInfo = await FileSystem.getInfoAsync(targetSavedUri);
    if (fileInfo.exists) {
      await FileSystem.deleteAsync(targetSavedUri, { idempotent: true });
    }
  } catch (err) {
    console.warn('Error deleting saved file copy:', err);
  }

  // 2. Delete MediaLibrary asset if created
  const assetId = item.mediaLibraryAssetId || targetRecord?.mediaLibraryAssetId;
  if (assetId) {
    try {
      const MediaLibrary = getMediaLibrary();
      if (MediaLibrary && typeof MediaLibrary.deleteAssetsAsync === 'function') {
        await MediaLibrary.deleteAssetsAsync([assetId]);
      }
    } catch (err) {
      console.warn('Error deleting MediaLibrary asset:', err);
    }
  }

  // 3. Remove record from saved records list
  const remainingRecords = records.filter((r) => r.id !== item.id);
  saveSavedRecords(remainingRecords);
}

/**
 * Auto-saves newly discovered statuses if setting is enabled.
 */
export async function processAutoSave(
  items: StatusMetadataItem[]
): Promise<StatusMetadataItem[]> {
  const records = loadSavedRecords();
  const savedIds = new Set(records.map((r) => r.id));

  const updatedItems = [...items];

  for (let i = 0; i < updatedItems.length; i++) {
    const item = updatedItems[i];
    if (!item.isSaved && !savedIds.has(item.id)) {
      try {
        const record = await saveStatusCopy(item);
        savedIds.add(item.id);
        updatedItems[i] = {
          ...item,
          isSaved: true,
          savedUri: record.savedUri,
          mediaLibraryAssetId: record.mediaLibraryAssetId,
        };
      } catch (err) {
        console.warn('Auto-save failed for item:', item.id, err);
      }
    }
  }

  return updatedItems;
}
