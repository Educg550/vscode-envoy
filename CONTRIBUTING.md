# Contributing to Envoy

Thanks for thinking about contributing! Envoy is a small extension and every contribution is welcome.

This guide covers how to get set up, what we expect from a pull request, and the workflow that keeps the project healthy.

## Getting started

### Prerequisites

- [Node.js](https://nodejs.org/) 18 or later (the VS Code Extension Host uses Node 18+)
- [VS Code](https://code.visualstudio.com/) 1.118 or later
- [Git](https://git-scm.com/)

### Set up your dev environment

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/vscode-envoy.git
   cd vscode-envoy
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Open the project in VS Code. When prompted, install the **recommended workspace extensions**. Two are important:

   - `dbaeumer.vscode-eslint`: lint errors shown as you type;
   - `connor4312.esbuild-problem-matchers`: required for the **F5 / Run Extension** task to report build errors correctly. Without it, the Extension Development Host may not launch correctly.

4. Press **F5** to launch the Extension Development Host. A new VS Code window opens with Envoy loaded: try sharing a `.env` file from the Explorer to confirm everything works.

## Commands you'll use

```bash
npm run compile      # type-check + bundle once
npm run watch        # type-check + bundle on every save (recommended while developing)
npm run lint         # ESLint
npm test             # Vitest unit tests
npm run package      # production bundle (used by vsce before packaging)
```

## Tests

**Before opening a pull request, make sure `npm test` and `npm run lint` both pass.** CI will fail otherwise.

If your change adds or modifies behavior, please add tests for it:

- Tests live next to the code they cover: `src/crypto/encrypt.ts` → `src/crypto/encrypt.test.ts`
- We use [Vitest](https://vitest.dev/), no setup needed
- Crypto changes especially must keep the existing round-trip tests passing

## Pull requests

### Branch & commit naming

We use [Conventional Commits](https://www.conventionalcommits.org/) for both commit messages and PR titles. The prefix tells reviewers and the changelog generator what kind of change this is:

| Prefix      | Use for                                                      |
| ----------- | ------------------------------------------------------------ |
| `feat:`     | A new user-facing feature                                    |
| `fix:`      | A bug fix                                                    |
| `docs:`     | Documentation only — README, CONTRIBUTING, comments, etc.    |
| `refactor:` | Code change that neither fixes a bug nor adds a feature      |
| `test:`     | Adding or updating tests                                     |
| `chore:`    | Tooling, dependencies, build config, release commits         |

A scope is optional but helpful: `feat(shareFile): add file size warning`, `fix(crypto): correct IV length`.

### PR description

The repo has a [pull request template](.github/PULL_REQUEST_TEMPLATE.md).
Please open a PR from a named branch from your fork into `main` on this repo.

### Review checklist (self-review before requesting review)

- [ ] `npm test` passes
- [ ] `npm run lint` passes
- [ ] New behavior has tests (or the PR explains why it can't)
- [ ] CHANGELOG.md has an entry under `## [Unreleased]` if the change is user-visible. Implementation details (refactors, internal tooling) do not need a changelog entry. See [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) for the format
- [ ] No real secrets, tokens, or `.env` content committed
- [ ] No new runtime dependencies for crypto or HTTP. Envoy uses `crypto.subtle` and native `fetch` only

## Reporting bugs and requesting features

Use the issue templates on GitHub. If none of the templates fit, open a blank issue and tell us what you'd like to discuss.

## Security

If you find a security issue, **please do not open a public issue**. [Email me directly](mailto:eduardo9cruz@outlook.com) so we can coordinate a fix before disclosure.

## Code of conduct

Be kind, assume good intent, and remember there's a human on the other side of every PR. We expect everyone to behave like the [Contributor Covenant](https://www.contributor-covenant.org/) describes.

## Thank you

Seriously, thank you for reading this far. Open-source extensions live or die by their contributors, and we appreciate you taking the time.
