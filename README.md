<p align="center">
  <img src="public/assets/img/readme/1.png" alt="Arecofix Banner" width="100%" style="border-radius: 12px; box-shadow: 0 8px 30px rgba(0,0,0,0.12);" />
</p>

<h1 align="center">🔧 ARECOFIX</h1>

<p align="center">
  <strong>Enterprise Multi-Tenant SaaS & E-Commerce Platform for Electronics Technical Services, POS & Hardware Academy</strong>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/production-ready-brightgreen?style=for-the-badge&logo=vercel" alt="Production Ready" />
  <img src="https://img.shields.io/badge/CSP-enforced-blue?style=for-the-badge&logo=shield" alt="CSP Enforced" />
  <a href="docs/JUSTIFIED_WARNINGS_20261020.md"><img src="https://img.shields.io/badge/Supabase%20Linter-0%20WARN%20%7C%203%20justificados-brightgreen?style=for-the-badge&logo=supabase" alt="Supabase Linter" /></a>
  <img src="https://img.shields.io/badge/E2E-10%2F10-brightgreen?style=for-the-badge&logo=cypress" alt="E2E 10/10" />
  <img src="https://img.shields.io/badge/Jest-276%2F276-brightgreen?style=for-the-badge&logo=jest" alt="Jest 276/276" />
  <img src="https://img.shields.io/badge/Mercado%20Pago-validated-blue?style=for-the-badge&logo=mercadopago" alt="Mercado Pago Validated" />
</p>


<p align="center">
  <a href="https://github.com/arecofix/Arecofixpage/actions/workflows/deploy.yml"><img src="https://img.shields.io/github/actions/workflow/status/arecofix/Arecofixpage/deploy.yml?branch=main&label=CI%2FCD%20Pipeline&style=flat-square&logo=github-actions" alt="CI/CD Pipeline" /></a>
  <a href="docs/STAGING.md"><img src="https://img.shields.io/badge/Staging%20Gate-Automated%20Cypress%20%2B%20Kong-69D3A7?style=flat-square&logo=cypress&logoColor=black" alt="Staging Gate" /></a>
  <a href="https://arecofix.com.ar"><img src="https://img.shields.io/badge/Production-arecofix.com.ar-00C7B7?style=flat-square&logo=google-chrome&logoColor=white" alt="Live Demo" /></a>
  <a href="https://angular.dev"><img src="https://img.shields.io/badge/Angular-21%20SSR-DD0031?style=flat-square&logo=angular&logoColor=white" alt="Angular 21" /></a>
  <a href="docs/D1_SCHEMA.md"><img src="https://img.shields.io/badge/Cloudflare-D1%20Edge%20Failover-F38020?style=flat-square&logo=cloudflare&logoColor=white" alt="Cloudflare D1 Failover" /></a>
  <a href="docs/SECURITY.md"><img src="https://img.shields.io/badge/Security-RLS%20100%25%20%2B%20CSP-blue?style=flat-square&logo=security" alt="Security" /></a>
</p>


---

## 🌟 Executive Overview & Business Value

**Arecofix** es un SaaS empresarial de gestión técnica, e-commerce y taller para servicios electrónicos, academias de hardware y facturación electrónica ARCA/AFIP, construido con Clean Architecture, Angular 21 SSR y alta disponibilidad resiliente.

