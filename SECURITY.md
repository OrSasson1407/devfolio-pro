# Security Policy

## Supported Versions

Only the latest release of DevFolio Pro receives security fixes.

| Version | Supported |
|---|---|
| Latest (`main`) | ✅ |
| Older releases | ❌ |

---

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues.**

If you discover a security vulnerability, please report it responsibly by emailing:

**security@devfolio-pro.com**

Include as much of the following as possible:

- A clear description of the vulnerability
- Steps to reproduce (proof of concept, if available)
- The potential impact and attack scenarios
- Any suggested mitigations

You will receive an acknowledgement within **48 hours** and a detailed response within **7 days** outlining next steps and any remediation timeline.

We kindly ask that you:
- Give us reasonable time to investigate and patch before any public disclosure
- Avoid accessing, modifying, or deleting data that does not belong to you
- Not perform denial-of-service attacks or automated scanning against production

---

## Scope

The following are **in scope** for security reports:

- Authentication bypasses (NextAuth / GitHub OAuth)
- Authorization flaws (accessing another user's portfolio data, analytics, or billing)
- Stripe webhook signature bypass or billing manipulation
- Injection attacks (SQL via Prisma, XSS in portfolio themes)
- Sensitive data exposure (API keys, tokens, PII)
- Server-Side Request Forgery (SSRF) via webhook URL input
- Insecure Direct Object References (IDOR) on portfolio, project, or org endpoints
- AI prompt injection leading to data leakage

The following are **out of scope**:

- Vulnerabilities in third-party services (GitHub, Stripe, Anthropic, Neon, Vercel)
- Issues requiring physical access to a user's device
- Social engineering attacks
- Rate limiting on non-sensitive endpoints
- Missing security headers that have no demonstrable impact

---

## Security Best Practices for Self-Hosters

If you are running DevFolio Pro yourself:

- **Rotate secrets regularly** — `AUTH_SECRET`, `STRIPE_WEBHOOK_SECRET`, and `CRON_SECRET` should be rotated at least annually
- **Restrict cron endpoints** — `/api/github/cron` and `/api/analytics/cron` check `CRON_SECRET`; never expose these without it
- **Use environment variables** — never commit `.env` files or hardcode credentials
- **Enable Stripe webhook signature verification** — always set `STRIPE_WEBHOOK_SECRET`; the webhook handler rejects requests with invalid signatures
- **Use HTTPS in production** — set `NEXT_PUBLIC_APP_URL` to your `https://` domain
- **Keep dependencies updated** — run `pnpm audit` regularly and apply patches promptly

---

## Disclosure Policy

Once a vulnerability is confirmed and patched, we will:

1. Release a patched version
2. Credit the reporter in the release notes (unless they prefer to remain anonymous)
3. Publish a summary in `CHANGELOG.md` under the relevant version

Thank you for helping keep DevFolio Pro and its users safe.
