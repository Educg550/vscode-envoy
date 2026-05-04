import * as vscode from 'vscode';

export interface EnclosedSettings {
  instanceUrl: string;
  defaultTtl: number;
  defaultDeleteAfterReading: boolean;
}

export function getSettings(): EnclosedSettings {
  const cfg = vscode.workspace.getConfiguration('enclosed');
  return {
    instanceUrl: cfg.get<string>('instanceUrl', 'https://enclosed.cc'),
    defaultTtl: cfg.get<number>('defaultTtl', 86400),
    defaultDeleteAfterReading: cfg.get<boolean>('defaultDeleteAfterReading', true),
  };
}
