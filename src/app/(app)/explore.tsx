import { Pressable, ScrollView, StyleSheet, View } from 'react-native';

import { ScreenHero } from '@/components/screen-hero';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Typeface } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { getDisplayName } from '@/lib/format';

export default function AccountScreen() {
  const { session, signOut } = useAuth();
  const theme = useTheme();
  const email = session?.user.email ?? '';

  return (
    <ThemedView style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.five }}>
        <ScreenHero intro="Tu cuenta" title={getDisplayName(email) || 'Cuenta'} />

        <View style={styles.column}>
          <View style={[styles.card, { backgroundColor: theme.backgroundElement }]}>
            <ThemedText type="small" themeColor="textSecondary">
              Correo
            </ThemedText>
            <ThemedText style={styles.email}>{email}</ThemedText>
          </View>

          <Pressable
            accessibilityRole="button"
            onPress={signOut}
            style={({ pressed }) => [styles.signOut, { borderColor: theme.danger }, pressed && styles.pressed]}>
            <ThemedText style={[styles.signOutText, { color: theme.danger }]}>Cerrar sesión</ThemedText>
          </Pressable>
        </View>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  column: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.three,
    gap: Spacing.three,
    marginTop: -32,
  },
  card: {
    borderRadius: 20,
    padding: Spacing.three,
    gap: 2,
    boxShadow: '0 8px 24px rgba(11, 31, 58, 0.18)',
  },
  email: { fontFamily: Typeface.semibold },
  signOut: { borderWidth: 2, borderRadius: Spacing.three, minHeight: 52, alignItems: 'center', justifyContent: 'center' },
  signOutText: { fontFamily: Typeface.extrabold },
  pressed: { opacity: 0.7 },
});
