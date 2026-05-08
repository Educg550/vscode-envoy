export interface CreateNotePayload {
  encryptedPayload: string;
  ttlInSeconds?: number;
  deleteAfterReading: boolean;
}

export interface FetchNoteResult {
  encryptedPayload: string;
  encryptionAlgorithm: string;
  serializationFormat: string;
}
