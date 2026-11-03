import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';

export const isSupabaseConfigured = supabaseUrl !== '' && supabaseAnonKey !== '';

// During static web export the code runs in Node (no window), so we skip storage there.
const isServerRender = Platform.OS === 'web' && typeof window === 'undefined';

export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      storage: isServerRender ? undefined : AsyncStorage,
      autoRefreshToken: true,
      persistSession: !isServerRender,
      detectSessionInUrl: false,
    },
  },
);
