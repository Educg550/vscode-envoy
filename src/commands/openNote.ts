import * as vscode from 'vscode';

export function parseNoteUrl(raw: string): { noteId: string; baseKey: string } | null {
  const trimmed = raw.trim();
  let fragment: string;

  try {
    const url = new URL(trimmed);
    fragment = url.hash;
  } catch {
    fragment = trimmed;
  }

  const stripped = fragment.replace(/^[#/]+/, '');
  const slashIndex = stripped.indexOf('/');
  if (slashIndex === -1) return null;

  const noteId = stripped.slice(0, slashIndex);
  const baseKey = stripped.slice(slashIndex + 1);

  if (!noteId || !baseKey || baseKey.includes('/')) return null;

  return { noteId, baseKey };
}

export async function openNoteCommand(): Promise<void> {
  vscode.window.showInformationMessage('openNote: not yet implemented');
}
