# Auditoría Técnica: Escaneo de Deuda Técnica y Tipado

**Fecha**: 2026-10-24  
**Rama de auditoría**: `audit/2026-10`  
**Modo**: Solo Lectura (Inventario Priorizado - Gate Humano)

---

## 1. Resumen Ejecutivo

| Categoría | Total Hallazgos | Nivel de Riesgo | Impacto |
| :--- | :---: | :---: | :--- |
| **TODO / FIXME / HACK** | 5 | Medio / Bajo | Tareas pendientes y bypasses temporales en servicios y repositorios |
| **`@ts-ignore`** | 2 | Medio | Supresiones explícitas de chequeo de tipos en componentes |
| **`console.log` en Producción** | 12 | Medio / Bajo | Logs en consola en runtime de producción que exponen detalles internos |
| **Uso de `any` en TypeScript** | 471 | Alto | Rompe la regla de oro del proyecto (*Strict mode enforced, `any` forbidden*) |

---

## 2. Inventario: TODO / FIXME / HACK

| # | Archivo:Línea | Severidad | Descripción del Hallazgo | Propuesta de Fix (1 línea) |
|---|---------------|-----------|--------------------------|----------------------------|
| 1 | [Back-End/app.py:723](file:///c:/git/Arecofixpage/Back-End/app.py#L723) | **Alta** | `# @token_required # Todo: add back when auth is integrated with angular` (endpoint de sync/orders sin auth) | Descomentar el decorador `@token_required` y validar JWT de GoTrue en la API de Flask. |
| 2 | [src/app/features/customers/infrastructure/repositories/supabase-customer.repository.ts:41](file:///c:/git/Arecofixpage/src/app/features/customers/infrastructure/repositories/supabase-customer.repository.ts#L41) | **Media** | `// TODO: Add the second branch ID here when the user provides it` | Obtener la lista dinámica de sucursales via `BranchService` en lugar de IDs hardcodeados. |
| 3 | [src/app/shared/components/lead-magnet/lead-magnet.component.ts:38](file:///c:/git/Arecofixpage/src/app/shared/components/lead-magnet/lead-magnet.component.ts#L38) | **Media** | `// TODO: Lógica para enviar los datos al backend (Supabase, Firebase, etc.)` | Inyectar `ContactService` / `LeadService` y persistir los leads en la tabla `leads`. |
| 4 | [src/environments/environment.development.ts:8](file:///c:/git/Arecofixpage/src/environments/environment.development.ts#L8) | **Baja** | `* TODO: Implement proper environment variable injection at build time` | Configurar `@ngx-env/builder` o script de sustitución de tokens en build. |
| 5 | [src/environments/environment.ts:8](file:///c:/git/Arecofixpage/src/environments/environment.ts#L8) | **Baja** | `* TODO: Implement proper environment variable injection at build time` | Mismo fix de inyección de variables en build para producción. |

---

## 3. Inventario: `@ts-ignore`

| # | Archivo:Línea | Severidad | Descripción del Hallazgo | Propuesta de Fix (1 línea) |
|---|---------------|-----------|--------------------------|----------------------------|
| 1 | [src/app/app.ts:121](file:///c:/git/Arecofixpage/src/app/app.ts#L121) | **Media** | `// @ts-ignore` antes de acceder a la API de Tauri en ventana global | Tipar el objeto global `window.__TAURI_INTERNALS__` en `src/typings.d.ts`. |
| 2 | [src/app/public/cursos/create-course/create-course.component.ts:77](file:///c:/git/Arecofixpage/src/app/public/cursos/create-course/create-course.component.ts#L77) | **Media** | `// @ts-ignore` en asignación de propiedad dinámica de formulario | Extender la interfaz del formulario o DTO del curso con la propiedad requerida. |

---

## 4. Inventario: `console.log` en Código de Producción (12 instancias)

| # | Archivo:Línea | Severidad | Descripción del Hallazgo | Propuesta de Fix (1 línea) |
|---|---------------|-----------|--------------------------|----------------------------|
| 1 | [server/routes/admin-dashboard.routes.ts:243](file:///c:/git/Arecofixpage/server/routes/admin-dashboard.routes.ts#L243) | **Media** | Log de fetching métricas con IDs internos | Reemplazar por `logger.info(...)` condicional a nivel de log de servidor. |
| 2 | [server/routes/admin-dashboard.routes.ts:285](file:///c:/git/Arecofixpage/server/routes/admin-dashboard.routes.ts#L285) | **Media** | Log de éxito de métricas | Reemplazar por `logger.debug(...)`. |
| 3 | [server/routes/services.routes.ts:386](file:///c:/git/Arecofixpage/server/routes/services.routes.ts#L386) | **Media** | Log de creación de lead con datos personales | Sanitizar PII y enviar a servicio de telemetría/logger estructurado. |
| 4 | [src/app/admin/branches/admin-branches-page.ts:286](file:///c:/git/Arecofixpage/src/app/admin/branches/admin-branches-page.ts#L286) | **Baja** | `console.log(...)` de debug en componente de sucursales | Reemplazar por `LoggerService.debug(...)` o eliminar si es residual. |
| 5 | [src/app/admin/repairs/admin-repair-form-page.ts:899](file:///c:/git/Arecofixpage/src/app/admin/repairs/admin-repair-form-page.ts#L899) | **Baja** | `console.log(...)` al calcular presupuesto de reparación | Usar `LoggerService.debug(...)`. |
| 6 | [src/app/admin/repairs/admin-repair-form-page.ts:951](file:///c:/git/Arecofixpage/src/app/admin/repairs/admin-repair-form-page.ts#L951) | **Baja** | `console.log(...)` en submit de orden de reparación | Usar `LoggerService.debug(...)`. |
| 7 | [src/app/core/services/image-optimizer.service.ts:104](file:///c:/git/Arecofixpage/src/app/core/services/image-optimizer.service.ts#L104) | **Baja** | `console.log(...)` al comprimir imágenes | Usar `LoggerService.debug(...)`. |
| 8 | [src/app/core/services/logger.service.ts:21](file:///c:/git/Arecofixpage/src/app/core/services/logger.service.ts#L21) | **Baja** | `console.log` en fallback del servicio Logger | Mantener protegido bajo condición `!environment.production`. |
| 9 | [src/app/core/services/logger.service.ts:70](file:///c:/git/Arecofixpage/src/app/core/services/logger.service.ts#L70) | **Baja** | `console.log` para métricas de performance | Usar `console.debug` condicional a flag de desarrollo. |
| 10 | [src/app/features/repairs/application/services/admin-repair.service.ts:572](file:///c:/git/Arecofixpage/src/app/features/repairs/application/services/admin-repair.service.ts#L572) | **Baja** | Comentario con `console.log` comentado en callback | Eliminar comentario residual. |
| 11 | [src/app/infrastructure/events/event-bus-logger.service.ts:7](file:///c:/git/Arecofixpage/src/app/infrastructure/events/event-bus-logger.service.ts#L7) | **Baja** | `console.log` en auditoría de bus de eventos | Condicionar la emisión del log a `environment.production === false`. |

---

## 5. Distribución de Tipos `any` en TypeScript (471 ocurrencias)

La regla del proyecto estipula que `any` está prohibido en modo estricto. Actualmente se distribuyen principalmente en:

1. **`server/routes/` (~50 ocurrencias)**:
   - Uso de `(req as any).user` y `(req as any).profile`.
   - Propuesta de Fix: Declarar `declare module 'express-serve-static-core' { interface Request { user?: User; profile?: Profile; } }`.
2. **`src/app/core/` y Repositorios Base (~65 ocurrencias)**:
   - Parámetros genéricos `<any>` en consultas PostgREST y adapters.
   - Propuesta de Fix: Usar genéricos tipados `BaseRepository<T, ID>` y `Record<string, unknown>`.
3. **`src/app/admin/` y Formularios (~160 ocurrencias)**:
   - Castings `(event as any)` o `(form.value as any)`.
   - Propuesta de Fix: Tipar `FormGroup<{ ... }>` estrictos con Angular Reactive Forms tipados.
4. **`src/app/features/` (Repairs, Orders, Courses) (~196 ocurrencias)**:
   - Manejadores de errores `catch (err: any)` y mapeos de datos Supabase `(row: any)`.
   - Propuesta de Fix: Reemplazar `catch (err: any)` por `catch (err: unknown)` con guards tipo `instanceof Error`.
