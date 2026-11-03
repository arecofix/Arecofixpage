# Post-Mortem Blameless de Incidente P0: Recursión Infinita en RLS y Caída de API REST

**Incidente ID:** INC-20261020-RLS-RECURSION  
**Fecha:** 20 de Octubre de 2026  
**Severidad:** P0 (Interrupción Total de API de Producción)  
**Duración Total:** 38 minutos  
**Incident Commander:** Senior Staff Incident Commander  
**Equipo Técnico Involucrado:** DBA Senior, SRE Senior, Backend Lead, Security Auditor, QA Lead  
**Estado:** **RESUELTO / SERVICIO 100% RESTAURADO**  

---

## 1. Resumen Ejecutivo

El 20 de Octubre de 2026 a las 21:10 UTC, tras la aplicación de las migraciones de remediación del linter de base de datos (`20261022050000_*`), la totalidad de las solicitudes REST hacia `db.arecofix.com.ar/rest/v1/*` comenzaron a fallar con errores `413` y `504` enmascarados en la capa CDN/Gateway.

El análisis de logs de PostgreSQL (`supabase-db`) confirmó `ERROR: stack depth limit exceeded`. La causa raíz fue la conversión de funciones helper de autorización (`is_admin()`, `get_auth_user_tenant()`, `is_super_admin()`) de `SECURITY DEFINER` a `SECURITY INVOKER`, lo que eliminó la capacidad de `BYPASSRLS` al consultar `public.profiles` dentro de las políticas de la propia tabla, generando un bucle de recursión infinita (CWE-674).

El equipo activó el protocolo War Room P0, tomó un snapshot de contingencia (`backup_pre_hotfix_20261020_2140.dump`), aplicó la migración quirúrgica `20261022100000_hotfix_restore_definer_recursion.sql` restaurando `SECURITY DEFINER` con `search_path` blindado, y reestableció la disponibilidad total con latencias <5ms. La batería de pruebas automatizadas Cypress (10/10) y Jest (276/276) verificó cero regresiones funcionales.

---

## 2. Línea de Tiempo del Incidente (Timeline)

| Hora (UTC) | Fase | Evento / Acción |
| :---: | :---: | :--- |
| **21:10** | **Introducción** | Se aplican migraciones R4 (`20261022050000_*` a `20261022090000_*`) para mitigar advertencias del linter. |
| **21:12** | **Detección** | PostgREST deja de responder. Postman y Frontend reportan errores `413` y `504` en `/rest/v1/categories`, `/rest/v1/profiles`. |
| **21:15** | **Alerta P0** | Se declara formalmente el Incidente P0. Se constituye el War Room multidisciplinario. |
| **21:20** | **Triage / Ruido** | Se descartan falsos positivos externos (`analytics.google.com`, `fbevents.js`). Se identifica que el HTTP `413` es un error de tubería rota en PostgREST originado por el crash del backend PostgreSQL. |
| **21:25** | **Aislamiento** | Ejecución de `docker logs supabase-db`. Se detecta `stack depth limit exceeded` con traza recursiva en `get_auth_user_tenant()` y `public.profiles`. |
| **21:32** | **Prueba en Sandbox** | Se ejecuta bloque de prueba transaccional (`BEGIN; ALTER ... SECURITY DEFINER; SELECT count(*) FROM profiles; ROLLBACK;`). La consulta se resuelve en <1ms sin desbordamiento. |
| **21:39** | **Respaldo** | Se genera dump transaccional de salvaguarda: `/home/ubuntu/backup_pre_hotfix_20261020_2140.dump` (2.1 MB). |
| **21:42** | **Despliegue Hotfix** | Se aplica la migración `20261022100000_hotfix_restore_definer_recursion.sql` en Staging y Producción. Se recarga PostgREST schema cache. |
| **21:45** | **Verificación** | `curl` a PostgREST responde `HTTP 200 OK` (Kong latency 0ms, upstream 2ms). `dashboard-healthcheck.mjs` reporta 100% OK en 0.70s. |
| **21:48** | **Cierre del P0** | Se ejecutan pruebas Jest (276/276) y Cypress E2E (10/10). El incidente se da por mitigado y cerrado. |

