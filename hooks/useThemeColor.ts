/**
 * Learn more about light and dark modes:
 * https://docs.expo.dev/guides/color-schemes/
 */

import Colors from '../constants/Colors';
import { useColorScheme } from './useColorScheme';
import { useMemo } from 'react';

export type ColorName = keyof typeof Colors.light & keyof typeof Colors.dark;

export function useThemeColor() {
  const { colorScheme } = useColorScheme();
  const isDark = useMemo(() => colorScheme === 'dark', [colorScheme]);

  const colors = useMemo(() => Colors[isDark ? 'dark' : 'light'], [isDark]);
  const getColor = useMemo(() => (colorName: ColorName) => colors[colorName], [colors]);

  return {
    colors,
    getColor,
    isDark,
  };
}
