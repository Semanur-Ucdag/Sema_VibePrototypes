# Mental Care Group Prototyping

Research-focused prototype for mental care workflows, optimized for fast local startup.

## Prerequisites

Install Bun:

- **Windows:** `powershell -c "irm bun.sh/install.ps1 | iex"`
- **macOS / Linux:** `curl -fsSL https://bun.sh/install | bash`

Verify with `bun --version`.

## Quick Start

```bash
# 1) Install dependencies
bun install

# 2) Create local env file
# Windows (PowerShell)
copy .env.example .env
# macOS / Linux
cp .env.example .env

# 3) Start the app
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Local Auth + SQLite

- Local SQLite is created automatically on first run (`LOCAL_SQLITE_PATH`, default: `data/app.db`).
- Auth uses local email/password with HTTP-only cookie sessions.
- Two local demo accounts are seeded automatically:
  - `therapist@local.dev` / `Password123!`
  - `client@local.dev` / `Password123!`

## Commands

```bash
bun run lint
bun run typecheck
bun run build
bun run preview
```