Operating live at **[https://arecofix.com.ar](https://arecofix.com.ar)**, it unites technical repair lifecycle tracking, ARCA/AFIP-compliant electronic invoicing, multi-tenant inventory control, and an e-learning academy into an integrated, offline-first application.

### 💼 Key Capabilities
- **🏢 Multi-Tenant SaaS Architecture**: Dynamic subdomain-based tenant and branch isolation enforced at the database level via **PostgreSQL Row-Level Security (RLS)**.
- **🛠️ SAT Workshop Repair Engine**: End-to-end device tracking from diagnostic intake to delivery, featuring digital client signatures, WhatsApp notification webhooks, and QR code tracking.
- **🧾 Point of Sale (POS) & ARCA Electronic Invoicing**: Instant emission of official AFIP/ARCA invoices (Facturas A, B, C) with automated CAE validation and printable thermal receipt layouts.
- **🛍️ E-Commerce & Inventory Management**: Catalog with dynamic variant matrices (color, storage, condition), JSONB specifications, and zero-egress asset storage on **Cloudflare R2**.
- **🛠️ Modular Services & Landing Pages Creator**: Drag-and-drop block editor featuring 10 dynamic block types, SSR-safe rendering, Schema.org technical SEO (`Service` + `LocalBusiness`), 301 redirects, and secured lead generation with WhatsApp routing.
- **🎓 Technical Academy (LMS)**: Certification workflows, modular video curriculum, student evaluations, and automated certificate generation.
- **⚡ Offline-First Architecture**: Dual storage synchronization utilizing **Dexie.js (IndexedDB)** and background mutation queues for zero downtime in workshops with intermittent connectivity.
- **🚀 1-Command Atomic Deployments**: Custom automated pipeline with tarball compression, remote snapshots, PM2 cluster reloads, and self-healing rollbacks.

---

## 📸 Platform Screenshots

<div align="center">
  <table>
    <tr>
      <td width="50%">
        <img src="public/assets/img/readme/gestiondesucursales.png" alt="Multi-Branch Administration" /><br />
        <p align="center"><em>🏢 Multi-Tenant Branch Administration & Access Control</em></p>
      </td>
      <td width="50%">
        <img src="public/assets/img/readme/2-1.png" alt="Repair Workshop Management" /><br />
        <p align="center"><em>🔧 Workshop Orders, Diagnostics & Customer Tracking</em></p>
      </td>
    </tr>
    <tr>
      <td width="50%">
        <img src="public/assets/img/readme/4.png" alt="POS & Electronic Invoicing" /><br />
        <p align="center"><em>🧾 Point of Sale (POS) & ARCA/AFIP Electronic Invoicing</em></p>
      </td>
      <td width="50%">
        <img src="public/assets/img/readme/5.png" alt="E-Commerce & Spare Parts Catalog" /><br />
        <p align="center"><em>🛍️ Product Catalog with Dynamic Variants & R2 Storage</em></p>
      </td>
    </tr>
    <tr>
      <td colspan="2">
        <img src="public/assets/img/readme/6.png" alt="Technical Academy" width="100%" /><br />
        <p align="center"><em>🎓 Arecofix Academy - Hardware Repair Certification & Video Courses</em></p>
      </td>
    </tr>
  </table>
</div>

---

## 🏛️ Architecture & Engineering Excellence

The system is constructed following **Clean Architecture**, **Domain-Driven Design (DDD)**, and the **Repository Pattern** to decouple user interface components from underlying persistence layers, featuring edge failover resilience and multi-tenant security.

```mermaid
graph TD
    User([Clients, Mobile & Staff]) -->|HTTPS / WSS| CF[Cloudflare Edge CDN & WAF]
    
    subgraph Cloudflare_Edge["Cloudflare Edge Resilience"]
        CF -->|HTTP 402/5xx Edge Failover| Worker[Cloudflare Worker: D1 Failover]
        Worker <-->|Sub-50ms Read| D1[(Cloudflare D1 Database)]
    end

    CF -->|Origin Traffic| Kong[Kong API Gateway :8000/:8443]
    Kong -->|CORS Shield & Rate Limiting| Nginx[Nginx Reverse Proxy :80/:443]
    
    subgraph Host["VPS Infrastructure (Oracle Cloud Linux)"]
        Nginx -->|Reverse Proxy :4000| SSR[Angular 21 SSR Engine / Node.js 22 Cluster]
        SSR -->|Hydration| Browser[Angular Signals & PWA Client]
        Nginx -->|Reverse Proxy :4001| Staging[Staging SSR Environment]
        Nginx -->|Proxy :5000| Flask[Flask Local Python Sync API]
    end

    subgraph Persistence["Distributed Data & Edge Storage"]
        Browser -->|IndexedDB Local Cache| Dexie[Dexie.js Client Storage]
        Kong -->|PostgREST REST & Auth| DB[(PostgreSQL 15 + RLS Engine)]
        DB -->|pg_net Realtime Webhook < 5s| Worker
        Browser -->|Direct Zero-Egress S3 API| R2[Cloudflare R2 Bucket - Assets]
        Flask <-->|Realtime Sync| DB
    end

    subgraph Integrations["External Services & Fiscal Engines"]
        DB -->|Webhooks / RPC| ARCA[ARCA / AFIP Electronic Invoicing]
        DB -->|Alerts| WA[WhatsApp API Notifications]
        SSR -->|Checkout Gateways| MP[MercadoPago Checkout & Webhooks]
    end
```

### 🧱 Clean Architecture Layers

```
src/app/
├── core/                        # Global singletons, auth tokens, HTTP interceptors & guards
│   ├── guards/                  # authGuard, roleGuard, tenantOwnerGuard, branchAdminGuard
│   ├── interceptors/            # Auth JWT, timeout backoff, error normalization
│   └── services/                # Supabase client, offline sync, logging & analytics
│
├── features/                    # Domain Bounded Contexts
│   ├── products/                # Domain models, PostgREST repositories, catalog UI
│   ├── services/                # Services landing pages, block editor engine, leads capture & Schema.org SEO
│   ├── sales/                   # Invoicing, POS cash registers, ARCA fiscal receipts
│   ├── repairs/                 # Workshop tickets, diagnostic workflows, device states
│   ├── academy/                 # Course lessons, student enrollments, exam evaluators
│   └── branches/                # Multi-tenant branch switching & access controls
│
├── shared/                      # Reusable UI primitives, pipes, modal handlers, block editor & renderer
└── admin/                       # Administrative back-office management dashboards (Services, Leads, Repairs, etc.)
```

---

## 🛡️ Calidad, Resiliencia y Procesos Operativos

El ecosistema de **Arecofix** opera con tolerancia cero a fallos silenciosos y automatización integral de punta a punta:

1. **🎭 Staging Environment Idéntico**:
   - Ambiente espejo (`staging.arecofix.com.ar`) en puerto aislado 4001, con base de datos de staging (`supabase-staging-db`, puerto 5433), Kong API Gateway y terminación SSL automatizada.
   - Todo cambio de código o esquema de base de datos se despliega y verifica primero en Staging antes de tocar Producción.
   - 📖 Ver especificación en [docs/STAGING.md](docs/STAGING.md).

2. **🧪 E2E Test Gate Bloqueante (Cypress CI/CD)**:
   - Integrado en el pipeline de GitHub Actions (`.github/workflows/deploy.yml`).
   - Ejecuta validaciones completas contra Staging: integridad del carrito, SSR dinámico de metatags SEO y respuesta de failover.
   - **Regla estricta**: Si un solo test de Cypress falla, el deploy a Producción se aborta automáticamente.

3. **🌐 Cloudflare D1 Failover & Realtime Sync**:
   - Worker perimetral (`arecofix-d1-failover`) con base de datos Cloudflare D1 que garantiza catálogo y navegación activa ante cualquier corte o límite de cuota (HTTP 402/5xx) de Supabase.
   - Sincronización automática en tiempo real disparada por triggers de PostgreSQL (`pg_net`) en menos de 5 segundos tras cualquier cambio en productos o categorías.
   - 📖 Ver esquema y arquitectura en [docs/D1_SCHEMA.md](docs/D1_SCHEMA.md).

4. **🔍 Verificación de Contrato de Base de Datos**:
   - Validación pre-deploy (`scripts/verify-schema.mjs`) que compara el esquema de la base de datos contra el contrato requerido por el frontend para prevenir *schema drift*.

5. **🛡️ Kong API Gateway & CORS Shield**:
   - Capa de gateway dedicada para protección de preflight CORS (HTTP 200/204), rate-limiting y enrutamiento seguro hacia PostgREST.
   - Procedimientos de contingencia y reversión documentados en [docs/ROLLBACK_KONG.md](docs/ROLLBACK_KONG.md) y auditoría post-incidente en [docs/POST_INCIDENT_CORS_VERIFICATION_20261019.md](docs/POST_INCIDENT_CORS_VERIFICATION_20261019.md).

6. **⚡ Rendimiento y Latencia**:
   - Métricas de SSR, Core Web Vitals y tiempos de respuesta documentados en [docs/PERFORMANCE.md](docs/PERFORMANCE.md).

> 📖 **Deep Dive Documentation:**
> - [Staging Architecture & Setup](docs/STAGING.md)
> - [Performance & Core Web Vitals Benchmark](docs/PERFORMANCE.md)
> - [Kong API Gateway Rollback & Contingency](docs/ROLLBACK_KONG.md)
> - [Cloudflare D1 Failover Architecture](docs/D1_SCHEMA.md)
> - [Post-Incident CORS Verification Report](docs/POST_INCIDENT_CORS_VERIFICATION_20261019.md)
> - [Services Landing Architecture](docs/SERVICES_ARCHITECTURE.md)
> - [Services Database & Row-Level Security (RLS)](docs/SERVICES_RLS.md)
> - [Complete Architecture Blueprint](docs/architecture.md)

---

## 🏆 Certificaciones y Auditorías Técnicas

La plataforma Arecofix ha sido sometida a rigurosas auditorías de seguridad, resiliencia y base de datos con evidencia real y reproducible:

- 📜 **[Certificación Final de Cierre (10/10)](docs/CLIENT_READINESS_20261019.md)** — Certificación de 4 pilares: CSP Enforced, CI/CD desacoplado, Cypress E2E 10/10 y Mercado Pago validado de punta a punta.
- 🔍 **[Auditoría Forense de Regresión (20/10/2026)](docs/REGRESSION_AUDIT_20261020.md)** — Verificación en vivo contra producción: 0 regresiones detectadas, 50 suites Jest (276 tests), headers CSP y token MLA activo.
- 🗄️ **[Auditoría Forense de Base de Datos (20/10/2026)](docs/DATABASE_AUDIT_20261020.md)** — Análisis exhaustivo de 70 tablas en PostgreSQL: 100% de tablas públicas con RLS activo, detección de redundancias e integridad referencial blindada.
- 🔒 **[Remediación Integral Supabase Database Linter](docs/SECURITY_REMEDIATION_20261020.md)** — Mitigación exhaustiva de 673 advertencias del linter en 15 reglas: 0 vulnerabilidades P0/P1, search_path blindado, RLS InitPlans y 31 índices FK covering.
- 📘 **[Guía de Hardening de Base de Datos](docs/DATABASE_HARDENING_GUIDE.md)** — Estándares operacionales CIS/OWASP para SECURITY DEFINER, subconsultas escalares RLS y CI/CD linting.
- 🛡️ **[Política de Seguridad y Hardening](docs/SECURITY.md)** — Rationale de directivas CSP, headers HSTS/X-Frame-Options, gestión de secretos y protocolo de reporte.
- 🩺 **[Troubleshooting & Playbooks Forenses](docs/TROUBLESHOOTING.md)** — Casos de estudio reales (AF-155, CSP, Mercado Pago, Cypress y DB).


---

## 💎 Highlights Técnicos para Reclutadores & Arquitectos Enterprise

Para evaluadores técnicos, recruiters senior y auditores de software:

1. **🛡️ CSP Enforced de Máxima Seguridad**:
   - Cabecera Content Security Policy en modo estricto (bloqueo activo, sin `-Report-Only`) configurada en Express SSR y Nginx.
   - Integración hermética con Cloudflare Turnstile, Supabase REST/WebSocket y SDK oficial de Mercado Pago sin generar una sola advertencia en DevTools.
2. **🚀 CI/CD Desacoplado y Limpio**:
   - Eliminación total de antipatrones como modificación de `/etc/hosts` o IPs hardcodeadas en GitHub Actions (`.github/workflows/deploy.yml`).
   - Verificación automatizada de contratos de esquema (`verify-schema.mjs`) y preflights CORS en Kong.
3. **🧪 Cobertura de Pruebas Honesta (276/276 & 10/10)**:
   - **Jest**: 50 suites unitarias y 276 tests pasando en 31.5 segundos cubriendo lógica de dominio, usecases ARCA, cálculo fiscal y mappers.
   - **Cypress E2E**: 10 tests de alta fidelidad pasando (0 pending, 0 failing, 0 skipped), incluyendo resiliencia de carrito, failover offline a D1 y SEO de tracking con registro real en DB (AF-155).
4. **💳 Pasarela de Pago Mercado Pago Validada E2E**:
   - Token oficial MLA verificado contra la API de Mercado Pago (`id: 374364423`, `nickname: ENGA9824962`).
   - Flujo de cobro verificado desde el carrito hasta la pasarela segura oficial de Mercado Pago con registro de orden en PostgreSQL.
5. **⚡ SSR de Alto Rendimiento en Clúster PM2 Zero-Downtime**:
   - Renderizado en el servidor con Angular 21 SSR sobre Node.js 22 LTS, gestionado por PM2 en clúster resiliente con healthchecks automáticos y autorrecuperación (*self-healing*).
6. **🗄️ Base de Datos Blindada con Row-Level Security**:
   - PostgreSQL 15 con el 100% de tablas públicas protegidas por RLS, asegurando aislamiento absoluto entre tenants y perfiles.

---

## 📅 Estado del Proyecto

- **Estado Actual**: 🟢 **10/10 Certificado para Producción y Facturación Enterprise**
- **Última Auditoría Integral**: 20 de Octubre de 2026
- **Próximo Hito**: Activación del registro DNS para `staging.arecofix.com.ar` en Cloudflare y ejecución del plan de normalización de base de datos.

---


## 🛠️ Technology Stack Breakdown

| Layer | Technologies & Libraries | Rationale & Architectural Purpose |
|---|---|---|
| **Frontend Framework** | **Angular 21** (`@angular/ssr`, standalone) | SSR for sub-second FCP, SEO prerendering, and fine-grained reactivity via Angular Signals. |
| **Language & Typing** | **TypeScript 6.0** (Strict Mode) | Zero `any` policy, exhaustive domain modeling, strict type-guards. |
| **Styling & Design** | **TailwindCSS 4** + **DaisyUI 5** | Utility-first responsive design, modern dark/light theming, zero CSS bloat. |
| **Database & Auth** | **PostgreSQL** + **PostgREST** + **Supabase** | Kernel-enforced Row-Level Security (RLS), ACID transactions, instant REST generation. |
| **Asset Storage** | **Cloudflare R2** (S3 compatible) | Zero egress fees, global edge distribution for high-resolution repair & product images. |
| **Edge & CDN** | **Cloudflare Workers** + CDN + WAF | SSL termination, DDoS protection, geo-routing, and smart edge caching. |
| **Reverse Proxy** | **Nginx** (Ubuntu Linux) | Real-IP restoration, static asset micro-caching, Gzip compression, and HTTP/2 proxy. |
| **Process Manager** | **PM2** (`ecosystem.config.cjs`) | Auto-restart on memory thresholds (>600MB), log rotation, and cluster uptime guarantees. |
| **Testing Suite** | **Jest** + **Cypress E2E** + **k6** | 30 unit test suites, browser automation specs, and API load testing. |
| **Mobile & Desktop** | **Capacitor 8** (Android) & **Tauri 2** (Desktop) | Cross-platform reach sharing 100% of the Angular codebase with native OS access. |

---

## ⚡ 1-Command Automated Deployment

Forget complex multi-step deployment rituals. The entire production pipeline is orchestrated into **1 command**:

```bash
pnpm run deploy
```

### What happens under the hood?
1. 🧪 **Validation**: Checks local environment and SSH deployment key authorization.
2. 🏗️ **Angular SSR Build**: Compiles production client and server bundles (`pnpm run build`).
3. 📦 **Atomic Tarballing**: Packages `dist/arecofix` into `dist.tar.gz` (transfer size reduced by 85%).
4. 💾 **Remote VPS Snapshot**: Automatically backs up the live version to `dist_backup/` on the server.
5. 🚀 **Encrypted SCP Transfer**: Ships the package across the secure SSH tunnel (`ssh.arecofix.com.ar`).
6. 🔄 **Atomic Extraction & PM2 Reload**: Extracts files and executes zero-downtime `pm2 reload arecofix-frontend`.
7. 🩺 **Automated Healthcheck**: Tests `https://arecofix.com.ar` for HTTP 200/301 responses.
   - **Self-Healing Guarantee**: If the server fails to respond, it automatically triggers an **instant rollback** from `dist_backup`.

### Operational Commands

```bash
# 🚀 Despliegue maestro a producción
pnpm run deploy

# ⚡ Despliegue rápido (omite compilación local si ya existe dist/)
pnpm run deploy:quick

# ⏪ Rollback inmediato de emergencia (< 2 segundos)
pnpm run deploy:rollback

# 🩺 Healthcheck en vivo de latencia y estado PM2
pnpm run healthcheck

# 🖥️ Monitoreo remoto de procesos PM2
pnpm run pm2:status
pnpm run pm2:logs
pnpm run pm2:restart
```

> ⚠️ **Compilación de Producción & Clean Tree Gate:**  
> El build de producción requiere `pnpm run build` (con prebuild hook), NO `ng build` directo. Para compilar local con cambios sin commitear: `ALLOW_DIRTY=true pnpm run build`.

> 📖 **DevOps & SRE Runbook:** Full server setup and Nginx configuration detailed in [docs/deployment.md](docs/deployment.md).

---

## 🧪 Testing & Quality Assurance

Quality is enforced at every layer of the architecture:

```bash
# Ejecutar suite de pruebas unitarias (Jest)
pnpm test

# Modo interactivo / TDD
pnpm test:watch

# Generar reporte de cobertura de código
pnpm test:coverage

# Ejecutar tests E2E con Cypress
pnpm run test:e2e

# Abrir Cypress Test Runner interactivo
pnpm run cypress:open
```

- **Unit Tests (Jest)**: 30 test suites (150+ assertions) testing mappers, services, interceptors, and compensating transactions.
- **E2E Forensic Tests (Cypress)**: Automated user journeys intercepting PostgREST network calls, form validations, and multi-tenant catalog updates.
- **Load Testing (k6)**: Stress testing API endpoints under simulated peak loads.

---

## 🚀 Local Development Setup

### Prerequisites
- [Node.js](https://nodejs.org/) v22+
- [pnpm](https://pnpm.io/) v9+
- [Git](https://git-scm.com/)

### Step-by-Step Installation

```bash
# 1. Clonar el repositorio
git clone https://github.com/arecofix/Arecofixpage.git
cd Arecofixpage

# 2. Instalar dependencias
pnpm install

# 3. Configurar variables de entorno
cp .env.example .env
# Completa tus credenciales de Supabase / Base de datos en .env

# 4. Iniciar servidor de desarrollo
pnpm start
# La aplicación estará disponible en http://localhost:4200
```

---

## 📂 Project Structure

```
Arecofixpage/
├── src/
│   ├── app/
│   │   ├── admin/           # Administrative panels (Sales, Products, Repairs, Branches)
│   │   ├── core/            # Core services, auth guards, interceptors, error handling
│   │   ├── features/        # Clean Architecture domain modules (Products, Sales, Repairs)
│   │   ├── shared/          # Reusable UI components, pipes, design tokens
│   │   ├── app.config.ts    # Dependency Injection providers & Repository bindings
│   │   └── app.routes.ts    # Lazy-loaded route registry
│   ├── server.ts            # Angular Express SSR bootstrap
│   └── environments/        # Target configuration profiles
├── docs/                    # Technical architecture, database schemas & Nginx templates
│   ├── architecture.md      # Clean Architecture & DDD specifications
│   ├── deployment.md        # Complete DevOps & SRE runbook
│   ├── database.md          # Database schema & RLS policies
│   └── nginx/arecofix.conf  # Production Nginx reverse proxy configuration
├── scripts/                 # Automation scripts (deploy.mjs, healthcheck.mjs, rollback.mjs)
├── cypress/                 # Automated E2E test suites
├── supabase/                # PostgreSQL migrations, schema DDL & seed data
├── ecosystem.config.cjs     # PM2 process management configuration
└── package.json             # Scripts & dependency definitions
```

---

## 🔒 Security Best Practices

- **Zero Committed Secrets**: All secrets and credentials are fully isolated in environment variables. The `.gitignore` is rigorously segmented into 8 protection categories.
- **No SQL Injections**: All queries are sanitized and parameterized via PostgREST and domain mappers with column whitelisting.
- **Tenant Isolation**: Row-Level Security (RLS) ensures that even in the event of an application logic anomaly, the database engine prohibits cross-tenant data access.
- **Strict HTTPS & HSTS**: Nginx forces TLS 1.3, HSTS preloading, secure cookies, and Cloudflare Authenticated Origin Pulls.

---

## 📄 License & Author

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

Developed with ❤️ by **[Ezequiel Enrico Areco](https://arecofix.com.ar)**  
*Founder & Senior Full-Stack Engineer / Tech Lead*  
📫 **Contact:** [ezequiel@arecofix.com.ar](mailto:ezequiel@arecofix.com.ar) | [LinkedIn](https://linkedin.com) | [Portfolio](https://arecofix.com.ar)
