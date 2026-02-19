import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-XXRJQVX5.mjs";
import {
  Injectable,
  catchError,
  from,
  map,
  of,
  setClassMetadata,
  ɵɵdefineInjectable,
  ɵɵinject
} from "./chunk-TFR7QWGS.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/core/services/courses.service.ts
var CoursesService = class _CoursesService {
  authService;
  supabase;
  // Centralized mock courses to be Single Source of Truth until DB is fully populated
  mockCourses = [
    {
      id: "1",
      title: "Reparaci\xF3n de Celulares - Nivel B\xE1sico",
      slug: "reparacion-celulares-basico",
      description: "Aprende los fundamentos de la reparaci\xF3n de smartphones. Incluye diagn\xF3stico, cambio de pantallas y bater\xEDas. Ideal para quienes quieren iniciarse en el mundo de la tecnolog\xEDa m\xF3vil.",
      duration: "3 meses",
      schedule: "S\xE1bados 10:00-13:00",
      price: 45e3,
      image_url: "assets/img/cursos/alumno3.jpg",
      level: "B\xE1sico",
      students: 120,
      rating: 4.8
    },
    {
      id: "2",
      title: "Microelectr\xF3nica Avanzada",
      slug: "curso-avanzado-microelectronica",
      description: "Domina la reparaci\xF3n de placas de iPhone y Android. Aprende reballing, esquema el\xE9ctrico, soluci\xF3n de fallas de encendido, carga e imagen.",
      duration: "4 meses",
      schedule: "Mi\xE9rcoles 18:00-21:00",
      price: 65e3,
      image_url: "assets/img/cursos/alumno2.jpg",
      level: "Avanzado",
      students: 85,
      rating: 4.9
    },
    {
      id: "3",
      title: "Electricidad Domiciliaria e Industrial",
      slug: "curso-electricidad",
      description: "Formaci\xF3n completa en instalaciones el\xE9ctricas. Aprende desde cero a realizar cableados, montaje de tableros, protecciones, iluminaci\xF3n y detecci\xF3n de fallas.",
      duration: "5 meses",
      schedule: "Martes y Jueves 19:00-21:00",
      price: 4e4,
      image_url: "assets/img/cursos/electricity.jpg",
      level: "Principiante",
      students: 40,
      rating: 4.7
    },
    {
      id: "4",
      title: "Aprendizaje 100% Pr\xE1ctico",
      slug: "aprendizaje-practico",
      description: "Modalidad intensiva de pr\xE1ctica en taller. Sin teor\xEDa, directo a la mesa de trabajo. Ideal para quienes ya tienen conocimientos te\xF3ricos y necesitan horas de vuelo.",
      duration: "A medida",
      schedule: "Consultar horarios",
      price: 35e3,
      image_url: "assets/img/cursos/aprendizaje-practico.jpg",
      level: "Pr\xE1ctico",
      students: 50,
      rating: 5
    }
  ];
  mockModules = [
    // Curso 1: Basico
    {
      id: "m1-1",
      course_id: "1",
      title: "M\xF3dulo 1: Fundamentos y Herramientas",
      description: "Introducci\xF3n a la electr\xF3nica, mult\xEDmetro, estaci\xF3n de calor.",
      order: 1
    },
    {
      id: "m1-2",
      course_id: "1",
      title: "M\xF3dulo 2: Desarme y Reconocimiento",
      description: "T\xE9cnicas de apertura, identificaci\xF3n de partes y buses.",
      order: 2
    },
    {
      id: "m1-3",
      course_id: "1",
      title: "M\xF3dulo 3: Pantallas y T\xE1ctiles",
      description: "Diferencias OLED/LCD, cambio de glass vs m\xF3dulo completo.",
      order: 3
    },
    {
      id: "m1-4",
      course_id: "1",
      title: "M\xF3dulo 4: Bater\xEDas y Carga",
      description: "Diagn\xF3stico de bater\xEDas, pines de carga y consumo.",
      order: 4
    },
    {
      id: "m1-5",
      course_id: "1",
      title: "M\xF3dulo 5: Software B\xE1sico",
      description: "Hard reset, flasheo y cuentas Google.",
      order: 5
    },
    // Curso 2: Microelectronica
    { id: "m2-1", course_id: "2", title: "M\xF3dulo 1: Lectura de Planos", description: "Schematics, boardview y seguimiento de l\xEDneas.", order: 1 },
    { id: "m2-2", course_id: "2", title: "M\xF3dulo 2: Soldadura SMD", description: "Manejo de componentes 0201, conectores FPC y blindajes.", order: 2 },
    { id: "m2-3", course_id: "2", title: "M\xF3dulo 3: Reballing", description: "T\xE9cnica de reballing para ICs de power, CPU y memoria.", order: 3 },
    { id: "m2-4", course_id: "2", title: "M\xF3dulo 4: Fallas de Encendido", description: "Consumos iniciales, secundarios y diagn\xF3stico con fuente.", order: 4 },
    // Curso 3: Electricidad
    { id: "m3-1", course_id: "3", title: "M\xF3dulo 1: Conceptos B\xE1sicos", description: "Ley de Ohm, corriente AC/DC, potencia y seguridad.", order: 1 },
    { id: "m3-2", course_id: "3", title: "M\xF3dulo 2: Herramientas y Empalmes", description: "Uso de pinzas, pelacables y tipos de uniones seguras.", order: 2 },
    { id: "m3-3", course_id: "3", title: "M\xF3dulo 3: Tableros y Protecciones", description: "Disyuntores, t\xE9rmicas y puesta a tierra.", order: 3 },
    { id: "m3-4", course_id: "3", title: "M\xF3dulo 4: Circuitos de Iluminaci\xF3n", description: "Llaves combinadas, fotoc\xE9lulas y sensores de movimiento.", order: 4 },
    { id: "m3-5", course_id: "3", title: "M\xF3dulo 5: Tomacorrientes y Fuerza", description: "C\xE1lculo de secciones de cables y distribuci\xF3n de cargas.", order: 5 }
  ];
  constructor(authService) {
    this.authService = authService;
    this.supabase = this.authService.getSupabaseClient();
  }
  getCourses() {
    return from(this.supabase.from("courses").select("id, title, slug, price, sale_price, level, is_active, image_url, created_at, duration, schedule").order("created_at", { ascending: false }).returns());
  }
  getCourseBySlug(slug) {
    return from(this.supabase.from("courses").select("*").eq("slug", slug).single()).pipe(map(({ data, error }) => {
      if (error || !data) {
        const mock = this.mockCourses.find((c) => c.slug === slug);
        return { data: mock || null, error: null, count: null, status: 200, statusText: "OK" };
      }
      return { data, error, count: null, status: 200, statusText: "OK" };
    }), catchError(() => {
      const mock = this.mockCourses.find((c) => c.slug === slug);
      return of({ data: mock || null, error: null, count: null, status: 200, statusText: "OK" });
    }));
  }
  getCourseById(id) {
    return from(this.supabase.from("courses").select("*").eq("id", id).single());
  }
  createCourse(course) {
    return from(this.supabase.from("courses").insert(course).select().single());
  }
  updateCourse(id, course) {
    return from(this.supabase.from("courses").update(course).eq("id", id).select().single());
  }
  deleteCourse(id) {
    return from(this.supabase.from("courses").delete().eq("id", id));
  }
  getModulesByCourseId(courseId) {
    return of({ data: this.mockModules, error: null });
  }
  async registerStudent(data) {
    if (data.course_id === "1") {
      await new Promise((resolve) => setTimeout(resolve, 1e3));
      return {
        data: __spreadProps(__spreadValues({}, data), { id: "mock-enrollment-id", status: "pending" }),
        error: null
      };
    }
    try {
      const { data: enrollment, error } = await this.supabase.from("course_enrollments").insert([{
        course_id: data.course_id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
        status: "pending",
        // Default status
        created_at: (/* @__PURE__ */ new Date()).toISOString()
      }]).select().single();
      if (error)
        throw error;
      return { data: enrollment, error: null };
    } catch (error) {
      console.error("Error registering student:", error);
      return { data: null, error };
    }
  }
  static \u0275fac = function CoursesService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CoursesService)(\u0275\u0275inject(AuthService));
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _CoursesService, factory: _CoursesService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CoursesService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], () => [{ type: AuthService }], null);
})();

export {
  CoursesService
};
//# sourceMappingURL=chunk-HK5ZMOOH.mjs.map
