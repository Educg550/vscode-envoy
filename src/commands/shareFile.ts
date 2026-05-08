import * as vscode from 'vscode';

export function validateInstanceUrl(url: string): boolean {
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function shareFileCommand(uri?: vscode.Uri): Promise<void> {
  void uri;
  vscode.window.showInformationMessage('shareFile: not yet implemented');
}
