# SEO Automation Dashboard

Full-Stack SEO Automation Platform built with **Next.js 14 (App Router)**, **Node.js**, **BullMQ**, and **Claude 3.5 Sonnet API**.

Authored by **Aditya Vijapure**.

This project provides a clean dual-portal architecture featuring an **Internal Operations Portal** and a **Client-Facing Dashboard**, complete with automated headless crawling, Core Web Vitals extraction, Google Search Console metrics, DataForSEO rankings, AI synthesis, PDF report generation, and mock WhatsApp delivery.

---

## 🌟 Key Features

### 1. Dual-Portal Architecture
- **Internal Admin Portal (`/admin`)**:
  - **Client Management (`/admin/clients`)**: Directory of multi-location businesses (dental clinics, healthcare, real estate), target keywords, and automated alert recipients.
  - **Live Audit Pipeline Visualizer (`/admin/audits/new`)**: Interactive 10-stage stepper with live BullMQ worker status, real-time streaming execution logs, and automated score summaries.
  - **BullMQ & Redis Queue Monitor (`/admin/queue`)**: Real-time worker telemetry, queue depth (`seo-audit-jobs`), Upstash Redis connection health, and mock mode toggle switch.
  - **Detailed Audit Inspector (`/admin/audits/[id]`)**: Deep-dive inspection of raw crawler signals, Claude structured JSON, and execution logs.

