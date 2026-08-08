import { useEffect, useState } from 'react';
import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';
import { loadSettings } from '@/lib/settingsService';

export default function Index() {
  const [targetRoute, setTargetRoute] = useState<string | null>(null);

  useEffect(() => {
    const settings = loadSettings();

    if (!settings.folderAccessGranted) {
      setTargetRoute('/folder-access');
    } else {
      setTargetRoute('/home');
    }
  }, []);

  if (!targetRoute) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: '#000000',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator color="#3DDC84" size="large" />
      </View>
    );
  }

  return <Redirect href={targetRoute as any} />;
}
