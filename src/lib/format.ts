/** Turns "mariani1819@gmail.com" into "Mariani". */
export function getDisplayName(email: string | undefined): string {
  const local = (email ?? '').split('@')[0];
  const letters = local.replace(/[^a-zA-ZáéíóúñÁÉÍÓÚÑ]+/g, ' ').trim().split(' ')[0];
  if (!letters) return '';
  return letters.charAt(0).toUpperCase() + letters.slice(1).toLowerCase();
}

export function getGreeting(date: Date = new Date()): string {
  const hour = date.getHours();
  if (hour < 12) return 'Buenos días';
  if (hour < 19) return 'Buenas tardes';
  return 'Buenas noches';
}

export function formatToday(date: Date = new Date()): string {
  return date.toLocaleDateString('es-MX', { weekday: 'long', day: 'numeric', month: 'long' });
}

/** "hoy", "ayer" or "12 nov" */
export function formatNoteDate(iso: string, now: Date = new Date()): string {
  const date = new Date(iso);
  const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const days = Math.round((startOfDay(now) - startOfDay(date)) / 86_400_000);
  if (days === 0) return 'hoy';
  if (days === 1) return 'ayer';
  return date.toLocaleDateString('es-MX', { day: 'numeric', month: 'short' }).replace('.', '');
}
