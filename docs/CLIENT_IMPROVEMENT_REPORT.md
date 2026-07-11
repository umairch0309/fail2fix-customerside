# Fail2Fix Platform — Improvement Opportunities Report

**Prepared for:** Fail2Fix client review  
**Date:** July 2026  
**Type:** Technical audit (recommendations only — no implementation included)  
**Repositories reviewed:**

| Repository | Path | Role |
|------------|------|------|
| Backend API | `fail2fixbackend` | Auth, quotes, payments, chat, WebSocket |
| Admin portal | `fail2fixadmin` | Internal operations dashboard |
| Customer + marketing | `failfix-animation` | Public website + customer dashboard (`fail2fix.co.uk`) |
| Content CMS | `fail2fixcms` | Blog management (`blog.fail2fix.co.uk`) |

---

## Executive Summary

Fail2Fix runs on a modern, capable stack: **Bun + Hono** backend, **Next.js 16** frontends, **Payload CMS** for blogs, **Better Auth** for sessions, and **Stripe** for payments.

This report lists **what can be improved** across all four codebases — with priority, effort estimates, and a phased roadmap for planning and budgeting.

| Scope | Estimate |
|-------|----------|
| Full improvement backlog | **18–28 developer-weeks** |
| Critical + High priority only (Phases 1–2) | **6–10 weeks** |

**Highest-risk gaps today:**

1. Security hygiene (secrets in config files, CMS draft content publicly readable)
2. Incomplete customer dashboard flows (quote/payment route conflicts, unfinished request wizard)
3. No automated testing or CI quality gates on any repository
4. API list endpoints load full datasets (will not scale)
5. Shared technical debt between admin and customer apps (duplicated fetch logic, dead code)

---

## Platform Architecture

```
                    ┌─────────────────────┐
                    │  fail2fix.co.uk     │
                    │  (failfix-animation)│
                    │  Marketing +        │
                    │  Customer Dashboard │
                    └─────────┬───────────┘
                              │
         ┌────────────────────┼────────────────────┐
         │                    │                    │
         ▼                    ▼                    ▼
┌────────────────┐  ┌─────────────────┐  ┌────────────────┐
│ fail2fixadmin  │  │ fail2fixbackend │  │  fail2fixcms   │
│ Admin portal   │  │ API + Auth + WS │  │  Blog CMS      │
│ (port 3001)    │  │ (port 3007)     │  │  (port 3004)   │
└────────────────┘  └────────┬────────┘  └────────────────┘
                               │
                    PostgreSQL · Redis · MinIO · Stripe
```

---

## Effort Scale

| Size | Time | Examples |
|------|------|----------|
| **S** | 0.5–1 day | Config fix, single bug, small refactor |
| **M** | 2–5 days | Shared utility, one domain hardening |
| **L** | 1–2 weeks | Test suite bootstrap, pagination, flow unification |
| **XL** | 2–4 weeks | Full E2E coverage, SSR migration |

---

## 1. Backend (`fail2fixbackend`)

**Stack:** Bun, Hono, Drizzle ORM, PostgreSQL, Redis, MinIO, Stripe, Better Auth (customer + admin)

### Critical / High

| ID | Area | Improvement | Priority | Effort |
|----|------|-------------|----------|--------|
| B-S1 | Security | Remove secrets from `docker-compose.yml`; add `.env.example`; gitignore `.env` | Critical | S |
| B-S2 | Security | Fix file download IDOR — enforce ownership on upload URLs | High | S |
| B-S3 | Security | Stricter rate limits on public MOT lookup endpoints | High | S |
| B-M1 | Security | Stripe webhook idempotency (prevent duplicate payment updates) | High | M |
| B-M2 | Data | Database transactions for multi-step flows (quote submit, webhooks) | High | M |
| B-M3 | Code | Consolidate duplicate vehicle service files | High | S |
| B-L1 | Testing | Bootstrap automated tests (currently zero) | High | L |
| B-M4 | DevOps | CI quality gates before deploy (typecheck, lint, test) | High | M |

### Medium / Low

| ID | Area | Improvement | Priority | Effort |
|----|------|-------------|----------|--------|
| B-M5 | Performance | Pagination on list endpoints | Medium | M |
| B-M6 | Performance | Redis-backed rate limiting for scaling | Medium | M |
| B-M7 | DevOps | Deep health check (DB, Redis, MinIO, Stripe) | Medium | S |
| B-M8 | DevOps | Run DB migrations via init job, not every container start | Medium | S |
| B-M9 | Code | Mount or remove unused parts-catalog routes | Medium | S |
| B-M10 | Code | Remove template leftovers (demo echo API, unused imports) | Medium | S |
| B-M11 | Code | Standardize error responses and logging | Medium | M |
| B-M12 | Security | File upload MIME validation (magic bytes) | Medium | S |
| B-L2 | Docs | README + API documentation for frontend teams | Medium | M |

**Backend estimated effort:** 4–6 weeks total · 2–3 weeks for Critical/High

