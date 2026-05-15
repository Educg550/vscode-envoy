import * as vscode from 'vscode';

export interface EnclosedSettings {
  instanceUrl: string;
  defaultTtl: number;
  defaultDeleteAfterReading: boolean;
  shouldCopyEnclosedUrl: boolean;
}

export function getSettings(): EnclosedSettings {
  const cfg = vscode.workspace.getConfiguration('envoy');
  return {
    instanceUrl: cfg.get<string>('enclosedInstanceUrl', 'https://enclosed.cc'),
    defaultTtl: cfg.get<number>('defaultTtl', 86400),
    defaultDeleteAfterReading: cfg.get<boolean>('defaultDeleteAfterReading', true),
    shouldCopyEnclosedUrl: cfg.get<boolean>('shouldCopyEnclosedUrl', true),
  };
}
