import { base64UrlToBuf, deriveMasterKey } from './codec';

export async function decryptContent(
  encryptedPayload: string,
  baseKey: string,
  password: string,
): Promise<string> {
  const [ivStr, ciphertextStr] = encryptedPayload.split(':');
  if (!ivStr || !ciphertextStr) {
    throw new Error('Invalid encrypted payload format');
  }

  const baseKeyBuf = base64UrlToBuf(baseKey);
  const masterKey = await deriveMasterKey(baseKeyBuf, password);

  const iv = base64UrlToBuf(ivStr);
  const ciphertext = base64UrlToBuf(ciphertextStr);

  const plaintextBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, masterKey, ciphertext);
  return new TextDecoder().decode(plaintextBuf);
}
