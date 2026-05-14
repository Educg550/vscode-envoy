import { describe, expect, it, vi } from 'vitest';

vi.mock('vscode', () => ({
  window: { showInformationMessage: vi.fn() },
}));

import { parseNoteUrl } from './openNote';

describe('parseNoteUrl', () => {
  it('parses a standard Enclosed URL (no flags)', () => {
    expect(parseNoteUrl('https://enclosed.cc/abc123#xyz789')).toEqual({
      noteId: 'abc123',
      baseKey: 'xyz789',
      isPasswordProtected: false,
    });
  });

  it('parses a password-protected URL (pw: prefix)', () => {
    expect(parseNoteUrl('https://enclosed.cc/abc123#pw:xyz789')).toEqual({
      noteId: 'abc123',
      baseKey: 'xyz789',
      isPasswordProtected: true,
    });
  });

  it('parses a delete-after-reading URL (dar: prefix)', () => {
    expect(parseNoteUrl('https://enclosed.cc/abc123#dar:xyz789')).toEqual({
      noteId: 'abc123',
      baseKey: 'xyz789',
      isPasswordProtected: false,
    });
  });

  it('parses a URL with both pw: and dar: prefixes', () => {
    expect(parseNoteUrl('https://enclosed.cc/abc123#pw:dar:xyz789')).toEqual({
      noteId: 'abc123',
      baseKey: 'xyz789',
      isPasswordProtected: true,
    });
  });

  it('parses a URL with a custom instance', () => {
    expect(parseNoteUrl('https://myinstance.example.com/abc123#xyz789')).toEqual({
      noteId: 'abc123',
      baseKey: 'xyz789',
      isPasswordProtected: false,
    });
  });

  it('parses a real-world Enclosed URL', () => {
    const result = parseNoteUrl('https://enclosed.cc/01kr4jxqyphgazrb0798w0s4xg#m774Mgqp---SY7Vx1L4MG5wto7It1v_kQLknwpob6l0');
    expect(result).toEqual({
      noteId: '01kr4jxqyphgazrb0798w0s4xg',
      baseKey: 'm774Mgqp---SY7Vx1L4MG5wto7It1v_kQLknwpob6l0',
      isPasswordProtected: false,
    });
  });

  it('returns null when noteId is missing from path', () => {
    expect(parseNoteUrl('https://enclosed.cc/#xyz789')).toBeNull();
  });

  it('returns null when fragment is missing', () => {
    expect(parseNoteUrl('https://enclosed.cc/abc123')).toBeNull();
  });

  it('returns null for an empty string', () => {
    expect(parseNoteUrl('')).toBeNull();
  });

  it('returns null for a non-URL string', () => {
    expect(parseNoteUrl('not a url')).toBeNull();
  });

  it('returns null for an unknown fragment prefix', () => {
    expect(parseNoteUrl('https://enclosed.cc/abc123#unknown:xyz789')).toBeNull();
  });
});
