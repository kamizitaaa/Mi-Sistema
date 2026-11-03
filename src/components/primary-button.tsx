import { ActivityIndicator, Pressable, StyleSheet, type PressableProps } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing, Typeface } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

type PrimaryButtonProps = Omit<PressableProps, 'children'> & {
  label: string;
  busy?: boolean;
};

export function PrimaryButton({ label, busy, disabled, style, ...rest }: PrimaryButtonProps) {
  const theme = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      disabled={disabled || busy}
      style={(state) => [
        styles.button,
        { backgroundColor: theme.action },
        (state.pressed || busy) && styles.pressed,
        typeof style === 'function' ? style(state) : style,
      ]}
      {...rest}>
      {busy ? (
        <ActivityIndicator color={theme.onAction} />
      ) : (
        <ThemedText style={[styles.label, { color: theme.onAction }]}>{label}</ThemedText>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    borderRadius: Spacing.three,
    paddingVertical: 15,
    paddingHorizontal: Spacing.four,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  label: { fontFamily: Typeface.extrabold, fontSize: 16 },
  pressed: { opacity: 0.75 },
});
