import { describe, expect, it } from 'vitest';
import { generateBaseKey } from './keys';
import { base64UrlToBuf } from './codec';

describe('crypto/keys', () => {
  it('generateBaseKey returns a 32-byte base64url string', () => {
    const key = generateBaseKey();
    expect(typeof key).toBe('string');
    expect(key).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(key).not.toContain('=');
    const buf = base64UrlToBuf(key);
    expect(buf.byteLength).toBe(32);
  });

  it('two calls return different keys', () => {
    const a = generateBaseKey();
    const b = generateBaseKey();
    expect(a).not.toBe(b);
  });
});
