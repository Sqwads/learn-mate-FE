# LearnMate (frontend)

Web client for **LearnMate**, a school-focused learning app where teachers manage classes and assignments, students submit work and take assessments, and administrators oversee users and analytics. Authentication is handled with **Supabase**; domain data is loaded from a separate **REST API** (see below).

## Tech stack

- [React](https://react.dev/) 18 · [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/) 6
- [Tailwind CSS](https://tailwindcss.com/) 4 (via `@tailwindcss/vite`)
- UI: [Radix UI](https://www.radix-ui.com/) primitives, [MUI](https://mui.com/) (icons/material), [Lucide](https://lucide.dev/) icons, [Sonner](https://sonner.emilkowal.ski/) toasts
- [Supabase JS](https://supabase.com/docs/reference/javascript/introduction) for auth
- [Axios](https://axios-http.com/) for HTTP calls to the backend

## Prerequisites

- [Node.js](https://nodejs.org/) 18+ (20 LTS recommended)

## Setup

1. Clone the repository and install dependencies:

   ```bash
   npm install
   ```

2. Create a `.env` file in the project root (Vite only exposes variables prefixed with `VITE_`):

   ```bash
   VITE_SUPABASE_URL=https://<your-project>.supabase.co
   VITE_SUPABASE_PUBLISHABLE_DEFAULT_KEY=<your-anon-or-publishable-key>
   ```

   Use the **Project URL** and **anon / public** key from your Supabase project settings.

3. Start the dev server (listens on all interfaces so you can open it from other devices on the network):

   ```bash
   npm run dev
   ```

   Open the URL printed in the terminal (typically `http://localhost:5173`).

## Scripts

| Command       | Description                          |
| ------------- | ------------------------------------ |
| `npm run dev` | Start Vite in development with `--host` |
| `npm run build` | Production build to `dist/`        |

## Project layout

- `index.html` — entry HTML
- `src/main.tsx` — React bootstrap
- `src/app/App.tsx` — auth session, role routing (teacher, student, admin, superuser)
- `src/app/components/` — feature UI (nested by role: `teacher/`, `student/`, `admin/`, `superadmin/`)
- `src/app/components/ui/` — shared UI primitives (Radix-based)
- `src/styles/` — global styles
- `vite.config.ts` — Vite config; path alias `@` → `src/`

## Backend API

REST calls in this repo currently use a **hard-coded base URL** pointing at a hosted LearnMate backend. To point the app at another environment, search the codebase for that URL and replace it consistently, or refactor to a single `VITE_API_BASE_URL` (or similar) and use it everywhere—there is no env-based API URL yet.

Ensure your Supabase project and backend are configured so that signed-in users match the user records the API expects (e.g. `/auth/me` keyed by Supabase user id).

## License

Private project (`"private": true` in `package.json`). Add a license file if you intend to distribute the code.