---

## 2. Admin Portal (`fail2fixadmin`)

**Stack:** Next.js 16, TanStack Query, Zustand, Better Auth (admin session)

### Critical / High

| ID | Area | Improvement | Priority | Effort | Needs backend? |
|----|------|-------------|----------|--------|----------------|
| A-H1 | Bug | Quote filter tabs use wrong statuses — tabs show empty results | High | S | Verify enums |
| A-H2 | Errors | Global 401 handler + consistent error UI on all pages | High | S | No |
| A-H3 | Architecture | Add error, loading, and not-found route boundaries | High | S | No |
| A-H4 | API | Centralize duplicated fetch logic into shared API client | High | M | Stable error format |
| A-H5 | Performance | Server-side pagination (currently loads all records) | High | L | Yes |
| A-H6 | Testing | No automated tests; no CI build gate | High | L + S | Staging API |

### Medium / Low

| ID | Area | Improvement | Priority | Effort |
|----|------|-------------|----------|--------|
| A-M1 | Auth | Protect all dashboard routes in edge proxy (not only `/dashboard`) | Medium | S |
| A-M2 | Auth | Profile/Settings pages 404 — implement or remove links | Medium | M |
| A-M3 | Performance | Server-side data prefetch for key pages | Medium | L |
| A-M4 | API | Runtime validation of API responses (Zod) | Medium | L |
| A-M5 | State | Unify REST + WebSocket notification sources | Medium | M |
| A-M6 | State | Persist quote creation wizard across page refresh | Medium | M |
| A-M7 | Performance | Code-split PDF/screenshot libraries | Medium | S |
| A-M8 | Accessibility | Chat live regions, breadcrumb labels, CI a11y checks | Medium | M |
| A-L1 | Debt | Remove dead axios client and wrong-project query keys | Low | S |
| A-L2 | Debt | Single navigation config for sidebar + search | Low | S |
| A-L3 | DevOps | Fix CI workflow naming; add `.env.example` + README | Medium | S |

**Admin estimated effort:** 3–5 weeks total · 1.5–2.5 weeks for High priority

---

## 3. Customer + Marketing Portal (`failfix-animation`)

**Stack:** Next.js 16, TanStack Query, Zustand, Better Auth (customer), GSAP animations, 10 location SEO pages  
**Deployed at:** `fail2fix.co.uk` (Vercel)

### Critical / High

| ID | Area | Improvement | Priority | Effort | Needs backend? |
|----|------|-------------|----------|--------|----------------|
| M-C1 | Quote flow | Unify `/quotes/[id]` and `/quotes/[id]/offer` — conflicting payment UX | Critical | M | Yes |
| M-C2 | Booking | Complete dashboard "New Request" flow (stops after VRM lookup) | Critical | M | Yes |
| M-C3 | Testing | No test infrastructure for auth, quote, or payment flows | Critical | L | Staging API |
| M-H1 | Quote flow | Remove mock MOT data and demo quote paths from production | High | S | Yes |
| M-H2 | Quote flow | Decide canonical payment model: 10% deposit vs full accept | High | M | Yes |
| M-H3 | Forms | Contact form only logs to console — wire to API or remove | High | S | Optional endpoint |
| M-H4 | Errors | Route-level error boundaries + consistent 401 redirect | High | M | No |
| M-H5 | Auth | Enforce email verification before dashboard access | High | S | Yes |
| M-H6 | Docs | Client-ready README + `.env.example` (current README is outdated) | High | S | No |
| M-H7 | SEO | Fix OG image build issue; add blog URLs to sitemap | High | S | CMS |
| M-H8 | SEO | Add metadata to `/blogs` index (currently client-only) | Medium | S | No |

### Medium / Low

| ID | Area | Improvement | Priority | Effort |
|----|------|-------------|----------|--------|
| M-M1 | API | Consolidate fetch layer; remove dead axios + admin-only hooks | Medium | M |
| M-M2 | State | Single React Query provider (remove nested instances) | Medium | S |
| M-M3 | UI | Archive legacy unused section components | Medium | M |
| M-M4 | UI | Deduplicate repeated get-a-quote and FAQ sections | Medium | M |
| M-M5 | Performance | Lazy-load GSAP, jsPDF, Lexical on dashboard routes | Medium | M |
| M-M6 | SEO | `noindex` dashboard and auth routes in robots.txt | Medium | S |
| M-M7 | SEO | Document location page update process (code-defined, not CMS) | Medium | M |
| M-L1 | Debt | Disable React Query Devtools in production | Low | S |
| M-L2 | Analytics | Instrument conversion events (quote, payment success) | Low | M |

**failfix-animation estimated effort:** 4–7 weeks total · 2.5–3.5 weeks for Critical/High

---

## 4. CMS (`fail2fixcms`)

**Stack:** Payload CMS 3.75, Next.js 15, PostgreSQL  
**URL:** `blog.fail2fix.co.uk`

### Critical / High

