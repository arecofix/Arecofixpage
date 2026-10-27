# Auditoría de Dependencias: Riesgos, CVEs y Paquetes Obsoletos

**Fecha**: 2026-10-24  
**Rama de auditoría**: `audit/2026-10`  
**Modo**: Solo Lectura (Inventario Priorizado - Gate Humano)

---

## 1. Resumen de Vulnerabilidades (`pnpm audit`)

| Nivel | Total | Impacto |
| :--- | :---: | :--- |
| **Crítica** | 6 | RCE / Command Injection / IP Spoofing / Proxy Path Exposure |
| **Alta** | 73 | DoS, ReDoS, XSS y Prototype Pollution en dependencias transitivas |
| **Moderada** | 53 | Dependencias de dev y tooling (build/test) |
| **Baja** | 11 | Irregularidades menores de formato/URI |
| **Total** | **143** | Vulnerabilidades reportadas en el árbol actual de `node_modules` |

---

## 2. Inventario de CVEs Críticos y de Alto Impacto

| # | Paquete | Severidad | CVE / Advisory | Ruta / Módulo afectado | Propuesta de Fix (1 línea) |
|---|---------|-----------|----------------|------------------------|----------------------------|
| 1 | `@capacitor/android` | **Crítica** | [GHSA-rvm3-566m-v7fv](https://github.com/advisories/GHSA-rvm3-566m-v7fv) | Carga de contenido remoto en origen de la app via proxy HTTP interno | Actualizar `@capacitor/android` a `>=8.5.1` en `package.json`. |
| 2 | `proxy-addr` | **Crítica** | [GHSA-jqcg-44mw-7w3h](https://github.com/advisories/GHSA-jqcg-44mw-7w3h) | IP spoofing via IPv4-mapped IPv6 trust subnet en Express | Agregar override `"proxy-addr": "^2.0.8"` en `pnpm.overrides` de `package.json`. |
| 3 | `piscina` | **Crítica** | [GHSA-67c8-pqhq-4rmx](https://github.com/advisories/GHSA-67c8-pqhq-4rmx) | Prototype pollution en ThreadPool.options permite RCE en worker threads | Agregar override `"piscina": "^5.3.2"` en `pnpm.overrides` de `package.json`. |
| 4 | `shell-quote` | **Crítica** | [GHSA-pqg4-j6r4-53mv](https://github.com/advisories/GHSA-pqg4-j6r4-53mv) | Command injection via delimitadores de línea en tokens con comentarios | Agregar override `"shell-quote": "^1.11.0"` en `pnpm.overrides`. |
| 5 | `handlebars` | **Crítica** | [GHSA-8r5x-fm3f-whwj](https://github.com/advisories/GHSA-8r5x-fm3f-whwj) | JavaScript Injection via AST Type Confusion en `compile()` (jest/ts-jest) | Agregar override `"handlebars": "^4.7.10"` en `pnpm.overrides`. |
| 6 | `handlebars` | **Crítica** | [GHSA-p8wg-vrv2-v86f](https://github.com/advisories/GHSA-p8wg-vrv2-v86f) | JavaScript Injection via Own Property Check Bypass | Queda remediado con el mismo override `"handlebars": "^4.7.10"`. |
| 7 | `serialize-javascript` | **Alta** | [GHSA-m5mm-p8h7-m29v](https://github.com/advisories/GHSA-m5mm-p8h7-m29v) | RCE via serialización de funciones en webpack / mocha | Agregar override `"serialize-javascript": "^7.1.3"` en `pnpm.overrides`. |
| 8 | `cross-spawn` | **Alta** | [GHSA-3xgq-45jj-v275](https://github.com/advisories/GHSA-3xgq-45jj-v275) | Command injection en sistemas Windows debido a escape defectuoso | Agregar override `"cross-spawn": "^7.0.6"` en `pnpm.overrides`. |

---

## 3. Inventario de Dependencias Abandonadas u Obsoletas en `package.json`

| # | Paquete | Versión actual | Estado de Mantenimiento | Riesgo | Propuesta de Fix (1 línea) |
|---|---------|----------------|-------------------------|--------|----------------------------|
| 1 | `cypress-file-upload` | `^5.0.8` | **Abandonado** (último release hace 4 años) | Incompatibilidad futura con Cypress 14+ / 15+ | Reemplazar en los tests por el método nativo de Cypress `cy.get(...).selectFile(...)`. |
| 2 | `node-fetch` | `^2.7.0` | **Obsoleto** (v2 está en maintenance mode) | Innecesario en Node.js 18+ que incluye `globalThis.fetch` nativo | Migrar scripts de node que usan `node-fetch` al `fetch` nativo de Node.js y desinstalarlo. |
| 3 | `pdf-lib` | `^1.17.1` | **Sin mantenimiento activo** (sin updates mayores) | Lentitud de renderizado y bugs sin parches en ESM moderno | Evaluar migración de generación de PDFs exclusivamente a `jspdf` (ya presente en el proyecto). |
| 4 | `url` | `^0.11.4` | **Innecesario** (polyfill de módulo core de Node) | Sobrecarga de bundle y dependencias duplicadas | Remover de `devDependencies` y usar `new URL(...)` nativo del motor JS. |
