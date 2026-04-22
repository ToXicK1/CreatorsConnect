# Workspace — Bharat Creator Hub

## Overview

India-focused creator marketplace (like Sideshift) connecting Indian creators with Indian brands. Built as a pnpm monorepo with TypeScript, Express API, PostgreSQL, and React frontend.

## Stack

- **Monorepo tool**: pnpm workspaces
- **Node.js version**: 24
- **Package manager**: pnpm
- **TypeScript version**: 5.9
- **API framework**: Express 5
- **Database**: PostgreSQL + Drizzle ORM
- **Validation**: Zod (`zod/v4`), `drizzle-zod`
- **API codegen**: Orval (from OpenAPI spec)
- **Build**: esbuild (CJS bundle)
- **Frontend**: React + Vite + Tailwind CSS (saffron/teal theme)
- **UI components**: shadcn/ui

## Artifacts

- `artifacts/api-server` — Express REST API on port 8080 (base path `/api`)
- `artifacts/creator-marketplace` — React frontend (path `/`)

## Features

- Creator profiles: Indian languages, states, city, platforms (incl. Moj/ShareChat/Josh)
- Brand campaigns: INR budgets, lakh/crore formatting, platform filters, deadlines
- Applications system: creators apply to brand campaigns
- Stats: top creators, trending campaigns, category breakdown, platform stats
- Full CRUD for creators, brands, campaigns, applications

## Key Files

- `lib/api-spec/openapi.yaml` — OpenAPI spec (source of truth)
- `lib/api-spec/package.json` — has codegen workaround (rewrites api-zod index.ts after orval)
- `lib/db/src/schema/` — Drizzle schema (creators/brands/campaigns/applications)
- `artifacts/api-server/src/routes/` — Express route handlers
- `artifacts/creator-marketplace/src/pages/` — All page components
- `artifacts/creator-marketplace/src/components/` — Navbar, CreatorCard, CampaignCard

## Indian Context

- Currency: INR (₹), formatted as lakhs/crores
- States: All 28 Indian states + Delhi
- Languages: 12 major Indian languages
- Platforms: Instagram, YouTube, Twitter, LinkedIn, Moj, ShareChat, Josh, Snapchat
- Seed data: 8 creators, 5 brands (Mamaearth, boAt, Nykaa, Zomato, Lenskart), 6 campaigns

## Important Notes

- `creators.platforms` is stored as JSON string in the DB (Drizzle workaround)
- All date fields from Drizzle are `Date` objects — must call `serializeDates()` before Zod parse
- Codegen workaround: `lib/api-spec/package.json` script rewrites `api-zod/src/index.ts` after orval to fix duplicate exports

## Key Commands

- `pnpm run typecheck` — full typecheck across all packages
- `pnpm run build` — typecheck + build all packages
- `pnpm --filter @workspace/api-spec run codegen` — regenerate API hooks and Zod schemas from OpenAPI spec
- `pnpm --filter @workspace/db run push` — push DB schema changes (dev only)
- `pnpm --filter @workspace/api-server run dev` — run API server locally

See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
