export function bufToBase64Url(buf: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < buf.length; i += chunkSize) {
    binary += String.fromCharCode(...buf.subarray(i, i + chunkSize));
  }
  return btoa(binary)
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '');
}

export function base64UrlToBuf(str: string): Uint8Array {
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(str.length + (4 - (str.length % 4)) % 4, '=');
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

export async function deriveMasterKey(baseKey: Uint8Array, password: string) {
  const passwordBytes = new TextEncoder().encode(password);
  const merged = new Uint8Array(baseKey.length + passwordBytes.length);
  merged.set(baseKey);
  merged.set(passwordBytes, baseKey.length);

  const keyMaterial = await crypto.subtle.importKey('raw', merged, 'PBKDF2', false, ['deriveKey']);

  return crypto.subtle.deriveKey(
    { name: 'PBKDF2', salt: baseKey, iterations: 100_000, hash: 'SHA-256' },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt'],
  );
}
