const emailRegex = /([a-zA-Z0-9._%+-]{2,}(\s?(\[dot\]|\(dot\)|\.|\sdot\s)\s?){1,}[a-zA-Z]{2,})|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/i;
const phoneRegex = /((?:\+?\d{1,3}[\s-]?)?(?:\(?\d{2,3}\)?[\s-]?)?\d{2,3}[\s-]?\d{2,3}[\s-]?\d{2,4})/g;
const urlRegex = /((https?:\/\/)?(www\.)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}\/?[^\s]*)/i;
const obfuscationTokens = /(dot|@|at|numero|tel|phone|wa\.me|whatsapp|telegram|t\.me|contact)/i;

export type ContactMatch = { type: string; match: string };

export function detectContactInfo(text: string): ContactMatch[] {
  if (!text) return [];

  const found: ContactMatch[] = [];
  const email = text.match(emailRegex)?.[0];
  if (email) found.push({ type: "email", match: email });

  const phones = Array.from(text.matchAll(phoneRegex)).map((m) => m[0]).filter(Boolean);
  phones.forEach((phone) => found.push({ type: "phone", match: phone }));

  const url = text.match(urlRegex)?.[0];
  if (url) found.push({ type: "url", match: url });

  if (obfuscationTokens.test(text) && /[0-9A-Za-z]/.test(text)) {
    found.push({ type: "suspicious", match: text.slice(0, 200) });
  }

  return found;
}

export function sanitizeText(text: string): string {
  if (!text) return "";
  let out = text.replace(emailRegex, "[REDACTED_EMAIL]");
  out = out.replace(urlRegex, "[REDACTED_URL]");
  out = out.replace(phoneRegex, "[REDACTED_PHONE]");
  out = out.replace(/\[dot\]|\(dot\)|\sdot\s/gi, ".");
  out = out.replace(/\[at\]|\(at\)|\sat\s/gi, "@");

  if (obfuscationTokens.test(out)) {
    out = out.replace(/([^\s]{3,})@(.*?)/g, "[REDACTED_EMAIL]");
  }

  return out;
}
