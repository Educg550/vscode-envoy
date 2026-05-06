import { describe, expect, it } from 'vitest';
import { encryptContent } from './encrypt';
import { decryptContent } from './decrypt';
import { generateBaseKey } from './keys';

describe('crypto round-trip', () => {
  it('encrypts and decrypts content without a password', async () => {
    const plaintext = 'DB_PASSWORD=hunter2\nAPI_KEY=abc123';
    const baseKey = generateBaseKey();
    const { encryptedPayload } = await encryptContent(plaintext, baseKey, '');
    const recovered = await decryptContent(encryptedPayload, baseKey, '');
    expect(recovered).toBe(plaintext);
  });

  it('encrypts and decrypts content with a password', async () => {
    const plaintext = 'SECRET=mysecret';
    const baseKey = generateBaseKey();
    const password = 'correcthorsebatterystaple';
    const { encryptedPayload } = await encryptContent(plaintext, baseKey, password);
    const recovered = await decryptContent(encryptedPayload, baseKey, password);
    expect(recovered).toBe(plaintext);
  });

  it('two encryptions of the same plaintext produce different payloads (random IV)', async () => {
    const baseKey = generateBaseKey();
    const { encryptedPayload: a } = await encryptContent('hello', baseKey, '');
    const { encryptedPayload: b } = await encryptContent('hello', baseKey, '');
    expect(a).not.toBe(b);
  });

  it('encryptedPayload has iv:ciphertext format (both base64url)', async () => {
    const { encryptedPayload } = await encryptContent('test', generateBaseKey(), '');
    const parts = encryptedPayload.split(':');
    expect(parts).toHaveLength(2);
    expect(parts[0]).toMatch(/^[A-Za-z0-9_-]+$/);
    expect(parts[1]).toMatch(/^[A-Za-z0-9_-]+$/);
  });

  it('decryption with wrong password throws', async () => {
    const baseKey = generateBaseKey();
    const { encryptedPayload } = await encryptContent('secret', baseKey, 'rightpassword');
    await expect(decryptContent(encryptedPayload, baseKey, 'wrongpassword')).rejects.toThrow();
  });

  it('decryption with wrong baseKey throws', async () => {
    const { encryptedPayload } = await encryptContent('secret', generateBaseKey(), '');
    await expect(decryptContent(encryptedPayload, generateBaseKey(), '')).rejects.toThrow();
  });
});
