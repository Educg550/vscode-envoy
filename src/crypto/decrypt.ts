import { decode } from 'cbor-x';
import { base64UrlToBuf, deriveMasterKey } from './codec';

export async function decryptContent(
  encryptedPayload: string,
  baseKey: string,
  password: string,
): Promise<string> {
  const colonIndex = encryptedPayload.indexOf(':');
  if (colonIndex === -1) {
    throw new Error('Invalid encrypted payload format');
  }
  const ivStr = encryptedPayload.slice(0, colonIndex);
  const ciphertextStr = encryptedPayload.slice(colonIndex + 1);
  if (!ivStr || !ciphertextStr || ciphertextStr.includes(':')) {
    throw new Error('Invalid encrypted payload format');
  }

  const baseKeyBuf = base64UrlToBuf(baseKey);
  const masterKey = await deriveMasterKey(baseKeyBuf, password);

  const iv = base64UrlToBuf(ivStr);
  const ciphertext = base64UrlToBuf(ciphertextStr);

  const plaintextBuf = await crypto.subtle.decrypt({ name: 'AES-GCM', iv }, masterKey, ciphertext);
  const [content] = decode(new Uint8Array(plaintextBuf)) as [string];
  return content;
}
