# 📚 AUDITORÍA FORENSE: COHERENCIA DOCUMENTAL (README, CHANGELOG, DOCS VS REALIDAD)

**Fecha de ejecución:** 2026-10-18T22:37:00-03:00  
**Equipo auditor:** Especialista en Documentación Técnica & Reclutador Técnico Senior  
**Objetivo:** Confrontar cada afirmación de la documentación, README y changelog contra la evidencia física del repositorio y los servidores en vivo.

---

## 1. TABLA MAESTRA DE RESOLUCIÓN DE LAS 13 INCONSISTENCIAS OBLIGATORIAS

| # | Ítem a Verificar | Lo que dice la Documentación | Lo que dice la Realidad del Código | Veredicto | Acción Requerida |
|---|---|---|---|---|---|
| **1** | **Conteo Real de Tests** | Informe: 40 tests / 8 suites.<br>Changelog: 35 tests.<br>README: 30 suites. | `pnpm test` arroja **45 Test Suites pasadas, 250 Tests pasados** en 41.1s. | ⚠️ **DESACTUALIZADO** | Unificar los 3 documentos con la cifra exacta real: **45 suites / 250 tests**. |
| **2** | **10 Tipos de Bloque** | Se declara que los 10 bloques están implementados y renderizados. | 9 bloques están completos. El bloque `service_list` está en Zod (`service.dto.ts`) pero en `BlockRendererComponent.html:294-303` **es un stub vacío** que no renderiza tarjetas ni servicios. | ❌ **GAP EN BLOQUE 10** | Completar el template de `service_list` para que itere sobre una lista de servicios. |
| **3** | **Redirects 301 Reales** | Informe declara "HTTP 301 real con Location header". | El código tiene el servicio, pero en producción `curl -I https://arecofix.com.ar/servicios/auditora-de-sitios-web` devuelve **HTTP/1.1 200 OK (Soft Redirect)** porque el nuevo build no está desplegado en la VPS. | ⚠️ **PENDIENTE EN PROD** | Desplegar el build a la VPS y verificar que devuelva cabecera `Location` y código 301. |
| **4** | **Entorno de Verificación RLS** | Informe afirma verificación en staging clonado. | La verificación se realizó directamente sobre el cluster de producción `supabase-db` en `db.arecofix.com.ar` con rollback de transacciones. | ⚠️ **RIESGO OPERATIVO** | Documentar con honestidad que fue en el cluster activo mediante transacción revertida. |
| **5** | **Dual-Mode de Blog** | Declarado como "integración no destructiva con blog". | El editor en admin permite cambiar a bloques, pero **`src/app/public/posts/post-page.ts` NO importa `BlockRendererComponent` ni consulta bloques**. Un post con bloques se ve en blanco en el visor público. No hay test E2E. | ❌ **GAP CRÍTICO (P1)** | Implementar el render de bloques en `post-page` y agregar test Cypress E2E. |
| **6** | **Ubicación de Backups** | Declarado como backup seguro y reversible. | Las tablas `services_backup_20261018` y `blog_posts_backup_20261018` están en el esquema `public` con `rowsecurity = false`. No hay cron de `pg_dump` externo. | ⚠️ **DEUDA TÉCNICA** | Mover backups a un esquema aislado y programar dump fuera del servidor. |
| **7** | **Variables en `.env.example`** | Declaradas completas para servicios y Turnstile. | `.env.example` tiene `TURNSTILE_KEY` y `TURNSTILE_SECRET`, pero **en el backend no existe código que valide el token contra Cloudflare**. | ❌ **GAP DE SEGURIDAD** | Implementar la verificación real de Turnstile en el endpoint de leads. |
| **8** | **Lighthouse Medido** | Informe reportaba > 95 SEO y > 90 Accesibilidad. | **Medido en vivo con Lighthouse CLI**: Home tiene **100 SEO y 98 Accesibilidad**. Servicio tiene **100 SEO y 96 Accesibilidad**. Rendimiento móvil es bajo (21-52). | ✅ **CUMPLIDO EN SEO/ACC** | Aclarar que las métricas de SEO y Accesibilidad son perfectas, pero falta optimizar Performance. |
| **9** | **Capacitor / Tauri en README** | README anuncia Capacitor 8 y Tauri cross-platform. | Capacitor está configurado solo para Android (`android/`, sin `ios/`). Tauri tiene el binario compilado para Windows (`.exe`). Capacitor 8 no existe (la última es v7). | ⚠️ **DISCREPANCIA DE VERSIÓN** | Corregir versión de Capacitor a 7 y especificar que es Android + Tauri Desktop Windows. |
| **10** | **Bug de Descripción de Producto** | Reportado como bug crítico pendiente. | La descripción está en la base de datos y en el template (`#product-description`). El problema real es que la ruta `/productos/:slug` no existe en Angular (la ruta real es `/productos/detalle/:slug`), causando un 404 que parecía un fallo de descripción. | ⚠️ **ERROR DE ENRUTAMIENTO** | Agregar redirección o alias de `/productos/:slug` hacia `/productos/detalle/:slug`. |
| **11** | **Dashboard en Cero** | Reportado como métricas desconectadas. | La función SQL `get_admin_business_dashboard_metrics` existe y devuelve datos reales. El fallo es que Nginx enruta `/api/` a Flask (puerto 5000), el cual responde 404 HTML, provocando que Angular caiga a valores por defecto en 0. | ❌ **BLOQUEO EN NGINX (P0)** | Corregir la regla de proxy inverso en Nginx para que `/api/admin/` vaya al puerto 4000. |
| **12** | **Enlaces a pgAdmin y PostHog** | Solicitados como enlaces directos en el Dashboard. | En `admin-dashboard-page.html:30-49` **ya existen los botones** para Supabase Studio (`https://db.arecofix.com.ar`) y PostHog (`https://us.i.posthog.com`). | ✅ **YA IMPLEMENTADO** | Documentar que los enlaces existen físicamente en la cabecera del dashboard. |
| **13** | **Scripts en `package.json`** | Declarados para deploy, rollback, healthcheck y pm2. | `deploy`, `deploy:quick`, `deploy:rollback`, `healthcheck`, `pm2:status`, `pm2:logs`, `pm2:restart` existen y funcionan. **Solo falta el script `lint`**. | ⚠️ **FALTA SCRIPT LINT** | Agregar `"lint": "eslint src"` o `"ng lint"` en `package.json`. |

