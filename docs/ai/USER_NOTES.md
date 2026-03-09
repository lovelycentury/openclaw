# User Notes (Agent Session Preferences)

> **This file is user-owned, not project-owned.**
> It captures session preferences and workflow habits for this specific user.
> Do NOT commit this file unless the user explicitly requests it.
> Do NOT treat these notes as project policy — they apply only to interactions with this user.

---

## Tool Use

- **Auto-approve edits:** User has confirmed "edit automatically" — proceed with file edits without asking for per-edit confirmation. Still confirm before destructive operations (force-push, branch deletion, npm publish, dropping data).

---

## Communication Style

- Concise and direct — no filler text, no preamble, no "Let me ..." framing
- No emojis unless explicitly requested
- File references: use markdown `[file.ts](path/to/file.ts)` link syntax (clickable in VSCode)
- Keep responses short; lead with the answer or action

---

## File Reference Format

Per `AGENTS.md`: file references must be repo-root relative only.
In VSCode context: wrap in markdown link syntax for clickability — `[filename.ts](src/filename.ts#L42)`.

---

## Workflow Preferences

- Do not ask for confirmation on formatting-only changes
- Do not create documentation files unless explicitly requested
- Do not add changelog entries for pure test additions unless asked
- Do not bump version numbers without explicit operator consent

---

## Notes on This Repo

- Maintainer: Oleksii Kryshtopa
- Working directory: repo root
- Primary interaction: VSCode extension (Claude Code)
