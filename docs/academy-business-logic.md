# 📚 Arecofix Academy — Definición de Reglas de Negocio (v1.0)

Este documento establece las especificaciones funcionales, reglas de negocio y restricciones operativas del módulo **Academia** de Arecofix (`/admin/courses`, `/instructor`, `/academy/mis-cursos`, `/academy/:slug/aula`).

---

## 1. Ciclo de Vida y Estados de Membresía / Alumno

### 1.1 Estados del Alumno / Suscripción
Cada estudiante registrado en el sistema posee un estado de membresía o acceso al catálogo educativo:

| Estado | Definición | Nivel de Acceso a Cursos | Acceso a Exámenes | Emisión de Diplomas |
|---|---|---|---|---|
| `active` | Membresía al día o curso adquirido de por vida. | Total a todos los módulos desbloqueados de sus cursos matriculados. | Habilitado | Habilitado |
| `grace_period` | Pago pendiente tras fecha de vencimiento (ventana de tolerancia: 7 días corridos). | Acceso total garantizado; se muestra banner de advertencia y botón de pago. | Habilitado | Habilitado |
| `suspended` | Plazo de gracia vencido sin regularización de pago. | **Solo lectura** de contenidos y lecciones completadas previamente; bloqueado para avanzar a nuevos módulos. | Bloqueado | Bloqueado |
| `expired` | Suscripción cancelada definitivamente o mora prolongada (> 30 días). | Bloqueo total del aula virtual (`/academy/:slug/aula`); redirección al portal con oferta de renovación. | Bloqueado | Bloqueado |

### 1.2 Regla de Acceso a Cursos Adquiridos vs. Membresía Global
- **Cursos individuales (Pago único / Lifetime):** Si el alumno adquirió o se le asignó un curso específico de forma directa (`course_enrollments` con `status = 'confirmed'`), mantiene acceso permanente a ese curso independientemente del estado de una membresía recurrente SaaS, a menos que sea explícitamente dado de baja por un administrador.
- **Membresía Academia (SaaS Recurrente):** Si el acceso proviene de una suscripción mensual/anual a la Academia, los estados `suspended` y `expired` revocan inmediatamente la apertura de nuevos contenidos y exámenes.

---

## 2. Desbloqueo de Contenido (Drip Content & Unlock Strategy)

### 2.1 Estrategias de Desbloqueo (`unlock_strategy`)
Cada curso define en sus metadatos la propiedad:
`unlock_strategy: 'ALL_AT_ONCE' | 'SEQUENTIAL'`

1. **`ALL_AT_ONCE` (Acceso Inmediato / Abierto):**
   - Todos los módulos del curso se encuentran disponibles desde el primer día de matriculación, respetando únicamente las fechas programadas en `course_modules.unlock_date` (si estuviesen configuradas por el instructor).
   - El alumno puede navegar libremente entre lecciones y módulos en el orden que prefiera.

2. **`SEQUENTIAL` (Progresión Pedagógica Estricta):**
   - El **Módulo 1** se encuentra siempre desbloqueado por defecto al iniciar la matrícula.
   - Para desbloquear el **Módulo N+1**, el alumno **debe haber completado el 100% de las lecciones obligatorias y aprobado el examen obligatorio (si existe) del Módulo N**.
   - Si el alumno intenta acceder a la URL o API de un recurso del Módulo N+1 sin haber aprobado el Módulo N, el backend (RLS/RPC) y el frontend retornan error `403 Forbidden` y visualizan el módulo con candado cerrado y tooltip explicativo.

### 2.2 Fechas de Apertura (`unlock_date`)
- Independientemente de la estrategia seleccionada, si un módulo tiene definida una fecha futura en `course_modules.unlock_date`:
  - `unlock_date > now()`: El módulo permanece bloqueado indicando la fecha exacta de apertura ("Disponible el DD/MM/AAAA").
  - `unlock_date <= now()` o `unlock_date IS NULL`: Rige la regla pedagógica (`ALL_AT_ONCE` o `SEQUENTIAL`).

---

## 3. Sistema de Exámenes y Evaluación Segura

