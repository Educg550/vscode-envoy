import * as vscode from 'vscode';
import { decryptContent } from '../crypto/decrypt';
import { EnclosedClient } from '../api/enclosedClient';
import { EnclosedApiError, NoteNotFoundError, RateLimitError } from '../api/errors';
import { getSettings } from '../config/settings';
import { promptNoteUrl, promptPassword } from '../ui/receivePanel';

export function parseNoteUrl(raw: string): { noteId: string; baseKey: string; isPasswordProtected: boolean } | null {
  let url: URL;
  try {
    url = new URL(raw.trim());
  } catch {
    return null;
  }

  const noteId = url.pathname.split('/').filter(Boolean).pop();
  if (!noteId) {return null;}

  const hashFragment = url.hash.replace(/^#/, '');
  if (!hashFragment) {return null;}

  const segments = hashFragment.split(':');
  const baseKey = segments.pop();
  if (!baseKey) {return null;}

  const validPrefixes = new Set(['pw', 'dar']);
  if (segments.some(s => !validPrefixes.has(s))) {return null;}

  return { noteId, baseKey, isPasswordProtected: segments.includes('pw') };
}

export async function openNoteFromUrl(url: string): Promise<void> {
  const parsed = parseNoteUrl(url);
  if (!parsed) {
    vscode.window.showErrorMessage(
      'Could not parse the Envoy link. Expected format: https://enclosed.cc/noteId#encryptionKey',
    );
    return;
  }

  const { instanceUrl } = getSettings();
  const client = new EnclosedClient(instanceUrl);

  let note: { encryptedPayload: string; isPasswordProtected: boolean };
  try {
    note = await client.fetchNote(parsed.noteId);
  } catch (err) {
    vscode.window.showErrorMessage(openErrorMessage(err));
    return;
  }

  let password = '';
  if (note.isPasswordProtected || parsed.isPasswordProtected) {
    const input = await promptPassword();
    if (input === undefined) {return;}
    password = input;
  }

  let plaintext: string;
  try {
    plaintext = await decryptContent(note.encryptedPayload, parsed.baseKey, password);
  } catch {
    vscode.window.showErrorMessage(
      'Failed to decrypt the note. The link or password may be incorrect.',
    );
    return;
  }

  const doc = await vscode.workspace.openTextDocument({ content: plaintext, language: 'dotenv' });
  await vscode.window.showTextDocument(doc);
}

export async function openNoteCommand(): Promise<void> {
  const raw = await promptNoteUrl();
  if (!raw) {return;}
  await openNoteFromUrl(raw);
}

function openErrorMessage(err: unknown): string {
  if (err instanceof NoteNotFoundError) {return 'Note not found. It may have expired or already been read.';}
  if (err instanceof RateLimitError) {return 'Too many requests. Please wait before trying again.';}
  if (err instanceof EnclosedApiError) {return `Enclosed API error: ${err.message}`;}
  return 'An unexpected error occurred while fetching the note.';
}
