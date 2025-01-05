import { useColorScheme as useNativeColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState, useCallback } from 'react';

const THEME_KEY = '@app_theme';

export type ColorScheme = 'light' | 'dark' | 'system';

export function useColorScheme() {
  const systemColorScheme = useNativeColorScheme();
  const [theme, setTheme] = useState<ColorScheme>('system');

  const loadTheme = useCallback(async () => {
    try {
      const savedTheme = await AsyncStorage.getItem(THEME_KEY);
      if (savedTheme) {
        setTheme(savedTheme as ColorScheme);
      }
    } catch (error) {
      console.error('Error loading theme:', error);
    }
  }, []);

  useEffect(() => {
    loadTheme();
  }, [loadTheme]);

  useEffect(() => {
    if (theme === 'system') {
      setTheme('system');
    }
  }, [systemColorScheme]);

  const setColorScheme = useCallback(async (newTheme: ColorScheme) => {
    try {
      await AsyncStorage.setItem(THEME_KEY, newTheme);
      setTheme(newTheme);
    } catch (error) {
      console.error('Error saving theme:', error);
    }
  }, []);

  const currentTheme = theme === 'system' ? systemColorScheme : theme;

  return {
    colorScheme: currentTheme,
    setColorScheme,
    theme,
  };
}
