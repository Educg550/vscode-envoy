import { beforeEach, describe, expect, it, vi } from 'vitest';
import {
  EnclosedApiError,
  EnclosedClient,
  NoteNotFoundError,
  PayloadTooLargeError,
  RateLimitError,
} from './enclosedClient';

const INSTANCE_URL = 'https://enclosed.example.com';

function makeFetchResponse(status: number, body: unknown): Response {
  return {
    ok: status >= 200 && status < 300,
    status,
    json: () => Promise.resolve(body),
  } as Response;
}

describe('EnclosedClient', () => {
  let client: EnclosedClient;

  beforeEach(() => {
    client = new EnclosedClient(INSTANCE_URL);
    vi.restoreAllMocks();
  });

  describe('createNote', () => {
    it('returns noteId from response', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        makeFetchResponse(200, { noteId: 'abc123' }),
      );

      const noteId = await client.createNote({
        encryptedPayload: 'iv:ciphertext',
        deleteAfterReading: false,
      });

      expect(noteId).toBe('abc123');
    });

    it('includes correct algorithm fields in POST body', async () => {
      const spy = vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        makeFetchResponse(200, { noteId: 'abc123' }),
      );

      await client.createNote({
        encryptedPayload: 'iv:ciphertext',
        ttlInSeconds: 3600,
        deleteAfterReading: true,
      });

      const call = spy.mock.calls[0]!;
      const body = JSON.parse((call[1] as RequestInit).body as string);
      expect(body.payload).toBe('iv:ciphertext');
      expect(body.encryptionAlgorithm).toBe('aes-256-gcm');
      expect(body.serializationFormat).toBe('cbor-array');
      expect(body.isPublic).toBe(true);
      expect(body.deleteAfterReading).toBe(true);
      expect(body.ttlInSeconds).toBe(3600);
    });

    it('throws EnclosedApiError with statusCode 0 on network error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new Error('Network failure'));

      const promise = client.createNote({ encryptedPayload: 'iv:ct', deleteAfterReading: false });
      await expect(promise).rejects.toBeInstanceOf(EnclosedApiError);
      await expect(promise).rejects.toMatchObject({ statusCode: 0 });
    });

    it('throws PayloadTooLargeError on 413', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        makeFetchResponse(413, { error: { code: 'payload_too_large' } }),
      );

      await expect(
        client.createNote({ encryptedPayload: 'iv:ct', deleteAfterReading: false }),
      ).rejects.toBeInstanceOf(PayloadTooLargeError);
    });
  });

  describe('fetchNote', () => {
    it('maps note.payload to encryptedPayload', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        makeFetchResponse(200, {
          note: {
            payload: 'iv:ciphertext',
            encryptionAlgorithm: 'aes-256-gcm',
            serializationFormat: 'cbor-array',
          },
        }),
      );

      const result = await client.fetchNote('note-id-1');

      expect(result.encryptedPayload).toBe('iv:ciphertext');
      expect(result.encryptionAlgorithm).toBe('aes-256-gcm');
      expect(result.serializationFormat).toBe('cbor-array');
    });

    it('throws NoteNotFoundError on 404', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        makeFetchResponse(404, { error: { code: 'note_not_found' } }),
      );

      await expect(client.fetchNote('missing')).rejects.toBeInstanceOf(NoteNotFoundError);
    });

    it('throws RateLimitError on 429', async () => {
      vi.spyOn(globalThis, 'fetch').mockResolvedValue(
        makeFetchResponse(429, { error: { code: 'rate_limit_exceeded' } }),
      );

      await expect(client.fetchNote('some-id')).rejects.toBeInstanceOf(RateLimitError);
    });

    it('throws EnclosedApiError on network error', async () => {
      vi.spyOn(globalThis, 'fetch').mockRejectedValue(new TypeError('Failed to fetch'));

      await expect(client.fetchNote('some-id')).rejects.toBeInstanceOf(EnclosedApiError);
    });
  });
});
