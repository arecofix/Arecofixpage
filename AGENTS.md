# 🤖 Arecofix AI Agent Guide

This file helps AI coding agents understand the Arecofix codebase and be immediately productive.

## 📌 Quick Facts

- **Framework**: Angular 21 (standalone components, SSR)
- **Backend**: Supabase (PostgreSQL + Auth + RLS)
- **UI**: TailwindCSS 4 + DaisyUI 5
- **Mobile**: Capacitor (Android)
- **Desktop**: Tauri + Flask backend
- **Hosting**: Firebase
- **Testing**: Jest + Cypress + WebdriverIO
- **Architecture**: Feature-based, repository pattern, multi-tenant SaaS
- **Type Safety**: Strict mode enforced (`any` forbidden)

## 🏗️ Architecture Overview

### Core Patterns

1. **Standalone Components** — All components use `standalone: true` with explicit `imports[]`. No NgModules.
2. **Repository Pattern** — Data access is abstracted:
   ```
   Domain (interface) → Infrastructure (Supabase impl) → Injected in services
   ```
3. **Feature-Based Structure** — `src/app/features/` owns routes, services, repositories for each domain
4. **Lazy Loading** — Routes use `loadChildren()`, components use `loadComponent()`
5. **Multi-Tenant** — `TenantService` resolves tenant from subdomain; guards enforce tenant isolation
6. **Signals** — Angular 17+ signals for state management (prefer over BehaviorSubject)
7. **Guards** — 10+ guards for auth, roles, subscriptions, tenant ownership

### Directory Structure

```
src/app/
├── core/              # Global services, guards, DI config, interceptors
│   ├── services/      # Auth, Supabase, Tenant, Analytics, etc. (31+ services)
│   ├── guards/        # authGuard, roleGuard, branchAdminGuard, etc. (10+)
│   └── interceptors/  # Error handling, timeout
├── features/          # Domain modules (products, orders, repairs, courses, academy, blog)
│   ├── domain/        # Interfaces, repositories, models
│   ├── infrastructure/# Supabase implementations
│   └── routes/        # Feature routes
├── shared/            # Reusable components, pipes, utilities
├── admin/             # Admin panel
├── instructor/        # Instructor dashboard
├── public/            # Public pages
├── app.config.ts      # DI configuration (bind repositories)
├── app.routes.ts      # Root routes
└── app.ts             # Bootstrap with SSR

Back-End/
├── app.py             # Flask REST API (offline Tauri support)
├── models.py          # SQLite ORM
└── sync_engine.py     # Data sync logic

supabase/
├── rls_*.sql          # Row-level security policies
└── migrations/        # Database schema
```

## 🚀 Essential Commands

| Task | Command |
|------|---------|
| Dev server | `pnpm start` |
| Build prod | `pnpm run build` |
| Unit tests (watch) | `pnpm test:watch` |
| E2E tests (interactive) | `pnpm run cypress:open` |
| E2E tests (headless) | `pnpm run test:e2e` |
| Deploy to Firebase | `pnpm run firebase:deploy` |
| Tauri desktop dev | `pnpm run tauri:dev` |
| Update SEO routes | `pnpm run routes:update` |

## 📂 Key Files & Their Purposes

| File | Purpose |
|------|---------|
| `src/app/app.config.ts` | DI provider configuration (bind interfaces to implementations) |
| `src/app/app.routes.ts` | Root routing config with lazy loading |
| `src/app/core/guards/` | 10+ guards for auth, roles, subscriptions |
| `src/app/core/services/supabase.service.ts` | Custom Supabase wrapper with caching + offline |
| `src/app/core/services/tenant.service.ts` | Multi-tenant resolver |
| `supabase/rls_*.sql` | Security policies (enforce tenant isolation) |
| `angular.json` | Angular CLI config, SSR settings, build targets |
| `firebase.json` | Hosting rules, rewrites |
| `cypress.config.ts` | E2E test config with network interception |
| `jest.config.js` | Unit test config |
| `Back-End/app.py` | Flask API for offline Tauri support |

## 🔐 Security & Multi-Tenancy

- **Auth**: Supabase JWT-based auth
- **RLS**: All tables have row-level security policies enforcing `tenant_id` isolation
- **Guards**: Multi-level access control via `authGuard`, `roleGuard`, `tenantOwnerGuard`, etc.
- **Tenant Resolution**: Via hostname/subdomain in `TenantService`
- **Check RLS**: If access denied, verify `supabase/rls_*.sql` matches user's role/tenant

## ⚡ Supabase Integration

### Custom Supabase Service Features
- **Memory Cache**: 60s TTL for GET requests (reduces egress costs)
- **IndexedDB Fallback**: Offline data persistence
- **Mutation Queuing**: Syncs to Supabase when online
- **Retry Logic**: 3 retries with 1.5s backoff for transient failures
- **Timeout**: 15s fetch timeout prevents hanging requests

