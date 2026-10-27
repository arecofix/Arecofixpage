# 📐 Arecofix Academy — Modelado UML y Arquitectura de Dominio (v1.0)

Este documento modela las entidades, relaciones y transiciones de estado del sistema de Academia de Arecofix bajo principios de **Clean Architecture** y tipado estricto.

---

## 1. Diagrama de Clases (Dominio de Academia)

```mermaid
classDiagram
    direction TB

    class Course {
        +UUID id
        +UUID tenant_id
        +string title
        +string slug
        +string description
        +string short_description
        +number price
        +number sale_price
        +string image_url
        +string level
        +string duration
        +boolean is_active
        +boolean is_featured
        +UUID author_id
        +UUID instructor_id
        +string instructor_name
        +UnlockStrategy unlock_strategy
        +DateTime created_at
        +DateTime updated_at
        +isAvailableFor(student: Student) boolean
        +calculateTotalHours() number
    }

    class CourseModule {
        +UUID id
        +UUID course_id
        +UUID tenant_id
        +string title
        +string description
        +number order_index
        +DateTime unlock_date
        +DateTime created_at
        +isUnlocked(studentProgress: CourseProgress[], previousModuleApproved: boolean) boolean
    }

    class CourseLesson {
        +UUID id
        +UUID module_id
        +UUID tenant_id
        +LessonType type
        +string title
        +string url
        +number order_index
        +JSON metadata
        +DateTime created_at
        +isExam() boolean
    }

    class Exam {
        +UUID content_id
        +UUID tenant_id
        +string title
        +number passing_score
        +number time_limit_minutes
        +number max_attempts
        +Question[] questions
        +evaluate(submissions: ExamAnswer[]) ExamResult
    }

    class ExamQuestion {
        +UUID id
        +UUID content_id
        +UUID tenant_id
        +string question_text
        +string[] options
        +number correct_option_index
        +number order_index
        +isCorrect(selectedOption: number) boolean
    }

    class StudentEnrollment {
        +UUID id
        +UUID tenant_id
        +UUID course_id
        +UUID user_id
        +string full_name
        +string email
        +string phone
        +EnrollmentStatus status
        +DateTime created_at
        +confirm() void
        +revoke() void
        +isActive() boolean
    }

    class Student {
        +UUID id
        +string email
        +string first_name
        +string last_name
        +string phone
        +MembershipStatus membership_status
        +DateTime membership_expires_at
        +canAccessCourse(courseId: UUID) boolean
        +canTakeExam() boolean
    }

    class Instructor {
        +UUID id
        +string full_name
        +string email
        +string bio
        +string avatar_url
        +string role
        +assignToCourse(course: Course) void
    }

    class CourseProgress {
        +UUID id
        +UUID tenant_id
        +UUID course_id
        +UUID content_id
        +UUID user_id
        +string email
        +DateTime completed_at
    }

    class CourseCertificate {
        +UUID id
        +UUID tenant_id
        +UUID course_id
        +string email
        +string student_name
        +string student_dni
        +string pdf_url
        +DateTime issued_at
        +verifyAuthenticity() boolean
    }

    class MembershipPayment {
        +UUID id
        +UUID user_id
        +UUID tenant_id
        +number amount
        +string currency
        +string payment_provider
        +PaymentStatus status
        +DateTime paid_at
        +DateTime expires_at
    }

    %% Relaciones
    Course "1" *-- "many" CourseModule : compone
    CourseModule "1" *-- "many" CourseLesson : compone
    CourseLesson "1" o-- "0..1" Exam : contiene
    Exam "1" *-- "many" ExamQuestion : contiene preguntas
    Course "1" -- "many" StudentEnrollment : matriculaciones
    Student "1" -- "many" StudentEnrollment : cursa
    Instructor "1" -- "many" Course : instruye / autor
    Student "1" -- "many" CourseProgress : registra avance
    CourseLesson "1" -- "many" CourseProgress : marcado como completado
    Course "1" -- "many" CourseCertificate : emite
    Student "1" -- "many" CourseCertificate : recibe
    Student "1" -- "many" MembershipPayment : paga suscripción
```

---

## 2. Diagramas de Transición de Estados

### 2.1 Máquina de Estados de la Matrícula (`StudentEnrollment`)

```mermaid
stateDiagram-v2
    [*] --> Pending : Solicitud pública / Registro
    [*] --> Confirmed : Asignación Directa por Admin

    Pending --> Confirmed : Admin aprueba solicitud
    Pending --> Rejected : Admin cancela / rechaza solicitud

    Confirmed --> InProgress : Alumno ingresa al Aula Virtual
    InProgress --> Completed : 100% Contenidos + Exámenes Aprobados
    
    Confirmed --> Revoked : Mora grave / Infracción
    InProgress --> Revoked : Mora grave / Infracción
    
    Completed --> [*] : Emisión de Diploma Oficial
    Rejected --> [*]
    Revoked --> [*]
```

### 2.2 Máquina de Estados de Membresía del Alumno (`MembershipStatus`)

```mermaid
stateDiagram-v2
    [*] --> Active : Suscripción creada / Pago confirmado

    Active --> GracePeriod : Vence cuota mensual (Día 0)
    note right of GracePeriod : Tolerancia de 7 días corridos.\nAcceso normal + Banner de pago.

    GracePeriod --> Active : Regulariza pago
    GracePeriod --> Suspended : Vence plazo de 7 días sin pago

    note right of Suspended : Solo lectura de lecciones aprobadas.\nBloqueo de exámenes y módulos nuevos.

    Suspended --> Active : Regulariza pago pendiente
    Suspended --> Expired : > 30 días sin regularizar

    note right of Expired : Bloqueo total del portal de aula.\nRequiere reactivación completa.

    Expired --> Active : Nueva suscripción / Reactivación
```

---

## 3. Diagrama de Secuencia: Asignación y Acceso de Alumno (Resolución del Bug)

```mermaid
sequenceDiagram
    autonumber
    actor Admin as Administrador
    participant AdminUI as Portal Admin (/admin/courses)
    participant Backend as Courses & Enrollment Service
    participant DB as Supabase PostgreSQL + RLS
    actor Student as Alumno Existente
    participant StudentUI as Portal Alumno (/academy/mis-cursos)

    Admin->>AdminUI: Selecciona Usuario registrado + Curso
    AdminUI->>Backend: enrollStudentManually(courseId, email, fullName, userId)
    Backend->>DB: INSERT / UPDATE course_enrollments (user_id, lower(email), status='confirmed', tenant_id)
    DB-->>Backend: Confirma registro (id, status='confirmed')
    Backend-->>AdminUI: Éxito (Toast "Usuario matriculado correctamente")

    Note over Student, StudentUI: El alumno inicia sesión o recarga su portal
    Student->>StudentUI: Ingresa a /academy/mis-cursos
    StudentUI->>Backend: getUserEnrolledCourses(email, userId)
    Note over Backend, DB: Consulta optimizada con cache-busting y filtro dual:<br/>(lower(email) = :email OR user_id = :userId)
    Backend->>DB: SELECT * FROM course_enrollments JOIN courses ...<br/>WHERE status='confirmed' AND (email ILIKE :email OR user_id = :userId)
    Note over DB: RLS Policy valida:<br/>lower(email) = auth.jwt()->>'email' OR user_id = auth.uid()
    DB-->>Backend: Retorna cursos matriculados
    Backend-->>StudentUI: [ Course { id, title, slug, image_url, ... } ]
    StudentUI-->>Student: Renderiza Curso con tarjeta "Matriculado" y botón "Ir al Aula"
```
