# Mental Care Group Prototyping

Built with a cutting-edge tech stack focused on performance, developer experience, and user privacy.

## Prerequisites

Before setting up the project, install the following on your machine.

### Node.js v22

| OS | How to install |
|----|----------------|
| **Windows** | [nodejs.org](https://nodejs.org/) installer, or `winget install OpenJS.NodeJS.LTS`, or [nvm-windows](https://github.com/coreybutler/nvm-windows) |
| **macOS** | [Homebrew](https://brew.sh/): `brew install node`, or [nvm](https://github.com/nvm-sh/nvm): `nvm install 22` |
| **Linux** | [nvm](https://github.com/nvm-sh/nvm) or [fnm](https://github.com/Schniz/fnm), or your distro’s package manager (e.g. `apt install nodejs`) |

### Package manager: Bun

This project uses **Bun** as the package manager (see `packageManager` in `package.json`).

| OS | How to install Bun |
|----|--------------------|
| **Windows** | `powershell -c "irm bun.sh/install.ps1 \| iex"` |
| **macOS** | `curl -fsSL https://bun.sh/install \| bash` |
| **Linux** | `curl -fsSL https://bun.sh/install \| bash` |

Verify with: `bun --version`.

### Docker (required for local Supabase)

Supabase runs locally via Docker. Install Docker Desktop (or Docker Engine + Docker Compose).

| OS | How to install |
|----|----------------|
| **Windows** | [Docker Desktop for Windows](https://docs.docker.com/desktop/install/windows-install/) (WSL2 backend recommended) |
| **macOS** | [Docker Desktop for Mac](https://docs.docker.com/desktop/install/mac-install/) (Apple Silicon or Intel) |
| **Linux** | [Docker Engine](https://docs.docker.com/engine/install/) + [Docker Compose](https://docs.docker.com/compose/install/) for your distro |

Ensure Docker is running before starting Supabase.

### Supabase CLI

Used to run the local database, apply migrations, and open Studio.

| OS | How to install |
|----|----------------|
| **Windows** | `scoop bucket add supabase https://github.com/supabase/scoop-bucket.git` then `scoop install supabase`, or `npm install -g supabase` |
| **macOS** | `brew install supabase/tap/supabase` or `npm install -g supabase` |
| **Linux** | [Install script](https://supabase.com/docs/guides/cli/getting-started#install-the-supabase-cli) or `npm install -g supabase` |

Verify with: `supabase --version`.

---

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd MentalCareGroup
```

### 2. Environment variables

Copy the example env file and fill in values (for local dev, the defaults point to the local Supabase instance):

```bash
# Windows (PowerShell)
copy .env.example .env

# macOS / Linux
cp .env.example .env
```

Edit `.env` if you need to change URLs or keys (see [Environment Variables](#environment-variables) below).

### 3. Start the local database (Supabase)

From the project root, start Supabase (requires Docker to be running):

```bash
supabase start
```

On first run this can take a few minutes. When it finishes, you’ll see local URLs and keys. Use these in `.env` if you’re not already using the defaults from `.env.example`.

- **Studio (DB UI):** `http://127.0.0.1:54323`
- **anon key** and **service_role key** are printed in the terminal; put them in `NUXT_PUBLIC_SUPABASE_KEY` and `NUXT_SUPABASE_SECRET_KEY` if they differ from `.env.example`.

Migrations in `supabase/migrations/` are applied automatically when you run `supabase start`. To reset the DB and re-run migrations and seeds:

```bash
supabase db reset
```

### 4. Install dependencies and run the app

```bash
# Install dependencies
bun install

# Start the development server
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Other commands

```bash
# Lint
bun run lint

# Type check
bun run typecheck

# Production build
bun run build

# Preview production build
bun run preview
```

---

## Database (Supabase)

- **Local:** `supabase start` runs PostgreSQL, Auth, Studio, etc. in Docker.
- **Migrations:** Stored in `supabase/migrations/`. Applied automatically on `supabase start`; use `supabase db reset` to reapply from scratch (including `supabase/seed.sql`).
- **Studio:** After `supabase start`, open [http://127.0.0.1:54323](http://127.0.0.1:54323) to manage data and run SQL.
- **Stop local Supabase:** `supabase stop`

---

## Project Structure

```
├── app/
│   ├── components/     # Vue components
│   ├── composables/    # Reusable composition functions
│   ├── layouts/        # Page layouts
│   ├── pages/          # File-based routing
│   └── utils/          # Utility functions
├── server/
│   └── api/            # Server API routes
├── supabase/
│   ├── migrations/     # Database migrations
│   ├── config.toml     # Local Supabase config
│   └── seed.sql        # Seed data (optional)
├── public/             # Static assets
├── nuxt.config.ts      # Nuxt configuration
└── .env                # Environment variables (create from .env.example)
```
