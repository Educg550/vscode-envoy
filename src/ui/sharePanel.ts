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
  defaultDeleteAfterReading: boolean,
): Promise<ShareOptions | undefined> {
  const ttlAndDar = await promptTtlAndDar(defaultTtl, defaultDeleteAfterReading);
  if (!ttlAndDar) { return undefined; }

  const passwordInput = await vscode.window.showInputBox({
    title: 'Share with Enclosed',
    prompt: 'Password (leave empty for no password)',
    password: true,
  });
  if (passwordInput === undefined) { return undefined; }

  return {
    ttl: ttlAndDar.ttl,
    password: passwordInput,
    deleteAfterReading: ttlAndDar.deleteAfterReading,
  };
}

async function promptTtlAndDar(
  defaultTtl: number,
  initialDar: boolean,
): Promise<{ ttl: number; deleteAfterReading: boolean } | undefined> {
  return new Promise(resolve => {
    const picker = vscode.window.createQuickPick();
    let dar = initialDar;

    picker.title = 'Share with Enclosed';
    picker.placeholder = 'Select expiration time';
    picker.items = buildTtlItems(defaultTtl, dar);

    picker.onDidChangeSelection(items => {
      const item = items[0];
      if (!item) { return; }
      if ('isToggle' in item) {
        dar = !dar;
        picker.items = buildTtlItems(defaultTtl, dar);
        return;
      }
      if ('seconds' in item) {
        resolve({ ttl: (item as TtlItem).seconds, deleteAfterReading: dar });
        picker.hide();
      }
    });

    picker.onDidHide(() => {
      picker.dispose();
      resolve(undefined);
    });

    picker.show();
  });
}
