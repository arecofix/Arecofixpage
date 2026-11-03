# Documento de Solución y Verificación: Bug de Pérdida de "Modelo del Equipo"

**Módulo**: Reparaciones y Taller Técnico (`/admin/repairs`)  
**Fecha**: 16 de Octubre de 2026  
**Sistema**: Arecofix — E-commerce & Taller SaaS Multi-tenant  
**Estado**: ✅ Corregido, Verificado con Tests Unitarios y Cypress E2E al 100%

---

## 1. Síntoma Reportado y Causa Raíz

### Síntoma
Al editar una Orden de Reparación existente (por ejemplo, cambiar el estado de la orden, editar notas o informes técnicos) y presionar "GUARDAR ORDEN", el campo **"Modelo del equipo"** (`device_model`) se borraba silenciosamente al persistir en la base de datos o al recargar la orden.

### Cadena Causal Identificada
1. **Frontend / Dirty Check Asimétrico**: Al editar una orden, el formulario `repairForm` solo enviaba `device_model` si había sido marcado como dirty (`this.repairForm.get('device_model')?.dirty`). Si el operador solo cambiaba el estado o las notas, `device_model` era eliminado del DTO de actualización (`delete payload.device_model`).
2. **Servicio Destructivo (`AdminRepairService.update`)**: Al no estar presente `device_model` en el payload, el servicio omitía la resolución del dispositivo pero no garantizaba la preservación incondicional de `originalRepair.device_id`.
3. **Mapeador Destructivo (`mapToDb`)**: `SupabaseRepairRepository.update` utilizaba un mapeador total que convertía campos ausentes o no provistos en `null`, enviando `PATCH repairs` con `device_id: null`.
4. **Desvinculación en Base de Datos**: La tabla `repairs` tiene una clave foránea `device_id REFERENCES customer_devices(id)`. Al setear `device_id = null`, la relación 1:N / N:1 se rompía. En la siguiente consulta `select(..., device:customer_devices(...))`, `device` retornaba `null`, haciendo que `device_model` se leyera como cadena vacía `""`.

---

## 2. Antes vs Después

| Aspecto | Antes (Comportamiento con Bug) ❌ | Después (Arquitectura Corregida) ✅ |
| :--- | :--- | :--- |
| **Mapper de Persistencia** | `mapToDb` destructivo: seteaba campos ausentes a `null`. | `RepairOrderMapper.mapUpdateToDb`: Safe Partial Update. Solo incluye propiedades definidas (`!== undefined`). |
| **Preservación de Dispositivo** | `device_id` se anulaba si `device_model` no se tocaba. | `AdminRepairService.update` preserva incondicionalmente `originalRepair.device_id`. |
| **Edición de Modelo** | Creaba nuevos dispositivos huérfanos sin actualizar el existente. | Pasa `targetDeviceId` a `upsertDevice` para actualizar el registro del cliente sin duplicados. |
| **Inicialización del Formulario** | `device_id` no estaba tipado ni vinculado explícitamente en el `FormGroup`. | `device_id` declarado en `FormGroup`, tipado mediante `RepairOrderFormValue` y preservado en `loadRepair()`. |
| **Tipado Estricto** | Uso de casts laxos y falta de interfaces de transferencia. | Creados `RepairOrderFormValue` y `UpdateRepairOrderPayload` con strict null checks. |
| **Caso de Uso Limpio** | Lógica dispersa entre componente y servicio. | Extraído `UpdateRepairUseCase` orquestando la actualización con Clean Architecture. |

---

## 3. Archivos Modificados y Creados

