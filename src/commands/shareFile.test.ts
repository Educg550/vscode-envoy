import { describe, expect, it, vi } from 'vitest';

vi.mock('vscode', () => ({
  window: { showInformationMessage: vi.fn() },
}));

import { validateInstanceUrl } from './shareFile';

describe('validateInstanceUrl', () => {
  it('accepts an https URL', () => {
    expect(validateInstanceUrl('https://enclosed.cc')).toBe(true);
  });

  it('accepts an http URL (for local dev)', () => {
    expect(validateInstanceUrl('http://localhost:8080')).toBe(true);
  });

  it('accepts an https URL with a path', () => {
    expect(validateInstanceUrl('https://myinstance.example.com/app')).toBe(true);
  });

  it('rejects a non-URL string', () => {
    expect(validateInstanceUrl('not a url')).toBe(false);
  });

  it('rejects an empty string', () => {
    expect(validateInstanceUrl('')).toBe(false);
  });

  it('rejects a non-http protocol', () => {
    expect(validateInstanceUrl('ftp://example.com')).toBe(false);
  });
});
