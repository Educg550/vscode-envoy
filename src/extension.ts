import * as vscode from 'vscode';
import { shareFileCommand } from './commands/shareFile';
import { openNoteCommand, openNoteFromUrl } from './commands/openNote';

export function activate(context: vscode.ExtensionContext): void {
  context.subscriptions.push(
    vscode.commands.registerCommand('envoy.shareFile', (uri?: vscode.Uri) => shareFileCommand(uri, context)),
    vscode.commands.registerCommand('envoy.openNote', openNoteCommand),
    vscode.window.registerUriHandler({
      handleUri(uri: vscode.Uri): void {
        if (uri.path === '/open') {
          const url = new URLSearchParams(uri.query).get('url');
          if (url) { void openNoteFromUrl(url); }
        }
      },
    }),
  );
}

export function deactivate(): void {}
