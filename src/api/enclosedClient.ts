import { EnclosedApiError, NoteNotFoundError, PayloadTooLargeError, RateLimitError } from './errors';
import { CreateNotePayload, FetchNoteResult } from './types';

export class EnclosedClient {
  constructor(private readonly instanceUrl: string) {}

  async createNote(payload: CreateNotePayload): Promise<string> {
    const body: Record<string, unknown> = {
      payload: payload.encryptedPayload,
      deleteAfterReading: payload.deleteAfterReading,
      encryptionAlgorithm: 'aes-256-gcm',
      serializationFormat: 'cbor-array',
      isPublic: true,
    };

    if (payload.ttlInSeconds !== undefined) {
      body.ttlInSeconds = payload.ttlInSeconds;
    }

    let response: Response;
    try {
      response = await fetch(`${this.instanceUrl}/api/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
    } catch (err) {
      throw new EnclosedApiError(
        err instanceof Error ? err.message : 'Network error',
        0,
      );
    }

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data = (await response.json()) as { noteId: string };
    return data.noteId;
  }

  async fetchNote(noteId: string): Promise<FetchNoteResult> {
    let response: Response;
    try {
      response = await fetch(
        `${this.instanceUrl}/api/notes/${encodeURIComponent(noteId)}`,
      );
    } catch (err) {
      throw new EnclosedApiError(
        err instanceof Error ? err.message : 'Network error',
        0,
      );
    }

    if (!response.ok) {
      await this.handleErrorResponse(response);
    }

    const data = (await response.json()) as {
      note: {
        payload: string;
        encryptionAlgorithm: string;
        serializationFormat: string;
        isPasswordProtected?: boolean;
      };
    };
    return {
      encryptedPayload: data.note.payload,
      encryptionAlgorithm: data.note.encryptionAlgorithm,
      serializationFormat: data.note.serializationFormat,
      isPasswordProtected: data.note.isPasswordProtected ?? false,
    };
  }

  private async handleErrorResponse(response: Response): Promise<never> {
    let code: string | undefined;
    try {
      const body = (await response.json()) as { error?: { code?: string } };
      code = body?.error?.code;
    } catch {}

    const message = `Request failed with status ${response.status}${code ? `: ${code}` : ''}`;

    switch (response.status) {
      case 404:
        throw new NoteNotFoundError(message, code);
      case 429:
        throw new RateLimitError(message, code);
      case 413:
        throw new PayloadTooLargeError(message, code);
      default:
        throw new EnclosedApiError(message, response.status, code);
    }
  }
}
