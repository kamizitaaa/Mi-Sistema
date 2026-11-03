import type { PropsWithChildren } from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { Brand, MaxContentWidth, Spacing, Typeface } from '@/constants/theme';

type ScreenHeroProps = PropsWithChildren<{
  /** Small line above the title, for example the greeting. */
  intro: string;
  title: string;
  /** Small line under the title, for example the date. */
  detail?: string;
}>;

/** Blue header shared by the Notes and Account screens. */
export function ScreenHero({ intro, title, detail, children }: ScreenHeroProps) {
  const insets = useSafeAreaInsets();
  // On web the floating tab bar sits on top of the page, so we leave room for it.
  const paddingTop = Platform.OS === 'web' ? 96 : insets.top + Spacing.three;

  return (
    <View style={[styles.hero, { paddingTop }]}>
      <View style={styles.inner}>
        <ThemedText style={styles.intro}>{intro}</ThemedText>
        <ThemedText type="title" style={styles.title} numberOfLines={1}>
          {title}
        </ThemedText>
        {detail ? <ThemedText style={styles.detail}>{detail}</ThemedText> : null}
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Brand.sky,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    paddingHorizontal: Spacing.three,
    paddingBottom: 56,
  },
  inner: { width: '100%', maxWidth: MaxContentWidth, alignSelf: 'center', gap: Spacing.one },
  intro: { color: Brand.ink, fontFamily: Typeface.semibold, fontSize: 17 },
  title: { color: '#FFFFFF' },
  detail: { color: Brand.ink, fontFamily: Typeface.medium, fontSize: 15, textTransform: 'capitalize' },
});
