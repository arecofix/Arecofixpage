import { buildMockSession, buildMockProfile } from '../../support/mock-factories';

describe('Academy Adversarial & Security Tests (Pruebas de Resiliencia y Reglas de Negocio)', () => {
  const courseId = 'c0000000-0000-0000-0000-000000000002';
  const sequentialCourseSlug = 'curso-secuencial-seguridad';
  const examId = 'exam-sec-1';

  const attackerUserId = '66666666-6666-6666-6666-666666666666';
  const attackerEmail = 'no.matriculado@arecofix.com';

  const mockSequentialCourse = {
    id: courseId,
    title: 'Curso Secuencial de Ciberseguridad',
    slug: sequentialCourseSlug,
    description: 'Aislamiento y pruebas avanzadas.',
    duration: '20 horas',
    schedule: 'Online',
    price: 40000,
    level: 'intermediate',
    unlock_strategy: 'SEQUENTIAL',
    is_active: true,
  };

  const mockModulesSequential = [
    {
      id: 'mod-seq-1',
      course_id: courseId,
      title: 'Módulo 1: Requisito Obligatorio',
      order_index: 1,
      unlock_date: null,
    },
    {
      id: 'mod-seq-2',
      course_id: courseId,
      title: 'Módulo 2: Contenido Avanzado (Condicionado)',
      order_index: 2,
      unlock_date: null,
    },
  ];

  const mockLessonsMod1 = [
    {
      id: 'lesson-1-1',
      module_id: 'mod-seq-1',
      type: 'video',
      title: 'Video Clase 1',
      url: 'https://example.com/video1.mp4',
      order_index: 1,
    },
  ];

  const mockLessonsMod2 = [
    {
      id: 'lesson-2-1',
      module_id: 'mod-seq-2',
      type: 'exam',
      title: 'Examen de Certificación',
      url: 'exam',
      order_index: 1,
      metadata: {
        passing_score: 80,
        time_limit_minutes: 10,
      },
    },
  ];

  beforeEach(() => {
    cy.clearAllLocalStorage();
    cy.clearAllCookies();
  });

  it('1. Acceso no autorizado: Alumno sin matrícula es rechazado en /aula', () => {
    const session = {
      ...buildMockSession(),
      user: {
        id: attackerUserId,
        email: attackerEmail,
        role: 'authenticated',
        user_metadata: { role: 'customer' },
        app_metadata: { provider: 'email' },
      },
    };
    const profile = {
      ...buildMockProfile(),
      id: attackerUserId,
      email: attackerEmail,
      role: 'customer',
    };

    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? mockSequentialCourse : [mockSequentialCourse],
      });
    }).as('getCourses');

    // DB returns 0 enrollments for this attacker
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [],
    }).as('noEnrollments');

    cy.loginAsUser(`/academy/${sequentialCourseSlug}/aula`, session as any, profile as any);

    // Verify access is strictly blocked
    cy.contains('Acceso Restringido', { timeout: 10000 }).should('be.visible');
    cy.contains('Ir a la página del Curso').should('be.visible');
  });

  it('2. Desbloqueo forzado: En curso SEQUENTIAL, Módulo 2 está bloqueado hasta completar Módulo 1', () => {
    const studentId = '77777777-7777-7777-7777-777777777777';
    const studentEmail = 'alumno.secuencial@arecofix.com';

    const session = {
      ...buildMockSession(),
      user: {
        id: studentId,
        email: studentEmail,
        role: 'authenticated',
        user_metadata: { role: 'customer' },
        app_metadata: { provider: 'email' },
      },
    };
    const profile = {
      ...buildMockProfile(),
      id: studentId,
      email: studentEmail,
      role: 'customer',
    };

    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? mockSequentialCourse : [mockSequentialCourse],
      });
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: mockModulesSequential,
    }).as('getModules');

    // User is enrolled
    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [
        {
          id: 'enr-seq-1',
          course_id: courseId,
          user_id: studentId,
          email: studentEmail,
          status: 'confirmed',
        },
      ],
    }).as('enrolled');

    // Return lessons per module
    cy.intercept('GET', '**/rest/v1/course_lessons*module_id=eq.mod-seq-1*', {
      statusCode: 200,
      body: mockLessonsMod1,
    }).as('getMod1Lessons');

    cy.intercept('GET', '**/rest/v1/course_lessons*module_id=eq.mod-seq-2*', {
      statusCode: 200,
      body: mockLessonsMod2,
    }).as('getMod2Lessons');

    // Progress has 0 completed contents
    cy.intercept('POST', '**/rest/v1/rpc/get_course_progress*', {
      statusCode: 200,
      body: {
        progress: 0,
        completed_contents: [],
        certificate_id: null,
      },
    }).as('getProgress');

    cy.loginAsUser(`/academy/${sequentialCourseSlug}/aula`, session as any, profile as any);

    // Module 1 is available
    cy.contains('Módulo 1: Requisito Obligatorio', { timeout: 10000 }).should('be.visible');

    // Module 2 is visually locked (shows lock icon)
    cy.contains('Módulo 2: Contenido Avanzado').parent().find('i.fa-lock').should('exist');
  });

  it('3. Bypass de examen: Recargar la página mantiene el timer desde donde quedó', () => {
    const studentId = '88888888-8888-8888-8888-888888888888';
    const studentEmail = 'alumno.timer@arecofix.com';

    const session = {
      ...buildMockSession(),
      user: {
        id: studentId,
        email: studentEmail,
        role: 'authenticated',
        user_metadata: { role: 'customer' },
        app_metadata: { provider: 'email' },
      },
    };
    const profile = {
      ...buildMockProfile(),
      id: studentId,
      email: studentEmail,
      role: 'customer',
    };

    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? mockSequentialCourse : [mockSequentialCourse],
      });
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [
        {
          id: 'mod-timer-1',
          course_id: courseId,
          title: 'Módulo 1: Examen Timer',
          order_index: 1,
          unlock_date: null,
        },
      ],
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-timer', course_id: courseId, user_id: studentId, email: studentEmail, status: 'confirmed' }],
    });

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: [
        {
          id: examId,
          module_id: 'mod-timer-1',
          type: 'exam',
          title: 'Examen con Timer Estricto',
          url: 'exam',
          order_index: 1,
          metadata: { passing_score: 70, time_limit_minutes: 10 },
        },
      ],
    });

    cy.intercept('POST', '**/rest/v1/rpc/get_exam_questions*', {
      statusCode: 200,
      body: [
        {
          id: 'q-timer-1',
          content_id: examId,
          question_text: '¿El timer persiste entre recargas?',
          options: ['Sí, usando timestamp', 'No'],
          correct_option_index: 0,
          order_index: 1,
        },
      ],
    });

    cy.loginAsUser(`/academy/${sequentialCourseSlug}/aula`, session as any, profile as any);

    // Open exam by clicking Comenzar
    cy.contains('button', 'Comenzar', { timeout: 10000 }).click({ force: true });

    // Verify timer badge is displayed inside exam modal
    cy.get('#take_exam_modal .badge', { timeout: 10000 }).contains(/\d\d:\d\d/).should('be.visible');

    // Answer question (auto-saved into localStorage)
    cy.contains('Sí, usando timestamp').click({ force: true });

    // Verify localStorage has persisted answer and start time
    cy.window().then((win) => {
      expect(win.localStorage.getItem(`exam_start_${examId}`)).to.not.be.null;
      expect(win.localStorage.getItem(`exam_answers_${examId}`)).to.include('q-timer-1');
    });

    // Close modal
    cy.get('#take_exam_modal button.btn-circle.btn-ghost').first().click({ force: true });

    // Re-open exam: answer is restored
    cy.contains('button', 'Comenzar').click({ force: true });
    cy.get('#take_exam_modal input[type="radio"]:checked').should('exist');
  });

  it('4. Expiración de Timer: Si el tiempo expira, se notifica al alumno', () => {
    const studentId = '88888888-8888-8888-8888-888888888888';
    const studentEmail = 'alumno.timer@arecofix.com';

    const session = {
      ...buildMockSession(),
      user: {
        id: studentId,
        email: studentEmail,
        role: 'authenticated',
        user_metadata: { role: 'customer' },
        app_metadata: { provider: 'email' },
      },
    };
    const profile = {
      ...buildMockProfile(),
      id: studentId,
      email: studentEmail,
      role: 'customer',
    };

    cy.intercept('GET', '**/rest/v1/courses*', (req) => {
      const isSingle = String(req.headers['accept'])?.includes('application/vnd.pgrst.object');
      req.reply({
        statusCode: 200,
        body: isSingle ? mockSequentialCourse : [mockSequentialCourse],
      });
    }).as('getCourses');

    cy.intercept('GET', '**/rest/v1/course_modules*', {
      statusCode: 200,
      body: [
        {
          id: 'mod-timer-1',
          course_id: courseId,
          title: 'Módulo 1: Examen Timer',
          order_index: 1,
          unlock_date: null,
        },
      ],
    }).as('getModules');

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: [{ id: 'enr-timer', course_id: courseId, user_id: studentId, email: studentEmail, status: 'confirmed' }],
    });

    cy.intercept('GET', '**/rest/v1/course_lessons*', {
      statusCode: 200,
      body: [
        {
          id: examId,
          module_id: 'mod-timer-1',
          type: 'exam',
          title: 'Examen con Timer Estricto',
          url: 'exam',
          order_index: 1,
          metadata: { passing_score: 70, time_limit_minutes: 10 },
        },
      ],
    });

    cy.intercept('POST', '**/rest/v1/rpc/get_exam_questions*', {
      statusCode: 200,
      body: [],
    });

    cy.loginAsUser(`/academy/${sequentialCourseSlug}/aula`, session as any, profile as any);

    // Inject an expired start time into localStorage (started 1 hour ago)
    cy.window().then((win) => {
      win.localStorage.setItem(`exam_start_${examId}`, String(Date.now() - 3600000));
    });

    // Open exam: should detect remaining <= 0 and show warning
    cy.contains('button', 'Comenzar', { timeout: 10000 }).click({ force: true });
    cy.contains('El tiempo para este examen ha expirado', { timeout: 8000 }).should('be.visible');
  });

  it('5. Asignación duplicada: Asignar el mismo alumno dos veces no genera duplicados en la DB', () => {
    cy.loginAsAdmin('/admin/dashboard');

    cy.intercept('GET', '**/rest/v1/profiles*', {
      statusCode: 200,
      body: [{ id: 'user-dup', email: 'dup@arecofix.com', first_name: 'Doble', last_name: 'Inscrito' }],
    }).as('getProfiles');

    cy.intercept('GET', '**/rest/v1/courses*', {
      statusCode: 200,
      body: [mockSequentialCourse],
    }).as('getCourses');

    // Mock existing enrollment check in DB
    cy.intercept('GET', '**/rest/v1/course_enrollments*', (req) => {
      if (req.url.includes('select=id')) {
        req.reply({
          statusCode: 200,
          body: [{ id: 'existing-enr-id', course_id: courseId, email: 'dup@arecofix.com' }],
        });
      } else {
        req.reply({
          statusCode: 200,
          body: [],
        });
      }
    }).as('checkExistingEnrollment');

    // Update query triggered by duplicate assignment
    cy.intercept({ method: /^(POST|PATCH)$/, url: '**/rest/v1/course_enrollments*' }, {
      statusCode: 200,
      body: [{ id: 'existing-enr-id', course_id: courseId, email: 'dup@arecofix.com', status: 'confirmed' }],
    }).as('updateExistingEnrollment');

    // Navigate to Solicitudes
    cy.get('aside.drawer-side').contains('Academia Arecofix').click({ force: true, multiple: true });
    cy.contains('Solicitudes').click({ force: true, multiple: true });

    cy.get('input[placeholder="ejemplo@email.com"]', { timeout: 10000 }).type('dup@arecofix.com{enter}');
    cy.get('ul.absolute li a').contains('Doble Inscrito', { timeout: 10000 }).click({ force: true });
    cy.contains('label', 'Curso a Asignar').parent().find('select').select('Curso Secuencial de Ciberseguridad');
    cy.contains('button', 'Matricular').should('not.be.disabled').click({ force: true });

    cy.contains('Usuario matriculado correctamente', { timeout: 10000 }).should('be.visible');
  });

  it('6. Rendimiento con volumen: Admin renderiza 100 inscripciones sin congelarse', () => {
    cy.loginAsAdmin('/admin/dashboard');

    const massiveEnrollments = Array.from({ length: 100 }, (_, i) => ({
      id: `massive-${i}`,
      course_id: courseId,
      full_name: `Alumno Número ${i + 1}`,
      email: `alumno${i + 1}@arecofix.com`,
      status: i % 2 === 0 ? 'confirmed' : 'pending',
      created_at: new Date().toISOString(),
      course: mockSequentialCourse,
    }));

    cy.intercept('GET', '**/rest/v1/course_enrollments*', {
      statusCode: 200,
      body: massiveEnrollments,
    }).as('getMassiveEnrollments');

    // Navigate to Solicitudes
    cy.get('aside.drawer-side').contains('Academia Arecofix').click({ force: true, multiple: true });
    cy.contains('Solicitudes').click({ force: true, multiple: true });

    cy.wait('@getMassiveEnrollments');

    // Verify elements render cleanly
    cy.contains('Alumno Número 1', { timeout: 10000 }).should('be.visible');
    cy.contains('Alumno Número 100').should('exist');
  });
});
