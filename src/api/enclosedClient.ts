export interface CreateNotePayload {
  content: string;
  ttl: number;
  isPasswordProtected: boolean;
  deleteAfterReading: boolean;
}

export interface FetchNoteResult {
  content: string;
  isPasswordProtected: boolean;
}

export class EnclosedClient {
  constructor(private readonly instanceUrl: string) {}

  async createNote(_payload: CreateNotePayload): Promise<string> {
    throw new Error('not yet implemented');
  }

  async fetchNote(_noteId: string): Promise<FetchNoteResult> {
    throw new Error('not yet implemented');
  }
}