---

## 3. Causa Raíz (5 Whys)

1. **¿Por qué fallaba la API REST?** PostgREST cerraba la conexión abruptamente al recibir fallos fatales de PostgreSQL.
2. **¿Por qué fallaba PostgreSQL?** Desbordaba el límite de profundidad de pila con `ERROR: stack depth limit exceeded`.
3. **¿Por qué desbordaba la pila?** La política `profiles_tenant_isolation_restrictive` llamaba a `get_auth_user_tenant()`, que ejecutaba una consulta a `public.profiles`, activando nuevamente la política en un bucle infinito.
4. **¿Por qué la consulta dentro de `get_auth_user_tenant()` activaba la política RLS?** Porque la función fue modificada a `SECURITY INVOKER`, perdiendo los privilegios del superusuario `postgres` que otorgan el flag `BYPASSRLS`.
5. **¿Por qué se modificó a `SECURITY INVOKER`?** Para silenciar mecánicamente la advertencia del linter de Supabase (`authenticated_security_definer_function_executable`), priorizando el score del linter por sobre la arquitectura de recursión en RLS.

---

## 4. Qué Funcionó vs. Qué Falló

### Qué Funcionó Muy Bien
- **Velocidad de Triage y Diagnóstico:** El equipo identificó la trampa del error 413 y aisló el stack depth limit en menos de 10 minutos.
- **Validación Transaccional Segura:** El test con `BEGIN ... ROLLBACK` permitió verificar la solución antes de modificar el estado permanente de la base de datos.
- **Cadena de Despliegue con Rollback:** La migración contó con script `_down.sql` probado y backup físico inmediato.
- **Batería de Pruebas de Regresión:** Cypress y Jest permitieron constatar en menos de 2 minutos que la restauración no generó regresiones colaterales en checkout ni taller.

### Qué Falló
- **Pruebas de Profundidad de RLS en Staging:** La migración R4 Grupo A no fue probada simulando el rol exacto `authenticated` en tablas con políticas recursivas dependientes de helpers.
- **Automatización de Detección en CI/CD:** El pipeline de integración continua carecía de un gate específico para validar recursión de RLS bajo roles no privilegiados.
- **Priorización Dogmática del Linter:** Se asumió que toda alerta de `SECURITY DEFINER` debía convertirse a `SECURITY INVOKER`, sin considerar que los resolvers de autenticación y tenencia **requieren imperativamente `SECURITY DEFINER`** para evitar recursión.

---

## 5. Tabla de Acciones Correctivas (Preventivas y Definitivas)

| Acción Correctiva | Tipo | Responsable | Deadline | Estado |
| :--- | :---: | :---: | :---: | :---: |
| Aplicar Hotfix de restauración `SECURITY DEFINER` en 15 funciones | Inmediata | DBA Senior | 2026-10-20 | ✅ Completado |
| Crear script automatizado anti-recursión `scripts/test_rls_recursion.mjs` | Preventiva | SRE / Backend | 2026-10-20 | ✅ Completado |
| Incorporar `pnpm test:recursion` como gate obligatorio en CI/CD (`deploy.yml`) | Preventiva | DevOps Senior | 2026-10-20 | ✅ Completado |
| Actualizar `docs/SECURITY.md` con la Regla de Oro sobre helpers RLS | Documental | Security Lead | 2026-10-20 | ✅ Completado |
| Documentar las funciones como falsos positivos justificados en `JUSTIFIED_WARNINGS` | Auditoría | Compliance Lead | 2026-10-20 | ✅ Completado |
| Configurar alerta en Prometheus/Datadog para métrica `pg_stat_activity` stack depth | Monitoreo | SRE Senior | 2026-10-25 | ⏳ Programado |

---

## 6. Dictamen de Cierre

El incidente ha sido resuelto de forma definitiva. La arquitectura de base de datos preserva su aislamiento multi-tenant hermético, elimina las superficies de ataque mediante `search_path` hardening, y garantiza estabilidad absoluta en tiempo de ejecución.
