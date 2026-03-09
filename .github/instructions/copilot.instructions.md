# Copilot-Specific Instructions

> **Shared conventions live in `AGENTS.md` (repo root).**
> Read it for: project structure, build/test/lint commands, coding style,
> naming conventions, commit guidelines, testing, release workflows, and
> multi-agent safety rules. Do not duplicate that content here.

## Anti-Redundancy Rules

- Avoid files that just re-export from another file. Import directly from the original source.
- If a function already exists, import it — do NOT create a duplicate in another file.
- Before creating any formatter, utility, or helper, search for existing implementations first.

## Source of Truth Locations

### Formatting Utilities (`src/infra/`)

- **Time formatting**: `src/infra/format-time`

**NEVER create local `formatAge`, `formatDuration`, `formatElapsedTime` functions — import from centralized modules.**

### Terminal Output (`src/terminal/`)

- Tables: `src/terminal/table.ts` (`renderTable`)
- Themes/colors: `src/terminal/theme.ts` (`theme.success`, `theme.muted`, etc.)
- Progress: `src/cli/progress.ts` (spinners, progress bars)

### CLI Patterns

- CLI option wiring: `src/cli/`
- Commands: `src/commands/`
- Dependency injection via `createDefaultDeps`

## Import Conventions

- Use `.js` extension for cross-package imports (ESM)
- Direct imports only — no re-export wrapper files
- Types: `import type { X }` for type-only imports

## Git Commits (Copilot context)

- When coding together with a human in VS Code, use `git` directly (not `scripts/committer`) and run quality checks (`pnpm check`, `pnpm tsgo`, `pnpm test`) manually.
- When working autonomously (no human pair), follow AGENTS.md commit conventions (`scripts/committer`).