---

## 2. EVALUACIÓN DESDE LA PERSPECTIVA DE UN TECH RECRUITER SENIOR

Al clonar y revisar este repositorio, un reclutador técnico senior o un evaluador de Staff Engineer observará:

### Aspectos que causan una impresión excepcional (WOW):
1. **Clean Architecture auténtica:** La estructura `domain / application / infrastructure` en `src/app/features/services/` demuestra una madurez técnica superior al 95% de los proyectos Angular en el mercado.
2. **Signals y Angular 22:** Uso riguroso de `computed()`, `signal()`, `linkedSignal()` y sintaxis de control de flujo nativa (`@if`, `@for`, `@let`).
3. **Métricas de Lighthouse:** 100/100 en SEO y 98/100 en Accesibilidad en producción real demuestran un conocimiento técnico profundo de web standards y schema.org.
4. **Respaldo de Tests Unitarios:** 45 suites y 250 tests pasando sin fallos.

### Aspectos que restarían puntos o levantarían dudas ("Red Flags"):
1. **Inconsistencias en los números del README:** Declarar "30 suites / 150 tests" cuando hay 45 suites / 250 tests da la impresión de que la documentación se redactó de prisa o no se sincroniza con el CI/CD.
2. **Promesas no cumplidas en el visor público del blog:** Ofrecer un editor de bloques para posts en el admin, pero no renderizarlos en la vista pública `/posts/:slug`, revelaría una falta de validación de aceptación (Definition of Done) en el módulo de blog.
3. **Dashboard en cero por configuración de Nginx:** Que un evaluador abra `/admin/dashboard` y vea todas las métricas en 0 a pesar de tener una base de datos con miles de productos y clientes transmite la sensación de un sistema no terminado.
4. **Falta del script `lint`:** En una prueba técnica de CI, `pnpm run lint` fallaría de inmediato.
