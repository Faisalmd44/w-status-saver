import { useCallback, useEffect, useState } from 'react';
import { AppSettings, DEFAULT_SETTINGS, loadSettings, saveSettings } from '@/lib/settingsService';

export function useSettings() {
  const [settings, setSettingsState] = useState<AppSettings>(DEFAULT_SETTINGS);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const loaded = loadSettings();
    setSettingsState(loaded);
    setIsLoaded(true);
  }, []);

  const updateSetting = useCallback(<K extends keyof AppSettings>(key: K, value: AppSettings[K]) => {
    setSettingsState((prev) => {
      const next = { ...prev, [key]: value };
      saveSettings(next);
      return next;
    });
  }, []);

  const toggleSetting = useCallback((key: keyof AppSettings) => {
    setSettingsState((prev) => {
      const curr = prev[key];
      if (typeof curr === 'boolean') {
        const next = { ...prev, [key]: !curr };
        saveSettings(next);
        return next;
      }
      return prev;
    });
  }, []);

  const resetSettings = useCallback(() => {
    setSettingsState(DEFAULT_SETTINGS);
    saveSettings(DEFAULT_SETTINGS);
  }, []);

  return {
    settings,
    isLoaded,
    updateSetting,
    toggleSetting,
    resetSettings,
  };
}
