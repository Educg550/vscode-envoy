export interface ShareOptions {
  ttl: number;
  password: string;
  deleteAfterReading: boolean;
}

export async function promptShareOptions(
  _defaultTtl: number,
  _defaultDelete: boolean,
): Promise<ShareOptions | undefined> {
  throw new Error('not yet implemented');
}
