# Auditoría del Módulo Academy & Cursos (v3 - Evidencia Verificada)

## 1. Inventario Completo de Archivos
| Ruta Exacta | LOC | Propósito en 1 Línea | Estado |
|---|:---:|---|---|
| `src/app/public/cursos/cursos.ts` | 352 | Componente de catálogo público de cursos con filtros, búsqueda y modal de inscripción. | Vivo |
| `src/app/public/cursos/cursos.html` | 323 | Plantilla HTML del catálogo con carrusel hero, grid y modal reactivo. | Vivo |
| `src/app/public/cursos/cursos.scss` | 1 | Hoja de estilos del catálogo público. | Vivo |
| `src/app/public/cursos/course-detail/course-detail.component.ts` | 380 | Vista de detalle de un curso individual y temario público. | Vivo |
| `src/app/public/cursos/course-detail/course-detail.component.html` | 700 | Plantilla HTML de detalle con temario desglosado y testimonios. | Vivo |
| `src/app/public/cursos/my-courses/student-my-courses-page.ts` | 367 | Portal del estudiante ("Mi Academia") con accesos a cursos y pestaña de instructor. | Vivo |
| `src/app/public/cursos/campus/student-campus-page.ts` | 912 | Aula virtual para visualización de lecciones, videos, PDFs y ejecución de exámenes. | Vivo |
| `src/app/public/cursos/certificate/certificate-page.component.ts` | 261 | Renderizado web e impresión/descarga directa del certificado otorgado. | Vivo |
| `src/app/public/cursos/certificate-validation/certificate-validation.page.ts` | 96 | Página pública para validar la autenticidad del certificado vía código QR o ID. | Vivo |
| `src/app/public/cursos/create-course/create-course.component.ts` | 84 | Formulario para sugerir o proponer nuevos cursos en la plataforma. | Vivo |
| `src/app/public/cursos/create-course/create-course.component.html` | 80 | Template del formulario de propuesta de nuevos cursos. | Vivo |
| `src/app/admin/courses/admin-courses-page.ts` | 144 | Listado y métricas de cursos en el panel administrativo. | Vivo |
| `src/app/admin/courses/admin-courses-page.html` | 390 | Template del listado administrativo de cursos con métricas y tabs. | Vivo |
| `src/app/admin/courses/admin-courses.routes.ts` | 35 | Configuración de rutas hijas del módulo de cursos en el admin. | Vivo |
| `src/app/admin/courses/admin-course-form-page.ts` | 348 | Formulario reactivo para alta y edición de cursos (precios, instructores, temario). | Vivo |
| `src/app/admin/courses/admin-course-form-page.html` | 263 | Template modular con pestañas de configuración del curso. | Vivo |
| `src/app/admin/courses/components/course-basic-info-form.component.ts` | 141 | Subcomponente para edición de títulos, slugs, descripciones e imágenes. | Vivo |
| `src/app/admin/courses/components/course-logistics-form.component.ts` | 189 | Subcomponente para niveles, carga horaria, precios y cronogramas. | Vivo |
| `src/app/admin/courses/components/course-staff-form.component.ts` | 237 | Subcomponente para asignación de instructores titulares y colaboradores. | Vivo |
| `src/app/admin/courses/components/app-course-modules-form.component.ts` | 104 | Subcomponente para administración del temario del curso. | Vivo |
| `src/app/admin/courses/materials/admin-course-materials-page.ts` | 1088 | Gestor de materiales, programación de liberación (Drip Content) y creador de exámenes. | Vivo |
| `src/app/admin/courses/enrollments/admin-course-enrollments-page.ts` | 147 | Gestión y confirmación de solicitudes de inscripción a cursos. | Vivo |
| `src/app/admin/courses/enrollments/admin-course-enrollments-page.html` | 155 | Template de administración de alumnos inscritos y aprobación manual. | Vivo |
| `src/app/admin/courses/review/admin-course-review.component.ts` | 119 | Panel administrativo para evaluar y rechazar propuestas de cursos enviadas. | Vivo |
| `src/app/instructor/instructor.routes.ts` | 32 | Definición de rutas del portal del instructor. | Vivo |
| `src/app/instructor/dashboard/instructor-dashboard.component.ts` | 274 | Panel principal del instructor con métricas y programas asignados. | Vivo |
| `src/app/instructor/builder/course-builder.component.ts` | 394 | Editor visual de cursos para instructores con soporte drag & drop de archivos. | Vivo |
| `src/app/instructor/builder/course-builder.component.html` | 493 | Template del constructor de cursos del instructor. | Vivo |
| `src/app/instructor/pages/course-students/course-students.page.ts` | 260 | Listado de alumnos del curso con emisión y revocación de diplomas. | Vivo |
| `src/app/instructor/pages/students/instructor-students.page.ts` | 86 | Vista consolidada de estudiantes registrados para el instructor. | Vivo |
| `src/app/instructor/components/approve-student-modal/approve-student-modal.component.ts` | 116 | Modal para emitir certificados llamando a la Edge Function. | Vivo |
| `src/app/core/services/courses.service.ts` | 496 | Servicio central de cursos, temarios, drips, inscripciones y exámenes. | Vivo |
| `src/app/features/courses/application/services/certificates.service.ts` | 147 | Servicio de generación y validación criptográfica de certificados. | Vivo |
| `src/app/features/courses/application/services/academy-students-state.service.ts` | 37 | Estado reactivo de estudiantes de la academia. | Vivo |
| `src/app/features/courses/application/usecases/review-course-proposal.usecase.ts` | 28 | Caso de uso Clean Architecture para aprobar/rechazar propuestas. | Vivo |
| `src/app/features/courses/application/usecases/submit-course-proposal.usecase.ts` | 46 | Caso de uso Clean Architecture para enviar propuestas de cursos. | Vivo |
| `src/app/features/courses/domain/entities/course.entity.ts` | 112 | Interfaces de dominio (`Course`, `CourseModule`, `CourseExamQuestion`, etc.). | Vivo |
| `src/app/features/courses/domain/repositories/course.repository.ts` | 23 | Interfaz abstracta del repositorio de cursos. | Vivo |
| `src/app/features/courses/infrastructure/repositories/supabase-course.repository.ts` | 212 | Implementación Supabase del repositorio de cursos. | Vivo |
| `src/app/features/courses/infrastructure/academy-students.repository.ts` | 20 | Implementación del repositorio de alumnos. | Vivo |
| `src/app/guards/instructor.guard.ts` | 55 | Guard de protección para rutas bajo `/instructor`. | Vivo |
| `src/app/guards/auth.guard.ts` | 71 | Guard de sesión y revocación de accesos. | Vivo |
| `supabase/functions/generate-certificate/index.ts` | 224 | Edge Function (Deno) para compilar el PDF oficial y generar código QR. | Vivo |

