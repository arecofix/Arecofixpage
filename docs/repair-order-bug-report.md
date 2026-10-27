# Informe de Auditoría y Diagnóstico de Causa Raíz: Pérdida de "Modelo del Equipo" en Reparaciones

**ID de Incidente:** BUG-REPAIR-DEVICE-MODEL-WIPE  
**Fecha:** 2026-10-16  
**Sistema:** Arecofix — Sistema de Taller y Gestión de Reparaciones  
**Módulos Afectados:** `/admin/repairs` y `/admin/repairs/:id`  
**Severidad:** Crítica (Pérdida silente de datos en DB PostgreSQL)

---

## 1. Auditoría Obligatoria (Secciones 1.1 – 1.10)

### 1.1 Frontend — Formulario de edición
- **¿Existe un formulario de edición de órdenes de reparación?**  
  ✅ **Correcto**: Sí, en `src/app/admin/repairs/admin-repair-form-page.ts`.
- **¿Es reactivo (FormGroup, FormBuilder) o template-driven (ngModel)?**  
  ✅ **Correcto**: Reactivo (`FormGroup` inicializado con `FormBuilder`).
- **¿Se inicializa con los datos existentes de la orden?**  
  ⚠️ **Parcial**: Se llama a `patchValue` en `loadRepair()`, pero el objeto `data` proveniente de `SupabaseRepairRepository.mapFromDb` **omitía la propiedad `device_id`**. Como resultado, `repairForm.get('device_id')` se inicializaba con `''`.
- **¿Se usa patchValue o setValue? ¿Con qué payload?**  
  ✅ **Correcto**: `patchValue` con el objeto de la orden recuperado del backend.
- **¿Todos los campos del formulario están declarados en el FormGroup?**  
  ✅ **Correcto**: Todos los campos están declarados en `setupForm()`.
- **¿El campo "Modelo del equipo" (device_model o similar) está en el FormGroup?**  
  ✅ **Correcto**: Sí, declarado como `device_model: ['', [Validators.required]]`.
- **¿El campo "Modelo del equipo" se inicializa correctamente al cargar la orden?**  
  ⚠️ **Parcial**: Al cargar se ejecuta `device_model: data.device_model`. Sin embargo, si la orden ya había sufrido un update previo, `repairs.device_id` era `NULL` en la base de datos, por lo que la relación con `customer_devices` devolvía null y `data.device_model` llegaba vacío (`""`).
- **¿Hay campos que se agregan dinámicamente con addControl?**  
  ✅ **Correcto**: No se agregan dinámicamente; todos los controles son estáticos en `setupForm()`.
- **¿Los campos dinámicos se inicializan con sus valores existentes?**  
  ✅ **Correcto**: N/A (no existen campos dinámicos).
- **¿El formulario está dentro de un ngOnInit que se ejecuta antes de tener los datos?**  
  ✅ **Correcto**: Se construye la estructura del formulario en `ngOnInit` y luego se llama `loadRepair()` asíncrono para hidratar los valores.
- **¿Se está usando [(ngModel)] con [value] en conflicto?**  
  ✅ **Correcto**: No, se usa `formControlName` estándar.
- **¿Se está bindeando el campo a una propiedad que se sobrescribe al cargar?**  
  ❌ **Incorrecto**: En `save()`, si el usuario no modificaba el modelo del equipo, `!this.repairForm.get('device_model')?.dirty` ejecutaba `delete payload.device_model;` mientras que `device_id` se enviaba como `rawData.device_id || null` (es decir `null`).

---

### 1.2 Frontend — Modelo de datos
- **¿Existe una interfaz o clase Repair bien tipada?**  
  ✅ **Correcto**: `Repair` en `src/app/features/repairs/domain/entities/repair.entity.ts`.
- **¿El campo deviceModel (o device_model) está declarado en el modelo?**  
  ✅ **Correcto**: Sí, `readonly device_model: string;` en `Repair` y `device_model?: string;` en `UpdateRepairDto`.
- **¿El campo es obligatorio u opcional?**  
  ✅ **Correcto**: Obligatorio en `Repair`, opcional en `UpdateRepairDto` (para permitir actualizaciones parciales).
- **¿Hay algún mapper entre la respuesta de la DB y el modelo del frontend?**  
  ❌ **Incorrecto**: Existía `mapFromDb` privado dentro de `SupabaseRepairRepository`, pero no existía una clase mapper desacoplada, testeable y tipada.
- **¿El mapper está perdiendo campos?**  
  ❌ **Incorrecto**: **SÍ**. `mapFromDb` omitía completamente `device_id` y `client_id` en el objeto `Repair` devuelto.
