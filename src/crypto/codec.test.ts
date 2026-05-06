import { describe, expect, it } from 'vitest';
import { base64UrlToBuf, bufToBase64Url } from './codec';

describe('crypto/codec', () => {
  it('bufToBase64Url produces URL-safe characters only', () => {
    const buf = new Uint8Array(256).map((_, i) => i);
    const encoded = bufToBase64Url(buf);
    expect(encoded).not.toMatch(/[+/=]/);
    expect(encoded).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('base64UrlToBuf round-trips bufToBase64Url', () => {
    const original = crypto.getRandomValues(new Uint8Array(32));
    const encoded = bufToBase64Url(original);
    const decoded = base64UrlToBuf(encoded);
    expect(decoded).toEqual(original);
  });

  it('handles strings without padding', () => {
    // lengths that would normally need 1 or 2 padding chars
    for (const len of [1, 2, 3, 10, 31, 32, 33]) {
      const buf = new Uint8Array(len).fill(0xab);
      const encoded = bufToBase64Url(buf);
      expect(encoded).not.toContain('=');
      expect(base64UrlToBuf(encoded)).toEqual(buf);
    }
  });
});