---

## 2. Matriz de Rutas
| Ruta | Componente | Guard Actual | Nivel de Acceso | Rol Requerido | Problema Detectado |
|---|---|---|---|---|---|
| `/academy` | `CursosComponent` | Ninguno | Público | Cualquiera | Sin paginación por servidor; carga todos los cursos en memoria. |
| `/cursos` | Redirect a `/academy` | Ninguno | Público | Cualquiera | Ninguno (redirección 301 interna). |
| `/academy/:slug` | `CourseDetailComponent` | Ninguno | Público | Cualquiera | Usa `ChangeDetectionStrategy.Eager`; no usa Signals internamente. |
| `/academy/create` | `CreateCourseComponent` | Ninguno | Público | Cualquiera | Permite a cualquier usuario anónimo proponer un curso sin capturar `user_id`. |
| `/academy/mis-cursos` | `StudentMyCoursesPage` | `authGuard` | Protegido | Alumno autenticado | Descarga todos los cursos de la base para filtrar en memoria por autor si es instructor. |
| `/academy/:slug/aula` | `StudentCampusPage` | `authGuard` | Protegido | Alumno matriculado | Consulta roles desde `user_metadata` inseguro; loops N+1 al cargar módulos. |
| `/academy/cert/:id` | `CertificatePageComponent` | Ninguno | Público | Cualquiera | URL canónica hardcodeada; renderiza vista previa HTML sin validar revocación en storage. |
| `/academy/certificado/:id` | `CertificateValidationPage` | Ninguno | Público | Cualquiera | Duplica la ruta de visualización de certificados con distinta UI y distinto servicio. |
| `/admin/courses` | `AdminCoursesPage` | `branchAdminGuard` (padre) | Protegido | `admin`, `super_admin` | Actualiza columna inexistente `status` en PostgreSQL mediante `// @ts-ignore`. |
| `/admin/courses/new` | `AdminCourseFormPage` | `branchAdminGuard` (padre) | Protegido | `admin`, `super_admin` | Usa `.toPromise()` deprecado al sincronizar temarios. |
| `/admin/courses/:id` | `AdminCourseFormPage` | `branchAdminGuard` (padre) | Protegido | `admin`, `super_admin` | Mismo problema de sincronización; no valida concurrencia. |
| `/admin/courses/:id/materials` | `AdminCourseMaterialsPage` | `branchAdminGuard` (padre) | Protegido | `admin`, `super_admin` | No limpia preguntas huérfanas si se elimina un módulo completo. |
| `/admin/courses/solicitudes` | `AdminCourseEnrollmentsPage` | `branchAdminGuard` (padre) | Protegido | `admin`, `super_admin` | Inyecta directamente `SUPABASE_CLIENT` sin pasar por el repositorio de dominio. |
| `/admin/courses/review` | `AdminCourseReviewComponent` | `branchAdminGuard` (padre) | Protegido | `admin`, `super_admin` | Desconectado del backend: busca `c.status === 'PENDING'`, columna inexistente en PostgreSQL. |
| `/instructor` | `InstructorDashboardComponent` | `instructorGuard` | Protegido | `instructor`, `admin`, autor | Bypasseable en runtime vía `localStorage.getItem('cypress-test') === 'true'`. |
| `/instructor/builder` | `CourseBuilderComponent` | `instructorGuard` | Protegido | `instructor`, `admin`, autor | Subida de archivos sin validación de tipo MIME real en el backend. |
| `/instructor/builder/:idOrSlug`| `CourseBuilderComponent` | `instructorGuard` | Protegido | `instructor`, `admin`, autor | Guarda `author_id` como `undefined` si el perfil no cargó en caché al guardar. |
| `/instructor/students/:id` | `CourseStudentsPage` | `instructorGuard` | Protegido | `instructor`, `admin` | Realiza queries directas con `SUPABASE_CLIENT`; bloquea con `window.confirm()`. |
| `/instructor/all-students` | `InstructorStudentsPage` | `instructorGuard` | Protegido | `instructor`, `admin` | Consulta la vista `academy_students_view` sin filtrar por tenant en la capa de UI. |