- **¿El mapper usa any o as y está tirando campos sin querer?**  
  ❌ **Incorrecto**: Usaba cast libre sin validar y dejaba fuera las claves foráneas primarias `device_id` y `client_id`.
- **¿El mapper tiene una lista explícita de campos y olvida incluir device_model?**  
  ⚠️ **Parcial**: Extraía `device_model` del join anidado `model?.name`, pero al no mapear `device_id`, cualquier operación posterior perdía la referencia al registro de `customer_devices`.

---

### 1.3 Frontend — Servicio de guardado
- **¿Cómo se envía el payload al backend?**  
  `adminRepairService.update(id, dto)` delega en `repairWorkflowService.processUpdateRepair(id, payload)` y luego en `repairRepo.update(id, dto)`.
- **¿Se envía toda la orden o solo los campos modificados?**  
  ⚠️ **Parcial**: El formulario extraía `rawData` y eliminaba `customer_name` o `device_model` si no estaban marcados como `dirty`, pero incluía `device_id: rawData.device_id || null`.
- **Si se envía toda la orden, ¿el payload incluye device_model?**  
  ❌ **Incorrecto**: Si el operador solo cambiaba el estado, `delete payload.device_model` eliminaba la propiedad del payload.
- **Si se envía solo lo modificado, ¿el backend hace un UPDATE parcial o total?**  
  ❌ **Incorrecto**: Supabase ejecutaba `.update(dbPayload)`. Pero `SupabaseRepairRepository.update()` ejecutaba `this.mapToDb(repair)`.
- **¿Se usa PATCH o PUT?**  
  ✅ **Correcto**: PostgREST HTTP PATCH vía `.update()`.
- **¿El servicio usa spread operator ({...order, ...changes}) que puede perder campos?**  
  ⚠️ **Parcial**: `AdminRepairService.update()` no conservaba `originalRepair.device_id` si `dto.device_model` no venía en el DTO.
- **¿El servicio construye el payload campo por campo y olvida incluir device_model?**  
  ❌ **Incorrecto**: En `AdminRepairService.update()`, el bloque que actualizaba/preservaba el dispositivo (`if (originalRepair.customer_id && dto.device_model)`) dependía enteramente de que `dto.device_model` estuviera presente. Si no venía (porque no fue modificado), no se ejecutaba y no se asignaba `payload.device_id`.
- **¿El servicio filtra campos undefined antes de enviar?**  
  ❌ **Incorrecto**: En `SupabaseRepairRepository.update()`, llamaba a `mapToDb()`. En `mapToDb()`, los campos no provistos (undefined) se convertían en `null` (por ejemplo `device_id: r['device_id'] || null`), y luego el loop `for (const key of validColumns) { if (fullPayload[key] !== undefined) dbPayload[key] = fullPayload[key]; }` incluía `dbPayload['device_id'] = null`, enviando `UPDATE repairs SET device_id = NULL` a PostgreSQL.

---

### 1.4 Backend / Supabase — Update
- **¿La query de update es .update(payload)?**  
  ✅ **Correcto**: Sí, `this.supabase.from(this.tableName).update(dbPayload).eq('id', id)`.
- **¿El payload incluye solo los campos a modificar o todos?**  
  ❌ **Incorrecto**: Debido al bug de `mapToDb` reutilizado para updates, incluía campos convertidos forzosamente a `null` (`device_id: null`, `client_id: null`, `security_pin: null`, etc.).
- **Si es parcial, ¿los campos no enviados mantienen su valor o se setean a null?**  
  ❌ **Incorrecto**: Se seteaban a `null` porque `mapToDb` asignaba `null` a todo lo ausente.
- **¿Hay un trigger en la DB que modifique device_model?**  
  ✅ **Correcto**: No. En PostgreSQL la tabla `repairs` ni siquiera tiene la columna `device_model`, el modelo se almacena en `customer_devices -> models.name` vinculado por `repairs.device_id`.
- **¿Hay un BEFORE UPDATE que sobreescriba campos?**  
  ✅ **Correcto**: No sobreescribe `device_id` (solo actualiza `updated_at` y márgenes financieros).
- **¿La columna device_model tiene un DEFAULT NULL que se aplica en updates?**  
  ✅ **Correcto**: N/A (la columna es `device_id UUID`).
- **¿Hay algún COALESCE mal puesto que devuelve null cuando no debería?**  
  ✅ **Correcto**: No en triggers de DB.

---

