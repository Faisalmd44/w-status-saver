import { supabase } from './supabase';

export interface StatusMetadataItem {
  id: string;
  type: 'image' | 'video';
  uri: string; // Local file path or local URI - NO binary file uploaded to Supabase Storage
  sender: string;
  time: string;
  duration?: string;
  isSaved: boolean;
  isFavorite: boolean;
  fileSizeBytes?: number;
}

export const INITIAL_STATUSES: StatusMetadataItem[] = [
  {
    id: '1',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?q=80&w=600&auto=format&fit=crop',
    sender: 'Alex Rivera',
    time: '10m ago',
    isSaved: false,
    isFavorite: true,
    fileSizeBytes: 1800000,
  },
  {
    id: '2',
    type: 'video',
    uri: 'https://images.unsplash.com/photo-1518173946687-a4c8a383392e?q=80&w=600&auto=format&fit=crop',
    sender: 'Sarah Chen',
    time: '25m ago',
    duration: '0:15',
    isSaved: true,
    isFavorite: false,
    fileSizeBytes: 4200000,
  },
  {
    id: '3',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=600&auto=format&fit=crop',
    sender: 'Marcus Vance',
    time: '1h ago',
    isSaved: false,
    isFavorite: false,
    fileSizeBytes: 2100000,
  },
  {
    id: '4',
    type: 'video',
    uri: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?q=80&w=600&auto=format&fit=crop',
    sender: 'Elena Rostova',
    time: '2h ago',
    duration: '0:30',
    isSaved: false,
    isFavorite: true,
    fileSizeBytes: 8500000,
  },
  {
    id: 'img-3',
    type: 'image',
    uri: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=600&auto=format&fit=crop',
    sender: 'Chloe Bennett',
    time: '3h ago',
    isSaved: true,
    isFavorite: true,
    fileSizeBytes: 3100000,
  },
  {
    id: 'vid-4',
    type: 'video',
    uri: 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?q=80&w=600&auto=format&fit=crop',
    sender: 'Lucas Silva',
    time: '6h ago',
    duration: '0:20',
    isSaved: true,
    isFavorite: true,
    fileSizeBytes: 6200000,
  },
];

/**
 * Fetches status metadata records from Supabase.
 * Falls back gracefully to local default statuses if offline or table is empty.
 */
export async function fetchStatusesMetadata(): Promise<StatusMetadataItem[]> {
  try {
    const { data, error } = await supabase
      .from('status_metadata')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) {
      return INITIAL_STATUSES;
    }

    // Map DB rows back to client status metadata structure
    const dbItems: StatusMetadataItem[] = data.map((row) => ({
      id: row.id,
      type: row.media_type as 'image' | 'video',
      uri: row.local_file_uri,
      sender: row.sender_name,
      time: row.time_label || 'Recent',
      duration: row.duration,
      isSaved: Boolean(row.is_saved),
      isFavorite: Boolean(row.is_favorite),
      fileSizeBytes: Number(row.file_size_bytes || 0),
    }));

    // Merge default items that are missing from DB
    const dbItemIds = new Set(dbItems.map((item) => item.id));
    const merged = [...dbItems];
    for (const initItem of INITIAL_STATUSES) {
      if (!dbItemIds.has(initItem.id)) {
        merged.push(initItem);
      }
    }

    return merged;
  } catch {
    return INITIAL_STATUSES;
  }
}

/**
 * Syncs 'saved' state metadata to Supabase.
 * Actual image/video binary file is stored locally on device.
 */
export async function toggleSaveInSupabase(
  item: StatusMetadataItem,
  newSavedState: boolean
): Promise<void> {
  try {
    await supabase.from('status_metadata').upsert(
      {
        id: item.id,
        media_type: item.type,
        sender_name: item.sender,
        time_label: item.time,
        duration: item.duration || null,
        local_file_uri: item.uri,
        file_size_bytes: item.fileSizeBytes || 0,
        is_saved: newSavedState,
        is_favorite: item.isFavorite,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.warn('Supabase toggleSave offline sync fallback:', err);
  }
}

/**
 * Syncs 'favorite' state metadata to Supabase.
 */
export async function toggleFavoriteInSupabase(
  item: StatusMetadataItem,
  newFavoriteState: boolean
): Promise<void> {
  try {
    await supabase.from('status_metadata').upsert(
      {
        id: item.id,
        media_type: item.type,
        sender_name: item.sender,
        time_label: item.time,
        duration: item.duration || null,
        local_file_uri: item.uri,
        file_size_bytes: item.fileSizeBytes || 0,
        is_saved: item.isSaved,
        is_favorite: newFavoriteState,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'id' }
    );
  } catch (err) {
    console.warn('Supabase toggleFavorite offline sync fallback:', err);
  }
}

/**
 * Syncs bulk 'save all' metadata state to Supabase.
 */
export async function saveAllInSupabase(items: StatusMetadataItem[]): Promise<void> {
  try {
    const upsertRows = items.map((item) => ({
      id: item.id,
      media_type: item.type,
      sender_name: item.sender,
      time_label: item.time,
      duration: item.duration || null,
      local_file_uri: item.uri,
      file_size_bytes: item.fileSizeBytes || 0,
      is_saved: true,
      is_favorite: item.isFavorite,
      updated_at: new Date().toISOString(),
    }));

    await supabase.from('status_metadata').upsert(upsertRows, { onConflict: 'id' });
  } catch (err) {
    console.warn('Supabase saveAll offline sync fallback:', err);
  }
}

/**
 * Deletes status metadata from Supabase.
 * Actual downloaded media remains intact in local device gallery unless deleted locally.
 */
export async function deleteStatusMetadataInSupabase(id: string): Promise<void> {
  try {
    await supabase.from('status_metadata').delete().eq('id', id);
  } catch (err) {
    console.warn('Supabase deleteStatusMetadata offline sync fallback:', err);
  }
}