---

## 3. Esquema REAL de Supabase en Producción

### Columnas y Tipos Reales Obtenidos de `information_schema.columns`
```sql
-- Tabla: courses
courses.id (uuid, NOT NULL, DEFAULT gen_random_uuid())
courses.tenant_id (uuid, NOT NULL, DEFAULT get_my_tenant())
courses.title (text, NOT NULL)
courses.slug (text, NOT NULL)
courses.description (text, NULL)
courses.short_description (text, NULL)
courses.duration (text, NULL)
courses.schedule (text, NULL)
courses.level (text, NULL)
courses.price (numeric, NOT NULL)
courses.sale_price (numeric, NULL)
courses.image_url (text, NULL)
courses.instructor_name (text, NULL)
courses.instructor_id (uuid, NULL)
courses.author_id (uuid, NULL)
courses.start_date (date, NULL)
courses.is_featured (boolean, NULL, DEFAULT false)
courses.is_active (boolean, NULL, DEFAULT true)
courses.syllabus (jsonb, NULL)
courses.benefits (jsonb, NULL)
courses.audience_list (jsonb, NULL, DEFAULT '[]'::jsonb)
courses.classes_count (integer, NULL, DEFAULT 0)
courses.hours_content (integer, NULL, DEFAULT 0)
courses.hours_practice (integer, NULL, DEFAULT 0)
courses.hours_per_week (text, NULL)
courses.instructor_role (text, NULL)
courses.instructor_bio (text, NULL)
courses.instructor_avatar (text, NULL)
courses.reviews_count (integer, NULL, DEFAULT 0)
courses.created_at (timestamptz, NOT NULL, DEFAULT timezone('utc'::text, now()))
courses.updated_at (timestamptz, NULL, DEFAULT timezone('utc'::text, now()))

-- Tabla: course_modules
course_modules.id (uuid, NOT NULL, DEFAULT gen_random_uuid())
course_modules.tenant_id (uuid, NOT NULL, DEFAULT get_my_tenant())
course_modules.course_id (uuid, NULL)
course_modules.title (text, NOT NULL)
course_modules.description (text, NULL)
course_modules.order_index (integer, NULL, DEFAULT 0)
course_modules.unlock_date (timestamptz, NULL)
course_modules.created_at (timestamptz, NOT NULL, DEFAULT timezone('utc'::text, now()))

-- Tabla: course_contents
course_contents.id (uuid, NOT NULL, DEFAULT gen_random_uuid())
course_contents.tenant_id (uuid, NOT NULL, DEFAULT get_my_tenant())
course_contents.module_id (uuid, NULL)
course_contents.title (text, NOT NULL)
course_contents.type (text, NOT NULL)
course_contents.url (text, NULL)
course_contents.duration (text, NULL)
course_contents.order_index (integer, NULL, DEFAULT 0)
course_contents.metadata (jsonb, NULL)
course_contents.created_at (timestamptz, NOT NULL, DEFAULT timezone('utc'::text, now()))

-- Tabla: course_enrollments
course_enrollments.id (uuid, NOT NULL, DEFAULT gen_random_uuid())
course_enrollments.tenant_id (uuid, NOT NULL, DEFAULT get_my_tenant())
course_enrollments.course_id (uuid, NOT NULL)
course_enrollments.user_id (uuid, NULL)
course_enrollments.full_name (text, NOT NULL)
course_enrollments.email (text, NOT NULL)
course_enrollments.phone (text, NULL)
course_enrollments.status (text, NULL, DEFAULT 'pending'::text)
course_enrollments.created_at (timestamptz, NOT NULL, DEFAULT timezone('utc'::text, now()))

-- Tabla: course_progress
course_progress.id (uuid, NOT NULL, DEFAULT gen_random_uuid())
course_progress.tenant_id (uuid, NOT NULL)
course_progress.course_id (uuid, NOT NULL)
course_progress.content_id (uuid, NOT NULL)
course_progress.user_id (uuid, NULL)
course_progress.email (text, NOT NULL)
course_progress.completed_at (timestamptz, NULL, DEFAULT now())

-- Tabla: course_certificates
course_certificates.id (uuid, NOT NULL, DEFAULT gen_random_uuid())
course_certificates.tenant_id (uuid, NOT NULL)
course_certificates.course_id (uuid, NOT NULL)
course_certificates.email (text, NOT NULL)
course_certificates.student_name (text, NOT NULL)
course_certificates.student_dni (text, NULL)
course_certificates.pdf_url (text, NULL)
course_certificates.issued_at (timestamptz, NULL, DEFAULT now())

-- Tabla: course_exam_questions
course_exam_questions.id (uuid, NOT NULL, DEFAULT gen_random_uuid())
course_exam_questions.tenant_id (uuid, NOT NULL)
course_exam_questions.content_id (uuid, NOT NULL)
course_exam_questions.question_text (text, NOT NULL)
course_exam_questions.options (jsonb, NOT NULL)
course_exam_questions.correct_option_index (integer, NOT NULL)
course_exam_questions.order_index (integer, NULL, DEFAULT 0)
course_exam_questions.created_at (timestamptz, NULL, DEFAULT now())

-- Tabla: course_exam_submissions
course_exam_submissions.id (uuid, NOT NULL, DEFAULT gen_random_uuid())
course_exam_submissions.tenant_id (uuid, NOT NULL)
course_exam_submissions.content_id (uuid, NOT NULL)
course_exam_submissions.email (text, NOT NULL)
course_exam_submissions.answers (jsonb, NOT NULL)
course_exam_submissions.score (numeric, NOT NULL)
course_exam_submissions.passed (boolean, NOT NULL)
course_exam_submissions.created_at (timestamptz, NULL, DEFAULT now())
```

