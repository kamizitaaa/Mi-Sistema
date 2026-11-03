import { Image } from 'expo-image';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { PrimaryButton } from '@/components/primary-button';
import { ThemedText } from '@/components/themed-text';
import { Brand, Spacing, Typeface } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { isSupabaseConfigured } from '@/lib/supabase';

type FieldProps = React.ComponentProps<typeof TextInput> & { label: string };

function Field({ label, ...inputProps }: FieldProps) {
  const theme = useTheme();
  const [focused, setFocused] = useState(false);

  return (
    <View style={styles.field}>
      <ThemedText type="smallBold">{label}</ThemedText>
      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.backgroundElement,
            color: theme.text,
            borderColor: focused ? theme.action : theme.backgroundSelected,
          },
        ]}
        placeholderTextColor={theme.textSecondary}
        autoCapitalize="none"
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        {...inputProps}
      />
    </View>
  );
}

export default function LoginScreen() {
  const { signIn, signUp } = useAuth();
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState<'signIn' | 'signUp'>('signIn');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const isSignIn = mode === 'signIn';

  async function handleSubmit() {
    if (!email.trim() || !password) {
      setMessage('Escribe tu correo y tu contraseña.');
      return;
    }
    setBusy(true);
    setMessage(null);
    const result = isSignIn ? await signIn(email.trim(), password) : await signUp(email.trim(), password);
    setBusy(false);

    if (result.error) setMessage(result.error);
    else if (result.needsConfirmation) setMessage('Cuenta creada. Abre el enlace que te enviamos por correo y luego inicia sesión.');
    // On success the session changes and the router moves to the app by itself.
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={[styles.screen, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={styles.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <View style={styles.hero}>
          <View style={styles.brandRow}>
            <Image source={require('../../public/images/icon-192-new.png')} style={styles.logo} />
            <ThemedText type="title" style={styles.heroTitle}>
              Mi Sistema
            </ThemedText>
          </View>
          <ThemedText style={styles.heroText}>Tus notas en la nube, siempre a la mano.</ThemedText>
        </View>

        <View style={[styles.sheet, { backgroundColor: theme.background, paddingBottom: insets.bottom + Spacing.five }]}>
          <View style={styles.sheetInner}>
            <ThemedText type="subtitle">{isSignIn ? 'Entra a tu cuenta' : 'Crea tu cuenta'}</ThemedText>

            {!isSupabaseConfigured && (
              <ThemedText type="small" style={{ color: theme.danger }}>
                Falta configurar Supabase. Revisa el archivo .env
              </ThemedText>
            )}

            <Field
              label="Correo"
              placeholder="nombre@correo.com"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
            />
            <Field
              label="Contraseña"
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              value={password}
              onChangeText={setPassword}
              onSubmitEditing={handleSubmit}
            />

            {message && (
              <ThemedText type="small" style={{ color: theme.danger }}>
                {message}
              </ThemedText>
            )}

            <PrimaryButton label={isSignIn ? 'Entrar' : 'Crear cuenta'} busy={busy} onPress={handleSubmit} />

            <Pressable
              onPress={() => {
                setMode(isSignIn ? 'signUp' : 'signIn');
                setMessage(null);
              }}>
              <ThemedText type="linkPrimary" style={styles.switchText}>
                {isSignIn ? '¿Primera vez? Crea tu cuenta' : '¿Ya tienes cuenta? Inicia sesión'}
              </ThemedText>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Brand.sky },
  scroll: { flexGrow: 1 },
  hero: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.five,
    paddingBottom: Spacing.five,
    gap: Spacing.two,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.three },
  logo: { width: 64, height: 64, borderRadius: 18 },
  heroTitle: { color: '#FFFFFF' },
  heroText: { color: Brand.ink, fontFamily: Typeface.semibold, fontSize: 17, maxWidth: 300 },
  sheet: {
    flex: 1,
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    paddingTop: Spacing.five,
    paddingHorizontal: Spacing.four,
  },
  sheetInner: { width: '100%', maxWidth: 480, alignSelf: 'center', gap: Spacing.three },
  field: { gap: Spacing.one },
  input: {
    borderRadius: Spacing.three,
    borderWidth: 2,
    paddingHorizontal: Spacing.three,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: Typeface.medium,
    outlineStyle: 'none' as never,
  },
  switchText: { textAlign: 'center' },
});
