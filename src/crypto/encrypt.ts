export interface EncryptResult {
  ciphertext: string; // base64
  iv: string;         // base64
}

export async function encryptContent(
  _plaintext: string,
  _baseKey: string,
  _password: string,
): Promise<EncryptResult> {
  throw new Error('not yet implemented');
}