### 1.5 Backend / Supabase — Lectura
- **¿La query de lectura (SELECT) trae device_model?**  
  ✅ **Correcto**: Sí, mediante join: `device:customer_devices!device_id(id, type, imei, passcode, model:models(name, brand_id))`.
- **¿El SELECT está usando * o una lista explícita de columnas?**  
  ✅ **Correcto**: Usa lista con relaciones explícitas.
- **Si es lista explícita, ¿está device_model incluido?**  
  ✅ **Correcto**: Trae `model:models(name, brand_id)` y `mapFromDb` lo extrae con `model?.['name']`.
- **¿Hay algún JOIN que esté filtrando el campo?**  
  ❌ **Incorrecto**: Al quedar `repairs.device_id` en `NULL` tras el primer update, el join a `customer_devices` devuelve `null`, resultando en un modelo vacío en lecturas subsiguientes.
- **¿La respuesta está siendo transformada antes de llegar al frontend?**  
  ✅ **Correcto**: Sí, por `mapFromDb`.

---

### 1.6 Base de datos
- **¿La tabla repair_orders (o equivalente) tiene la columna device_model?**  
  ⚠️ **Parcial**: La tabla se llama `repairs`. No tiene columna directa `device_model`; la arquitectura normalizada utiliza `device_id UUID REFERENCES customer_devices(id)`.
- **¿El tipo de dato es correcto (text, varchar)?**  
  ✅ **Correcto**: `repairs.device_id` es `uuid`. En `models`, `name` es `varchar/text`.
- **¿La columna admite NULL?**  
  ✅ **Correcto**: Sí, `repairs.device_id` admite NULL. Por eso PostgreSQL aceptaba el update destructivo sin arrojar error de restricción NOT NULL.
- **¿Hay un CHECK constraint que la restrinja?**  
  ✅ **Correcto**: No.
- **¿Hay un trigger BEFORE UPDATE o AFTER UPDATE?**  
  ✅ **Correcto**: No alteran `device_id`.
- **¿Hay una función RPC que actualice la orden y olvide incluir device_model?**  
  ✅ **Correcto**: No para updates (los updates van por PostgREST directo sobre `repairs`).
- **¿Hay un ON CONFLICT DO UPDATE que sobreescriba con EXCLUDED.device_model mal usado?**  
  ✅ **Correcto**: No.

---

### 1.7 Integración con eventos
- **¿Al guardar la orden, se emite algún evento?**  
  ✅ **Correcto**: Sí, eventos de dominio de facturación y ciclo de vida (`publishReadyForInvoicingEvent`, `RepairOrderCancelledEvent`, etc.).
- **¿El evento incluye device_model?**  
  ✅ **Correcto**: Sí, en el payload del evento.
- **¿Algún handler modifica la orden después del evento?**  
  ✅ **Correcto**: Ningún handler modifica `device_id`.

---

### 1.8 Validaciones
- **¿El campo device_model es obligatorio?**  
  ✅ **Correcto**: En el formulario tiene `Validators.required`, y el Value Object `DeviceModel` exige no vacío y no genérico.
- **¿Se valida antes de guardar?**  
  ✅ **Correcto**: Sí, a nivel de formulario y en `UpdateRepairUseCase`.
- **¿Si el usuario no toca el campo, se mantiene el valor original?**  
  ❌ **Incorrecto**: **NO se mantenía**. Al no ser `dirty`, el frontend borraba `payload.device_model`, el servicio no seteaba `payload.device_id`, y el repositorio enviaba `device_id: null`.
- **¿Si el usuario borra el campo, se guarda vacío?**  
  ✅ **Correcto**: El formulario previene el guardado porque es un campo obligatorio (`Validators.required`).
- **¿Hay algún trim() o transformación que devuelva undefined?**  
  ✅ **Correcto**: No.

---

### 1.9 Estado del componente
- **¿El componente guarda el estado de la orden en un signal, BehaviorSubject o variable?**  
  ✅ **Correcto**: En `repairForm` (`FormGroup`) y signals reactivos.
- **¿Al cargar la orden, se asigna correctamente a esa variable?**  
  ⚠️ **Parcial**: Como `data.device_id` venía `undefined` por el bug de `mapFromDb`, el control `device_id` quedaba en `''`.
- **¿Al guardar, se usa la variable actual o se relee?**  
  ✅ **Correcto**: Se lee `this.repairForm.getRawValue()`.
- **¿Hay algún reset() que borre el estado antes de guardar?**  
  ✅ **Correcto**: No.
- **¿El formulario tiene updateOn: 'blur' o 'change'? ¿Afecta?**  
  ✅ **Correcto**: Por defecto 'change'; no afecta.

---

