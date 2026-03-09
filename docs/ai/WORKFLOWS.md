# OpenClaw — Workflows (Agent Quick Reference)

> For full rules see `AGENTS.md`. This file is a distilled command/workflow reference.

---

## Dev Setup

```bash
pnpm install          # install all workspace deps
prek install          # install pre-commit hooks (runs same checks as CI)
```

If `node_modules` is missing or a tool is not found, run `pnpm install` once then retry.

---

## Core Command Loop

| Command | Purpose |
|---------|---------|
| `pnpm build` | TypeScript compile → `dist/` |
| `pnpm tsgo` | Type-check only (no emit) |
| `pnpm check` | Lint + format check (Oxlint + Oxfmt) |
| `pnpm format:fix` | Auto-fix formatting (Oxfmt --write) |
| `pnpm test` | Unit + integration tests (Vitest) |
| `pnpm test:coverage` | Tests with V8 coverage report |
| `pnpm openclaw ...` | Run CLI in dev mode (Bun) |
| `pnpm dev` | Alias for dev CLI |

Run `pnpm check` before every commit. Run `pnpm build` after any lazy-loading/module boundary refactor to check for `[INEFFECTIVE_DYNAMIC_IMPORT]` warnings.

---

## Testing

### Test tiers

| Tier | Command | When |
|------|---------|------|
| Unit/integration | `pnpm test` | Always; required in CI |
| E2E gateway | `pnpm test:e2e` | Optional CI; WebSocket smoke |
| Live (real keys) | `CLAWDBOT_LIVE_TEST=1 pnpm test:live` | Manual only |
| Docker models | `pnpm test:docker:live-models` | Manual only |
| Onboarding E2E | `pnpm test:docker:onboard` | Manual only |

### Low-memory mode (non-Mac-Studio hosts)

```bash
OPENCLAW_TEST_PROFILE=low OPENCLAW_TEST_SERIAL_GATEWAY=1 pnpm test
```

### Coverage threshold
70% lines/branches/functions/statements (enforced by Vitest V8).

### Test file naming
- Unit/integration: `*.test.ts` (colocated with source)
- E2E: `*.e2e.test.ts`
- Live: `*.live.test.ts`

---

## Commit Workflow

Use `scripts/committer` to stage and commit (keeps staging scoped):

```bash
scripts/committer "CLI: add verbose flag to send" src/cli/send.ts src/cli/types.ts
```

- Follow Conventional Commit style: `Area: action description` (e.g., `Gateway: fix session leak`)
- Group related changes; no bundling of unrelated refactors
- For the full maintainer workflow (triage order, quality bar, rebase rules): `.agents/skills/PR_WORKFLOW.md`

---

## PR Workflow

1. **Before submitting:** `pnpm check && pnpm test`
2. **PR template:** `.github/pull_request_template.md`
3. **Bot review conversations:** address and resolve them yourself after fixing; leave unresolved only when reviewer judgment is still needed
4. **Full process:** `.agents/skills/PR_WORKFLOW.md` (`review-pr` → `prepare-pr` → `merge-pr` pipeline)
5. **Landing a PR:** follow `~/.codex/prompts/landpr.md` (global)

---

## Release Workflow

> **Always read `docs/reference/RELEASING.md` before any release work.**
> **Never bump version numbers without operator's explicit consent.**
> **Never run `npm publish` without explicit instruction.**

Pre-release checks:
```bash
node --import tsx scripts/release-check.ts
pnpm release:check
pnpm test:install:smoke   # or OPENCLAW_INSTALL_SMOKE_SKIP_NONROOT=1 pnpm test:install:smoke
```

Version locations to update (all of these, never appcast.xml unless cutting a Sparkle release):
- `package.json`
- `apps/android/app/build.gradle.kts` (versionName + versionCode)
- `apps/ios/Sources/Info.plist` + `apps/ios/Tests/Info.plist`
- `apps/macos/Sources/OpenClaw/Resources/Info.plist`
- `docs/install/updating.md` (pinned npm version)

npm publish (inside tmux, 1Password OTP):
```bash
npm publish --access public --otp="<otp>"
```

---

## Plugin / Extension Development

- Keep plugin-only deps in the extension's `package.json`, not root
- Runtime deps → `dependencies`; avoid `workspace:*` in `dependencies` (breaks `npm install --omit=dev`)
- Put `openclaw` in `devDependencies` or `peerDependencies`; runtime resolves `openclaw/plugin-sdk` via jiti alias
- After adding a channel/extension: update `.github/labeler.yml` and create matching GitHub labels

Published extensions use the `@openclaw/<name>` npm scope. Full plugin list: `docs/reference/RELEASING.md`.

---

## Docs Editing (Mintlify)

> `docs/ai/` files (this directory) are NOT Mintlify-published. Do not add them to `docs/docs.json`.

For Mintlify `docs/**` files:
- Internal links: root-relative, no `.md`/`.mdx` suffix (e.g., `[Config](/configuration)`)
- Alphabetical order for service/provider lists (unless describing runtime execution order)
- No em dashes (`—`) or apostrophes in headings (break Mintlify anchor links)
- Docs content must be generic: no personal device names; use placeholders like `user@gateway-host`
- Do NOT edit `docs/zh-CN/**` directly (generated); run `scripts/docs-i18n` pipeline instead
- When touching docs, end reply with the `https://docs.openclaw.ai/...` URLs you referenced

---

## macOS App

- Build (dev, current arch): `scripts/package-mac-app.sh`
- Full release checklist: `docs/platforms/mac/release.md`
- Do NOT rebuild the macOS app over SSH; must run directly on the Mac
- Restart gateway via the OpenClaw Mac app or `scripts/restart-mac.sh`

---

## Lint / Format Churn Policy

- Formatting-only staged+unstaged diffs: auto-resolve without asking
- If commit/push already requested: include formatting-only follow-ups in the same commit (or tiny follow-up), no extra confirmation
- Only ask when changes are semantic (logic/data/behavior)
