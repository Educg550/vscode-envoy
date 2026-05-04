import * as vscode from 'vscode';

export async function shareFileCommand(uri?: vscode.Uri): Promise<void> {
  void uri;
  vscode.window.showInformationMessage('shareFile: not yet implemented');
}
