import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap = 'checkbox-outline';

          if (route.name === 'index') {
            iconName = focused ? 'checkbox' : 'checkbox-outline';
          } else if (route.name === 'settings') {
            iconName = focused ? 'settings' : 'settings-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#228be6',
        tabBarInactiveTintColor: '#868e96',
        headerShown: false,
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Görevler',
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Ayarlar',
        }}
      />
    </Tabs>
  );
}
