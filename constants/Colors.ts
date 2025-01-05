/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

const tintColorLight = '#228be6';
const tintColorDark = '#74c0fc';

export default {
  light: {
    primary: tintColorLight,
    background: '#f8f9fa',
    card: '#ffffff',
    text: '#1a1a1a',
    textSecondary: '#495057',
    textTertiary: '#868e96',
    border: '#dee2e6',
    borderLight: '#f1f3f5',
    success: '#37b24d',
    successBackground: '#d3f9d8',
    warning: '#f08c00',
    warningBackground: '#fff3bf',
    warningBorder: '#ffd43b',
    error: '#e03131',
    errorBackground: '#ffe3e3',
    disabled: '#e9ecef',
  },
  dark: {
    primary: tintColorDark,
    background: '#1a1a1a',
    card: '#2d2d2d',
    text: '#f8f9fa',
    textSecondary: '#ced4da',
    textTertiary: '#adb5bd',
    border: '#495057',
    borderLight: '#343a40',
    success: '#51cf66',
    successBackground: '#2b8a3e',
    warning: '#fcc419',
    warningBackground: '#e67700',
    warningBorder: '#f59f00',
    error: '#ff6b6b',
    errorBackground: '#c92a2a',
    disabled: '#343a40',
  },
};
