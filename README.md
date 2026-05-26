# Retail Pocket PWA

Retail Pocket is an offline-first Progressive Web App for a small retail shop. It uses React, TypeScript, Vite, Tailwind CSS, TanStack Query, Zustand, React Hook Form, Zod, Recharts, and Dexie-powered IndexedDB.

## What Is Included

- Installable PWA with generated service worker, manifest, offline caching, app icon, and standalone display mode.
- Local IndexedDB database for products, sales, and users.
- Admin role with inventory CRUD, sales recording, analytics, reports, exports, sharing, and employee management.
- Employee role with a restricted stock view showing only product names and available quantities.
- Stock tracking that automatically deducts inventory when sales are recorded.
- Analytics cards and charts for investment, revenue, profit, daily/weekly/monthly profit, product-wise profit, best sellers, and stock alerts.
- Sales, profit, inventory, and employee-safe stock exports in CSV/text/PDF formats.
- Sync-ready repository and metadata structure for adding Firebase, Supabase, or a custom backend later.

## Demo Login

Admin:

```text
username: admin
password: admin123
```

Employee:

```text
username: employee
password: employee123
```

Change these defaults in `.env` before production use.

## Setup

```bash
npm install
npm run dev
```

Open the local URL printed by Vite, usually:

```text
http://localhost:5173
```

Production build:

```bash
npm run build
npm run preview
```

The installable PWA output is generated in `dist/`.

## Environment Configuration

Create `.env` from `.env.example`:

```bash
cp .env.example .env
```

Available variables:

```text
VITE_APP_NAME="Retail Pocket"
VITE_SYNC_ENDPOINT=""
VITE_ENABLE_PUSH_NOTIFICATIONS=false
VITE_DEMO_ADMIN_USERNAME=admin
VITE_DEMO_ADMIN_PASSWORD=admin123
VITE_DEMO_EMPLOYEE_USERNAME=employee
VITE_DEMO_EMPLOYEE_PASSWORD=employee123
```

For a real deployment, rotate the demo credentials immediately after first login or seed your own users.

## Folder Structure

```text
src/
  components/        Reusable UI, charts, and layout
  data/              Dexie database and seed data
  features/          Auth, dashboard, inventory, sales, reports, sharing, employee views
  hooks/             TanStack Query hooks
  lib/               Analytics, exports, dates, validation, security helpers
  repositories/      IndexedDB data access layer
  services/          Sync adapter and notifications
  stores/            Zustand auth store
  types/             Shared TypeScript models
```

## Architecture Notes

The app is offline-first. UI components call typed hooks, hooks call repositories, and repositories write to IndexedDB. Product and sale records include `syncStatus`, `updatedAt`, and `deviceId`, so a future cloud adapter can push pending changes and pull server updates without rewriting the UI.

RBAC is enforced at route and component level. Employee routes never render inventory prices, buying prices, revenue, profit, reports, analytics, or management screens.

Because this is a frontend-only offline app, local RBAC should be treated as client-side protection. For multi-device or adversarial environments, add a backend auth service and issue server-signed JWTs.

## Deployment

1. Run `npm run build`.
2. Deploy the `dist/` folder to a static host such as Netlify, Vercel static output, Firebase Hosting, Cloudflare Pages, or S3 + CloudFront.
3. Serve over HTTPS. Browsers require HTTPS for service workers, install prompts, and most PWA APIs.
4. Configure the host to fall back all routes to `index.html`.
5. Verify `dist/manifest.webmanifest` and `dist/sw.js` are served with correct content types.

## Useful Commands

```bash
npm run dev      # local development
npm run build    # type-check and production PWA build
npm run preview  # preview the production build
npm run lint     # TypeScript check only
```