| ID | Area | Improvement | Priority | Effort |
|----|------|-------------|----------|--------|
| CMS-C1 | Security | Restrict public API to published blogs only (drafts currently exposed) | Critical | S |
| CMS-C2 | Security | Rotate secrets; gitignore `.env`; remove hardcoded DB password | Critical | S |
| CMS-H1 | Media | Migrate local disk storage to S3/R2 + CDN | High | M |
| CMS-H2 | Content | Add author display name to Users collection | High | S |
| CMS-H3 | DevOps | CI with lint, typecheck, and tests before deploy | High | M |
| CMS-H4 | DevOps | Standardize package manager (pnpm / bun / npm conflict) | High | S |
| CMS-H5 | Docs | Replace stale template README (references MongoDB, not Postgres) | High | S |
| CMS-H6 | Dependencies | Align Payload version with marketing site Lexical packages | High | S–M |

### Medium / Low

| ID | Area | Improvement | Priority | Effort |
|----|------|-------------|----------|--------|
| CMS-M1 | SEO | Add blog post URLs to marketing sitemap | Medium | S |
| CMS-M2 | Editorial | Enable Payload drafts/versions + scheduled publishing | Medium | M |
| CMS-M3 | Integration | CMS webhook → on-demand cache revalidation on marketing site | Medium | M |
| CMS-M4 | Integration | Share generated types with frontends | Medium | S |
| CMS-M5 | Security | Disable GraphQL playground in production | Medium | S |
| CMS-M6 | Security | Role-based admin users (editor vs admin) | Medium | M |
| CMS-M7 | DevOps | Automated Postgres + media backups | Medium | M |
| CMS-L1 | Content | Auto-generate and validate blog slugs | Low | S |
| CMS-L2 | Config | Set production `serverURL` in Payload config | Low | S |

**CMS estimated effort:** 2–4 weeks total · 1–1.5 weeks for Critical/High

---

## 5. Cross-Portal Initiatives

Improvements that span multiple repositories and should be coordinated:

| Initiative | Portals | Effort | Priority |
|------------|---------|--------|----------|
| Secrets and environment hygiene | All 4 | S | Critical |
| CI quality gates on every deploy | All 4 | M | High |
| Shared API contract (error format, status enums) | Backend + Admin + failfix-animation | L | High |
| Pagination at scale | Backend + Admin + failfix-animation | L | High |
| Single payment model (deposit vs full accept) | Backend + failfix-animation + Admin | M | Critical |
| Public quote funnel hardening | Backend + failfix-animation | M | High |
| WebSocket and notification reliability | Backend + Admin + failfix-animation | M | Medium |
| Blog integration (drafts, CDN, sitemap, types) | CMS + failfix-animation | M | High |

---

## 6. Recommended Phased Roadmap

### Phase 1 — Production safety (2–3 weeks, 1 developer)

- Backend: secrets cleanup, upload IDOR fix, MOT rate limits, vehicle service consolidation
- CMS: published-only blog access, secrets hygiene
- failfix-animation: email verification, env docs, OG/sitemap fixes
- All repos: CI build gate before deploy

### Phase 2 — Broken user journeys (3–4 weeks, 1–2 developers)

- failfix-animation: unify quote routes, complete request flow, contact form, payment model
- Backend: Stripe webhook idempotency, DB transactions
- Admin: quote status tab fix
- CMS: author display names

### Phase 3 — Scale and maintainability (4–6 weeks, 1–2 developers)

- Backend: API pagination, test suite bootstrap
- Admin: shared API client, pagination UI
- failfix-animation: API consolidation, legacy code cleanup
- CMS: CDN media, sitemap, cache revalidation webhooks

### Phase 4 — Quality and polish (4–8 weeks, optional)

- End-to-end tests (login, quote, payment)
- Server-side rendering prefetch
- Accessibility audit
- Full API documentation

---

## 7. Summary for Budgeting

| Portal | Critical | High | Total effort | Phase 1–2 only |
|--------|----------|------|--------------|----------------|
| Backend | 1 | 7 | 4–6 weeks | 2–3 weeks |
| Admin | 0 | 6 | 3–5 weeks | 1–1.5 weeks |
| failfix-animation | 3 | 8 | 4–7 weeks | 2.5–3.5 weeks |
| CMS | 2 | 6 | 2–4 weeks | 0.5–1 week |
| Cross-portal | 2 | 4 | 3–5 weeks (overlaps) | 1–2 weeks |

**Recommended starting point:** Phase 1 + Phase 2 = **6–10 weeks** of development to address the most critical security gaps and broken customer journeys before scaling work.

---

## 8. Out of Scope

This report does not include:

- Implementation of any listed items (recommendations only)
- New features not implied by existing code (mobile apps, new payment providers)
- Legacy `fail2fixcustomer` repository (superseded by `failfix-animation`)
- Infrastructure cost optimization beyond CDN/backup recommendations

---

*This document is based on static code review of all four repositories. No runtime penetration testing or load testing was performed.*