### Data Access Pattern
1. Define repository interface in `features/*/domain/`
2. Implement with Supabase in `features/*/infrastructure/`
3. Bind in `app.config.ts` as DI provider
4. Inject in services via `inject(IRepository)`
5. Add/verify RLS policies in `supabase/`

## 🧪 Testing

### Unit Tests (Jest)
- Location: `src/**/*.spec.ts`
- Run: `pnpm test:watch`
- Config: `jest.config.js` (with SSR support)

### E2E Tests (Cypress)
- Location: `cypress/e2e/{api,ui}/`
- Run: `pnpm run cypress:open` (interactive) or `pnpm run test:e2e`
- Pattern: Intercepts network requests to validate without hitting real DB
- Key: Use explicit `cy.wait()` for timing-sensitive tests

### Mobile Tests (WebdriverIO + Appium)
- Config: `wdio.conf.js`
- Run: `wdio wdio.conf.js`
- Runs against Android device/emulator

## ⚙️ Development Conventions

### DO ✅
- Use path aliases: `@app/*`, `@env/*`
- Inject dependencies: `inject(Service)` instead of constructor
- Create repository interfaces for data access (enable testing/swapping)
- Use Signals for new state management
- Add `standalone: true` and explicit `imports: []` for components
- Lazy load routes with `loadChildren()` and components with `loadComponent()`
- Type everything (strict mode enforced)
- Use `takeUntilDestroyed()` to manage subscriptions

### DON'T ❌
- Don't import directly from `src/` (breaks lazy loading; use path aliases)
- Don't mix BehaviorSubject and Signals in the same service
- Don't skip tests
- Don't use `any` type
- Don't forget RLS policies when adding new database tables
- Don't hardcode tenant IDs (use `TenantService`)

## ⚠️ Common Gotchas

| Problem | Root Cause | Solution |
|---------|-----------|----------|
| **RLS policy denies access** | Overly restrictive policy | Check `supabase/rls_*.sql` matches user role/tenant |
| **Stale cached data** | 60s cache TTL in custom Supabase service | Wait or manually clear cache for immediate refresh |
| **Tauri backend starts late** | Flask startup race condition | `app.ts` includes 2s startup check; if still failing, increase delay |
| **Firebase rewrites fail** | SSR prerendering mismatch | Verify `firebase.json` rewrites all paths to `/index.html` |
| **CORS errors on localhost** | Backend CORS whitelist missing | Check `Back-End/app.py` includes `http://localhost:4200` |
| **Routes not prerendering** | `routes.txt` is stale | Run `pnpm run routes:update` |
| **Cypress intercepts miss** | Network timing race | Use explicit `cy.wait()` with sufficient timeout |
| **Strict mode type errors** | Missing type annotations | Add explicit types; `any` is forbidden |

## 📦 Environment Variables

Required in `.env`:
```env
SUPABASE_URL=https://jftiyfnnaogmgvksgkbn.supabase.co
SUPABASE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

Optional:
```env
TAURI_DEBUG=1
FIREBASE_API_KEY=...
```

## 🔗 Additional Documentation

For deeper context, see repository memory files:
- `[arecofix-codebase-guide.md](/memories/repo/arecofix-codebase-guide.md)` — Complete architecture, all file locations, setup details
- `[arecofix-quick-reference.md](/memories/repo/arecofix-quick-reference.md)` — Command reference, code snippets, file lookup
- `[arecofix-ai-agent-guide.md](/memories/repo/arecofix-ai-agent-guide.md)` — AI-specific patterns, debugging tips, feature workflow

## 🎯 Typical Development Workflow

1. **Add a new feature**:
   - Create `src/app/features/feature-name/{domain,infrastructure,routes}`
   - Define repository interface in `domain/`
   - Implement with Supabase in `infrastructure/`
   - Bind in `app.config.ts`
   - Add route in `app.routes.ts` with `loadChildren()`

2. **Add a new guard**:
   - Create in `src/app/core/guards/`
   - Apply to routes in `app.routes.ts`

3. **Modify database schema**:
   - Create migration in `supabase/migrations/`
   - Add RLS policy in `supabase/rls_*.sql`
   - Update repository interface

4. **Write tests**:
   - Unit: `*.spec.ts` alongside component/service
   - E2E: `cypress/e2e/{api|ui}/feature.cy.ts`

5. **Deploy**:
   - Push to `main` branch
   - GitHub Actions auto-builds, tests, deploys to Firebase

## 💡 When You're Stuck

1. **Type errors**: Check `tsconfig.json` for path aliases and strict mode settings
2. **Runtime errors**: Check browser console and `Back-End/app.py` logs (if Tauri)
3. **Data access denied**: Verify RLS policies in `supabase/` and user role/tenant
4. **Build fails**: Try `rm -rf dist/ .angular/ node_modules/ && pnpm install && pnpm build`
5. **Tests fail**: Run `pnpm test:watch` to see detailed output; check Cypress `videos/` folder for E2E failures

---

**Last updated**: 2024  
**Questions?** Refer to the additional documentation linked above or check recent git commits.
