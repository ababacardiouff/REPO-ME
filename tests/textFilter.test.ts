import { detectContactInfo, sanitizeText } from "../src/services/textFilter";

test("detects email and phone", () => {
  const t = "Contact me at john.doe@example.com or +221 77 123 4567";
  const found = detectContactInfo(t);
  expect(found.some((f) => f.type === "email")).toBeTruthy();
  expect(found.some((f) => f.type === "phone")).toBeTruthy();
});

test("sanitizes text", () => {
  const t = "mail: john[dot]doe[at]gmail[dot]com - tel 77-123-4567";
  const s = sanitizeText(t);
  expect(s).not.toContain("john");
  expect(s).toContain("[REDACTED");
});