### 3.1 Control de Tiempo (Timer Seguro en Servidor)
1. **Inicio de Examen:**
   - Cuando el estudiante inicia un examen con tiempo límite (`time_limit_minutes`), se genera un registro en base de datos (`course_exam_attempts` o metadatos de sesión) con `started_at = timezone('utc', now())`.
   - El frontend recibe la duración y calcula la cuenta regresiva basándose en el diferencial del servidor, no en el reloj del cliente.
2. **Prevención de Manipulación (Inyección de Tiempo / Reloj Local):**
   - El alumno no puede modificar el reloj de su computadora para ganar tiempo. La función de corrección `submit_exam` en PostgreSQL valida:
     $$\text{tiempo\_transcurrido} = \text{now}() - \text{started\_at}$$
   - Se concede un margen de tolerancia de red de 30 segundos ($\text{buffer}$). Si el envío supera $\text{time\_limit\_minutes} \times 60 + 30$, el examen se califica automáticamente con las respuestas guardadas hasta ese momento o se marca como expirado.
3. **Cierre de Navegador y Auto-guardado (Resiliencia):**
   - El frontend realiza auto-guardado reactivo de las respuestas seleccionadas en `localStorage` y envía snapshots periódicos.
   - Si el estudiante recarga la página o sufre un corte de conexión, al reingresar el temporizador reanuda desde el tiempo restante real determinado por `started_at` del servidor. Si el tiempo expiró mientras estuvo desconectado, el examen se auto-entrega.

### 3.2 Calificación y Nota Mínima (`passing_score`)
- Cada examen cuenta con un porcentaje mínimo de aprobación (por defecto 60%, configurable por el instructor/admin hasta 100%).
- La función segura `submit_exam` en PostgreSQL (SECURITY DEFINER) evalúa las opciones correctas contra `course_exam_questions`, calcula el score y almacena el resultado en `course_exam_submissions`.
- Si el score $\ge \text{passing\_score}$:
  - Se registra el progreso en `course_progress`.
  - Se desbloquea el siguiente módulo (si es `SEQUENTIAL`).
- Si el score $< \text{passing\_score}$:
  - El alumno puede reintentar el examen conforme a la política de reintentos configurada (`max_attempts`).

---

## 4. Certificación y Diplomas

### 4.1 Criterio de Emisión
Un certificado oficial de Arecofix Academy se emite automáticamente única y exclusivamente cuando:
1. El estudiante posee matrícula confirmada (`status = 'confirmed'`).
2. Se registra el 100% de las lecciones completadas en `course_progress`.
3. Todos los exámenes requeridos del curso se encuentran aprobados.

### 4.2 Validación y Autenticidad
- Cada diploma genera un registro en `course_certificates` con identificador UUID único.
- Incorpora código QR verificable públicamente en:
  `https://arecofix.com.ar/academy/cert/:id`
- La validación pública confirma: nombre del estudiante, curso, fecha de emisión, instructor titular y sello de autenticidad criptográfico.

---

## 5. Matrícula y Asignación de Cursos (`course_enrollments`)

### 5.1 Máquina de Estados del Enrollment
```
[ Solicitud / Auto-registro ] ──> pending ──(Admin aprueba / Asigna)──> confirmed
                                     │                                      │
                                     ├──(Rechazo)──> rejected              ├──(Inicia lección)──> in_progress
                                                                            │                         │
                                                                            │                         ├──(Completa 100%)──> completed
                                                                            │                         │
                                                                            └──(Falta grave / Mora)───┴──> revoked
```

### 5.2 Vinculación Dual de Identidad (`email` + `user_id`)
Para garantizar que **todo alumno registrado que reciba un curso lo vea de inmediato en su portal**:
1. El registro en `course_enrollments` debe almacenar simultáneamente `user_id` (UUID de `profiles.id`) y `email` normalizado en minúsculas (`trim().toLowerCase()`).
2. Las consultas del portal del estudiante (`StudentMyCoursesPage` y `StudentCampusPage`) deben consultar por **ambas vías**:
   - `OR (email = auth_user.email, user_id = auth_user.id)`
3. Las políticas RLS de PostgreSQL deben autorizar la lectura si coincide `user_id = auth.uid()` **O** `lower(email) = lower(auth.jwt() ->> 'email')`.
4. La invalidación de caché en el frontend debe ser inmediata tras la matriculación o carga de página para evitar que peticiones GET en memoria sirvan estados obsoletos.
