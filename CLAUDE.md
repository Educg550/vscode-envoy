# Project Instructions for AI Agents

This file provides instructions and context for AI coding agents working on this project.

<!-- BEGIN BEADS INTEGRATION v:1 profile:minimal hash:ca08a54f -->
## Beads Issue Tracker

This project uses **bd (beads)** for issue tracking. Run `bd prime` to see full workflow context and commands.

### Quick Reference

```bash
bd ready              # Find available work
bd show <id>          # View issue details
bd update <id> --claim  # Claim work
bd close <id>         # Complete work
```

### Rules

- Use `bd` for ALL task tracking — do NOT use TodoWrite, TaskCreate, or markdown TODO lists
- Run `bd prime` for detailed command reference and session close protocol
- Use `bd remember` for persistent knowledge — do NOT use MEMORY.md files

## Session Completion

**When ending a work session**, you MUST complete ALL steps below. Work is NOT complete until `git push` succeeds.

**MANDATORY WORKFLOW:**

1. **File issues for remaining work** - Create issues for anything that needs follow-up
2. **Run quality gates** (if code changed) - Tests, linters, builds
3. **Update issue status** - Close finished work, update in-progress items
4. **PUSH TO REMOTE** - This is MANDATORY:
   ```bash
   git pull --rebase
   bd dolt push
   git push
   git status  # MUST show "up to date with origin"
   ```
5. **Clean up** - Clear stashes, prune remote branches
6. **Verify** - All changes committed AND pushed
7. **Hand off** - Provide context for next session

**CRITICAL RULES:**
- Work is NOT complete until `git push` succeeds
- NEVER stop before pushing - that leaves work stranded locally
- NEVER say "ready to push when you are" - YOU must push
- If push fails, resolve and retry until it succeeds
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
│   └── openNote.ts       # "Open Enclosed Note" — Command Palette, paste URL
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

**Data flow (send):** file content → encrypt (AES-GCM) → POST to Enclosed API → assemble link `{instanceUrl}/#noteId/baseKey` → copy to clipboard.

**Data flow (receive):** paste link → extract noteId + baseKey from URL fragment → GET encrypted note → PBKDF2 derive key → AES-GCM decrypt locally → open untitled editor.

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
