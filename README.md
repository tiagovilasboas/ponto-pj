# Ponto PJ

Personal time clock for Brazilian PJ contractors: clock in/out, edit sessions, browse monthly history, export a PDF.

Demo: [ponto-pj.vercel.app](https://ponto-pj.vercel.app)

This is a personal app with a public demo, not a multi-tenant product. Running it locally needs your own Supabase project.

## Start

Prerequisites: Node.js 18+, npm, and a [Supabase](https://supabase.com/) project.

```bash
git clone https://github.com/tiagovilasboas/ponto-pj.git
cd ponto-pj
npm install
cp .env.example .env
```

Fill `.env` with the project URL and anon key from Supabase **Settings → API**.

```bash
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_KEY=your-anon-key
VITE_APP_URL=http://localhost:5173
```

Create tables `users` and `work_sessions` (with RLS) using [DATABASE_SETUP.md](DATABASE_SETUP.md). Auth email and redirect notes: [SUPABASE_SETUP.md](SUPABASE_SETUP.md).

```bash
npm run dev
```

The app is at http://localhost:5173.

```bash
npm run lint
npm run type-check
npm run test:run
npm run build
```

## Stack

- React 19, TypeScript, Vite
- Mantine UI, Tailwind CSS
- Zustand, React Router 6
- Supabase (Postgres, Auth, RLS)
- i18next (`pt-BR`, `en-US`)
- vite-plugin-pwa
- Vitest, Testing Library
- Vercel (demo host; Analytics / Speed Insights in production)

## Scope

What it does:

- Sign up, login, password reset (Supabase Auth)
- Clock in and out for the current day
- Manual time entry and session edits
- Monthly history and a PDF report
- Offline-capable PWA install

What it is not:

- An HR or payroll system
- Multi-company or team timesheets
- A drop-in product without your own backend

Security notes shipped with the repo: [SECURITY.md](SECURITY.md). License: [MIT](LICENSE).
