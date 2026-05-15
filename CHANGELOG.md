# Changelog

All notable changes to the Envoy extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [1.0.0] — 2026-05-15

### Added

- Receivers can now open an Envoy note directly from a `vscode://` deep link — no Command Palette required. The link is available via the "Copy VS Code link" button in the share notification
- New setting `envoy.shouldCopyEnclosedUrl` (default `true`): controls whether the web link or the VS Code deep link is copied to clipboard when sharing

### Changed — Breaking

- **Command IDs renamed**: All extension commands have been renamed from `enclosed.*` to `envoy.*`:
  - `enclosed.shareFile` → `envoy.shareFile`
  - `enclosed.openNote` → `envoy.openNote`

  If you have these commands bound to custom keyboard shortcuts, you must update your keybindings.

- **Settings renamed**: All extension settings have been renamed from `enclosed.*` to `envoy.*`:
  - `enclosed.instanceUrl` → `envoy.enclosedInstanceUrl`
  - `enclosed.defaultTtl` → `envoy.defaultTtl`
  - `enclosed.defaultDeleteAfterReading` → `envoy.defaultDeleteAfterReading`

  Users with custom values in `settings.json` must rename these keys manually.

## [0.3.0] — 2026-05-14

### Added

- Delete-after-reading can now be toggled directly in the share panel before sending a note, without changing the default setting

### Changed

- All extension labels, commands, and notifications now say "Envoy" instead of "Enclosed".
  This is primarily a product decision, as infraestructure still uses the main `enclosed.cc` instance as default.

## [0.2.0] — 2026-05-14

### Fixed

- Notes shared from the extension now open correctly on enclosed.cc. Previously, all shared notes were unreadable in the browser due to an incompatible payload format
- Opening a password-protected note now prompts for the password as expected
- Sharing files larger than a few kilobytes no longer fails with an unexpected error
- Notes received from Enclosed could not be decrypted due to the encryption key being extracted from the wrong part of the URL

## [0.1.0] — 2026-05-04

### Added

- **Share securely with Enclosed** command — right-click any `.env` file in the Explorer to share it as an end-to-end encrypted, ephemeral link
- **Open Enclosed Note** command — paste an Enclosed link in the Command Palette to decrypt and view the note directly in the editor
- Shield icon in the Editor Toolbar when a `.env` file is active
- `enclosed.instanceUrl` setting to point to a self-hosted Enclosed instance
- `enclosed.defaultTtl` setting to configure the default link expiration time
- `enclosed.defaultDeleteAfterReading` setting to auto-destroy notes after they're opened
