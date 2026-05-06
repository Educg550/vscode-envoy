import { base64UrlToBuf, bufToBase64Url, deriveMasterKey } from './codec';

export interface EncryptResult {
  encryptedPayload: string; // format: "${ivBase64url}:${ciphertextBase64url}"
}

export async function encryptContent(
  plaintext: string,
  baseKey: string,
  password: string,
): Promise<EncryptResult> {
  const baseKeyBuf = base64UrlToBuf(baseKey);
  const masterKey = await deriveMasterKey(baseKeyBuf, password);

  const iv = crypto.getRandomValues(new Uint8Array(12));
  const plaintextBuf = new TextEncoder().encode(plaintext);
  const ciphertextBuf = await crypto.subtle.encrypt({ name: 'AES-GCM', iv }, masterKey, plaintextBuf);

  const encryptedPayload = `${bufToBase64Url(iv)}:${bufToBase64Url(new Uint8Array(ciphertextBuf))}`;
  return { encryptedPayload };
}
