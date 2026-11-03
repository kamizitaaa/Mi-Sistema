import { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';

import { PrimaryButton } from '@/components/primary-button';
import { ScreenHero } from '@/components/screen-hero';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, MaxContentWidth, Spacing, Typeface } from '@/constants/theme';
import { useAuth } from '@/context/auth-context';
import { useTheme } from '@/hooks/use-theme';
import { formatNoteDate, formatToday, getDisplayName, getGreeting } from '@/lib/format';
import { supabase } from '@/lib/supabase';

type Note = { id: string; title: string; created_at: string };

export default function NotesScreen() {
  const theme = useTheme();
  const { session } = useAuth();
  const [notes, setNotes] = useState<Note[]>([]);
  const [title, setTitle] = useState('');
  const [focused, setFocused] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const name = getDisplayName(session?.user.email) || 'bienvenido';
  const today = useMemo(() => formatToday(), []);
  const greeting = useMemo(() => getGreeting(), []);

  const loadNotes = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from('notes')
      .select('id, title, created_at')
      .order('created_at', { ascending: false });
    if (loadError) setError(loadError.message);
    else setNotes(data ?? []);
  }, []);

  useEffect(() => {
    supabase
      .from('notes')
      .select('id, title, created_at')
      .order('created_at', { ascending: false })
      .then(({ data, error: loadError }) => {
        if (loadError) setError(loadError.message);
        else setNotes(data ?? []);
      });
  }, []);

  async function addNote() {
    const text = title.trim();
    if (!text) return;
    setError(null);
    // user_id is filled by the database (default auth.uid())
    const { error: insertError } = await supabase.from('notes').insert({ title: text });
    if (insertError) {
      setError(insertError.message);
      return;
    }
    setTitle('');
    loadNotes();
  }

  async function deleteNote(id: string) {
    const { error: deleteError } = await supabase.from('notes').delete().eq('id', id);
    if (deleteError) setError(deleteError.message);
    else setNotes((current) => current.filter((note) => note.id !== id));
  }

  const counter = notes.length === 1 ? '1 nota guardada' : `${notes.length} notas guardadas`;

  const header = (
    <View>
      <ScreenHero intro={`${greeting},`} title={name} detail={today} />

      <View style={styles.column}>
        <View
          style={[
            styles.composer,
            { backgroundColor: theme.backgroundElement, borderColor: focused ? theme.action : 'transparent' },
          ]}>
          <TextInput
            style={[styles.input, { color: theme.text }]}
            placeholder="¿Qué quieres recordar?"
            placeholderTextColor={theme.textSecondary}
            value={title}
            onChangeText={setTitle}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            onSubmitEditing={addNote}
            returnKeyType="done"
          />
          <PrimaryButton label="Guardar" onPress={addNote} style={styles.saveButton} />
        </View>

        {error && (
          <ThemedText type="small" style={{ color: theme.danger }}>
            {error}
          </ThemedText>
        )}

        <View style={[styles.counter, { backgroundColor: theme.accent }]}>
          <ThemedText type="smallBold" style={{ color: theme.onAccent }}>
            {counter}
          </ThemedText>
        </View>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={notes}
        keyExtractor={(note) => note.id}
        ListHeaderComponent={header}
        contentContainerStyle={{ paddingBottom: BottomTabInset + Spacing.five }}
        ListEmptyComponent={
          <View style={styles.column}>
            <ThemedText themeColor="textSecondary">
              Aquí aparecerán tus notas. Escribe la primera arriba y toca Guardar.
            </ThemedText>
          </View>
        }
        renderItem={({ item }) => {
          const when = formatNoteDate(item.created_at);
          return (
            <View style={styles.column}>
              <View style={[styles.note, { backgroundColor: theme.backgroundElement }]}>
                <View
                  style={[styles.marker, { backgroundColor: when === 'hoy' ? theme.accent : theme.backgroundSelected }]}
                />
                <View style={styles.noteBody}>
                  <ThemedText style={styles.noteTitle}>{item.title}</ThemedText>
                  <ThemedText type="small" themeColor="textSecondary">
                    {when}
                  </ThemedText>
                </View>
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel={`Borrar nota ${item.title}`}
                  onPress={() => deleteNote(item.id)}
                  hitSlop={8}>
                  <ThemedText type="smallBold" style={{ color: theme.danger }}>
                    Borrar
                  </ThemedText>
                </Pressable>
              </View>
            </View>
          );
        }}
      />
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
    marginBottom: Spacing.two,
  },
  composer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    padding: Spacing.two,
    paddingLeft: Spacing.three,
    borderRadius: 20,
    borderWidth: 2,
    marginTop: -32,
    boxShadow: '0 8px 24px rgba(11, 31, 58, 0.18)',
  },
  input: { flex: 1, fontFamily: Typeface.medium, fontSize: 16, paddingVertical: 12, outlineStyle: 'none' as never },
  saveButton: { minHeight: 46, paddingVertical: 10, paddingHorizontal: Spacing.three, borderRadius: 14 },
  counter: { alignSelf: 'flex-start', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 6 },
  note: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.three,
    borderRadius: 16,
    paddingVertical: Spacing.three,
    paddingRight: Spacing.three,
    overflow: 'hidden',
  },
  marker: { width: 6, alignSelf: 'stretch', marginVertical: -Spacing.three, borderRadius: 0 },
  noteBody: { flex: 1, gap: 2 },
  noteTitle: { fontFamily: Typeface.semibold },
});
