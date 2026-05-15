import * as vscode from 'vscode';
import { shareFileCommand } from './commands/shareFile';
import { openNoteCommand } from './commands/openNote';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('enclosed.shareFile', (uri?: vscode.Uri) => shareFileCommand(uri, context)),
    vscode.commands.registerCommand('enclosed.openNote', openNoteCommand),
  );
}

export function deactivate(): void {}
