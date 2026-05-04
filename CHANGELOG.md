# Changelog

All notable changes to the Envoy extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

## [0.1.0] — 2026-05-04

### Added
- **Share securely with Enclosed** command — right-click any `.env` file in the Explorer to share it as an end-to-end encrypted, ephemeral link
- **Open Enclosed Note** command — paste an Enclosed link in the Command Palette to decrypt and view the note directly in the editor
- Shield icon in the Editor Toolbar when a `.env` file is active
- `enclosed.instanceUrl` setting to point to a self-hosted Enclosed instance
- `enclosed.defaultTtl` setting to configure the default link expiration time
- `enclosed.defaultDeleteAfterReading` setting to auto-destroy notes after they're opened
