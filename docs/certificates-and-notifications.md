# 🎓 Arecofix Academy — Módulo de Certificación y Sistema de Notificaciones por Email (v1.0)

Este documento detalla la arquitectura, el diseño de base de datos, el flujo de emisión y validación pública de diplomas con código QR, y el sistema de notificaciones automáticas por correo electrónico para la **Academia Arecofix**.

---

## 📌 Resumen Ejecutivo y Alcance

El módulo se encuentra estrictamente aislado de los módulos de E-commerce, Reparaciones y Facturación principal. Introduce:
1. **Emisión de Certificados Oficiales:** Al alcanzar el 100% del progreso en un curso.
2. **Validación Pública Desacoplada y Segura:** Ruta pública `/academy/verify/:id` que permite a empleadores y terceros verificar la autenticidad del diploma sin exponer datos personales (cumplimiento de privacidad: sin email, DNI ni teléfono).
3. **Generación Dinámica de PDF Vectorial con QR:** Uso de `pdf-lib` y `qrcode` para crear un diploma de alta fidelidad estética (formato A4 apaisado con membrete dorado y azul marino institucional).
4. **Sistema Transaccional de Emails:** Plantillas HTML responsivas para:
   - Recibo de pago de suscripción/membresía (Mercado Pago).
   - Aviso de vencimiento inminente (período de gracia de 7 días).
   - Felicitación y link de descarga tras completar el curso.
5. **Automatización:** Cron job para detección y despacho de alertas de membresías en `grace_period`.

---

## 🗄️ 1. Diseño de Base de Datos y Seguridad (Fase 1)

### 1.1 Esquema de `course_certificates`
La tabla gestiona la vigencia y metadatos de los diplomas emitidos:

```sql
CREATE TABLE IF NOT EXISTS public.course_certificates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    email TEXT NOT NULL,
    student_dni TEXT,
    student_name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'valid' CHECK (status IN ('valid', 'revoked')),
    pdf_url TEXT,
    issued_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    UNIQUE(course_id, email)
);
```

### 1.2 Auditoría e Idempotencia: `academy_email_notifications`
Registra cada notificación despachada para garantizar idempotencia y evitar re-envíos duplicados:

```sql
CREATE TABLE IF NOT EXISTS public.academy_email_notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id UUID REFERENCES public.tenants(id) ON DELETE CASCADE,
    recipient_email TEXT NOT NULL,
    student_name TEXT,
    notification_type TEXT NOT NULL CHECK (notification_type IN ('payment_receipt', 'grace_period_warning', 'course_completed')),
    reference_id TEXT, -- subscription_id, payment_id o certificate_id
    status TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('queued', 'sent', 'failed')),
    metadata JSONB DEFAULT '{}'::jsonb,
    sent_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now()),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc', now())
);
```

### 1.3 Función RPC Pública Segura (`get_public_certificate_data`)
> [!IMPORTANT]
> **Garantía Estricta de Privacidad:** La función pública corre con `SECURITY DEFINER` y está expuesta a usuarios anónimos (`anon`). Une `course_certificates`, `courses` y `profiles`, devolviendo **únicamente**:
> - Nombre y Apellido del Alumno
> - Título del Curso
> - Nombre del Instructor
> - Fecha de Emisión
> - Estado de Validez (`valid` / `revoked`)
> - URL de descarga pública del PDF
>
> **Jamás expone email, DNI, teléfono ni identificadores de usuario.**

```sql
CREATE OR REPLACE FUNCTION public.get_public_certificate_data(p_cert_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_result JSONB;
BEGIN
    SELECT jsonb_build_object(
        'success', true,
        'certificate_id', c.id,
        'student_name', c.student_name,
        'course_title', co.title,
        'instructor_name', COALESCE(co.instructor_name, 'Instructor Certificado Arecofix'),
        'issued_at', c.issued_at,
        'status', c.status,
        'is_valid', (c.status = 'valid'),
        'pdf_url', COALESCE(c.pdf_url, '/api/academy/certificates/' || c.id || '/pdf')
    ) INTO v_result
    FROM public.course_certificates c
    LEFT JOIN public.courses co ON co.id = c.course_id
    WHERE c.id = p_cert_id;

    IF v_result IS NULL THEN
        RETURN jsonb_build_object(
            'success', false,
            'status', 'not_found',
            'message', 'Certificado no encontrado o inexistente.'
        );
    END IF;

    RETURN v_result;
END;
$$;
```