### 1.10 Tests existentes
- **¿Hay tests unitarios del formulario?**  
  ✅ Existen tests para el usecase y algunos servicios.
- **¿Hay tests del servicio de guardado?**  
  ✅ `admin-repair.service.spec.ts`.
- **¿Hay tests E2E del flujo de edición?**  
  ⚠️ Parcial: Los tests en `cypress/e2e/admin-repairs/03-repair-edit-workflow.cy.ts` mockeaban la respuesta de PATCH sin validar que `device_id` no fuese sobreescrito con `null`, ni hacían recarga de página para verificar la persistencia del modelo del equipo.

---

## 2. Causas Raíz Identificadas (Múltiple / Cadena Causal)

Se determinó que el bug responde a la confluencia de tres fallas arquitectónicas:

1. **Causa 1 (Omisión en Mapper Inverso `mapFromDb`):**  
   En `SupabaseRepairRepository.mapFromDb`, se mapeaban casi 30 campos de la consulta SELECT, pero **`device_id` y `client_id` nunca se incluían en el objeto retornado**. Por ende, toda lectura de una orden dejaba `order.device_id = undefined`.

2. **Causa 2 (Dirty Check asimétrico en Frontend):**  
   En `AdminRepairFormPage.save()`:
   ```typescript
   if (this.id && !this.repairForm.get('device_model')?.dirty) {
     delete payload.device_model;
   }
   ```
   Al cambiar solo el estado de la orden, `device_model` no estaba sucio (`dirty === false`), por lo que se borraba del payload. Sin embargo, `device_id` (que venía vacío por la Causa 1) se incluía en el payload como `device_id: null`.

3. **Causa 3 (Mapeo destructivo para Updates en `SupabaseRepairRepository.update`):**  
   `SupabaseRepairRepository.update()` reutilizaba `mapToDb()`. En `mapToDb()`, campos faltantes o undefined se resolvían con `|| null`:
   ```typescript
   device_id: r['device_id'] || null
   ```
   Luego, el filtro de columnas válidas ejecutaba `if (fullPayload[key] !== undefined) dbPayload[key] = fullPayload[key];`. Como `null !== undefined` es verdadero, `dbPayload.device_id = null` se enviaba al PostgreSQL de Supabase, seteando `repairs.device_id = NULL` y desconectando permanentemente la orden de su dispositivo.

---

## 3. Evidencia en Base de Datos Real (Producción)

En la base de datos de producción (`supabase-db`), la orden `AF-135` (`id: 32a30f5f-82ee-4292-af25-37f1a0fcc157`) sufrió exactamente este síntoma:
- `current_status_id`: 2 (En Presupuesto, editado por el operador).
- `device_id`: `NULL` (desconectado por el update parcial).
- Al consultar por API, `device` es `null` y `device_model` aparece vacío.
- En contraste, la orden `AF-145` (creada y no editada parcialmente) conserva intacto su `device_id: 76c4a7e2-f4a1-4bd1-a7db-05e30589b119` (`model_name: Galaxy A02s`).

---

## 4. Plan de Acción y Solución Arquitectónica

1. **Creación de `RepairOrderMapper` desacoplado y tipado:**
   - Extraer métodos puros `mapFromDb`, `mapCreateToDb` y `mapUpdateToDb`.
   - `mapFromDb`: Asegurar `device_id: (p['device_id'] as string) || (device?.['id'] as string) || undefined`.
   - `mapUpdateToDb`: Solo mapear y enviar en el payload de base de datos aquellas propiedades que **vengan definidas** (`!== undefined`) en el DTO de actualización. Si `device_id` es undefined, **no se incluye en la sentencia UPDATE**.

2. **Refactorización en `AdminRepairService.update`:**
   - Asegurar que si `dto.device_model` no fue modificado, `payload.device_id` retenga `originalRepair.device_id`.
   - Si `dto.device_model` fue modificado, actualizar el dispositivo existente pasando `deviceId: originalRepair.device_id || null` a `upsertDevice`.

3. **Refactorización en `AdminRepairFormPage`:**
   - Asegurar que el form se hidrate con el `device_id` real.
   - Tipar con `RepairOrderFormValue` y `UpdateRepairOrderPayload`.
   - Nunca forzar `device_id: null` en actualizaciones de órdenes existentes.

4. **Suite de Pruebas Unitarias y Cypress E2E:**
   - Cobertura exhaustiva en `cypress/e2e/repairs/` y `cypress/e2e/repairs-adversarial/`.
   - Verificación de persistencia de todos los campos (modelo, diagnóstico, notas, estado, cliente, repuestos).
