import * as vscode from 'vscode';

export async function promptNoteUrl(): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: 'Envoy: Open Note',
    prompt: 'Paste the Envoy link',
    placeHolder: 'https://enclosed.cc/{noteId}#{encryptionKey}',
  });
}

export async function promptPassword(): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: 'Envoy: Open Note',
    prompt: 'Enter the password for this note',
    password: true,
  });
}