---

## 📄 2. Generación de PDF Vectorial y Código QR (Fase 2)

El servicio `AcademyCertificateService` (`server/services/academy-certificate.service.ts`) implementa:
1. **Resolución y Formato:** Hoja horizontal A4 ($841.89 \times 595.28$ puntos tipográficos).
2. **Diseño Visual:**
   - Marco exterior con doble filete decorativo en Azul Marino Institucional (`#1e3a8a`) y Oro Pulido (`#d97706`).
   - Encabezado: `ARECOFIX ACADEMY — CERTIFICADO OFICIAL DE ACREDITACIÓN`.
   - Tipografía jerárquica con el nombre completo del egresado.
   - Detalle de horas académicas y programa completado.
   - Firma del Instructor y del Director Académico.
3. **Código QR Integrado:**
   - Generado con biblioteca `qrcode` en formato PNG Buffer.
   - Enlace escaneable directo:
     `https://arecofix.com.ar/academy/verify/${certificateId}`
   - Incrustado en la esquina inferior izquierda con su leyenda técnica de validación digital.

### Endpoints Disponibles:
- `GET /api/academy/certificates/:id/public`: Consulta los datos públicos seguros vía RPC.
- `GET /api/academy/certificates/:id/pdf`: Transmite el archivo PDF binario con cabecera `Content-Type: application/pdf` y `Content-Disposition: inline`.
- `POST /api/academy/certificates/issue`: Emite el certificado cuando el progreso alcanza el 100% y dispara el correo de felicitaciones.

---

## 🌐 3. Frontend: Validación Pública y Portal del Alumno (Fase 3)

### 3.1 Vista Pública de Validación (`/academy/verify/:id`)
- **Componente:** `src/app/public/cursos/certificate-validation/certificate-validation.page.ts`.
- **Rutas asociadas:** `/academy/verify/:id` y `/academy/certificado/:id`.
- **Comportamiento:**
  - Si el certificado es válido: Muestra la insignia `✅ Certificado Válido`, marco con gradiente esmeralda, sello de agua con checkmark, fecha con formato local, nombre del egresado, curso, instructor y botón "Descargar Certificado (PDF)".
  - Si el certificado fue alterado o revocado: Muestra tarjeta en rojo `❌ Certificado Inválido` indicando que el identificador no existe en los registros oficiales.
  - **Auditoría de Privacidad en Cypress:** El test valida que el selector `#valid-certificate-card` no contenga `@`, `DNI:` ni `Teléfono:`.

### 3.2 Portal del Estudiante (`/academy/mis-cursos`)
- Cada tarjeta de curso completado presenta:
  - Botón verde prominente `Descargar Certificado` (abre o descarga el PDF dinámico).
  - Botón secundario `Validar Certificado (QR)` (redirige a la vista pública de validación).

### 3.3 Aula Virtual (`/academy/:slug/aula`)
- Al alcanzar `progress >= 100`:
  - Se despliega un banner de felicitaciones en la parte superior:
    `🎓 ¡Felicitaciones! Has completado el 100% del curso`.
  - Acciones rápidas para validar el código QR o descargar el diploma.

---

## ✉️ 4. Sistema de Notificaciones por Email (Fase 4)

El servicio `AcademyEmailService` (`server/services/academy-email.service.ts`) despacha correos con plantillas HTML responsivas y accesibles en clientes móviles:

### 4.1 Notificación de Pago Exitoso (Recibo)
- **Disparador:** Webhook de Mercado Pago (`POST /api/webhooks/mercadopago-academy`) al confirmar estado `approved`.
- **Contenido:**
  - Recibo con número de comprobante y monto facturado ($ARS).
  - Plan de suscripción contratado (Membresía Mensual / Anual).
  - Fecha de vigencia y próximo vencimiento.
  - Botón de acceso directo al aula virtual.