### Políticas RLS Reales Obtenidas de `pg_policies`
```sql
-- courses
crs_select: (tenant_id = (SELECT get_my_tenant())) AND ((is_active = true) OR ((SELECT auth.role()) = 'authenticated'))
courses_select_policy: (is_active = true) OR is_admin_of_tenant(tenant_id)
Authors can manage their courses: (author_id = auth.uid()) [authenticated]
super_admin_all_access: (get_user_role() = 'super_admin') [authenticated]

-- course_modules
course_modules_select_policy: EXISTS (SELECT 1 FROM courses c WHERE c.id = course_modules.course_id AND ((c.is_active = true) OR is_admin_of_tenant(c.tenant_id)))
Admins can manage course modules: ((SELECT profiles.role FROM profiles WHERE profiles.id = auth.uid()) = ANY(ARRAY['admin', 'super_admin']))
Authors can manage course modules: EXISTS (SELECT 1 FROM courses c WHERE c.id = course_modules.course_id AND c.author_id = auth.uid())

-- course_enrollments
Students can view own enrollments: (email = (auth.jwt() ->> 'email'))
Admins can manage enrollments: ((SELECT profiles.role FROM profiles WHERE profiles.id = auth.uid()) = ANY(ARRAY['admin', 'super_admin']))

-- course_progress
Students manage own progress: (email = (auth.jwt() ->> 'email'))
Admins can view progress: ((SELECT profiles.role FROM profiles WHERE profiles.id = auth.uid()) = ANY(ARRAY['admin', 'super_admin']))

-- course_exam_questions
Admins can manage exam questions: ((SELECT profiles.role FROM profiles WHERE profiles.id = auth.uid()) = ANY(ARRAY['admin', 'super_admin']))
```

---

## 4. Hallazgos Técnicos Verificados (25 Findings con Snippets)

### Finding 1 [CRÍTICO]
- **Impacto:** Vulnerabilidad de escalamiento de privilegios de usuario a administrador.
- **Archivo y Línea:** `src/app/public/cursos/campus/student-campus-page.ts:712-716`
- **Snippet Problemático:**
```typescript
const userSession = await this.authService.getSession();
const userRole = userSession?.user?.user_metadata?.['role'];
if (['admin', 'staff', 'super_admin', 'tenant_owner'].includes(userRole)) {
  accessConfirmed = true;
  this.isAdmin.set(true);
}
```
- **Fix Propuesto:**
```typescript
const profile = this.authService.getCurrentProfile();
const userRole = profile?.role;
if (['admin', 'staff', 'super_admin', 'tenant_owner'].includes(userRole || '')) {
  accessConfirmed = true;
  this.isAdmin.set(true);
}
```

