export type FormErrors = Record<string, string>;

export function validateEmail(email: string): string | null {
  if (!email.trim()) return 'Az email cím megadása kötelező.';
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Kérjük, érvényes email címet adj meg.';
  return null;
}

export function validatePhone(phone: string): string | null {
  if (!phone.trim()) return 'A telefonszám megadása kötelező.';
  const cleaned = phone.replace(/\s/g, '').replace(/^\+36/, '').replace(/^06/, '');
  if (cleaned.length < 8 || cleaned.length > 11) {
    return 'Kérjük, érvényes magyar telefonszámot adj meg (pl. 06 30 123 4567).';
  }
  if (!/^\d+$/.test(cleaned)) return 'A telefonszám csak számjegyeket tartalmazhat.';
  return null;
}

export function validateRequired(value: string, fieldName: string): string | null {
  if (!value.trim()) return `${fieldName} megadása kötelező.`;
  return null;
}

export function validateGdpr(checked: boolean): string | null {
  if (!checked) return 'Az adatkezelési tájékoztató elfogadása kötelező a jelentkezéshez.';
  return null;
}
