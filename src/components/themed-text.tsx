import { Platform, StyleSheet, Text, type TextProps } from 'react-native';

import { Fonts, ThemeColor, Typeface } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

export type ThemedTextProps = TextProps & {
  type?: 'default' | 'title' | 'small' | 'smallBold' | 'subtitle' | 'link' | 'linkPrimary' | 'code';
  themeColor?: ThemeColor;
};

export function ThemedText({ style, type = 'default', themeColor, ...rest }: ThemedTextProps) {
  const theme = useTheme();

  return (
    <Text
      style={[
        { color: theme[themeColor ?? 'text'] },
        type === 'default' && styles.default,
        type === 'title' && styles.title,
        type === 'small' && styles.small,
        type === 'smallBold' && styles.smallBold,
        type === 'subtitle' && styles.subtitle,
        type === 'link' && styles.link,
        type === 'linkPrimary' && [styles.linkPrimary, { color: theme.action }],
        type === 'code' && styles.code,
        style,
      ]}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  small: { fontFamily: Typeface.medium, fontSize: 14, lineHeight: 20 },
  smallBold: { fontFamily: Typeface.semibold, fontSize: 14, lineHeight: 20 },
  default: { fontFamily: Typeface.regular, fontSize: 16, lineHeight: 24 },
  title: { fontFamily: Typeface.extrabold, fontSize: 44, lineHeight: 46, letterSpacing: -1 },
  subtitle: { fontFamily: Typeface.extrabold, fontSize: 30, lineHeight: 34, letterSpacing: -0.5 },
  link: { fontFamily: Typeface.medium, lineHeight: 30, fontSize: 14 },
  linkPrimary: { fontFamily: Typeface.semibold, lineHeight: 30, fontSize: 14 },
  code: {
    fontFamily: Fonts.mono,
    fontWeight: Platform.select({ android: 700 }) ?? 500,
    fontSize: 12,
  },
});
