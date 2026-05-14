import { describe, expect, it, vi } from 'vitest';

vi.mock('vscode', () => ({
  QuickPickItemKind: { Separator: -1 },
  window: { createQuickPick: vi.fn(), showInputBox: vi.fn() },
}));

import * as vscode from 'vscode';
import { buildTtlItems, TtlItem, ToggleItem } from './sharePanel';

describe('buildTtlItems', () => {
  it('marks the default TTL with a star prefix', () => {
    const items = buildTtlItems(86_400, false);
    const item = items.find((i): i is TtlItem => 'seconds' in i && i.seconds === 86_400);
    expect(item?.label).toBe('$(star) 1 day');
  });

  it('does not mark non-default TTL items', () => {
    const items = buildTtlItems(86_400, false);
    const item = items.find((i): i is TtlItem => 'seconds' in i && i.seconds === 3_600);
    expect(item?.label).toBe('1 hour');
  });

  it('toggle shows check and destruction description when DAR is true', () => {
    const items = buildTtlItems(86_400, true);
    const toggle = items.find((i): i is ToggleItem => 'isToggle' in i);
    expect(toggle?.label).toBe('$(check) Delete after reading');
    expect(toggle?.description).toBe('Note will be destroyed after it is opened');
  });

  it('toggle shows circle and persistence description when DAR is false', () => {
    const items = buildTtlItems(86_400, false);
    const toggle = items.find((i): i is ToggleItem => 'isToggle' in i);
    expect(toggle?.label).toBe('$(circle-outline) Delete after reading');
    expect(toggle?.description).toBe('Note will persist until it expires');
  });

  it('separator appears between the last TTL item and the toggle', () => {
    const items = buildTtlItems(86_400, false);
    const separatorIdx = items.findIndex(i => i.kind === vscode.QuickPickItemKind.Separator);
    const toggleIdx    = items.findIndex((i): i is ToggleItem => 'isToggle' in i);
    const lastTtlIdx   = items.reduce<number>((acc, i, idx) => 'seconds' in i ? idx : acc, -1);
    expect(separatorIdx).toBeGreaterThan(lastTtlIdx);
    expect(toggleIdx).toBe(separatorIdx + 1);
  });
});
