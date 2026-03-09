# OpenClaw — Repository Overview (Agent Quick Reference)

> **Canonical guide:** `AGENTS.md` (symlinked as `CLAUDE.md`). This file is a concise orientation map; always defer to `AGENTS.md` for authoritative rules.

---

## What Is OpenClaw

OpenClaw is a personal AI assistant that runs on your own devices. It exposes a single WebSocket Gateway that routes conversations from 24+ messaging channels (WhatsApp, Telegram, Slack, Discord, Signal, iMessage, Google Chat, Matrix, MS Teams, and more) to an AI agent loop. It runs on macOS, iOS, Android, Linux, Raspberry Pi, and Docker.

---

## Directory Map

| Path | Purpose |
|------|---------|
| `src/` | Core TypeScript source (77 subsystems) |
| `src/gateway/` | WebSocket control plane, session management |
| `src/agents/` | Agent loop, prompting, tool calling, ACP |
| `src/cli/` | CLI command wiring |
| `src/commands/` | Command implementations |
| `src/channels/` | Shared channel routing / base types |
| `src/telegram/`, `src/discord/`, `src/slack/`, `src/signal/`, `src/imessage/`, `src/web/` | Core built-in channel integrations |
| `src/infra/` | Infrastructure utilities |
| `src/config/` | Configuration schema and validation |
| `src/plugin-sdk/` | Plugin SDK (exported to extensions) |
| `extensions/` | Extension/plugin workspace packages (42 packages) |
| `apps/macos/` | macOS menu bar app (Swift/SwiftUI) |
| `apps/ios/` | iOS app |
| `apps/android/` | Android app |
| `ui/` | Control UI and web interface |
| `docs/` | Mintlify documentation (https://docs.openclaw.ai) |
| `docs/ai/` | Internal agent quick-reference docs (this directory) |
| `scripts/` | Build, release, packaging, and utility scripts |
| `.agents/` | Agent/maintainer guidance; skills in `.agents/skills/` |
| `.github/` | CI workflows, issue templates, PR template, labeler |
| `dist/` | Built output (generated, do not edit) |
| `packages/` | Additional workspace packages |
| `test/`, `test-fixtures/` | Test fixtures and utilities |
| `vendor/` | Vendored dependencies |

---

## Key File Quick Reference

| File | Purpose |
|------|---------|
| `AGENTS.md` | **Canonical** AI/agent guide (CLAUDE.md is a symlink) |
| `CONTRIBUTING.md` | Human contributor guide |
| `SECURITY.md` | Security policy; read before any triage/severity decision |
| `CHANGELOG.md` | Version history (append-only; user-facing only) |
| `VISION.md` | Project vision statement |
| `package.json` | Root workspace; version, scripts, pnpm workspaces |
| `pnpm-workspace.yaml` | Workspace members: `.`, `ui/`, `packages/*`, `extensions/*` |
| `tsconfig.json` | TypeScript config (ES2023, strict mode) |
| `vitest.config.ts` | Default test config (unit/integration) |
| `.oxlintrc.json` | Lint rules |
| `.oxfmtrc.jsonc` | Format rules |
| `.env.example` | Environment variable reference |
| `.pre-commit-config.yaml` | Pre-commit hooks (run `prek install`) |
| `docs/reference/RELEASING.md` | Release checklist (read before any release work) |
| `.agents/skills/PR_WORKFLOW.md` | Full maintainer PR workflow |
| `.github/pull_request_template.md` | Canonical PR template |

---

## Technology Stack

- **Language:** TypeScript (ESM, strict)
- **Package manager:** pnpm (preferred); Bun also supported
- **Runtime:** Node 22+ (production); Bun (dev/scripts/tests preferred)
- **Testing:** Vitest with V8 coverage (70% threshold)
- **Lint/format:** Oxlint + Oxfmt (`pnpm check` / `pnpm format:fix`)
- **Build:** `tsdown` + TypeScript (`pnpm build`)
- **Mobile:** Swift/SwiftUI (macOS/iOS), Kotlin (Android)

---

## Release Channels

| Channel | Tag pattern | npm dist-tag | Notes |
|---------|------------|--------------|-------|
| stable | `vYYYY.M.D` | `latest` | Tagged releases only |
| beta | `vYYYY.M.D-beta.N` | `beta` | Prerelease tags |
| dev | (none) | — | `main` branch head |

Version locations: `package.json`, `apps/android/app/build.gradle.kts`, `apps/ios/Sources/Info.plist`, `apps/macos/Sources/OpenClaw/Resources/Info.plist`. "Bump version everywhere" means all these locations (never `appcast.xml` unless cutting a Sparkle release).

---

## Subdirectory AGENTS.md Files

Some subdirectories have their own `AGENTS.md` with domain-specific notes (additive to root `AGENTS.md`):

- `src/gateway/server-methods/AGENTS.md`
- `docs/reference/templates/AGENTS.md`

---

## See Also

- `docs/ai/WORKFLOWS.md` — dev/test/release command reference
- `docs/ai/ARCHITECTURE.md` — system architecture and module map
- `docs/ai/USER_NOTES.md` — user-specific preferences (not project-owned)
