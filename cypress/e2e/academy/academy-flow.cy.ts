import { buildMockSession, buildMockProfile } from '../../support/mock-factories';

describe('Academy E2E: Flujo Completo Happy Path (Admin & Alumno)', () => {
  const courseId = 'c0000000-0000-0000-0000-000000000001';
  const courseSlug = 'curso-reparacion-e2e';
  const moduleId = 'm0000000-0000-0000-0000-000000000001';
  const examContentId = 'e0000000-0000-0000-0000-000000000001';

  const studentUserId = '55555555-5555-5555-5555-555555555555';
  const studentEmail = 'alumno.existente@arecofix.com';

  const mockCourse = {
    id: courseId,
    title: 'Curso Reparación Celulares E2E',
    slug: courseSlug,
    description: 'Curso completo de diagnóstico y reparación de hardware móvil.',
    duration: '40 horas',
    schedule: 'Flexible online',
    price: 35000,
    level: 'basic',
    unlock_strategy: 'ALL_AT_ONCE',
    is_active: true,
    image_url: '/assets/img/cursos/1.jpg',
  };

  const mockModule = {
    id: moduleId,
    course_id: courseId,
    title: 'Módulo 1: Diagnóstico de Placas',
    order_index: 1,
    unlock_date: '2025-01-01T00:00:00Z',
  };

  const mockExamContent = {
    id: examContentId,
    module_id: moduleId,
    type: 'exam',
    title: 'Examen de Diagnóstico',
    url: 'exam',
    order_index: 1,
    metadata: {
      passing_score: 70,
      time_limit_minutes: 20,
    },
  };

  const mockQuestions = [
    {
      id: 'q1',
      content_id: examContentId,
      question_text: '¿Qué herramienta se utiliza para medir continuidad y voltaje?',
      options: ['Multímetro', 'Cautín', 'Osciloscopio', 'Alcohol isopropílico'],
      correct_option_index: 0,
      order_index: 1,
    },
    {
      id: 'q2',
      content_id: examContentId,
      question_text: '¿Cuál es la tensión nominal habitual de una batería Li-Ion?',
      options: ['12V', '3.7V - 3.85V', '1.5V', '220V'],
      correct_option_index: 1,
      order_index: 2,
    },
  ];

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it('1. Admin: Crea el curso y configura el temario y examen', () => {
    cy.loginAsAdmin('/admin/dashboard');

    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? mockCourse : [mockCourse],
      });
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [mockModule],
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: [mockExamContent],
    }).as('getLessons');

    // UI navigation to avoid session reload
    cy.get('aside.drawer-side').contains('Academia Arecofix').click({ force: true, multiple: true });
    cy.contains('Cursos').click({ force: true, multiple: true });
    cy.contains('Curso Reparación Celulares E2E', { timeout: 10000 }).should('be.visible');

    // Navigate to materials
    cy.get(`a[href="/admin/courses/${courseId}/materials"]`).first().click({ force: true });
    cy.contains('Módulo 1: Diagnóstico de Placas', { timeout: 10000 }).should('be.visible');
    cy.get('input[placeholder="Título del recurso..."]').first().should('have.value', 'Examen de Diagnóstico');
    cy.contains('Configurar Examen').should('be.visible');
  });

  it('2. Admin: Asigna el curso a un alumno existente (Bug Prioridad 1)', () => {
    cy.loginAsAdmin('/admin/dashboard');

    cy.intercept('GET', '**/rest/v1/courses*', {
      statusCode: 200,
      body: [mockCourse],
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/profiles*', (req) => {
      req.reply({
        statusCode: 200,
        body: [
          {
            id: studentUserId,
            email: studentEmail,
            first_name: 'Alumno',
            last_name: 'Existente',
            role: 'customer',
          },
        ],
      });
    }).as('profiles');

    cy.intercept('GET', '**/rest/v1/course_enrollments*', (req) => {
      req.reply({
        statusCode: 200,
        body: [],
      });
    }).as('getEnrollments');

    cy.intercept({ method: /^(POST|PATCH)$/, url: '**/rest/v1/course_enrollments*' }, (req) => {
      req.reply({
        statusCode: 200,
        body: {
          id: 'enrollment-1',
          course_id: courseId,
          user_id: studentUserId,
          email: studentEmail,
          full_name: 'Alumno Existente',
          status: 'confirmed',
          course: mockCourse,
        },
      });
    }).as('saveEnrollment');

    // Navigate to Solicitudes (Enrollments)
    cy.get('aside.drawer-side').contains('Academia Arecofix').click({ force: true, multiple: true });
    cy.contains('Solicitudes').click({ force: true, multiple: true });

    cy.get('input[placeholder="ejemplo@email.com"]', { timeout: 10000 }).type('alumno.existente@arecofix.com{enter}');
    cy.wait('@profiles');
    cy.get('ul.absolute li a').contains('Alumno Existente', { timeout: 10000 }).click({ force: true });
    cy.contains('label', 'Curso a Asignar').parent().find('select').select('Curso Reparación Celulares E2E');
    cy.contains('button', 'Matricular').should('not.be.disabled').click({ force: true });
    cy.contains('Usuario matriculado correctamente', { timeout: 10000 }).should('be.visible');
  });

  it('3. Alumno: Inicia sesión y ve inmediatamente el curso asignado en Mis Cursos', () => {
    const studentSession = {
      ...buildMockSession(),
      user: {
        id: studentUserId,
        email: studentEmail,
        role: 'authenticated',
        user_metadata: { role: 'customer' },
        app_metadata: { provider: 'email' },
      },
    };

    const studentProfile = {
      ...buildMockProfile(),
      id: studentUserId,
      email: studentEmail,
      first_name: 'Alumno',
      last_name: 'Existente',
      role: 'customer',
    };

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [
        {
          id: 'enrollment-1',
          course_id: courseId,
          user_id: studentUserId,
          email: studentEmail,
          full_name: 'Alumno Existente',
          status: 'confirmed',
          created_at: new Date().toISOString(),
          course: mockCourse,
        },
      ],
    }).as('studentEnrollments');

    cy.loginAsUser('/academy/mis-cursos', studentSession as any, studentProfile as any);
    cy.contains('Mi Academia', { timeout: 10000 }).should('be.visible');
    cy.contains('Curso Reparación Celulares E2E').should('be.visible');
    cy.contains('Ir al Aula').should('be.visible');
  });

  it('4. Alumno: Ingresa al Campus Virtual, responde el examen y lo aprueba', () => {
    const studentSession = {
      ...buildMockSession(),
      user: {
        id: studentUserId,
        email: studentEmail,
        role: 'authenticated',
        user_metadata: { role: 'customer' },
        app_metadata: { provider: 'email' },
      },
    };

    const studentProfile = {
      ...buildMockProfile(),
      id: studentUserId,
      email: studentEmail,
      role: 'customer',
    };

    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? mockCourse : [mockCourse],
      });
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [mockModule],
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: [mockExamContent],
    }).as('getLessons');

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [
        {
          id: 'enrollment-1',
          course_id: courseId,
          user_id: studentUserId,
          email: studentEmail,
          status: 'confirmed',
        },
      ],
    }).as('checkEnrollment');

    cy.intercept('POST', '**/rest/v1/rpc/get_exam_questions*', {
      statusCode: 200,
      body: mockQuestions,
    }).as('getExamQuestions');

    cy.intercept('POST', '**/rest/v1/rpc/get_course_progress*', {
      statusCode: 200,
      body: {
        progress: 0,
        completed_contents: [],
        certificate_id: null,
      },
    }).as('getProgress');

    cy.intercept('POST', '**/rest/v1/rpc/submit_exam*', {
      statusCode: 200,
      body: {
        score: 100,
        passed: true,
        correct_answers: 2,
        total_questions: 2,
        progress: {
          progress: 100,
          completed_contents: [examContentId],
          certificate_id: 'cert-12345',
        },
      },
    }).as('submitExam');

    cy.loginAsUser(`/academy/${courseSlug}/aula`, studentSession as any, studentProfile as any);

    cy.contains('Curso Reparación Celulares E2E', { timeout: 10000 }).should('be.visible');
    cy.contains('Módulo 1: Diagnóstico de Placas').should('be.visible');

    // Click on Comenzar to open exam
    cy.contains('button', 'Comenzar').click({ force: true });
    cy.wait('@getExamQuestions');

    // Answer questions
    cy.contains('Multímetro').click({ force: true });
    cy.contains('3.7V - 3.85V').click({ force: true });

    // Submit Exam
    cy.contains('button', 'Entregar Examen').click({ force: true });
    cy.wait('@submitExam');

    cy.contains('¡Aprobado!', { timeout: 10000 }).should('be.visible');
    cy.contains('100%').should('be.visible');
    cy.contains('2 de 2 correctas').should('be.visible');
  });

  it('5. Admin: Comprueba el progreso del alumno y la inscripción', () => {
    cy.loginAsAdmin('/admin/dashboard');

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [
        {
          id: 'enrollment-1',
          course_id: courseId,
          user_id: studentUserId,
          email: studentEmail,
          full_name: 'Alumno Existente',
          status: 'confirmed',
          created_at: new Date().toISOString(),
          course: mockCourse,
        },
      ],
    }).as('adminEnrollments');

    // Navigate to Solicitudes (Enrollments)
    cy.get('aside.drawer-side').contains('Academia Arecofix').click({ force: true, multiple: true });
    cy.contains('Solicitudes').click({ force: true, multiple: true });

    cy.contains('Alumno Existente', { timeout: 10000 }).should('be.visible');
    cy.contains('alumno.existente@arecofix.com').should('be.visible');
    cy.contains('Curso Reparación Celulares E2E').should('be.visible');
  });
});
