import { describe, expect, it, vi } from 'vitest';

vi.mock('vscode', () => ({
  window: { showInformationMessage: vi.fn() },
}));

import { parseNoteUrl } from './openNote';

describe('parseNoteUrl', () => {
  it('parses a full Enclosed URL', () => {
    expect(parseNoteUrl('https://enclosed.cc/#abc123/xyz789')).toEqual({
      noteId: 'abc123',
      baseKey: 'xyz789',
    });
  });

  it('parses a URL with a custom instance', () => {
    expect(parseNoteUrl('https://myinstance.example.com/#abc123/xyz789')).toEqual({
      noteId: 'abc123',
      baseKey: 'xyz789',
    });
  });

  it('parses a fragment-only string', () => {
    expect(parseNoteUrl('#abc123/xyz789')).toEqual({ noteId: 'abc123', baseKey: 'xyz789' });
  });

  it('parses noteId/baseKey without a leading hash', () => {
    expect(parseNoteUrl('abc123/xyz789')).toEqual({ noteId: 'abc123', baseKey: 'xyz789' });
  });

  it('returns null when there is no slash separator', () => {
    expect(parseNoteUrl('https://enclosed.cc/#abc123')).toBeNull();
  });

  it('returns null when baseKey contains a slash (extra path segment)', () => {
    expect(parseNoteUrl('https://enclosed.cc/#abc123/xyz789/extra')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseNoteUrl('')).toBeNull();
  });

  it('returns null when noteId is empty', () => {
    expect(parseNoteUrl('/xyz789')).toBeNull();
  });
});