- **Client-Facing Dashboard (`/client`)**:
  - **SEO Health Index**: Circular gauge with overall score (0–100) and grade benchmark.
  - **5-Pillar Score Breakdown**: Technical SEO, On-Page SEO, Content Quality, Core Web Vitals, Schema.org.
  - **Core Web Vitals Panel**: Mobile metrics for LCP (4.2s), CLS (0.08), INP (280ms), render-blocking resources, and unused JS.
  - **Google Search Console Panel**: Total impressions (4,560), clicks (167), CTR (4.3%), index coverage errors, and top-ranking search queries.
  - **Competitor Rankings (DataForSEO)**: Target keyword position (#4 for *"dental clinic pune"*) vs top local competitors.
  - **Claude AI Recommendations**: Prioritized action items (Critical, High, Medium, Low) with Finding, Actionable Fix, Estimated Impact, Effort, and **Falsifiability Verification Criteria**.
  - **High-Velocity Quick Wins**: Interactive checklist of fixes with effort $\le$ 2 hours.
  - **Executive Summary**: Clear, 3-sentence plain English assessment.
  - **One-Click PDF Report Export**: Printable, formatted executive PDF report.

---

## 🚀 10-Stage Audit Pipeline Sequence

1. **Step 1**: Headless Crawler (`Fetch + Cheerio`) — crawls HTML, DOM hierarchy, title, headings, and images without alt tags.
2. **Step 2**: Google PageSpeed Insights API (`MOCKED/REAL`) — evaluates mobile Core Web Vitals.
3. **Step 3**: Google Search Console API (`MOCKED/REAL`) — aggregates impressions, clicks, CTR, and index errors.
4. **Step 4**: Schema.org Validator — audits `LocalBusiness`, `Dentist`, and `MedicalOrganization` JSON-LD schemas.
5. **Step 5**: On-Page Analysis — inspects keyword density and structural hierarchy.
6. **Step 6**: Robots.txt & Sitemap Check — verifies crawler access and XML sitemap indexability.
7. **Step 7**: DataForSEO Rankings API (`MOCKED/REAL`) — checks local Pune rankings against competitors.
8. **Step 8**: Anthropic Claude API (`claude-3-5-sonnet` / `claude-sonnet-4-6`) — analyzes all signals and generates structured JSON output using the Master SEO prompt.
9. **Step 9**: Database Persistence — persists complete audit signals and recommendations to PostgreSQL (Supabase / Neon).
10. **Step 10**: Automated PDF Report & Twilio WhatsApp Alert — compiles printable report and dispatches notification.

---

## 📁 Project Structure

```
├── src/
│   ├── app/
│   │   ├── admin/
│   │   │   ├── audits/
│   │   │   │   ├── [id]/page.js   # Single audit deep-dive inspector
│   │   │   │   └── new/page.js    # Interactive live pipeline runner
│   │   │   ├── clients/page.js    # Client management directory
│   │   │   ├── queue/page.js      # BullMQ & Upstash Redis monitor
│   │   │   └── page.js            # Admin portal overview & stats
│   │   ├── api/
│   │   │   ├── audit/
│   │   │   │   ├── [id]/route.js  # Audit details & rerun endpoint
│   │   │   │   └── route.js       # Queue audit job & list audits
│   │   │   ├── clients/route.js   # Client CRUD endpoint
│   │   │   ├── queue/route.js     # BullMQ queue telemetry
│   │   │   └── reports/[id]/pdf/route.js # Printable PDF report endpoint
│   │   ├── client/
│   │   │   └── page.js            # Client-facing SEO dashboard
│   │   ├── globals.css
│   │   ├── layout.js
│   │   └── page.js                # Hub / landing page
│   ├── components/
│   │   └── Navbar.jsx             # Dual-portal navigation switcher
│   ├── crawlers/
│   │   ├── cheerio-crawler.js     # Headless fetch + cheerio crawler
│   │   ├── dataforseo.js          # DataForSEO crawler integration
│   │   ├── gsc.js                 # Google Search Console crawler
│   │   ├── pagespeed.js           # Google PageSpeed crawler
│   │   ├── robots-sitemap.js      # Robots.txt & sitemap checker
│   │   └── schema-validator.js    # Schema.org validator
│   ├── mocks/
│   │   ├── dataforseo.mock.js     # DataForSEO mock dataset
│   │   ├── gsc.mock.js            # GSC impressions/clicks mock dataset
│   │   ├── index.js               # USE_MOCKS toggle switch
│   │   ├── pagespeed.mock.js      # PageSpeed Insights mock dataset
│   │   └── twilio.mock.js         # Twilio WhatsApp console log mock
│   ├── services/
│   │   ├── audit-runner.js        # 10-step pipeline orchestrator
│   │   ├── claude-analyst.js      # Claude API caller + Master prompt
│   │   └── notification.js        # Twilio notification dispatcher
│   └── lib/
│       ├── queue.js               # BullMQ queue wrapper & worker
│       └── store.js               # Client & audit data store
├── prisma/
│   ├── schema.prisma              # PostgreSQL schema
│   └── seed.js                    # Database seed script
├── .env.example
├── next.config.js
├── tailwind.config.js
└── package.json
```

---

## 🛠️ Quick Start & Setup

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/adityavijapure/edgelink-seo-automation.git
cd edgelink-seo-automation
npm install
```

### 2. Configure Environment Variables
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

Settings in `.env`:
```env
# Toggle for mock mode (true by default for zero-cost testing)
USE_MOCKS=true

# Anthropic Claude API (Optional if USE_MOCKS=true)
ANTHROPIC_API_KEY=

# Supabase / PostgreSQL database connection (Prisma)
DATABASE_URL=
DIRECT_URL=

# Upstash Redis for BullMQ Queue (Optional in mock mode)
REDIS_URL=
```

### 3. Database Sync & Seed
```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server & Worker
Start the web app:
```bash
npm run dev
```

In a separate terminal, start the BullMQ worker:
```bash
npm run worker
```

Open [http://localhost:3000](http://localhost:3000) in your browser:
- **Admin Portal**: [http://localhost:3000/admin](http://localhost:3000/admin)
- **Client Dashboard**: [http://localhost:3000/client](http://localhost:3000/client)
- **Live Pipeline Visualizer**: [http://localhost:3000/admin/audits/new](http://localhost:3000/admin/audits/new)
- **Queue Operations**: [http://localhost:3000/admin/queue](http://localhost:3000/admin/queue)

---

## 📄 License & Copyright

© 2026 Aditya Vijapure. All rights reserved.