### Finding 2 [CRÍTICO]
- **Impacto:** Falla de ejecución SQL en producción por intentar actualizar una columna inexistente (`status` no existe en la tabla `courses`).
- **Archivo y Línea:** `src/app/admin/courses/admin-courses-page.ts:89-94`
- **Snippet Problemático:**
```typescript
// @ts-ignore
const { error } = await this.coursesService.supabase
  .from('courses')
  .update({ status: 'published', is_active: true })
  .eq('id', course.id);
```
- **Fix Propuesto:**
```typescript
const { error } = await this.coursesService.supabase
  .from('courses')
  .update({ is_active: true })
  .eq('id', course.id);
```

### Finding 3 [CRÍTICO]
- **Impacto:** Puerta trasera en el guard de instructores que permite el acceso a cualquier usuario que manipule el almacenamiento local del navegador.
- **Archivo y Línea:** `src/app/guards/instructor.guard.ts:20-22`
- **Snippet Problemático:**
```typescript
if (typeof window !== 'undefined' && localStorage.getItem('cypress-test') === 'true') {
  return true; // Bypass authentication guard during Cypress UI tests
}
```
- **Fix Propuesto:**
```typescript
if (!environment.production && typeof window !== 'undefined' && localStorage.getItem('cypress-test') === 'true') {
  return true;
}
```

### Finding 4 [CRÍTICO]
- **Impacto:** Inserción en tabla incorrecta en base de datos; las notificaciones de inscripción fallan silenciosamente.
- **Archivo y Línea:** `src/app/core/services/courses.service.ts:156-163`
- **Snippet Problemático:**
```typescript
await this.supabase.from('notifications').insert({
    title: '🎓 Nueva Inscripción a Curso',
    message: `${data.full_name} se ha inscripto al curso de ${data.course_title || 'N/A'}.`,
    type: 'info',
    scope: 'admin',
    is_read: false,
    tenant_id: this.tenantService.getTenantId()
});
```
- **Fix Propuesto:**
```typescript
await this.supabase.from('admin_notifications').insert({
    title: '🎓 Nueva Inscripción a Curso',
    message: `${data.full_name} se ha inscripto al curso de ${data.course_title || 'N/A'}.`,
    type: 'info',
    is_read: false,
    tenant_id: this.tenantService.getTenantId()
});
```

### Finding 5 [CRÍTICO]
- **Impacto:** Filtrado cruzado erróneo de certificados: `maybeSingle()` sin filtrar por alumno puede devolver el certificado de otro estudiante del mismo curso.
- **Archivo y Línea:** `src/app/core/services/courses.service.ts:448-454`
- **Snippet Problemático:**
```typescript
return from(
    this.supabase
        .from('course_certificates')
        .select('id')
        .eq('course_id', courseId)
        .maybeSingle()
)
```
- **Fix Propuesto:**
```typescript
const email = (await this.supabase.auth.getUser()).data.user?.email || '';
return from(
    this.supabase
        .from('course_certificates')
        .select('id')
        .eq('course_id', courseId)
        .eq('email', email)
        .maybeSingle()
)
```

### Finding 6 [ALTO]
- **Impacto:** Ineficiencia de red y sobreconsumo de egress al descargar toda la tabla de cursos a memoria para filtrar por autor.
- **Archivo y Línea:** `src/app/public/cursos/my-courses/student-my-courses-page.ts:334-337`
- **Snippet Problemático:**
```typescript
const allCourses = await this.courseRepo.getAll();
const mine = allCourses.filter((c) => c.author_id === profile.id);
this.authoredCourses.set(mine);
```
- **Fix Propuesto:**
```typescript
const mine = await this.courseRepo.getByAuthorId(profile.id);
this.authoredCourses.set(mine);
```

### Finding 7 [ALTO]
- **Impacto:** Módulo desconectado: `courseRepo.getAll()` filtra estrictamente por `is_active: true`, impidiendo cargar cursos pendientes de revisión.
- **Archivo y Línea:** `src/app/admin/courses/review/admin-course-review.component.ts:99-100`
- **Snippet Problemático:**
```typescript
const all = await this.courseRepo.getAll();
this.pendingCourses.set(all.filter((c) => c.status === 'PENDING'));
```
- **Fix Propuesto:**
```typescript
const pending = await this.courseRepo.getPendingReview();
this.pendingCourses.set(pending);
```