### 4.2 Notificación de Membresía por Vencer (Período de Gracia)
- **Disparador:** Cron job diario que evalúa `grace_period`.
- **Contenido:**
  - Alerta amigable recordando que restan 7 días de gracia para renovar.
  - Explicación de que los cursos ya iniciados permanecen accesibles pero la evaluación quedará suspendida si vence el plazo.
  - Botón directo para renovar en un solo clic con Mercado Pago Checkout Pro.

### 4.3 Notificación de Diploma Emitido
- **Disparador:** Lección final completada o examen final aprobado (progreso al 100%).
- **Contenido:**
  - Felicitaciones formales de parte de la dirección de Arecofix.
  - Enlace de descarga del PDF de alta resolución.
  - Enlace público para compartir en LinkedIn / CV digital.

---

## ⏰ 5. Cron Job y Automatización

### 5.1 Función PostgreSQL de Detección
La función `check_and_notify_expiring_subscriptions()` busca suscripciones vencidas en el rango de los últimos 7 días que no hayan recibido alerta previa:

```sql
SELECT * FROM public.check_and_notify_expiring_subscriptions();
```

### 5.2 Endpoint de Despacho
`POST /api/academy/notifications/cron-grace-period`
Ejecutable mediante `pg_cron` o el orquestador de tareas del servidor en Oracle Cloud VPS:

```bash
# Ejecución diaria a las 08:00 UTC
0 8 * * * curl -X POST https://arecofix.com.ar/api/academy/notifications/cron-grace-period -H "Authorization: Bearer $CRON_SECRET"
```

---

## 🧪 6. Suite de Pruebas E2E y Adversariales (Cypress)

Archivo de pruebas: `cypress/e2e/academy-certificates/academy-certificates.cy.ts`

| # | Escenario de Prueba | Resultado | Validación Clave |
|---|---|---|---|
| **Test 1** | Alumno completa curso -> Diploma se emite | ✅ **PASSED** | Botón "Descargar Certificado" y "Validar Certificado (QR)" presentes en `/academy/mis-cursos` y banner de 100% en `/academy/:slug/aula`. |
| **Test 2** | Validación Pública Anónima | ✅ **PASSED** | Acceso anónimo a `/academy/verify/:id`; renderiza nombre, curso, instructor y fecha. Auditoría estricta de privacidad: **cero fugas de email o DNI**. |
| **Test 3** | Intento de Falsificación de UUID | ✅ **PASSED** | UUID inexistente o revocado renderiza tarjeta roja `❌ Certificado Inválido`. No muestra datos ni enlaces de descarga. |
| **Test 4** | Webhook de Pago Aprobado | ✅ **PASSED** | Firma criptográfica HMAC-SHA256 validada; webhook procesa y registra auditoría de correo con estado 200 OK. |
| **Test 5** | Cron Job de Período de Gracia | ✅ **PASSED** | Invoca `/api/academy/notifications/cron-grace-period`, detecta suscripciones en gracia y despacha emails sin duplicación. |

### Resultados de la Ejecución Automatizada:
```
  Running: academy-certificates.cy.ts (1 of 1)
  Academy Certificates & Email Notifications System E2E
    √ 1. Alumno completa curso -> Diploma se emite -> Botón Descargar Certificado disponible y QR válido (7s)
    √ 2. Usuario anónimo entra a /academy/verify/:id -> ve datos válidos sin exponer datos sensibles
    √ 3. Falsificación: Usuario altera el UUID en la URL -> recibe Certificado Inválido
    √ 4. Webhook de Pago Aprobado -> Envía recibo de pago por correo (Mock de Notificación)
    √ 5. Cron Job de Vencimiento -> Detecta membresías en grace_period y despacha emails de alerta

  5 passing (7s)
```

### Validación de No-Regresión en Módulos Previos:
```
  Running: academy-subscriptions-flow.cy.ts & academy-subscriptions-adversarial.cy.ts
  11 passing (14s) - 0 failures
```

---

## 🚀 7. Guía de Despliegue en Producción (Oracle VPS)

1. **Migración de Base de Datos:**
   ```bash
   docker exec -i supabase-db psql -U postgres -d postgres < supabase/migrations/20261017020000_academy_certificates_and_notifications.sql
   ```

2. **Compilación del Frontend SSR y Servidor:**
   ```bash
   pnpm run build
   ```

3. **Sincronización y Reinicio:**
   ```bash
   node scripts/deploy.mjs
   ```
