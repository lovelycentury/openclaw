# OpenClaw — Architecture (Agent Quick Reference)

> For full design context see `docs/concepts/architecture.md` and `SECURITY.md`. This file is a condensed reference map.

---

## System Model

```
  ┌─────────────────────────────────────────────────────┐
  │  Gateway  (WebSocket, loopback :18789 default)       │
  │                                                      │
  │  ┌──────────┐   ┌──────────┐   ┌─────────────────┐  │
  │  │ Clients  │   │  Agents  │   │  Channel         │  │
  │  │ (control │   │ (session │   │  Connectors      │  │
  │  │  UI, CLI)│   │  loops)  │   │  (built-in +     │  │
  │  └──────────┘   └──────────┘   │  extensions)     │  │
  │                                └─────────────────┘  │
  └─────────────────────────────────────────────────────┘
         │
    Device Nodes (macOS app, iOS, Android, Pi)
    — camera, system.run, notifications, Voice Wake
```

One gateway = one operator. The gateway runs on loopback by default; remote access via Tailscale Serve/Funnel or SSH tunnel.

---

## Gateway

- **Entry point:** `src/gateway/` — WebSocket server, session management, protocol handling
- **Boot sequence:** loads config → starts HTTP/WS listener → registers channels → accepts client/node connections
- **Protocol:** typed WebSocket messages; code-generated types (`docs/gateway/protocol.md`)
- **Configuration:** `~/.openclaw/openclaw.json` (chmod 600); managed via `openclaw config set`
- **Restart (macOS):** via OpenClaw Mac app or `scripts/restart-mac.sh` — not ad-hoc tmux

---

## Channel Taxonomy

### Core built-in channels (live in `src/`)
| Directory | Channel |
|-----------|---------|
| `src/telegram/` | Telegram (grammY) |
| `src/discord/` | Discord |
| `src/slack/` | Slack |
| `src/signal/` | Signal |
| `src/imessage/` | iMessage |
| `src/web/` | WhatsApp Web (Baileys) |
| `src/line/` | LINE |
| `src/channels/` | Shared routing, base types |
| `src/routing/` | Message routing logic |

### Extension channel plugins (live in `extensions/`)
`extensions/msteams`, `extensions/matrix`, `extensions/googlechat`, `extensions/feishu`, `extensions/mattermost`, `extensions/nextcloud-talk`, `extensions/irc`, `extensions/nostr`, `extensions/synology-chat`, `extensions/tlon`, `extensions/twitch`, `extensions/zalo`, `extensions/zalouser`, `extensions/bluebubbles`, `extensions/voice-call`

When refactoring shared channel logic (routing, allowlists, pairing, command gating, onboarding, docs) — consider **all** built-in + extension channels.

---

## Agent / Session Model

- **Agent loop:** `src/agents/` — orchestrates tool calls, context assembly, model streaming
- **ACP (Agent Control Protocol):** `src/acp/` — spawning, scoping, provenance tracking
- **Sessions:** `src/sessions/` — session IDs are routing identifiers, not security boundaries
- **Memory:** `src/memory/` — QMD + optional vector backends (`extensions/memory-lancedb`)
- **Context engine:** `src/context-engine/` — assembles context window for each turn
- **Multi-agent:** sessions are isolated workspaces; use `sessions_*` tools for coordination

---

## Trust Model

| Entity | Trust level |
|--------|-------------|
| Operator (gateway owner) | Full trust — controls all config, tool policies |
| Plugins (extensions) | Trusted — run in-process; treat as operator-level code |
| Session IDs | Routing only — not authentication or authorization |
| Shared gateways (multi-user) | Not recommended — no per-user authz boundary |

Before any security triage or severity decision, read `SECURITY.md`.

---

## Key `src/` Subsystems

| Module | Purpose |
|--------|---------|
| `src/agents/` | Agent loop, tool execution, ACP |
| `src/acp/` | Agent Control Protocol |
| `src/cli/` | CLI command wiring (program definition) |
| `src/commands/` | Command implementations (gateway, agent, models, …) |
| `src/gateway/` | WebSocket server, auth, lifecycle |
| `src/channels/` | Channel base types and routing |
| `src/routing/` | Message routing |
| `src/pairing/` | Device pairing |
| `src/media/` | Media pipeline (audio/video/images) |
| `src/media-understanding/` | Vision/audio analysis |
| `src/browser/` | Chrome/Chromium automation |
| `src/canvas-host/` | Canvas rendering, A2UI bundle |
| `src/memory/` | Session memory and context storage |
| `src/infra/` | Infrastructure utilities, Docker, VM, paths |
| `src/config/` | Configuration schema and management |
| `src/secrets/` | Credentials and secret management |
| `src/security/` | Permission models, security checks |
| `src/plugin-sdk/` | Plugin SDK (re-exported to extensions) |
| `src/plugins/` | Plugin management and loading |
| `src/cron/` | Cron job scheduling |
| `src/hooks/` | Webhook handlers |
| `src/node-host/` | Device node communication |
| `src/tts/` | Text-to-speech |
| `src/providers/` | LLM model provider integrations |
| `src/terminal/` | Terminal utilities — use `src/terminal/palette.ts` for colors, `src/terminal/table.ts` for tables |
| `src/cli/progress.ts` | CLI progress (osc-progress + @clack/prompts) — do not hand-roll spinners |

---

## Extension / Plugin System

- Extensions are pnpm workspace packages under `extensions/`
- At runtime, `openclaw/plugin-sdk` resolves via jiti alias
- Published to npm under `@openclaw/<name>` scope
- Plugin-only deps stay in the extension's own `package.json`
- Runtime deps → `dependencies`; `openclaw` → `devDependencies` or `peerDependencies`
- `npm install --omit=dev` runs inside plugin dir at install time

---

## Platform Apps

| App | Location | Stack |
|-----|----------|-------|
| macOS menu bar | `apps/macos/` | Swift/SwiftUI (`@Observable`, `@Bindable`) |
| iOS | `apps/ios/` | Swift/SwiftUI |
| Android | `apps/android/` | Kotlin |
| Control UI / WebChat | `ui/` | TypeScript |

SwiftUI state: prefer `Observation` framework (`@Observable`, `@Bindable`) over `ObservableObject`/`@StateObject`.

---

## Deployment Models

| Model | Description |
|-------|-------------|
| Local-first | Gateway on loopback; single user/host (default) |
| Remote via Tailscale | `tailscale serve` / `funnel` exposes gateway |
| Remote via SSH tunnel | Port-forward loopback to remote host |
| Docker | `Dockerfile` + `docker-compose`; optional Nix declarative mode |
| Cloud VMs | DigitalOcean, GCP, Hetzner, Oracle guides in `docs/platforms/` |
| Raspberry Pi | Documented in `docs/platforms/raspberry-pi.md` |

---

## See Also

- `docs/concepts/architecture.md` — full Gateway WebSocket network design
- `docs/gateway/configuration.md` — complete configuration reference
- `docs/gateway/protocol.md` — WebSocket wire protocol
- `SECURITY.md` — trust model, out-of-scope findings, operator assumptions
