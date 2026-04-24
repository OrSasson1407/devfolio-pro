# Contributing to DevFolio Pro

Thank you for your interest in contributing! This guide covers everything you need to go from zero to an open pull request.

---

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Project Structure](#project-structure)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Submitting a Pull Request](#submitting-a-pull-request)
- [Reporting Bugs](#reporting-bugs)
- [Requesting Features](#requesting-features)

---

## Code of Conduct

Be respectful, constructive, and inclusive. We are here to build something great together. Harassment or discrimination of any kind will not be tolerated.

---

## Getting Started

**1. Fork and clone**

```bash
git clone https://github.com/YOUR_USERNAME/devfolio-pro.git
cd devfolio-pro
```

**2. Install dependencies**

```bash
pnpm install
```

**3. Set up your environment**

```bash
cp .env.example .env
# Fill in your own credentials (see README for details)
```

**4. Set up the database**

```bash
npx prisma generate
npx prisma db push
```

**5. Start the dev server**

```bash
pnpm dev
```

---

## Development Workflow

### Branching

Always branch off `main`. Use a descriptive prefix:

| Type | Branch name |
|---|---|
| New feature | `feature/short-description` |
| Bug fix | `fix/short-description` |
| Docs | `docs/short-description` |
| Refactor | `refactor/short-description` |
| Dependency update | `chore/update-dependency-name` |

```bash
git checkout -b feature/my-new-feature
```

### Commits

Follow [Conventional Commits](https://www.conventionalcommits.org/):

```
feat: add LinkedIn summary AI generation
fix: correct Stripe referral credit amount
docs: update environment variable table in README
chore: upgrade Prisma to 7.8.0
refactor: extract AI rate-limiting logic into middleware
test: add E2E test for billing flow
```

Keep commits focused. One logical change per commit.

---

## Project Structure

Key directories to know before making changes:

```
src/app/api/          — All API route handlers
src/app/(dashboard)/  — Authenticated dashboard pages
src/app/[username]/   — Public portfolio pages
src/lib/              — Core utilities (AI, auth, Prisma, Stripe, GitHub)
src/components/
  portfolio/themes/   — The 6 portfolio theme components
  dashboard/          — Dashboard UI components
  ui/                 — shadcn/ui base components
prisma/schema.prisma  — Database schema (source of truth)
__tests__/unit/       — Jest unit tests
__tests__/e2e/        — Playwright end-to-end tests
```

---

## Coding Standards

### TypeScript

- **Strict mode is on.** Avoid `any` — use proper types or `unknown` + a type guard.
- Prefer explicit return types on exported functions.
- Use `type` for object shapes; use `interface` only when extension is needed.

### React / Next.js

- All new pages use the **App Router** (no `pages/` directory).
- Server Components by default. Add `"use client"` only when you need browser APIs or interactivity.
- Keep API route handlers thin — move business logic into `src/lib/`.

### Styling

- Use **Tailwind CSS utility classes**. Avoid writing custom CSS unless strictly necessary.
- Use `cn()` from `src/lib/utils` for conditional class merging (wraps `clsx` + `tailwind-merge`).
- New UI primitives go in `src/components/ui/` as shadcn/ui-compatible components.

### Linting

```bash
pnpm lint
```

All lint errors must be resolved before opening a PR. Warnings are acceptable but should be noted.

### Formatting

Prettier is configured. Most editors will format on save. To format manually:

```bash
pnpm format
```

---

## Testing

### Unit Tests (Jest)

Unit tests live in `__tests__/unit/`. They test individual library functions in isolation — no HTTP, no database.

```bash
pnpm test           # Run all unit tests
pnpm test:watch     # Watch mode
pnpm test:coverage  # Coverage report
```

**What to unit test:** Functions in `src/lib/` (AI generation, GitHub sync logic, Stripe helpers, auth utilities).

### End-to-End Tests (Playwright)

E2E tests live in `__tests__/e2e/`. They run against a full local dev environment.

```bash
# Start the dev server first
pnpm dev

# In another terminal:
npx playwright test

# Run a single spec:
npx playwright test __tests__/e2e/signup.spec.ts

# Open the interactive UI:
npx playwright test --ui
```

**What to E2E test:** Critical user flows — sign up, portfolio publish, billing upgrade/downgrade.

### When to add tests

| Change type | Expectation |
|---|---|
| New `src/lib/` function | Unit test required |
| New API route | Unit test for the handler logic |
| New user-facing flow | E2E test for the happy path |
| Bug fix | Add a test that would have caught the bug |

---

## Submitting a Pull Request

1. Push your branch to your fork:
   ```bash
   git push origin feature/my-new-feature
   ```

2. Open a Pull Request against `main` on the upstream repo.

3. Fill in the PR template completely — especially the **Testing** and **Database Migrations** sections.

4. Ensure all CI checks pass (lint, unit tests).

5. A maintainer will review your PR. Be responsive to feedback — PRs that go stale for more than 30 days may be closed.

### PR size

Keep PRs focused and reviewable. If a feature is large, consider splitting it into smaller PRs (e.g., schema + API + UI as separate PRs).

---

## Reporting Bugs

Use the [Bug Report template](../../issues/new?template=bug_report.md). Include steps to reproduce, expected vs actual behaviour, and your environment. The more detail you provide, the faster we can fix it.

---

## Requesting Features

Use the [Feature Request template](../../issues/new?template=feature_request.md). Check the [open issues](../../issues) first to avoid duplicates. If a similar request already exists, add a 👍 reaction rather than opening a new issue.

---

## Questions?

For questions that aren't bugs or feature requests, open a [Discussion](../../discussions) rather than an issue.
