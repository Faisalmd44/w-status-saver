import { useCallback, useEffect, useState } from 'react';
import {
  INITIAL_STATUSES,
  StatusMetadataItem,
  deleteStatusMetadataInSupabase,
  fetchStatusesMetadata,
  saveAllInSupabase,
  toggleFavoriteInSupabase,
  toggleSaveInSupabase,
} from '@/lib/statusService';

export function useStatuses() {
  const [statuses, setStatuses] = useState<StatusMetadataItem[]>(INITIAL_STATUSES);
  const [isLoading, setIsLoading] = useState(true);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    const data = await fetchStatusesMetadata();
    setStatuses(data);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const toggleSave = useCallback((id: string) => {
    setStatuses((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;
      const nextSaved = !target.isSaved;
      toggleSaveInSupabase(target, nextSaved);
      return prev.map((item) =>
        item.id === id ? { ...item, isSaved: nextSaved } : item
      );
    });
  }, []);

  const toggleFavorite = useCallback((id: string) => {
    setStatuses((prev) => {
      const target = prev.find((item) => item.id === id);
      if (!target) return prev;
      const nextFav = !target.isFavorite;
      toggleFavoriteInSupabase(target, nextFav);
      return prev.map((item) =>
        item.id === id ? { ...item, isFavorite: nextFav } : item
      );
    });
  }, []);

  const saveAll = useCallback(() => {
    setStatuses((prev) => {
      const updated = prev.map((item) => ({ ...item, isSaved: true }));
      saveAllInSupabase(updated);
      return updated;
    });
  }, []);

  const deleteItem = useCallback((id: string) => {
    setStatuses((prev) => {
      deleteStatusMetadataInSupabase(id);
      return prev.filter((item) => item.id !== id);
    });
  }, []);

  return {
    statuses,
    isLoading,
    refresh: loadData,
    toggleSave,
    toggleFavorite,
    saveAll,
    deleteItem,
  };
}