### Finding 8 [ALTO]
- **Impacto:** Peticiones N+1 con RxJS no encadenadas reactivamente que producen subscriptions huérfanas en el ciclo de vida del componente.
- **Archivo y Línea:** `src/app/public/cursos/campus/student-campus-page.ts:747-755`
- **Snippet Problemático:**
```typescript
for (const mod of modulesRes.data) {
  const shouldLoad = this.isModuleUnlocked(mod) || this.isAuthor() || this.isAdmin();
  if (shouldLoad) {
    this.coursesService
      .getModuleContents(mod.id)
      .subscribe((contentsRes) => {
        if (contentsRes.data) {
          this.moduleContentsMap[mod.id] = contentsRes.data;
        }
      });
  }
}
```
- **Fix Propuesto:**
```typescript
const unlockedMods = modulesRes.data.filter(m => this.isModuleUnlocked(m) || this.isAuthor() || this.isAdmin());
forkJoin(unlockedMods.map(m => this.coursesService.getModuleContents(m.id)))
  .pipe(takeUntilDestroyed(this.destroyRef))
  .subscribe(allResults => {
    unlockedMods.forEach((mod, idx) => {
      this.moduleContentsMap[mod.id] = allResults[idx].data || [];
    });
  });
```

### Finding 9 [ALTO]
- **Impacto:** Uso de métodos bloqueantes del motor del navegador (`window.alert`) que rompen la experiencia de usuario y fallan en entornos Tauri/Mobile.
- **Archivo y Línea:** `src/app/public/cursos/campus/student-campus-page.ts:876-879`
- **Snippet Problemático:**
```typescript
alert(
  'Por favor, responde a todas las preguntas antes de entregar el examen.',
);
```
- **Fix Propuesto:**
```typescript
this.toastService.show('Por favor, responde a todas las preguntas antes de entregar el examen.', 'warning');
```

### Finding 10 [ALTO]
- **Impacto:** Uso de `toPromise()` deprecado desde RxJS 7+, provocando potenciales fugas de memoria o advertencias de compilación severas.
- **Archivo y Línea:** `src/app/core/services/courses.service.ts:354`
- **Snippet Problemático:**
```typescript
return from(Promise.all(contentRequests.map(obs => obs.toPromise()))).pipe(...)
```
- **Fix Propuesto:**
```typescript
return forkJoin(contentRequests).pipe(...)
```

### Finding 11 [ALTO]
- **Impacto:** Pérdida de vinculación de identidad: inscripciones de usuarios autenticados creadas sin `user_id`.
- **Archivo y Línea:** `src/app/core/services/courses.service.ts:130-138`
- **Snippet Problemático:**
```typescript
const enrollment: StudentEnrollment = {
    course_id: data.course_id,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    status: 'pending',
    tenant_id: this.tenantService.getTenantId(),
    created_at: new Date().toISOString()
};
```
- **Fix Propuesto:**
```typescript
const user = (await this.supabase.auth.getUser()).data.user;
const enrollment: StudentEnrollment = {
    course_id: data.course_id,
    user_id: user?.id || null,
    full_name: data.full_name,
    email: data.email,
    phone: data.phone,
    status: 'pending',
    tenant_id: this.tenantService.getTenantId(),
    created_at: new Date().toISOString()
};
```

### Finding 12 [ALTO]
- **Impacto:** Ruptura de aislamiento multi-tenant en enlaces de certificados compartidos.
- **Archivo y Línea:** `src/app/public/cursos/certificate/certificate-page.component.ts:204-206`
- **Snippet Problemático:**
```html
<p class="text-[10px] text-slate-400 font-mono mt-1">
  Verifica la validez de este certificado en:
  https://arecofix.com.ar/academy/cert/{{ certificate()?.id }}
</p>
```
- **Fix Propuesto:**
```html
<p class="text-[10px] text-slate-400 font-mono mt-1">
  Verifica la validez de este certificado en:
  {{ tenantService.getBaseUrl() }}/academy/cert/{{ certificate()?.id }}
</p>
```

### Finding 13 [MEDIO]
- **Impacto:** Divergencia de componentes: dos pantallas públicas distintas para validar el mismo certificado (`/cert/:id` vs `/certificado/:id`).
- **Archivo y Línea:** `src/app/public/public.routes.ts:335-349`
- **Snippet Problemático:**
```typescript
{
  title: 'Certificado de Finalización',
  path: 'academy/cert/:id',
  loadComponent: () => import('@app/public/cursos/certificate/certificate-page.component').then(m => m.CertificatePageComponent)
},
{
  title: 'Validación de Certificado',
  path: 'academy/certificado/:id',
  loadComponent: () => import('@app/public/cursos/certificate-validation/certificate-validation.page').then(m => m.CertificateValidationPage)
}
```
- **Fix Propuesto:** Unificar en una única ruta `/academy/cert/:id` que contenga tanto la vista de impresión como la validación criptográfica y descarga de PDF.

### Finding 14 [MEDIO]
- **Impacto:** Violación del patrón Repository inyectando el cliente de base de datos directamente en componentes UI.
- **Archivo y Línea:** `src/app/admin/courses/enrollments/admin-course-enrollments-page.ts:68-71`
- **Snippet Problemático:**
```typescript
const { error } = await this.supabase
  .from('course_enrollments')
  .delete()
  .eq('id', id);
```
- **Fix Propuesto:**
```typescript
const { error } = await this.coursesService.deleteEnrollment(id);
```

