import * as vscode from 'vscode';

export interface ShareOptions {
  ttl: number;
  password: string;
  deleteAfterReading: boolean;
}

const TTL_OPTIONS = [
  { label: '1 hour', seconds: 3_600 },
  { label: '1 day', seconds: 86_400 },
  { label: '7 days', seconds: 604_800 },
  { label: '30 days', seconds: 2_592_000 },
] as const;

export type TtlItem    = vscode.QuickPickItem & { readonly seconds: number };
export type ToggleItem = vscode.QuickPickItem & { readonly isToggle: true };

export function buildTtlItems(
  defaultTtl: number,
  deleteAfterReading: boolean,
): (TtlItem | vscode.QuickPickItem | ToggleItem)[] {
  const ttlItems: TtlItem[] = TTL_OPTIONS.map(opt => ({
    label: opt.seconds === defaultTtl ? `$(star) ${opt.label}` : opt.label,
    seconds: opt.seconds,
  }));

  const separator: vscode.QuickPickItem = {
    label: '',
    kind: vscode.QuickPickItemKind.Separator,
  };

  const toggleItem: ToggleItem = {
    label: deleteAfterReading ? '$(check) Delete after reading' : '$(circle-outline) Delete after reading',
    description: deleteAfterReading
      ? 'Note will be destroyed after it is opened'
      : 'Note will persist until it expires',
    isToggle: true,
  };

  return [...ttlItems, separator, toggleItem];
}

export async function promptShareOptions(
  defaultTtl: number,
  defaultDelete: boolean,
): Promise<ShareOptions | undefined> {
  const items = TTL_OPTIONS.map(opt => ({
    label: opt.seconds === defaultTtl ? `$(star) ${opt.label}` : opt.label,
    seconds: opt.seconds,
  }));

  const picked = await vscode.window.showQuickPick(items, {
    title: 'Share with Enclosed',
    placeHolder: 'Select expiration time',
  });
  if (!picked) {return undefined;}

  const passwordInput = await vscode.window.showInputBox({
    title: 'Share with Enclosed',
    prompt: 'Password (leave empty for no password)',
    password: true,
  });
  if (passwordInput === undefined) {return undefined;}

  return {
    ttl: picked.seconds,
    password: passwordInput,
    deleteAfterReading: defaultDelete,
  };
}
