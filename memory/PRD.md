# Globens Solutions — Financial Services Website (PRD)

## Original Problem Statement
User asked to build a business website. Business: **financial services**. Wanted a **full business site** with **3 pages** (Home, Services, Contact us). Design: **minimal but interactive**, **trading-chart colour palette**. Integrations: **contact form emails, payments, analytics**. Brand: **Globens Solutions** (derived from contact email `globensloutions@gmail.com`).

## Architecture
- **Backend**: FastAPI + Motor (MongoDB) at `/api/*`. Stripe via `emergentintegrations`.
- **Frontend**: React 19 (CRA + craco), react-router-dom, TailwindCSS, shadcn/ui, sonner (toasts), lucide-react (icons), react-fast-marquee (ticker), framer-motion.
- **Design system**: "Trading Terminal Deep Dark" — bg #0B0E14, surface #131722, primary teal #26A69A, accent green #00C805, destructive red #EF5350. Fonts: Manrope (display), IBM Plex Sans (body), JetBrains Mono (numbers).
- **Analytics**: PostHog script already embedded in `public/index.html`.

## Core Requirements
- 3 pages: Home, Services, Contact.
- Interactive minimal UI.
- Trading-chart-inspired dark theme with green/red tickers.
- Contact form → notifies `globensloutions@gmail.com`.
- Stripe checkout for paid consultations.

## Implemented (2026-07-10)
- FastAPI backend with routes: `/api/health`, `/api/services/packages`, `/api/contact`, `/api/contact/submissions`, `/api/payments/checkout/session`, `/api/payments/checkout/status/{id}`, `/api/webhook/stripe`.
- MongoDB collections: `contact_submissions`, `payment_transactions`.
- 4 paid packages: Discovery Call $49 · Strategy Session $149 · Portfolio Audit $349 · Wealth Plan $799.
- Frontend pages: Home (hero + stats + services preview + process + CTA), Services (6 service cards + 4 packages with Stripe checkout), Contact (form + info panel), PaymentSuccess (polls status). 
- Global Navbar (glassmorphism), Footer, live ticker tape.
- Contact form submissions persist to Mongo; success toast + banner shown.
- Stripe Checkout integration validated end-to-end (test key `sk_test_emergent`).

## Known Limitations / Deferred
- **Outbound email is NOT wired.** Contact submissions are stored in Mongo only. Adding Resend/SendGrid + a real API key will deliver messages to `globensloutions@gmail.com`.
- Google Analytics: PostHog is live; GA4 measurement ID not added (no ID provided).
- No admin dashboard to browse submissions (accessible via API only).

## Prioritized Backlog
- **P0**: Wire Resend (or Gmail SMTP with app password) to actually email contact submissions to `globensloutions@gmail.com`.
- **P1**: Simple admin route to view contact submissions & payment transactions.
- **P1**: Add testimonials + FAQ section to Home for trust conversion.
- **P2**: Blog / market-insights section.
- **P2**: Multi-language + light-theme toggle.

## Test Credentials
None — no auth in current build. See `/app/memory/test_credentials.md` (empty).
