import { safeCustomStorage } from './supabase';

export interface AppSettings {
  amoledTheme: boolean;
  language: string;
  autoSave: boolean;
  saveLocation: string;
  statusAlerts: boolean;
  folderAccessGranted: boolean;
  folderPath: string;
  onboardingCompleted: boolean;
}

export const DEFAULT_SETTINGS: AppSettings = {
  amoledTheme: true,
  language: 'English (device)',
  autoSave: true,
  saveLocation: 'Gallery / W Status Saver',
  statusAlerts: false,
  folderAccessGranted: false,
  folderPath: 'PrimaryStorage/Android/media/com.whatsapp/WhatsApp/Media/.Statuses',
  onboardingCompleted: false,
};

const SETTINGS_KEY = 'w_status_saver_app_settings';

export function loadSettings(): AppSettings {
  try {
    const raw = safeCustomStorage.getItem(SETTINGS_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch {
    // fallback
  }
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    safeCustomStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}
