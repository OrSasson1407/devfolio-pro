📌 Overview
Devfolio Pro is an AI-powered portfolio builder for developers. Connect your GitHub account, let Claude generate compelling copy, pick a theme, and go live — no CSS required, no design skills needed.

Sync GitHub → Generate with AI → Publish — the entire flow in under 5 minutes.


✨ Features
🔗 One-Click GitHub Sync
Import repositories, top languages, star counts, and contribution graphs directly from GitHub — automatically, in real time.
🤖 AI-Powered Content Generation
Claude (Anthropic) generates punchy hero taglines, professional bios, and project descriptions tailored to your actual GitHub data. No more staring at a blank page.
🎨 Curated Themes
Six hand-crafted themes to match your personal brand:
ThemeStyleMinimalClean, distraction-freeTerminalDark, hacker aestheticCreativeBold, expressivePastelSoft, approachableCorporatePolished, enterprise-readyGlassmorphismModern, frosted-glass UI
🖱️ Drag-and-Drop Editor
Reorder projects and custom sections (Work Experience, Education, and more) using @dnd-kit — no code, no friction.
📊 Advanced Analytics
Track profile views, visualize visitor countries on a map, and monitor traffic sources — all from a built-in dashboard.
⚡ Webhook Integrations
Fire webhooks on every profile view to pipe analytics directly into Slack, Discord, Notion, or Zapier.
🎁 Referral System
Built-in referral credits let users earn free Pro months by inviting friends.

🛠️ Tech Stack
LayerTechnologyFrameworkNext.js 16 (App Router) + React 19StylingTailwind CSS v4 + shadcn/uiDatabasePostgreSQL via Neon ServerlessORMPrismaAuthNextAuth.js (Auth.js v5) — GitHub OAuthAIAnthropic Claude (@anthropic-ai/sdk)PaymentsStripeEmailResend + React EmailDrag & Drop@dnd-kitTestingJest (unit) + Playwright (E2E)

🚀 Getting Started
Prerequisites
Before you begin, ensure you have the following:

Node.js ≥ 20
PostgreSQL database (Neon recommended)
GitHub OAuth App — create one here
Stripe Account — for Pro features
Anthropic API Key — get one here

Installation
1. Clone the repository
bashgit clone https://github.com/yourusername/devfolio-pro.git
cd devfolio-pro
2. Install dependencies
bashnpm install
# or: yarn install / pnpm install / bun install
3. Configure environment variables
Create a .env file in the project root:
env# ─── Database ─────────────────────────────────────────────────────────
DATABASE_URL="postgresql://user:password@host/dbname?sslmode=require"

# ─── Authentication ────────────────────────────────────────────────────
AUTH_SECRET="your-super-secret-auth-string"
AUTH_GITHUB_ID="your-github-oauth-client-id"
AUTH_GITHUB_SECRET="your-github-oauth-client-secret"

# ─── AI ────────────────────────────────────────────────────────────────
ANTHROPIC_API_KEY="sk-ant-api03-..."

# ─── Stripe ────────────────────────────────────────────────────────────
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."

# ─── App ───────────────────────────────────────────────────────────────
NEXT_PUBLIC_APP_URL="http://localhost:3000"
4. Initialize the database
bashnpx prisma generate
npx prisma db push
5. Start the development server
bashnpm run dev
Open http://localhost:3000 in your browser. 🎉

📂 Project Structure
devfolio-pro/
├── prisma/                   # Database schema & migrations
├── public/                   # Static assets
├── src/
│   ├── app/                  # Next.js App Router
│   │   ├── (auth)/           # Authentication pages
│   │   ├── (dashboard)/      # Dashboard & editor interfaces
│   │   └── api/              # API routes — AI, Auth, Stripe, GitHub
│   ├── components/           # React components — UI, Portfolio, Dashboard
│   ├── lib/                  # Utilities, Prisma client, Auth config
│   └── types/                # TypeScript type definitions
└── __tests__/                # Unit tests (Jest) & E2E tests (Playwright)

🧪 Testing
Devfolio Pro uses Jest for unit testing and Playwright for end-to-end testing.
bash# Run unit tests
npm run test

# Run unit tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage

🤝 Contributing
Contributions, issues, and feature requests are welcome! Please check the issues page before opening a new one.

Fork the repository
Create your feature branch: git checkout -b feature/amazing-feature
Commit your changes: git commit -m 'Add some amazing feature'
Push to the branch: git push origin feature/amazing-feature
Open a Pull Request


📄 License
This project is licensed under the MIT License — see the LICENSE file for details.