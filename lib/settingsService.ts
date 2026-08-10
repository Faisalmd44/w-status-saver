import * as SecureStore from 'expo-secure-store';

export interface AppSettings {
  amoledTheme: boolean;
  language: string;
  autoSave: boolean;
  saveLocation: string;
  statusAlerts: boolean;
  folderAccessGranted: boolean;
  folderPath: string;
  safUri: string;
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
  safUri: '',
  onboardingCompleted: false,
};

const SETTINGS_KEY = 'w_status_saver_app_settings';

export function loadSettings(): AppSettings {
  try {
    const raw = SecureStore.getItem(SETTINGS_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load settings:', err);
  }

  return DEFAULT_SETTINGS;
}

export async function loadSettingsAsync(): Promise<AppSettings> {
  try {
    const raw = await SecureStore.getItemAsync(SETTINGS_KEY);

    if (raw) {
      const parsed = JSON.parse(raw);
      return { ...DEFAULT_SETTINGS, ...parsed };
    }
  } catch (err) {
    console.warn('Failed to load settings:', err);
  }

  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: AppSettings): void {
  try {
    SecureStore.setItem(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}

export async function saveSettingsAsync(settings: AppSettings): Promise<void> {
  try {
    await SecureStore.setItemAsync(
      SETTINGS_KEY,
      JSON.stringify(settings)
    );
  } catch (err) {
    console.warn('Failed to save settings:', err);
  }
}
