export function bufToBase64Url(buf: Uint8Array): string {
  return btoa(String.fromCharCode.apply(null, buf as unknown as number[]))
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
