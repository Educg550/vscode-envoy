import * as vscode from 'vscode';

export async function promptNoteUrl(): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: 'Open Enclosed Note',
    prompt: 'Paste the Enclosed link',
    placeHolder: 'https://enclosed.cc/{noteId}#{encryptionKey}',
  });
}

export async function promptPassword(): Promise<string | undefined> {
  return vscode.window.showInputBox({
    title: 'Open Enclosed Note',
    prompt: 'Enter the password for this note',
    password: true,
  });
}