### Finding 15 [MEDIO]
- **Impacto:** Bypass de SSR en `authGuard` que puede provocar fugas de contenido antes de la hidratación del cliente.
- **Archivo y Línea:** `src/app/guards/auth.guard.ts:17-19`
- **Snippet Problemático:**
```typescript
if (isPlatformServer(platformId)) {
  return true;
}
```
- **Fix Propuesto:**
```typescript
if (isPlatformServer(platformId)) {
  return false;
}
```

### Finding 16 [MEDIO]
- **Impacto:** Declaración inválida `ChangeDetectionStrategy.Eager` en componentes Standalone de Angular.
- **Archivo y Línea:** `src/app/public/cursos/campus/student-campus-page.ts:25`
- **Snippet Problemático:**
```typescript
changeDetection: ChangeDetectionStrategy.Eager,
```
- **Fix Propuesto:**
```typescript
changeDetection: ChangeDetectionStrategy.OnPush,
```

### Finding 17 [MEDIO]
- **Impacto:** Cursos creados por instructores pueden guardar `author_id` como `null` si el perfil no cargó de inmediato.
- **Archivo y Línea:** `src/app/instructor/builder/course-builder.component.ts:357-361`
- **Snippet Problemático:**
```typescript
const profile = this.authService.getCurrentProfile();
const payload: Partial<Course> = {
  ...this.courseData,
  author_id: profile?.id,
};
```
- **Fix Propuesto:**
```typescript
const user = await this.authService.getUser();
const payload: Partial<Course> = {
  ...this.courseData,
  author_id: user?.id,
};
```

### Finding 18 [MEDIO]
- **Impacto:** Uso repetitivo y no tipado de `any` en servicios de dominio infringiendo el modo estricto del proyecto.
- **Archivo y Línea:** `src/app/core/services/courses.service.ts:378`
- **Snippet Problemático:**
```typescript
getExamQuestions(contentId: string): Observable<{ data: any[], error: any }> {
```
- **Fix Propuesto:**
```typescript
getExamQuestions(contentId: string): Observable<{ data: CourseExamQuestion[], error: PostgrestError | null }> {
```

### Finding 19 [MEDIO]
- **Impacto:** Ejecución de queries secuenciales bloqueantes en bucle `for` durante el guardado de módulos.
- **Archivo y Línea:** `src/app/instructor/builder/course-builder.component.ts:338-347`
- **Snippet Problemático:**
```typescript
for (let i = 0; i < savedModules.length; i++) {
  const newModId = savedModules[i].id;
  const oldModId = this.modules[i]?.id;
  const contentsToSave = this.moduleContentsMap[oldModId] || [];
  await firstValueFrom(
    this.coursesService.saveModuleContents(newModId, contentsToSave),
  );
}
```
- **Fix Propuesto:**
```typescript
await Promise.all(savedModules.map((mod, i) => {
  const oldModId = this.modules[i]?.id;
  return firstValueFrom(this.coursesService.saveModuleContents(mod.id, this.moduleContentsMap[oldModId] || []));
}));
```

### Finding 20 [MEDIO]
- **Impacto:** Inconsistencia de estado: mezcla de mutación de variables planas con Signals reactivos en `CourseDetailComponent`.
- **Archivo y Línea:** `src/app/public/cursos/course-detail/course-detail.component.ts:55-57`
- **Snippet Problemático:**
```typescript
course: Course | null = null;
loading = true;
error: string | null = null;
```
- **Fix Propuesto:**
```typescript
course = signal<Course | null>(null);
loading = signal<boolean>(true);
error = signal<string | null>(null);
```

### Finding 21 [BAJO]
- **Impacto:** Formulario de inscripción pública no utiliza `ReactiveFormsModule`, careciendo de validaciones estrictas de teléfono y DNI.
- **Archivo y Línea:** `src/app/public/cursos/cursos.ts:67`
- **Snippet Problemático:**
```typescript
registrationForm = { full_name: '', email: '', phone: '' };
```
- **Fix Propuesto:** Migrar a `FormGroup` con `Validators.email` y validación de formato telefónico estándar.

### Finding 22 [BAJO]
- **Impacto:** Dependencia en `confirm()` nativo para eliminar preguntas de exámenes en el panel de materiales.
- **Archivo y Línea:** `src/app/admin/courses/materials/admin-course-materials-page.ts:816-819`
- **Snippet Problemático:**
```typescript
if (!confirm('¿Querés bloquear este módulo? Los alumnos dejarán de ver su contenido.'))
  return;
```
- **Fix Propuesto:** Emplear un modal de confirmación DaisyUI reutilizable.