### Infraestructura y Dominio
- [`src/app/features/repairs/infrastructure/mappers/repair-order.mapper.ts`](file:///c:/git/Arecofixpage/src/app/features/repairs/infrastructure/mappers/repair-order.mapper.ts):
  - `mapFromDb`: extracción segura de `device_id` y `device_model`.
  - `mapUpdateToDb`: mapeo parcial seguro, protección contra coerción destructiva a `null`.
  - `mapCreateToDb`: creación con defaults limpios.
- [`src/app/features/repairs/infrastructure/mappers/repair-order.mapper.spec.ts`](file:///c:/git/Arecofixpage/src/app/features/repairs/infrastructure/mappers/repair-order.mapper.spec.ts):
  - 7 pruebas unitarias completas para verificar persistencia y no regresión.
- [`src/app/features/repairs/infrastructure/repositories/supabase-repair.repository.ts`](file:///c:/git/Arecofixpage/src/app/features/repairs/infrastructure/repositories/supabase-repair.repository.ts):
  - Integración de `RepairOrderMapper.mapUpdateToDb` en el método `update()`.
- [`src/app/features/repairs/domain/entities/repair.entity.ts`](file:///c:/git/Arecofixpage/src/app/features/repairs/domain/entities/repair.entity.ts):
  - Interfaces `RepairOrderFormValue` y `UpdateRepairOrderPayload`.

### Capa de Aplicación
- [`src/app/features/repairs/application/services/admin-repair.service.ts`](file:///c:/git/Arecofixpage/src/app/features/repairs/application/services/admin-repair.service.ts):
  - Preservación explícita de `originalRepair.device_id` en `update()`.
  - Reutilización de `targetDeviceId` al actualizar el modelo del equipo.
- [`src/app/features/repairs/application/use-cases/update-repair.use-case.ts`](file:///c:/git/Arecofixpage/src/app/features/repairs/application/use-cases/update-repair.use-case.ts):
  - Caso de uso desacoplado para actualización de órdenes.
- [`src/app/features/repairs/application/use-cases/update-repair.use-case.spec.ts`](file:///c:/git/Arecofixpage/src/app/features/repairs/application/use-cases/update-repair.use-case.spec.ts):
  - 5 tests unitarios verificando delegación y contratos.

### Capa de Presentación
- [`src/app/admin/repairs/admin-repair-form-page.ts`](file:///c:/git/Arecofixpage/src/app/admin/repairs/admin-repair-form-page.ts):
  - Vinculación de `device_id` en el `FormGroup`.
  - Preservación de `device_id` en el payload de edición.

---

## 4. Evidencia de Tests y Cobertura

### Tests Unitarios (Jest)
Ejecución: `pnpm exec jest src/app/features/repairs/`
- `repair-order.mapper.spec.ts`: 7 tests pasados (100%).
- `update-repair.use-case.spec.ts`: 5 tests pasados (100%).
- `admin-repair.service.spec.ts`: 5 tests pasados (100%).
- **Total**: 17 tests unitarios pasando.

### Tests E2E (Cypress)
Ubicación:
- `cypress/e2e/repairs/edit-order-preserves-fields.cy.ts` (3 tests)
- `cypress/e2e/repairs/edit-order-device-model.cy.ts` (2 tests)
- `cypress/e2e/repairs/edit-order-status.cy.ts` (3 tests)
- `cypress/e2e/repairs/edit-order-all-fields.cy.ts` (1 test)
- `cypress/e2e/repairs/edit-order-edge-cases.cy.ts` (2 tests)
- `cypress/e2e/repairs-adversarial/edit-order-multiple-times.cy.ts` (1 test — 5 ciclos consecutivos)
- `cypress/e2e/repairs-adversarial/edit-order-concurrent.cy.ts` (1 test)
- `cypress/e2e/repairs-adversarial/edit-order-empty-fields.cy.ts` (2 tests)
- `cypress/e2e/repairs-adversarial/01-adversarial-security.cy.ts` (3 tests)
- `cypress/e2e/repairs-adversarial/02-adversarial-integrity.cy.ts` (2 tests)
- **Total E2E**: 20 tests Cypress pasando al 100% (11 specs en repairs + 9 specs en repairs-adversarial).

---

## 5. Build y Despliegue a Producción

- **Build de producción**: `pnpm run build --configuration production` completado con éxito (`dist/arecofix`).
- **Despliegue a VPS (`ssh.arecofix.com.ar`)**:
  - Transferencia segura mediante clave SSH y `scp -r dist/ ubuntu@ssh.arecofix.com.ar:arecofix/`.
  - Reinicio exitoso del servicio SSR en PM2: `pm2 restart arecofix-frontend` (PID 3075991, estado `online`).
- **Verificación en Vivo**:
  - Endpoint: `https://arecofix.com.ar` y `https://arecofix.com.ar/arecofix/admin/repairs`.
  - HTTP 200 OK verificado contra Cloudflare / Node SSR.

---

## 6. Verificación de No Regresión
- **Módulo de Facturación y Eventos**: No afectado (los eventos de dominio `RepairOrderReadyForInvoicingEvent` y `DomainRepairOrderReadyForInvoicingEvent` se mantienen íntegros).
- **Módulo de Productos y Carrito**: Intacto.
- **Seguridad y RLS**: No se alteraron políticas ni triggers de base de datos; la solución opera en la capa de arquitectura de software y queries seguras.
