<div align="center">

<img src="public/logo.svg" alt="DevFolio Pro" width="72" height="72" />

# DevFolio Pro

**The AI-powered portfolio builder for developers.**

Connect GitHub → Generate with Claude → Publish — in under 5 minutes.

[![CI](https://github.com/yourusername/devfolio-pro/actions/workflows/ci.yml/badge.svg)](https://github.com/yourusername/devfolio-pro/actions/workflows/ci.yml)
[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB?logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-38BDF8?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-7-2D3748?logo=prisma)](https://www.prisma.io/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](LICENSE)

[Live Demo](https://devfolio-pro.vercel.app) · [Report a Bug](../../issues/new?template=bug_report.md) · [Request a Feature](../../issues/new?template=feature_request.md) · [Changelog](CHANGELOG.md)

</div>

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Architecture](#architecture)
- [Getting Started](#getting-started)
- [Environment Variables](#environment-variables)
- [Database Schema](#database-schema)
- [API Reference](#api-reference)
- [Plans & Pricing](#plans--pricing)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [Security](#security)
- [Roadmap](#roadmap)
- [License](#license)

---

## Overview

DevFolio Pro lets developers go from a GitHub account to a live, professional portfolio in minutes — no design skills required.

Under the hood, it syncs your real GitHub data (repos, languages, stars, contributions), feeds it to Claude (Anthropic) to generate polished copy, and renders your portfolio in one of six hand-crafted themes. Advanced features — analytics, webhooks, team workspaces, cover letter generation — are available on Pro and Team plans.

```
GitHub OAuth → Sync repos → AI content generation → Pick a theme → Publish at /{username}
```

---

## Features

### Core

| Feature | Free | Pro | Team |
|---|:---:|:---:|:---:|
| GitHub OAuth & repo sync | ✅ | ✅ | ✅ |
| Public portfolio at `/{username}` | ✅ | ✅ | ✅ |
| 6 curated themes | ✅ | ✅ | ✅ |
| Drag-and-drop project reordering | ✅ | ✅ | ✅ |
| AI content generation (bio, tagline, project descriptions) | 5/mo | Unlimited | Unlimited |
| AI cover letter generator | ❌ | ✅ | ✅ |
| AI LinkedIn summary generator | ❌ | ✅ | ✅ |
| AI interview talking points | ❌ | ✅ | ✅ |
| Advanced analytics (views, countries, referrers) | ❌ | ✅ | ✅ |
| Webhook integrations | ❌ | ✅ | ✅ |
| Referral credits | ✅ | ✅ | ✅ |
| Team workspaces | ❌ | ❌ | ✅ |
| Custom domain | ❌ | ✅ | ✅ |

### Themes

| Theme | Style |
|---|---|
| **Minimal** | Clean, distraction-free |
| **Terminal** | Dark, hacker aesthetic |
| **Creative** | Bold, expressive |
| **Pastel** | Soft, approachable |
| **Corporate** | Polished, enterprise-ready |
| **Glassmorphism** | Modern, frosted-glass UI |

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui + Radix UI |
| Database | PostgreSQL via [Neon Serverless](https://neon.tech) |
| ORM | Prisma 7 (with driver adapters) |
| Auth | NextAuth.js v5 (Auth.js) — GitHub OAuth |
| AI | Anthropic Claude (`@anthropic-ai/sdk`) |
| Payments | Stripe (Checkout, Webhooks, Customer Portal) |
| Email | Resend + React Email |
| File uploads | Cloudinary |
| Drag & Drop | `@dnd-kit/core` + `@dnd-kit/sortable` |
| Charts | Recharts |
| Testing | Jest (unit) + Playwright (E2E) |
| Deployment | Vercel (recommended) |

---

## Architecture

```
devfolio-pro/
├── prisma/                         # Database schema & migrations
│   └── schema.prisma
├── public/                         # Static assets & favicons
├── src/
│   ├── app/
│   │   ├── (auth)/                 # /login
│   │   ├── (dashboard)/            # /dashboard/*
│   │   │   ├── dashboard/          # Main dashboard
│   │   │   ├── ai-tools/           # AI generation hub
│   │   │   ├── analytics/          # Views, countries, referrers
│   │   │   ├── billing/            # Plan management
│   │   │   ├── cover-letter/       # AI cover letter
│   │   │   ├── editor/             # Portfolio editor
│   │   │   └── team/               # Team workspace
│   │   ├── [username]/             # Public portfolio pages
│   │   ├── discover/               # Public portfolio directory
│   │   └── api/
│   │       ├── ai/generate/        # Claude AI endpoint
│   │       ├── analytics/          # Track + cron aggregation
│   │       ├── auth/[...nextauth]/ # NextAuth handler
│   │       ├── github/             # Sync + cron
│   │       ├── og/                 # Open Graph image generation
│   │       ├── portfolio/          # Portfolio CRUD
│   │       ├── stripe/             # Checkout, portal, webhook
│   │       └── upload/             # Cloudinary upload
│   ├── components/
│   │   ├── ui/                     # shadcn/ui base components
│   │   ├── portfolio/
│   │   │   └── themes/             # 6 portfolio theme components
│   │   └── dashboard/              # Dashboard-specific components
│   ├── lib/                        # Utilities
│   │   ├── ai.ts                   # Claude generation functions
│   │   ├── auth.ts                 # NextAuth config
│   │   ├── github.ts               # GitHub API client
│   │   ├── prisma.ts               # Prisma singleton
│   │   └── stripe.ts               # Stripe client
│   └── types/                      # Shared TypeScript types
└── __tests__/
    ├── unit/                       # Jest unit tests
    └── e2e/                        # Playwright E2E tests
```

---

## Getting Started

### Prerequisites

- **Node.js** ≥ 20
- **PostgreSQL** database — [Neon](https://neon.tech) is recommended (serverless, free tier available)
- **GitHub OAuth App** — [Create one here](https://github.com/settings/applications/new)
  - Callback URL: `http://localhost:3000/api/auth/callback/github`
- **Anthropic API Key** — [console.anthropic.com](https://console.anthropic.com)
- **Stripe Account** — [stripe.com](https://stripe.com) (test mode is fine for local dev)
- **Resend Account** — [resend.com](https://resend.com) (free tier covers development)
- **Cloudinary Account** — [cloudinary.com](https://cloudinary.com) (for avatar/screenshot uploads)

### Installation

**1. Clone the repository**

```bash
git clone https://github.com/yourusername/devfolio-pro.git
cd devfolio-pro
```

**2. Install dependencies**

```bash
pnpm install
# or: npm install / yarn install / bun install
```

**3. Set up environment variables**

```bash
cp .env.example .env
```

Open `.env` and fill in your credentials. See [Environment Variables](#environment-variables) for a description of each value.

**4. Initialize the database**

```bash
npx prisma generate
npx prisma db push
```

**5. Start the development server**

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000). Sign in with GitHub and start building. 🎉

---

## Environment Variables

All required variables are documented in [`.env.example`](.env.example). Copy it to `.env` and fill in your credentials:

```bash
cp .env.example .env
```

| Variable | Required | Description |
|---|:---:|---|
| `DATABASE_URL` | ✅ | PostgreSQL connection string |
| `AUTH_SECRET` | ✅ | Random string for signing sessions — `openssl rand -base64 32` |
| `AUTH_URL` | ✅ | Base URL for NextAuth (`http://localhost:3000` locally) |
| `AUTH_GITHUB_ID` | ✅ | GitHub OAuth App client ID |
| `AUTH_GITHUB_SECRET` | ✅ | GitHub OAuth App client secret |
| `ANTHROPIC_API_KEY` | ✅ | Anthropic Claude API key |
| `STRIPE_SECRET_KEY` | ✅ | Stripe secret key (`sk_test_...` for dev) |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | ✅ | Stripe publishable key (`pk_test_...` for dev) |
| `STRIPE_WEBHOOK_SECRET` | ✅ | Stripe webhook signing secret (`whsec_...`) |
| `STRIPE_PRO_PRICE_ID` | ✅ | Stripe Price ID for monthly Pro plan |
| `STRIPE_PRO_ANNUAL_PRICE_ID` | ✅ | Stripe Price ID for annual Pro plan |
| `RESEND_API_KEY` | ✅ | Resend API key for transactional email |
| `CLOUDINARY_CLOUD_NAME` | ✅ | Cloudinary cloud name |
| `CLOUDINARY_API_KEY` | ✅ | Cloudinary API key |
| `CLOUDINARY_API_SECRET` | ✅ | Cloudinary API secret |
| `NEXT_PUBLIC_APP_URL` | ✅ | Public base URL (used in OG images and emails) |
| `CRON_SECRET` | ✅ | Random string securing the cron endpoints — `openssl rand -base64 32` |

> **Stripe Webhooks (local):** Use the [Stripe CLI](https://stripe.com/docs/stripe-cli) to forward events to your local server:
> ```bash
> stripe listen --forward-to localhost:3000/api/stripe/webhook
> ```
> Copy the printed `whsec_...` value into `STRIPE_WEBHOOK_SECRET`.

---

## Database Schema

DevFolio Pro uses **PostgreSQL** with Prisma as the ORM. Core models:

| Model | Description |
|---|---|
| `User` | Authenticated user, plan (`FREE`/`PRO`/`TEAM`), referral data, AI usage counters |
| `Portfolio` | Bio, skills, theme, social links, custom sections, webhook URL |
| `Project` | Synced GitHub repo with title, description, stars, screenshots |
| `View` | Page view events (country, referrer, timestamp) for analytics |
| `ClickEvent` | Click tracking (project links, contact, social) |
| `Subscription` | Stripe subscription details per user |
| `Organization` | Team workspace with slug and plan |
| `OrgMember` | User ↔ Organization join table with role (`ADMIN`/`MEMBER`) |

After schema changes, run:

```bash
npx prisma generate   # Regenerate the Prisma client
npx prisma db push    # Apply schema to the database (dev)
# or for production migrations:
npx prisma migrate dev --name your_migration_name
```

---

## API Reference

All API routes live under `src/app/api/`. Authentication is enforced via NextAuth sessions.

### AI Generation — `POST /api/ai/generate`

Generates portfolio content using Claude. Free plan is limited to **5 calls/month**.

| `type` | Description | Required body fields |
|---|---|---|
| `bio` | Professional bio | — |
| `tagline` | Hero taglines (returns array) | — |
| `description` | Project description | `repoName`, `language`, `stars` |
| `skills` | Suggested skills from repos | — |
| `cover-letter` | Cover letter for a job | `jobDescription` |
| `linkedin-summary` | LinkedIn About section | — |
| `interview-points` | Talking points for a project | `project` |

```bash
curl -X POST /api/ai/generate \
  -H "Content-Type: application/json" \
  -d '{"type": "bio"}'
```

### GitHub Sync — `POST /api/github/sync`

Manually triggers a GitHub repo sync for the authenticated user. Also runs automatically via cron at `/api/github/cron` (nightly at 02:00 UTC).

### Analytics — `POST /api/analytics/track`

Records a view or click event. Aggregated nightly by the cron job at `/api/analytics/cron` (03:00 UTC).

### Portfolio — `GET / PUT /api/portfolio`

Reads and updates the authenticated user's portfolio data.

### Stripe

| Route | Description |
|---|---|
| `POST /api/stripe/checkout` | Creates a Checkout session for Pro upgrade |
| `POST /api/stripe/portal` | Creates a Customer Portal session for subscription management |
| `POST /api/stripe/webhook` | Handles `checkout.session.completed`, `subscription.updated`, `subscription.deleted` |

### Open Graph — `GET /api/og`

Generates dynamic OG images for portfolio pages. Query params: `name`, `username`, `image`.

---

## Plans & Pricing

| | Free | Pro | Team |
|---|---|---|---|
| Portfolios | 1 | 1 | Unlimited |
| AI calls/month | 5 | Unlimited | Unlimited |
| Analytics | ❌ | ✅ | ✅ |
| Custom domain | ❌ | ✅ | ✅ |
| Webhooks | ❌ | ✅ | ✅ |
| Team workspace | ❌ | ❌ | ✅ |

Pricing is managed entirely through Stripe. Set your product Price IDs via `STRIPE_PRO_PRICE_ID` and `STRIPE_PRO_ANNUAL_PRICE_ID`.

### Referral System

Every user gets a unique referral link. When a referred user upgrades to Pro, the referrer automatically receives **1 referral credit** in the database and a **$10 Stripe balance credit** applied to their next invoice.

---

## Testing

DevFolio Pro uses **Jest** for unit tests and **Playwright** for end-to-end tests.

```bash
# Unit tests
pnpm test
pnpm test:watch
pnpm test:coverage

# E2E tests (Playwright auto-starts the dev server locally)
npx playwright test

# Single spec
npx playwright test __tests__/e2e/signup.spec.ts

# Interactive UI mode
npx playwright test --ui
```

### Test Coverage

| Area | File | Type |
|---|---|---|
| Auth flows | `__tests__/unit/auth.test.ts` | Unit |
| AI generation | `__tests__/unit/ai.test.ts` | Unit |
| GitHub sync | `__tests__/unit/github.test.ts` | Unit |
| Stripe webhooks | `__tests__/unit/stripe.test.ts` | Unit |
| Signup flow | `__tests__/e2e/signup.spec.ts` | E2E |
| Portfolio builder | `__tests__/e2e/portfolio-builder.spec.ts` | E2E |
| Billing | `__tests__/e2e/billing.spec.ts` | E2E |

CI runs lint, typecheck, and unit tests in parallel on every push. E2E tests run on every pull request. See [`.github/workflows/ci.yml`](.github/workflows/ci.yml).

---

## Deployment

### Vercel (Recommended)

1. Push to GitHub and import the repo in [Vercel](https://vercel.com)
2. Add all variables from `.env.example` in the Vercel dashboard
3. `vercel.json` is already configured — cron jobs are set up automatically:
   - `/api/github/cron` — nightly at 02:00 UTC
   - `/api/analytics/cron` — nightly at 03:00 UTC
4. Update your GitHub OAuth app's callback URL to your production domain:
   `https://yourdomain.com/api/auth/callback/github`
5. Configure your Stripe webhook endpoint to:
   `https://yourdomain.com/api/stripe/webhook`

### Other Platforms

The app is a standard Next.js application and deploys to any platform supporting Node.js ≥ 20 (Railway, Render, Fly.io, AWS, etc.). Configure cron jobs externally if not using Vercel.

---

## Contributing

We welcome contributions of all kinds — bug fixes, features, docs, and tests. Please read [**CONTRIBUTING.md**](CONTRIBUTING.md) for the full guide covering branching conventions, code style, testing requirements, and the PR checklist.

Please also read our [**Code of Conduct**](CODE_OF_CONDUCT.md) before participating.

---

## Security

If you discover a security vulnerability, **please do not open a public issue.** See [**SECURITY.md**](SECURITY.md) for our responsible disclosure policy, in-scope attack surface, and contact details.

---

## Roadmap

- [ ] **Custom domain SSL** — automated certificate provisioning via Let's Encrypt
- [ ] **Portfolio templates marketplace** — community-submitted themes
- [ ] **PDF resume export** — one-click export from portfolio data
- [ ] **GitHub Actions integration** — auto-redeploy portfolio on push
- [ ] **i18n / multi-language** — internationalized AI content generation
- [ ] **Stripe metered billing** — pay-per-AI-call as an alternative to subscriptions
- [ ] **Dark/light mode toggle** — per-theme preference stored in profile
- [ ] **Portfolio versioning** — snapshot history for published portfolios
- [ ] **SSO for Team plan** — SAML/OIDC for enterprise team workspaces

Have an idea? [Open a feature request](../../issues/new?template=feature_request.md).

---

## License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

Built with ❤️ using [Next.js](https://nextjs.org), [Anthropic Claude](https://anthropic.com), and [Stripe](https://stripe.com).

</div>