### Finding 23 [BAJO]
- **Impacto:** Búsqueda en base de datos de usuarios en `searchUsersByEmail` no utiliza debounce, enviando peticiones en cada pulsación.
- **Archivo y Línea:** `src/app/admin/courses/enrollments/admin-course-enrollments-page.ts:100-105`
- **Snippet Problemático:**
```typescript
searchUsers() {
  const query = this.searchQuery().trim();
  this.coursesService.searchUsersByEmail(query).subscribe(...);
}
```
- **Fix Propuesto:** Implementar `debounceTime(300)` y `distinctUntilChanged()` mediante un `Subject<string>`.

### Finding 24 [BAJO]
- **Impacto:** Eliminación física de registros de preguntas de exámenes (`delete().eq('content_id', contentId)`) antes de insertar los nuevos sin control transaccional explícito.
- **Archivo y Línea:** `src/app/core/services/courses.service.ts:399-405`
- **Snippet Problemático:**
```typescript
this.supabase
    .from('course_exam_questions')
    .delete()
    .eq('content_id', contentId)
    .then(...)
```
- **Fix Propuesto:** Encapsular la actualización en la función RPC existente `save_exam_questions` en PostgreSQL para garantizar atomicidad transaccional.

### Finding 25 [BAJO]
- **Impacto:** Cálculo de ingresos mensuales de cursos `totalMonthlyRevenue` sumando precios estáticos de catálogo en vez de órdenes reales cobradas.
- **Archivo y Línea:** `src/app/admin/courses/admin-courses-page.ts:58-63`
- **Snippet Problemático:**
```typescript
totalMonthlyRevenue = computed(() =>
  this.courses().reduce(
    (sum, c) => sum + (c.is_active ? Number(c.price || 0) : 0),
    0,
  ),
);
```
- **Fix Propuesto:** Consultar agregación real desde la tabla `orders` filtrando por `item_type = 'course'` y `status = 'completed'`.

---

## 5. Diagramas de Flujo Actuales

### A. Flujo de Inscripción y Activación
```text
[ Alumno / Invitado ]
        │
        ▼
Selecciona Curso en /academy o /academy/:slug
        │
        ▼
Completa Modal de Inscripción (Nombre, Email, Teléfono)
        │
        ▼
CoursesService.registerStudent()
        ├──> INSERT en course_enrollments (status: 'pending')
        ├──> INSERT en contact_messages (Bandeja de Entrada Admin)
        └──> INSERT en admin_notifications (Campana de Notificaciones)
        │
        ▼
[ Administrador en /admin/courses/solicitudes ]
        │
        ▼
Presiona "Aprobar"
        │
        ▼
UPDATE course_enrollments SET status = 'confirmed'
        │
        ▼
Alumno ingresa a /academy/mis-cursos y accede a /academy/:slug/aula
```

### B. Flujo de Desbloqueo de Temario (Drip Content)
```text
[ Administrador en /admin/courses/:id/materials ]
        │
        ├─────────────────────────────┬─────────────────────────────┐
        ▼                             ▼                             ▼
  [ Habilitar Ahora ]        [ Programar Fecha ]            [ Bloquear ]
        │                             │                             │
unlock_date = now()          unlock_date = ISO Date        unlock_date = NULL
        │                             │                             │
        └─────────────────────────────┼─────────────────────────────┘
                                      ▼
                        UPDATE en course_modules
                                      │
                                      ▼
[ Alumno ingresa a /academy/:slug/aula ]
        │
        ▼
isModuleUnlocked(module):
        ├── Si unlock_date == NULL  --> [ Bloqueado con Candado ]
        ├── Si unlock_date > now()  --> [ Programado con Fecha de Apertura ]
        └── Si unlock_date <= now() --> [ Habilitado / Contenido Visible ]
```

### C. Flujo de Exámenes y Certificación
```text
[ Alumno en el Aula Virtual ]
        │
        ▼
Selecciona Recurso de Tipo 'Examen'
        │
        ▼
CoursesService.getExamQuestions(contentId) -> RPC Supabase
        │
        ▼
Responde Cuestionario y presiona "Entregar Examen"
        │
        ▼
CoursesService.submitExam() -> RPC submit_exam en PostgreSQL
        │
        ├──> Guarda respuestas en course_exam_submissions
        ├──> Calcula puntaje (% de aprobación)
        │
        ▼
¿Aprobado (Score >= Passing Score)?
        ├── NO  --> Muestra pantalla de reintento.
        └── SÍ  --> Registra en course_progress (completed_at: now())
                    │
                    ▼
            ¿Todos los contenidos del curso completados?
                    ├── NO  --> Actualiza barra de progreso.
                    └── SÍ  --> Llama a Edge Function / Trigger
                                │
                                ▼
                        INSERT en course_certificates
                        Genera QR y compila PDF oficial
                                │
                                ▼
                        Certificado disponible en /academy/cert/:id
```
