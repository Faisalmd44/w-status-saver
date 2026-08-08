import { Tabs } from 'expo-router';
import { BottomNav } from '@/components/ui/BottomNav';

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <BottomNav {...props} />}
      screenOptions={{
        headerShown: false,
      }}
    >
      <Tabs.Screen name="home" options={{ title: 'Home' }} />
      <Tabs.Screen name="images" options={{ title: 'Images' }} />
      <Tabs.Screen name="videos" options={{ title: 'Videos' }} />
      <Tabs.Screen name="saved" options={{ title: 'Saved' }} />
      <Tabs.Screen name="favorites" options={{ title: 'Favorites' }} />
    </Tabs>
  );
}
