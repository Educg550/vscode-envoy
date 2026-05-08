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
  if (!picked) return undefined;

  const passwordInput = await vscode.window.showInputBox({
    title: 'Share with Enclosed',
    prompt: 'Password (leave empty for no password)',
    password: true,
  });
  if (passwordInput === undefined) return undefined;

  return {
    ttl: picked.seconds,
    password: passwordInput,
    deleteAfterReading: defaultDelete,
  };
}
