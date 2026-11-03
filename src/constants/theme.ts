/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#0B1F3A',
    background: '#F2F6FB',
    backgroundElement: '#FFFFFF',
    backgroundSelected: '#DCE7F5',
    textSecondary: '#5B6B80',
    action: '#1565C0',
    onAction: '#FFFFFF',
    accent: '#FFC83D',
    onAccent: '#0B1F3A',
    danger: '#C62828',
  },
  dark: {
    text: '#F2F6FB',
    background: '#0B1522',
    backgroundElement: '#15233A',
    backgroundSelected: '#22344F',
    textSecondary: '#9FB0C6',
    action: '#5AAEFF',
    onAction: '#0B1F3A',
    accent: '#FFC83D',
    onAccent: '#0B1F3A',
    danger: '#FF8A80',
  },
} as const;

/** Brand colors that stay the same in light and dark mode (same as the splash screen). */
export const Brand = {
  sky: '#208AEF',
  ink: '#0B1F3A',
} as const;

/** Bricolage Grotesque, loaded in src/app/_layout.tsx */
export const Typeface = {
  regular: 'BricolageGrotesque_400Regular',
  medium: 'BricolageGrotesque_500Medium',
  semibold: 'BricolageGrotesque_600SemiBold',
  extrabold: 'BricolageGrotesque_800ExtraBold',
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
