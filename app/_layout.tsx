import { Stack } from 'expo-router';
import { useColorScheme } from '../hooks/useColorScheme';
import { useThemeColor } from '../hooks/useThemeColor';
import { ErrorBoundary } from '../components/ErrorBoundary';

export default function RootLayout() {
  const { colorScheme } = useColorScheme();
  const { colors } = useThemeColor();

  return (
    <ErrorBoundary>
      <Stack
        screenOptions={{
          headerStyle: {
            backgroundColor: colors.card,
          },
          headerTintColor: colors.text,
          headerShadowVisible: false,
          headerBackTitle: 'Geri',
          contentStyle: {
            backgroundColor: colors.background,
          },
        }}
      >
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="add-task"
          options={{
            presentation: 'modal',
            title: 'Yeni Görev',
          }}
        />
        <Stack.Screen
          name="edit-task"
          options={{
            presentation: 'modal',
            title: 'Görevi Düzenle',
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
