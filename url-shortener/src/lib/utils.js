// small utility helpers
export function isValidUrl(u) {
  try {
    const url = new URL(u);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export function now() {
  return Date.now();
}

export function minutesToMs(min) {
  return Math.max(0, Number(min)) * 60 * 1000;
}

export function defaultValidityMinutesIfEmpty(val) {
  // assignment: default to 30 minutes if user leaves blank
  if (val === "" || val === null || val === undefined) return 30;
  const n = parseInt(val, 10);
  return Number.isNaN(n) || n <= 0 ? null : n;
}

export function generateCode(len = 6) {
  const alphabet = "abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ23456789";
  let out = "";
  for (let i = 0; i < len; i++) out += alphabet[Math.floor(Math.random() * alphabet.length)];
  return out;
}
