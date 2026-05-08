import * as vscode from 'vscode';

export function parseNoteUrl(raw: string): { noteId: string; baseKey: string } | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  const noteId = url.pathname.split('/').filter(Boolean).pop();
  if (!noteId) return null;

  const hashFragment = url.hash.replace(/^#/, '');
  if (!hashFragment) return null;

  const segments = hashFragment.split(':');
  const baseKey = segments.pop();
  if (!baseKey) return null;

  const validPrefixes = new Set(['pw', 'dar']);
  if (segments.some(s => !validPrefixes.has(s))) return null;

  return { noteId, baseKey };
}

export async function openNoteCommand(): Promise<void> {
  vscode.window.showInformationMessage('openNote: not yet implemented');
}
