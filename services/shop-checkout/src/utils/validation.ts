export function validateContact(phone?: string | null, email?: string | null) {
  const phoneValid = !!phone && /^\+?[0-9\-\s]{6,20}$/.test(phone);
  const emailValid = !!email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  return phoneValid || emailValid;
}
