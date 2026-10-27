# Baseline Técnico de Auditoría Forense — Arecofix

**Fecha:** 18 de Octubre de 2026 (22:30 ART)  
**Ambiente:** Windows x64 (Local) + Ubuntu 22.04 LTS (VPS `ssh.arecofix.com.ar`)  
**Rama:** `feature/services-landing`  
**Auditor:** Equipo Senior de Auditoría Técnica Multidisciplinario

---

## 1. Inventario de Versiones del Stack

| Herramienta / Runtime | Versión Real Detectada | Versión Declarada en README | Discrepancia |
|---|:---:|:---:|:---:|
| **Node.js** | `v24.18.0` | `v22+` | ✅ Compatible |
| **Package Manager (pnpm)** | `11.10.0` | `v9+` | ✅ Compatible |
| **Angular CLI** | `22.1.5` | `21 SSR` | 📝 **Inconsistencia** (Proyecto actualizado a Angular 22) |
| **@angular/core** | `22.1.3` | `Angular 21` | 📝 **Inconsistencia** (Angular 22 instalado) |
| **TypeScript** | `6.0.3` | `TypeScript 6.0` | ✅ Coincide |
| **PostgreSQL (supabase-db)** | `PostgreSQL 15.8 (Debian)` | `PostgreSQL` | ✅ Coincide |
| **PM2 (Cluster)** | `5.4.3` | `PM2` | ✅ Coincide |

---

## 2. Ejecución Literal de Comandos de Línea Base

### 2.1. Verificación de Dependencias (`pnpm install`)
```bash
$ pnpm install
Scope: all 1 workspace projects
Lockfile is up to date, resolution step is skipped
Already up to date
Done in 2.1s
```
*Estado:* ✅ Limpio, sin discrepancias en lockfile.

### 2.2. Linter (`pnpm run lint`)
```bash
$ pnpm run lint
[ERR_PNPM_NO_SCRIPT] Missing script: lint
Command "lint" not found.
```
*Estado:* ❌ **Falla de script**: `package.json` no tiene configurado el script `lint`. Existe `format` (Prettier) pero no linter automatizado (`eslint` o `ng lint`).

### 2.3. Compilación de Producción SSR (`pnpm run build`)
```bash
$ ng build --configuration production
> Building...
/*! 🌼 daisyUI 5.7.20 */
√ Building...

Client bundles:
Initial chunk files:
main-JXM32LXB.js          | main                     | 498.42 kB
styles-C57T2L2R.css       | styles                   | 141.22 kB
polyfills-S35YYIF2.js     | polyfills                |  34.50 kB

Server bundles:
server.mjs                | server                   |   1.32 MB
chunk-SB32VILL.mjs        | -                        | 590.16 kB

Application bundle generation complete. [65.542 seconds]
Output location: C:\git\Arecofixpage\dist\arecofix
Exit Code: 0
```
*Estado:* ✅ **Compilación Exitosa**: Bundles de cliente y servidor generados sin errores en estricto TypeScript.

### 2.4. Suite Completa de Tests Unitarios (`pnpm test`)
```
PASS src/app/infrastructure/events/rxjs-event-bus.service.spec.ts
PASS src/app/features/repairs/application/services/admin-repair.service.spec.ts
PASS src/app/shared/components/blocks-editor/blocks-editor.component.spec.ts
PASS src/app/features/services/application/usecases/service-usecases.spec.ts
PASS src/app/features/services/domain/value-objects/value-objects.spec.ts
PASS src/app/shared/components/block-renderer/block-renderer.component.spec.ts
PASS src/app/admin/services/service-editor/service-editor.component.spec.ts
PASS src/app/features/services/domain/dtos/block-schemas.spec.ts
PASS src/app/features/services/application/mappers/service-mapper.spec.ts
PASS src/app/admin/services/admin-services-page.spec.ts
PASS src/app/shared/services/cart.service.spec.ts
PASS src/app/admin/dashboard/admin-dashboard-page.spec.ts
PASS src/app/admin/dashboard/services/admin-business-dashboard.service.spec.ts
[... 32 suites restantes ...]

Test Suites: 45 passed, 45 total
Tests:       250 passed, 250 total
Snapshots:   0 total
Time:        41.138 s
Ran all test suites.
Exit Code: 0
```
*Estado:* ✅ **100% de Pruebas Unitarias Pasando**:
- **Total Suites:** 45 (README dice 30).
- **Total Tests:** 250 (README dice 150+).

### 2.5. Cobertura de Código (`pnpm test:coverage`)
```
------------------------------------------------------|---------|----------|---------|---------|
File                                                  | % Stmts | % Branch | % Funcs | % Lines |
------------------------------------------------------|---------|----------|---------|---------|
All files                                             |    13.1 |    13.16 |    8.24 |   13.47 |
------------------------------------------------------|---------|----------|---------|---------|
```
*Estado:* ⚠️ **Baja Cobertura Global (13.1%)**: Los módulos nuevos de servicios y eventos tienen > 85% de cobertura, pero componentes legados gigantescos (`admin`, `directives`, `checkout`, `chatbot`, `sales`) tienen 0% de cobertura unitaria.

### 2.6. Pruebas E2E Cypress Headless (`pnpm run test:e2e`)
```bash
Cypress could not verify that this server is running:
  > http://localhost:4200
We are verifying this server because it has been configured as your baseUrl.
Cypress failed to verify that your server is running.
Please start this server and then run Cypress again.
Exit Code: 1
```
*Estado:* ⚠️ **Requiere Servidor Activo**: El script `test:e2e` en `package.json` intenta usar `start-server-and-test`, pero en ejecución directa sin background daemon falla por timeout de conexión a `localhost:4200`.
