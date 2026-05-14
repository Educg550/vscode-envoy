# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Full workflow reference: `.claude/commands/beads.md`.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

**Beads sync**: This project does NOT use `bd dolt push`. Issue state lives in `.beads/issues.jsonl` — commit it to git alongside code changes:
```bash
git add .beads/issues.jsonl && git commit -m "chore(beads): ..."
```
<!-- END BEADS INTEGRATION -->


## Build & Test

```bash
npm install          # install dependencies
npm run compile      # TypeScript → JS via esbuild (watch: npm run watch)
npm run lint         # ESLint with @typescript-eslint
npm test             # Vitest unit tests (crypto round-trips, API client)
npm run package      # vsce package — produces .vsix for local install/publish
```

Run the extension locally: press **F5** in VS Code to launch the Extension Development Host.

## Architecture Overview

VS Code extension (TypeScript) that wraps the [Enclosed](https://github.com/CorentinTh/enclosed) API for end-to-end encrypted credential sharing without leaving the editor.

```
src/
├── extension.ts          # Entry point — registers all commands
├── commands/
│   ├── shareFile.ts      # "Share securely" — right-click on .env in Explorer
│   └── openNote.ts       # "Envoy: Open Note" — Command Palette, paste URL
├── crypto/
│   ├── keys.ts           # Random baseKey via crypto.getRandomValues
│   ├── encrypt.ts        # PBKDF2(baseKey+password) → AES-GCM 256 encrypt
│   └── decrypt.ts        # PBKDF2(baseKey+password) → AES-GCM 256 decrypt
├── api/
│   └── enclosedClient.ts # POST /api/notes (create) + GET /api/notes/:id (fetch)
├── ui/
│   ├── sharePanel.ts     # Quick Pick for TTL / password / delete-after-read
│   └── receivePanel.ts   # Input Box for URL + optional password prompt
└── config/
    └── settings.ts       # Reads enclosed.instanceUrl, defaultTtl, deleteAfterReading
```

**Data flow (send):** file content → encrypt (AES-GCM) → POST to Enclosed API → assemble link `{instanceUrl}/{noteId}#{[pw:][dar:]baseKey}` → copy to clipboard.

**Data flow (receive):** paste link → extract noteId from URL **path** and baseKey from URL **fragment** (strip optional `pw:` / `dar:` flag prefixes, key is always the last colon-separated segment) → GET encrypted note → PBKDF2 derive key → AES-GCM decrypt locally → open untitled editor.

The `baseKey` lives only in the URL fragment — never sent to the server. All crypto uses `crypto.subtle` (Web Crypto API, no external deps).

## Conventions & Patterns

- **No external crypto deps** — use only `crypto.subtle` natively available in the VS Code Extension Host (Node 18+).
- **No external HTTP deps** — use native `fetch` (Node 18+).
- **baseKey is never logged** — not in console, not in error messages, not in telemetry.
- **Passwords never stored** — always via `vscode.window.showInputBox({ password: true })`, never cached or persisted.
- **Crypto params must match Enclosed app-client exactly** — before changing any PBKDF2/AES param (salt, iterations, IV length), verify against `packages/app-client` in the Enclosed source. Interoperability with the web app depends on this.
- **Validate instanceUrl before fetch** — check it's a valid URL and matches the configured instance to prevent SSRF.
- **Untitled documents for decrypted content** — never auto-save; the user explicitly saves if they want persistence.
- **TypeScript strict mode** — `"strict": true` in tsconfig.json.
- **Tests co-located** — `src/crypto/*.test.ts` alongside implementation files.

## Versioning & Changelog

- **Versioning is always a developer decision** — never bump version or create git tags autonomously. Only do so when explicitly asked.
- **Changelog follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/)** — entries must be readable by anyone, not just developers. Describe what changed from the user's perspective. Never include implementation details (build system changes, refactors, internal restructuring).
