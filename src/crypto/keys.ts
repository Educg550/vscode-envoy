import { bufToBase64Url } from './codec';

export function generateBaseKey(): string {
  const buf = crypto.getRandomValues(new Uint8Array(32));
  return bufToBase64Url(buf);
}
