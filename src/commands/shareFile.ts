import * as vscode from 'vscode';
import { generateBaseKey } from '../crypto/keys';
import { encryptContent } from '../crypto/encrypt';
import { EnclosedClient } from '../api/enclosedClient';
import { EnclosedApiError, NoteNotFoundError, PayloadTooLargeError, RateLimitError } from '../api/errors';
import { getSettings } from '../config/settings';
import { promptShareOptions } from '../ui/sharePanel';

export function validateInstanceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function shareFileCommand(uri?: vscode.Uri): Promise<void> {
  const settings = getSettings();

  if (!validateInstanceUrl(settings.instanceUrl)) {
    vscode.window.showErrorMessage(
      `Invalid Enclosed instance URL: "${settings.instanceUrl}". Update it in Settings → Extensions → Enclosed.`,
    );
    return;
  }

  let content: string;
  if (uri) {
    const bytes = await vscode.workspace.fs.readFile(uri);
    content = new TextDecoder().decode(bytes);
  } else {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
      vscode.window.showErrorMessage(
        'Open a file or right-click a file in the Explorer to share it.',
      );
      return;
    }
    content = editor.document.getText();
  }

  const options = await promptShareOptions(settings.defaultTtl, settings.defaultDeleteAfterReading);
  if (!options) return;

  const baseKey = generateBaseKey();
  const { encryptedPayload } = await encryptContent(content, baseKey, options.password);

  const client = new EnclosedClient(settings.instanceUrl);
  let noteId: string;
  try {
    noteId = await client.createNote({
      encryptedPayload,
      ttlInSeconds: options.ttl,
      deleteAfterReading: options.deleteAfterReading,
    });
  } catch (err) {
    vscode.window.showErrorMessage(shareErrorMessage(err));
    return;
  }

  const flags = [
    options.password && 'pw',
    options.deleteAfterReading && 'dar',
  ].filter(Boolean);
  const hashFragment = [...flags, baseKey].join(':');
  const link = `${settings.instanceUrl}/${noteId}#${hashFragment}`;

  await vscode.env.clipboard.writeText(link);
  vscode.window.showInformationMessage('Enclosed link copied to clipboard.');
}

function shareErrorMessage(err: unknown): string {
  if (err instanceof PayloadTooLargeError) return 'File is too large to share via Enclosed.';
  if (err instanceof RateLimitError) return 'Too many requests. Please wait before sharing again.';
  if (err instanceof NoteNotFoundError) return 'Unexpected error: note not found after creation.';
  if (err instanceof EnclosedApiError) return `Enclosed API error: ${err.message}`;
  return 'An unexpected error occurred while sharing.';
}
