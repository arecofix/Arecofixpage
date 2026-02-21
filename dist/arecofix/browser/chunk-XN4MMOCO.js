import {
  CoursesService
} from "./chunk-M3JCUFW6.js";
import {
  IsErrorComponent,
  IsLoadingComponent
} from "./chunk-UJ62XMW5.js";
import "./chunk-65AYZUFN.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  ɵNgNoValidate
} from "./chunk-DEVYQMPB.js";
import "./chunk-2IPP5M5M.js";
import {
  environment
} from "./chunk-TCBIYFRD.js";
import {
  ActivatedRoute,
  CommonModule,
  CurrencyPipe,
  DomSanitizer,
  NgIf,
  RouterLink,
  RouterModule
} from "./chunk-B7SLUDL7.js";
import {
  ChangeDetectorRef,
  Component,
  inject,
  setClassMetadata,
  switchMap,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵinterpolate1,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeResourceUrl,
  ɵɵsanitizeUrl,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-4O7IFJFV.js";
import {
  __spreadValues
} from "./chunk-GOMI4DH3.js";

// src/app/public/cursos/course-detail/course-detail.component.ts
var _forTrack0 = ($index, $item) => $item.job;
var _forTrack1 = ($index, $item) => $item.week;
var _forTrack2 = ($index, $item) => $item.text;
var _forTrack3 = ($index, $item) => $item.url;
var _forTrack4 = ($index, $item) => $item.question;
var _forTrack5 = ($index, $item) => $item.id;
function CourseDetailComponent_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 1);
    \u0275\u0275element(1, "is-loading");
    \u0275\u0275elementEnd();
  }
}
function CourseDetailComponent_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "is-error", 6);
    \u0275\u0275elementStart(2, "a", 7);
    \u0275\u0275text(3, "Volver a Cursos");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275property("message", ctx_r0.error || "Curso no encontrado");
  }
}
function CourseDetailComponent_Conditional_3_Conditional_19_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 20);
    \u0275\u0275element(1, "i", 65);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.course.rating, " ");
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_For_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 73)(1, "div", 157);
    \u0275\u0275element(2, "i", 158);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "span", 159);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r4);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_For_31_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 162);
    \u0275\u0275text(1, "Ganancia");
    \u0275\u0275elementEnd();
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_For_31_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 86)(1, "div", 160);
    \u0275\u0275element(2, "i", 161);
    \u0275\u0275conditionalCreate(3, CourseDetailComponent_Conditional_3_Conditional_43_For_31_Conditional_3_Template, 2, 0, "span", 162);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3", 61);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 163);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 164);
    \u0275\u0275text(9, "promedio por trabajo");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const roi_r5 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275conditional(roi_r5.earning ? 3 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(roi_r5.job);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(roi_r5.range);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_For_94_div_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 172);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_For_94_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 124)(1, "div", 165)(2, "div", 166);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275template(4, CourseDetailComponent_Conditional_3_Conditional_43_For_94_div_4_Template, 1, 0, "div", 167);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 168)(6, "span", 169);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h4", 170);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 171);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const step_r6 = ctx.$implicit;
    const $index_r7 = ctx.$index;
    const \u0275$index_282_r8 = ctx.$index;
    const \u0275$count_282_r9 = ctx.$count;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", $index_r7 + 1, " ");
    \u0275\u0275advance();
    \u0275\u0275property("ngIf", !(\u0275$index_282_r8 === \u0275$count_282_r9 - 1));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(step_r6.week);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r6.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r6.desc);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_For_111_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 132);
    \u0275\u0275element(1, "i");
    \u0275\u0275elementStart(2, "span", 173);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const inc_r10 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap(inc_r10.icon + " text-3xl text-gray-400 dark:text-gray-500 mb-3");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(inc_r10.text);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_For_118_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 137)(1, "div", 174);
    \u0275\u0275element(2, "img", 175);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 176)(4, "span", 177);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "h4", 178);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "span", 179);
    \u0275\u0275text(9, " Leer art\xEDculo completo ");
    \u0275\u0275element(10, "i", 180);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const news_r11 = ctx.$implicit;
    \u0275\u0275property("href", news_r11.url, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275property("src", news_r11.image, \u0275\u0275sanitizeUrl)("alt", news_r11.source);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(news_r11.source);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(news_r11.title);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_For_133_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 147);
    \u0275\u0275element(1, "input", 181);
    \u0275\u0275elementStart(2, "div", 182);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 183)(5, "p", 184);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const faq_r12 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", faq_r12.question, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(faq_r12.answer);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_43_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 33)(1, "div", 66)(2, "div", 67)(3, "h2", 68);
    \u0275\u0275text(4, "\xBFBuscas una profesi\xF3n con futuro?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 69);
    \u0275\u0275text(6, " La reparaci\xF3n de celulares es uno de los oficios m\xE1s rentables y demandados de la actualidad. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 70)(8, "div")(9, "h3", 71);
    \u0275\u0275text(10, "Este curso es para vos si:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "ul", 72);
    \u0275\u0275repeaterCreate(12, CourseDetailComponent_Conditional_3_Conditional_43_For_13_Template, 5, 1, "li", 73, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 74);
    \u0275\u0275element(15, "img", 75);
    \u0275\u0275elementStart(16, "div", 76)(17, "p", 77);
    \u0275\u0275text(18, '"Hoy tengo mi propio taller"');
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(19, "section", 78);
    \u0275\u0275element(20, "div", 79)(21, "div", 80);
    \u0275\u0275elementStart(22, "div", 81)(23, "span", 82);
    \u0275\u0275text(24, "Oportunidad de Negocio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "h2", 83);
    \u0275\u0275text(26, "Recupera tu inversi\xF3n en menos de un mes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "p", 84);
    \u0275\u0275text(28, " No necesitas miles de clientes. Con solo 3 o 4 reparaciones b\xE1sicas ya cubr\xEDs el costo del curso. El resto es ganancia pura. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(29, "div", 85);
    \u0275\u0275repeaterCreate(30, CourseDetailComponent_Conditional_3_Conditional_43_For_31_Template, 10, 3, "div", 86, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(32, "div", 87)(33, "div", 88);
    \u0275\u0275element(34, "img", 89);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(35, "div", 72)(36, "div", 90);
    \u0275\u0275element(37, "i", 91);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "h3", 92);
    \u0275\u0275text(39, "Metodolog\xEDa 100% Pr\xE1ctica");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "p", 93);
    \u0275\u0275text(41, " Creemos que la \xFAnica forma de aprender a reparar es reparando. Desde las primeras clases, trabajar\xE1s con equipos reales, mult\xEDmetros, estaciones de soldado y microscopios. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(42, "ul", 94)(43, "li", 95);
    \u0275\u0275element(44, "i", 96);
    \u0275\u0275text(45, " Diagn\xF3stico de placas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "li", 95);
    \u0275\u0275element(47, "i", 96);
    \u0275\u0275text(48, " Microsoldadura y reballing");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(49, "li", 95);
    \u0275\u0275element(50, "i", 96);
    \u0275\u0275text(51, " Cambio de m\xF3dulos y bater\xEDas");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(52, "div", 97)(53, "div", 98)(54, "div", 99)(55, "span", 100);
    \u0275\u0275text(56, "Mentoria Experta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(57, "h3", 101);
    \u0275\u0275text(58, "Aprende de los Mejores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(59, "p", 102);
    \u0275\u0275text(60, " Nuestros instructores son t\xE9cnicos activos con a\xF1os de experiencia en el rubro. Transmiten los secretos del oficio que no est\xE1n en los libros. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "div", 103)(62, "div", 104);
    \u0275\u0275element(63, "div", 105)(64, "div", 106)(65, "div", 107);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "span", 108);
    \u0275\u0275text(67, "Acompa\xF1amiento personalizado");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(68, "div", 109);
    \u0275\u0275element(69, "img", 110);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(70, "div", 87)(71, "div", 111)(72, "div", 112);
    \u0275\u0275element(73, "i", 113);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "h3", 92);
    \u0275\u0275text(75, "Instalaciones Profesionales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(76, "p", 93);
    \u0275\u0275text(77, " Laboratorios equipados simulando un entorno real de trabajo. ");
    \u0275\u0275element(78, "br");
    \u0275\u0275elementStart(79, "span", 114);
    \u0275\u0275text(80, "* Clases en sedes equipadas (CIC, Puntos Digitales, y Aulas Propias).");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(81, "div", 115);
    \u0275\u0275element(82, "img", 116);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(83, "div", 117)(84, "div", 118)(85, "div", 119)(86, "h3", 120);
    \u0275\u0275text(87, "Plan de Estudio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(88, "p", 121);
    \u0275\u0275text(89, " Un programa dise\xF1ado paso a paso para llevarte de cero a experto. Sin rellenos, directo a la pr\xE1ctica. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "button", 122);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Conditional_43_Template_button_click_90_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.activeTab = "temario");
    });
    \u0275\u0275text(91, " Ver Temario Completo ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(92, "div", 123);
    \u0275\u0275repeaterCreate(93, CourseDetailComponent_Conditional_3_Conditional_43_For_94_Template, 12, 5, "div", 124, _forTrack1);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(95, "div", 125)(96, "div", 87)(97, "div", 126);
    \u0275\u0275element(98, "img", 127);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(99, "div")(100, "h3", 120);
    \u0275\u0275text(101, "M\xE1s que un Curso, una Comunidad");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(102, "p", 128);
    \u0275\u0275text(103, " Participa de foros, grupos de WhatsApp exclusivos y actualizaciones constantes. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "button", 129);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Conditional_43_Template_button_click_104_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.activeTab = "testimonios");
    });
    \u0275\u0275text(105, "Ver Testimonios de Alumni");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(106, "div")(107, "h2", 130);
    \u0275\u0275text(108, "Todo lo que incluye tu inscripci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(109, "div", 131);
    \u0275\u0275repeaterCreate(110, CourseDetailComponent_Conditional_3_Conditional_43_For_111_Template, 4, 3, "div", 132, _forTrack2);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(112, "div", 133)(113, "h3", 134);
    \u0275\u0275element(114, "i", 135);
    \u0275\u0275text(115, " Arecofix en los medios ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(116, "div", 136);
    \u0275\u0275repeaterCreate(117, CourseDetailComponent_Conditional_3_Conditional_43_For_118_Template, 11, 5, "a", 137, _forTrack3);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(119, "div", 138)(120, "div", 139)(121, "div", 140);
    \u0275\u0275element(122, "i", 141);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(123, "div", 142)(124, "h3", 143);
    \u0275\u0275text(125, "Garant\xEDa de Confianza Arecofix");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(126, "p", 144);
    \u0275\u0275text(127, " Estamos tan seguros de nuestra calidad educativa que te ofrecemos una garant\xEDa de aprendizaje. Si sent\xEDs que necesitas reforzar alg\xFAn tema, podr\xE1s asistir a clases de repaso sin costo adicional hasta que domines la t\xE9cnica. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(128, "div", 145)(129, "h2", 146);
    \u0275\u0275text(130, "Preguntas Frecuentes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(131, "div", 72);
    \u0275\u0275repeaterCreate(132, CourseDetailComponent_Conditional_3_Conditional_43_For_133_Template, 7, 2, "div", 147, _forTrack4);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(134, "div", 148)(135, "h3", 149);
    \u0275\u0275text(136, "\xBFEst\xE1s listo para dar el siguiente paso?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(137, "div", 150)(138, "button", 151);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Conditional_43_Template_button_click_138_listener() {
      \u0275\u0275restoreView(_r3);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.openRegistration());
    });
    \u0275\u0275text(139, " Quiero Reservar mi Lugar ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(140, "a", 152);
    \u0275\u0275element(141, "i", 64);
    \u0275\u0275text(142, " Hablar con un Asesor ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(143, "p", 153);
    \u0275\u0275text(144, "Cupos limitados por disponibilidad de laboratorio.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(145, "div", 154);
    \u0275\u0275element(146, "img", 155);
    \u0275\u0275elementStart(147, "p", 156)(148, "strong");
    \u0275\u0275text(149, "Instructor Certificado:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(150, " Ezequiel. Especialista en microsoldadura y reparaci\xF3n de dispositivos m\xF3viles con m\xE1s de 10 a\xF1os de experiencia en el gremio. ");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(12);
    \u0275\u0275repeater(ctx_r0.audienceList);
    \u0275\u0275advance(18);
    \u0275\u0275repeater(ctx_r0.roiExamples);
    \u0275\u0275advance(63);
    \u0275\u0275repeater(ctx_r0.syllabusTimeline);
    \u0275\u0275advance(17);
    \u0275\u0275repeater(ctx_r0.inclusions);
    \u0275\u0275advance(7);
    \u0275\u0275repeater(ctx_r0.pressLinks);
    \u0275\u0275advance(15);
    \u0275\u0275repeater(ctx_r0.faqs);
    \u0275\u0275advance(8);
    \u0275\u0275property("href", "https://wa.me/" + ctx_r0.whatsappNumber, \u0275\u0275sanitizeUrl);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_44_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "is-loading");
  }
}
function CourseDetailComponent_Conditional_3_Conditional_44_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 186);
    \u0275\u0275text(1, " No hay m\xF3dulos cargados para este curso a\xFAn. ");
    \u0275\u0275elementEnd();
  }
}
function CourseDetailComponent_Conditional_3_Conditional_44_Conditional_5_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 187);
    \u0275\u0275element(1, "input", 188);
    \u0275\u0275elementStart(2, "div", 189)(3, "span", 190);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 183)(7, "p", 191);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const module_r13 = ctx.$implicit;
    const $index_r14 = ctx.$index;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", $index_r14 + 1, " ");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", module_r13.title, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(module_r13.description);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_44_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 72);
    \u0275\u0275repeaterCreate(1, CourseDetailComponent_Conditional_3_Conditional_44_Conditional_5_For_2_Template, 9, 3, "div", 187, _forTrack5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.modules);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "h2", 185);
    \u0275\u0275text(2, "Contenido del Curso");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(3, CourseDetailComponent_Conditional_3_Conditional_44_Conditional_3_Template, 1, 0, "is-loading")(4, CourseDetailComponent_Conditional_3_Conditional_44_Conditional_4_Template, 2, 0, "div", 186)(5, CourseDetailComponent_Conditional_3_Conditional_44_Conditional_5_Template, 3, 0, "div", 72);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(ctx_r0.loadingModules ? 3 : ctx_r0.modules.length === 0 ? 4 : 5);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_45_For_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 193);
    \u0275\u0275element(1, "img", 194)(2, "div", 195);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const img_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", img_r15, \u0275\u0275sanitizeUrl);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_45_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "h2", 185);
    \u0275\u0275text(2, "Galer\xEDa de Clases");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 192);
    \u0275\u0275repeaterCreate(4, CourseDetailComponent_Conditional_3_Conditional_45_For_5_Template, 3, 1, "div", 193, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r0.galleryImages);
  }
}
function CourseDetailComponent_Conditional_3_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 34)(1, "h2", 185);
    \u0275\u0275text(2, "Lo que dicen nuestros alumnos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 196)(4, "div", 197);
    \u0275\u0275element(5, "iframe", 198);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 199);
    \u0275\u0275text(7, " Mira c\xF3mo nuestros alumnos aplican lo aprendido en clase (Video gentileza Municipio de Marcos Paz) ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 136)(9, "div", 200)(10, "div", 73)(11, "div", 201);
    \u0275\u0275text(12, '"');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(13, "div")(14, "p", 202);
    \u0275\u0275text(15, " Incre\xEDble experiencia. No solo aprend\xED a reparar, sino que me dieron las herramientas para montar mi propio negocio. Hoy vivo de esto. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 203)(17, "div", 204);
    \u0275\u0275text(18, " MR ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div")(20, "h4", 205);
    \u0275\u0275text(21, "Mart\xEDn Rodriguez");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "p", 206);
    \u0275\u0275text(23, "Egresado 2024");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(24, "div", 207)(25, "div", 73)(26, "div", 201);
    \u0275\u0275text(27, '"');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div")(29, "p", 202);
    \u0275\u0275text(30, " Los profesores explican con mucha paciencia y la pr\xE1ctica es constante. Me sent\xED muy c\xF3modo desde el primer d\xEDa. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "div", 203)(32, "div", 208);
    \u0275\u0275text(33, " LZ ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(34, "div")(35, "h4", 205);
    \u0275\u0275text(36, "Lucas Zarate");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "p", 206);
    \u0275\u0275text(38, "Alumno Nivel B\xE1sico");
    \u0275\u0275elementEnd()()()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(5);
    \u0275\u0275property("src", ctx_r0.getVideoUrl(), \u0275\u0275sanitizeResourceUrl);
  }
}
function CourseDetailComponent_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 8)(1, "div", 9);
    \u0275\u0275element(2, "img", 10)(3, "div", 11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 12)(5, "div", 13)(6, "div", 14)(7, "ul")(8, "li")(9, "a", 15);
    \u0275\u0275text(10, "Inicio");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "li")(12, "a", 16);
    \u0275\u0275text(13, "Cursos");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "li", 17);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "div", 18)(17, "span", 19);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(19, CourseDetailComponent_Conditional_3_Conditional_19_Template, 3, 1, "span", 20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "h1", 21);
    \u0275\u0275text(21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(22, "p", 22);
    \u0275\u0275text(23);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 23)(25, "button", 24);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openRegistration());
    });
    \u0275\u0275element(26, "i", 25);
    \u0275\u0275text(27, " Inscribirme al Curso ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "a", 26);
    \u0275\u0275element(29, "i", 27);
    \u0275\u0275text(30, " Acceder al Curso ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(31, "div", 28)(32, "div", 29)(33, "div", 30)(34, "div", 31)(35, "button", 32);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Template_button_click_35_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.activeTab = "info");
    });
    \u0275\u0275text(36, " Informaci\xF3n ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "button", 32);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Template_button_click_37_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.activeTab = "temario");
    });
    \u0275\u0275text(38, " Temario ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(39, "button", 32);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Template_button_click_39_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.activeTab = "galeria");
    });
    \u0275\u0275text(40, " Galer\xEDa ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(41, "button", 32);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Template_button_click_41_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.activeTab = "testimonios");
    });
    \u0275\u0275text(42, " Testimonios ");
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(43, CourseDetailComponent_Conditional_3_Conditional_43_Template, 151, 1, "div", 33);
    \u0275\u0275conditionalCreate(44, CourseDetailComponent_Conditional_3_Conditional_44_Template, 6, 1, "div", 34);
    \u0275\u0275conditionalCreate(45, CourseDetailComponent_Conditional_3_Conditional_45_Template, 6, 0, "div", 34);
    \u0275\u0275conditionalCreate(46, CourseDetailComponent_Conditional_3_Conditional_46_Template, 39, 1, "div", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(47, "div", 35)(48, "div", 36)(49, "div", 37)(50, "span", 38);
    \u0275\u0275text(51, "Precio del Curso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "div", 39);
    \u0275\u0275text(53);
    \u0275\u0275pipe(54, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(55, "span", 40);
    \u0275\u0275text(56, "Pago \xFAnico o en cuotas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(57, "div", 41)(58, "div", 42)(59, "div", 43);
    \u0275\u0275element(60, "i", 44);
    \u0275\u0275elementStart(61, "span");
    \u0275\u0275text(62, "Duraci\xF3n");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(63, "span", 45);
    \u0275\u0275text(64);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(65, "div", 42)(66, "div", 43);
    \u0275\u0275element(67, "i", 46);
    \u0275\u0275elementStart(68, "span");
    \u0275\u0275text(69, "Horario");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(70, "span", 47);
    \u0275\u0275text(71);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(72, "div", 42)(73, "div", 43);
    \u0275\u0275element(74, "i", 48);
    \u0275\u0275elementStart(75, "span");
    \u0275\u0275text(76, "Modalidad");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(77, "div", 49)(78, "span", 50);
    \u0275\u0275text(79, "Presencial + Virtual");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "span", 51);
    \u0275\u0275text(81, "\xA1Incluye Aula Virtual!");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(82, "div", 52)(83, "h4", 53);
    \u0275\u0275element(84, "i", 54);
    \u0275\u0275text(85, "Capacitaci\xF3n H\xEDbrida");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(86, "p", 55);
    \u0275\u0275text(87, " Adem\xE1s de las clases presenciales, tendr\xE1s acceso a nuestra ");
    \u0275\u0275elementStart(88, "strong");
    \u0275\u0275text(89, "Aula Virtual");
    \u0275\u0275elementEnd();
    \u0275\u0275text(90, " exclusiva y soporte mediante ");
    \u0275\u0275elementStart(91, "strong");
    \u0275\u0275text(92, "Google Meet");
    \u0275\u0275elementEnd();
    \u0275\u0275text(93, ". ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "ul", 56)(95, "li");
    \u0275\u0275element(96, "i", 57);
    \u0275\u0275text(97, "Clases grabadas de repaso");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(98, "li");
    \u0275\u0275element(99, "i", 57);
    \u0275\u0275text(100, "Material PDF descargable");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "li");
    \u0275\u0275element(102, "i", 57);
    \u0275\u0275text(103, "Consultas en vivo online");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(104, "button", 58);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_3_Template_button_click_104_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.openRegistration());
    });
    \u0275\u0275text(105, " Inscribirme Ahora ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(106, "p", 59);
    \u0275\u0275text(107, "Cupos limitados. Reserva tu lugar hoy.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(108, "div", 60)(109, "h3", 61);
    \u0275\u0275text(110, "\xBFTienes dudas?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(111, "p", 62);
    \u0275\u0275text(112, "Habla con un asesor educativo ahora mismo.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(113, "a", 63);
    \u0275\u0275element(114, "i", 64);
    \u0275\u0275text(115, " Chatear ");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(2);
    \u0275\u0275property("src", ctx_r0.course.image_url, \u0275\u0275sanitizeUrl)("alt", ctx_r0.course.title);
    \u0275\u0275advance(13);
    \u0275\u0275textInterpolate(ctx_r0.course.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(ctx_r0.course.level);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.course.rating ? 19 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.course.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r0.course.description, " ");
    \u0275\u0275advance(12);
    \u0275\u0275classProp("bg-indigo-50", ctx_r0.activeTab === "info")("text-indigo-600", ctx_r0.activeTab === "info")("dark:bg-gray-700", ctx_r0.activeTab === "info")("dark:text-white", ctx_r0.activeTab === "info");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-indigo-50", ctx_r0.activeTab === "temario")("text-indigo-600", ctx_r0.activeTab === "temario")("dark:bg-gray-700", ctx_r0.activeTab === "temario")("dark:text-white", ctx_r0.activeTab === "temario");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-indigo-50", ctx_r0.activeTab === "galeria")("text-indigo-600", ctx_r0.activeTab === "galeria")("dark:bg-gray-700", ctx_r0.activeTab === "galeria")("dark:text-white", ctx_r0.activeTab === "galeria");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-indigo-50", ctx_r0.activeTab === "testimonios")("text-indigo-600", ctx_r0.activeTab === "testimonios")("dark:bg-gray-700", ctx_r0.activeTab === "testimonios")("dark:text-white", ctx_r0.activeTab === "testimonios");
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.activeTab === "info" ? 43 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.activeTab === "temario" ? 44 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.activeTab === "galeria" ? 45 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.activeTab === "testimonios" ? 46 : -1);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(54, 47, ctx_r0.course.price));
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r0.course.duration);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.course.schedule);
    \u0275\u0275advance(42);
    \u0275\u0275property("href", "https://wa.me/" + ctx_r0.whatsappNumber, \u0275\u0275sanitizeUrl);
  }
}
function CourseDetailComponent_Conditional_4_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    const _r17 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 215);
    \u0275\u0275element(1, "i", 218);
    \u0275\u0275elementStart(2, "h3", 219);
    \u0275\u0275text(3, "\xA1Pre-inscripci\xF3n realizada!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "p", 220);
    \u0275\u0275text(5, "Para confirmar tu vacante, por favor realiza el pago:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 221)(7, "p", 222);
    \u0275\u0275text(8, "Datos Bancarios:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "p", 223);
    \u0275\u0275text(10, "Alias: ");
    \u0275\u0275elementStart(11, "span", 224);
    \u0275\u0275text(12, "arecofix");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(13, "p", 225);
    \u0275\u0275text(14, "CBU: ");
    \u0275\u0275elementStart(15, "span", 224);
    \u0275\u0275text(16, "ecocell");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(17, "p", 226);
    \u0275\u0275text(18, " Una vez realizado el pago, env\xEDa el comprobante al: ");
    \u0275\u0275element(19, "br");
    \u0275\u0275elementStart(20, "strong", 227);
    \u0275\u0275text(21, "+54 9 11 2596-0900");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(22, "a", 228);
    \u0275\u0275element(23, "i", 229);
    \u0275\u0275text(24, " Enviar Comprobante ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "button", 230);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_4_Conditional_9_Template_button_click_25_listener() {
      \u0275\u0275restoreView(_r17);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.closeRegistration());
    });
    \u0275\u0275text(26, "Cerrar");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(22);
    \u0275\u0275property("href", \u0275\u0275interpolate1("https://wa.me/5491125960900?text=Hola,%20adjunto%20comprobante%20de%20pago%20para%20el%20curso%20", ctx_r0.course == null ? null : ctx_r0.course.title), \u0275\u0275sanitizeUrl);
  }
}
function CourseDetailComponent_Conditional_4_Conditional_10_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 237);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r0.registrationError);
  }
}
function CourseDetailComponent_Conditional_4_Conditional_10_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 240);
  }
}
function CourseDetailComponent_Conditional_4_Conditional_10_Template(rf, ctx) {
  if (rf & 1) {
    const _r18 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "form", 72)(1, "div")(2, "label", 231);
    \u0275\u0275text(3, "Nombre Completo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "input", 232);
    \u0275\u0275twoWayListener("ngModelChange", function CourseDetailComponent_Conditional_4_Conditional_10_Template_input_ngModelChange_4_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.registrationForm.full_name, $event) || (ctx_r0.registrationForm.full_name = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(5, "div")(6, "label", 233);
    \u0275\u0275text(7, "Email");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "input", 234);
    \u0275\u0275twoWayListener("ngModelChange", function CourseDetailComponent_Conditional_4_Conditional_10_Template_input_ngModelChange_8_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.registrationForm.email, $event) || (ctx_r0.registrationForm.email = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div")(10, "label", 235);
    \u0275\u0275text(11, "Tel\xE9fono / WhatsApp");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "input", 236);
    \u0275\u0275twoWayListener("ngModelChange", function CourseDetailComponent_Conditional_4_Conditional_10_Template_input_ngModelChange_12_listener($event) {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.registrationForm.phone, $event) || (ctx_r0.registrationForm.phone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(13, CourseDetailComponent_Conditional_4_Conditional_10_Conditional_13_Template, 2, 1, "p", 237);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 238)(15, "button", 239);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_4_Conditional_10_Template_button_click_15_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.submitRegistration());
    });
    \u0275\u0275conditionalCreate(16, CourseDetailComponent_Conditional_4_Conditional_10_Conditional_16_Template, 1, 0, "span", 240);
    \u0275\u0275text(17);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "button", 241);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_4_Conditional_10_Template_button_click_18_listener() {
      \u0275\u0275restoreView(_r18);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.closeRegistration());
    });
    \u0275\u0275text(19, " Cancelar ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.registrationForm.full_name);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.registrationForm.email);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.registrationForm.phone);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.registrationError ? 13 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275property("disabled", ctx_r0.registering);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.registering ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r0.registering ? "Enviando..." : "Confirmar Inscripci\xF3n", " ");
  }
}
function CourseDetailComponent_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r16 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "dialog", 209);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_4_Template_dialog_click_0_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRegistration());
    });
    \u0275\u0275elementStart(1, "div", 210);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_4_Template_div_click_1_listener($event) {
      \u0275\u0275restoreView(_r16);
      return \u0275\u0275resetView($event.stopPropagation());
    });
    \u0275\u0275elementStart(2, "button", 211);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_4_Template_button_click_2_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRegistration());
    });
    \u0275\u0275text(3, "\u2715");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3", 212);
    \u0275\u0275text(5, " Inscripci\xF3n al curso ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 213);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 214);
    \u0275\u0275conditionalCreate(9, CourseDetailComponent_Conditional_4_Conditional_9_Template, 27, 2, "div", 215)(10, CourseDetailComponent_Conditional_4_Conditional_10_Template, 20, 7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "form", 216)(12, "button", 217);
    \u0275\u0275listener("click", function CourseDetailComponent_Conditional_4_Template_button_click_12_listener() {
      \u0275\u0275restoreView(_r16);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.closeRegistration());
    });
    \u0275\u0275text(13, "close");
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.course == null ? null : ctx_r0.course.title);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(ctx_r0.registrationSuccess ? 9 : 10);
  }
}
var CourseDetailComponent = class _CourseDetailComponent {
  route = inject(ActivatedRoute);
  coursesService = inject(CoursesService);
  cd = inject(ChangeDetectorRef);
  sanitizer = inject(DomSanitizer);
  course = null;
  loading = true;
  error = null;
  // Registration
  whatsappNumber = environment.contact.whatsappNumber;
  showRegistrationModal = false;
  registrationForm = { full_name: "", email: "", phone: "" };
  registering = false;
  registrationSuccess = false;
  registrationError = null;
  // Tabs
  activeTab = "info";
  // info, temario, galeria, testimonios
  // Modules (Syllabus)
  modules = [];
  loadingModules = false;
  // Static Content
  galleryImages = [
    "assets/img/cursos/academy/aprender.jpeg",
    "assets/img/cursos/academy/capacitaciones.jpeg",
    "assets/img/cursos/academy/cic.jpeg",
    "assets/img/cursos/academy/profe_de_reparacion-de-celulares.jpeg",
    "assets/img/cursos/academy/eddis_educativa.jpeg",
    "assets/img/cursos/academy/salida_laboral_propia.jpeg",
    "assets/img/cursos/academy/diploma.jpeg",
    "assets/img/cursos/academy/cursos.jpeg",
    "assets/img/cursos/academy/donde_ense\xF1an_reparacion_de_celulares.jpeg"
  ];
  pressLinks = [
    {
      title: "J\xF3venes del programa Envi\xF3n finalizaron el curso",
      source: "Municipio de Marcos Paz",
      url: "https://www.marcospaz-gob-ar.marcospaz.net/noticias/item/8551-j%C3%B3venes-del-programa-envi%C3%B3n-finalizaron-el-curso-de-reparaci%C3%B3n-de-celulares.html",
      image: "assets/img/cursos/municipio.jpg",
      // Verified as existing in root cursos folder
      date: "Reciente"
    },
    {
      title: "Alumnos de Envi\xF3n se capacitan en reparaci\xF3n",
      source: "A1 Noticias",
      url: "https://a1noticias.com.ar/nota/9798/marcos-paz-jovenes-del-programa-envion-finalizaron-el-curso-de-reparacion-de-celulares",
      image: "assets/img/cursos/academy/diploma.jpeg",
      // Verified as in academy folder
      date: "Reciente"
    }
  ];
  // Sales Content Types
  audienceList = [
    "No ten\xE9s experiencia pero quer\xE9s una salida laboral r\xE1pida.",
    "Ya repar\xE1s celulares pero quer\xE9s subir de nivel.",
    "Quer\xE9s trabajar desde tu casa o armar tu propio taller.",
    "Busc\xE1s independizarte y tener horarios flexibles.",
    "Quer\xE9s un trabajo rentable sin depender de terceros."
  ];
  benefitsList = [
    { icon: "fas fa-microscope", text: "Laboratorio real equipado con microscopios y estaciones." },
    { icon: "fas fa-hands-on", text: "Clases 100% pr\xE1cticas desde el d\xEDa 1." },
    { icon: "fas fa-user-tie", text: "Instructor con experiencia real en taller." },
    { icon: "fas fa-certificate", text: "Certificado con validez y matr\xEDcula." },
    { icon: "fas fa-users", text: "Bolsa de trabajo y comunidad de alumnos." },
    { icon: "fas fa-video", text: "Acceso a Aula Virtual con material premium." }
  ];
  syllabusTimeline = [
    { week: "Semana 1", title: "Fundamentos y Desarme", desc: "Conceptos, herramientas, seguridad y desarme de equipos." },
    { week: "Semana 2", title: "Diagn\xF3stico Inicial", desc: "Manejo de mult\xEDmetro, fuentes y detecci\xF3n de fallas comunes." },
    { week: "Semana 3", title: "Reparaciones Modulares", desc: "Cambio de pantallas, bater\xEDas, c\xE1maras y perif\xE9ricos." },
    { week: "Semana 4", title: "Electr\xF3nica Aplicada", desc: "Medici\xF3n de componentes, cortos y fugas en placa." },
    { week: "Semana 5", title: "Microsoldadura I", desc: "Pin de carga, botones, micr\xF3fonos y t\xE9cnica de soldado." },
    { week: "Semana 6", title: "Software", desc: "Flasheo, desbloqueo, cuentas Google y sistemas operativos." },
    { week: "Semana 7", title: "Pr\xE1ctica Real", desc: "Trabajos con equipos reales tra\xEDdos por los alumnos." },
    { week: "Semana 8", title: "Examen Final", desc: "Evaluaci\xF3n te\xF3rica-pr\xE1ctica y entrega de certificados." }
  ];
  roiExamples = [
    { job: "Cambio de M\xF3dulo", range: "$15.000 \u2013 $40.000", earning: true },
    { job: "Cambio de Bater\xEDa", range: "$8.000 \u2013 $20.000", earning: true },
    { job: "Cambio de Pin de Carga", range: "$10.000 \u2013 $30.000", earning: true },
    { job: "Limpieza de Software/Flasheo", range: "$5.000 \u2013 $15.000", earning: true }
  ];
  inclusions = [
    { icon: "fas fa-laptop", text: "Aula Virtual 24/7" },
    { icon: "fas fa-file-pdf", text: "Material PDF" },
    { icon: "fas fa-video", text: "Clases Grabadas" },
    { icon: "fas fa-certificate", text: "Certificado Oficial" },
    { icon: "fas fa-users", text: "Comunidad VIP" },
    { icon: "fas fa-briefcase", text: "Bolsa de Trabajo" }
  ];
  faqs = [
    { question: "\xBFNecesito experiencia previa?", answer: "No, el curso inicia desde cero absoluto. Te guiamos paso a paso." },
    { question: "\xBFQu\xE9 herramientas necesito?", answer: "Durante la cursada proveemos todo en el taller. Solo necesitas ganas de aprender." },
    { question: "\xBFRealmente voy a poder reparar despu\xE9s?", answer: "S\xED. El enfoque es 100% pr\xE1ctico para que salgas con la confianza de trabajar." },
    { question: "\xBFEntregan certificado?", answer: "S\xED, entregamos certificado de asistencia y aprobaci\xF3n al finalizar el curso." },
    { question: "\xBFPuedo pagar en cuotas?", answer: "S\xED, aceptamos todas las tarjetas y ofrecemos financiaci\xF3n propia." }
  ];
  getVideoUrl() {
    return this.sanitizer.bypassSecurityTrustResourceUrl("https://www.youtube.com/embed/l93eYkGMxsI?start=45");
  }
  ngOnInit() {
    this.route.paramMap.pipe(switchMap((params) => {
      const slug = params.get("slug");
      if (!slug)
        throw new Error("Cuso no encontrado");
      this.loading = true;
      return this.coursesService.getCourseBySlug(slug);
    })).subscribe({
      next: (response) => {
        if (response.error || !response.data) {
          this.error = "Curso no encontrado";
          this.loading = false;
          this.cd.detectChanges();
        } else {
          const courseData = response.data;
          if (courseData && courseData.image_url && courseData.image_url.includes("curso-reparacion-de-celulares.jpg")) {
            courseData.image_url = "assets/img/cursos/academy/curso-reparacion-de-celulares.jpg";
          }
          if (courseData && courseData.slug === "reparacion-celulares-basico") {
            courseData.schedule = "Lunes y Mi\xE9rcoles 18:00-21:00";
          }
          this.course = courseData;
          this.loadModules(this.course.id);
          this.loading = false;
          this.cd.detectChanges();
        }
      },
      error: (err) => {
        this.error = "Error al cargar el curso.";
        this.loading = false;
        this.cd.detectChanges();
      }
    });
  }
  loadModules(courseId) {
    this.loadingModules = true;
    this.coursesService.getModulesByCourseId(courseId).subscribe({
      next: (res) => {
        this.modules = res.data || [];
        this.loadingModules = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.loadingModules = false;
        this.cd.detectChanges();
      }
    });
  }
  /*
  loadModules(courseId: string) {
      this.loadingModules = true;
      this.coursesService.getModulesByCourseId(courseId).subscribe({
          next: (res) => {
              this.modules = res.data || [];
              this.loadingModules = false;
          },
          error: (err) => {
              // Suppress error to avoid console noise for missing table
              // console.error('Error loading modules:', err);
              this.loadingModules = false;
          }
      });
  }
  */
  openRegistration() {
    this.showRegistrationModal = true;
    this.registrationSuccess = false;
    this.registrationError = null;
    this.registrationForm = { full_name: "", email: "", phone: "" };
  }
  closeRegistration() {
    this.showRegistrationModal = false;
  }
  async submitRegistration() {
    if (!this.course || !this.registrationForm.full_name || !this.registrationForm.email || !this.registrationForm.phone) {
      this.registrationError = "Por favor completa todos los campos.";
      return;
    }
    this.registering = true;
    this.registrationError = null;
    this.cd.detectChanges();
    try {
      const response = await this.coursesService.registerStudent(__spreadValues({
        course_id: this.course.id
      }, this.registrationForm));
      if (response.error) {
        this.registrationError = "Error al registrarse. Intenta nuevamente.";
        console.error("Registration failed:", response.error);
      } else {
        this.registrationSuccess = true;
      }
    } catch (err) {
      console.error("Registration unexpected error:", err);
      this.registrationError = "Error de conexi\xF3n/inesperado.";
    } finally {
      this.registering = false;
      this.cd.detectChanges();
    }
  }
  static \u0275fac = function CourseDetailComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CourseDetailComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CourseDetailComponent, selectors: [["app-course-detail"]], decls: 7, vars: 3, consts: [[1, "min-h-screen", "bg-gray-50", "dark:bg-gray-900", "pb-12"], [1, "flex", "justify-center", "items-center", "h-screen"], [1, "container", "mx-auto", "px-4", "py-20", "text-center"], [1, "modal", "modal-open", "modal-bottom", "sm:modal-middle"], ["target", "_blank", "aria-label", "Chat en WhatsApp", 1, "fixed", "bottom-6", "right-6", "z-50", "bg-green-500", "hover:bg-green-600", "text-white", "w-14", "h-14", "rounded-full", "shadow-2xl", "flex", "items-center", "justify-center", "transition-transform", "hover:scale-110", "animate-bounce-slow", 3, "href"], [1, "fab", "fa-whatsapp", "text-3xl"], [3, "message"], ["routerLink", "/academy", 1, "btn", "btn-primary", "mt-4"], [1, "relative", "bg-gray-900", "text-white", "py-16", "overflow-hidden"], [1, "absolute", "inset-0"], [1, "w-full", "h-full", "object-cover", "opacity-30", "blur-sm", 3, "src", "alt"], [1, "absolute", "inset-0", "bg-linear-to-t", "from-gray-900", "to-transparent"], [1, "relative", "container", "mx-auto", "px-4"], [1, "max-w-4xl"], [1, "text-sm", "breadcrumbs", "text-gray-300", "mb-6"], ["routerLink", "/"], ["routerLink", "/academy"], [1, "font-semibold", "text-white"], [1, "flex", "flex-wrap", "gap-2", "mb-4"], [1, "bg-indigo-600", "text-white", "px-3", "py-1", "rounded-full", "text-xs", "font-bold", "uppercase", "tracking-wide"], [1, "bg-yellow-500/20", "text-yellow-300", "border", "border-yellow-500/30", "px-3", "py-1", "rounded-full", "text-xs", "font-bold", "flex", "items-center"], [1, "text-4xl", "md:text-5xl", "font-bold", "mb-6", "tracking-tight", "leading-tight"], [1, "text-xl", "text-gray-200", "mb-8", "max-w-2xl", "leading-relaxed"], [1, "flex", "flex-col", "sm:flex-row", "gap-4", "mt-8"], [1, "btn", "btn-primary", "bg-indigo-600", "border-none", "hover:bg-indigo-500", "text-white", "px-8", "h-12", "text-lg", "shadow-lg", "shadow-indigo-500/30", 3, "click"], [1, "fas", "fa-pen-nib", "mr-2"], ["routerLink", "/login", 1, "btn", "btn-outline", "text-white", "hover:bg-white", "hover:text-gray-900", "border-white/30", "h-12", "px-8", "text-lg"], [1, "fas", "fa-laptop-code", "mr-2"], [1, "container", "mx-auto", "px-4", "-mt-8", "relative", "z-10"], [1, "grid", "grid-cols-1", "lg:grid-cols-3", "gap-8"], [1, "lg:col-span-2", "space-y-8"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700", "p-2", "flex", "overflow-x-auto"], [1, "flex-1", "py-3", "px-6", "rounded-lg", "font-medium", "text-sm", "transition-colors", "whitespace-nowrap", "text-gray-600", "dark:text-gray-300", 3, "click"], [1, "space-y-16", "fade-in", "pb-12"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700", "p-8", "fade-in"], [1, "lg:col-span-1", "space-y-6"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700", "p-6", "sticky", "top-24"], [1, "text-center", "mb-6"], [1, "text-gray-500", "dark:text-gray-400", "text-sm", "uppercase", "tracking-wide"], [1, "text-4xl", "font-bold", "text-gray-900", "dark:text-white", "my-2"], [1, "text-sm", "text-gray-500", "dark:text-gray-400"], [1, "space-y-4", "mb-8"], [1, "flex", "items-center", "justify-between", "p-3", "bg-gray-50", "dark:bg-gray-700/50", "rounded-lg"], [1, "flex", "items-center", "text-gray-600", "dark:text-gray-300"], [1, "fas", "fa-calendar-alt", "w-8", "text-indigo-500"], [1, "font-semibold", "text-gray-900", "dark:text-white"], [1, "fas", "fa-clock", "w-8", "text-indigo-500"], [1, "font-semibold", "text-gray-900", "dark:text-white", "text-right", "text-sm", "max-w-[150px]"], [1, "fas", "fa-map-marker-alt", "w-8", "text-indigo-500"], [1, "text-right"], [1, "block", "font-semibold", "text-gray-900", "dark:text-white"], [1, "text-xs", "text-green-600", "font-medium"], [1, "bg-indigo-50", "dark:bg-gray-700", "p-4", "rounded-lg", "mb-6", "text-sm"], [1, "font-bold", "text-indigo-700", "dark:text-indigo-300", "mb-2"], [1, "fas", "fa-laptop-house", "mr-2"], [1, "text-gray-600", "dark:text-gray-300", "mb-2"], [1, "space-y-1", "text-gray-500", "dark:text-gray-400"], [1, "fas", "fa-check", "text-green-500", "mr-2"], [1, "w-full", "btn", "btn-primary", "bg-indigo-600", "hover:bg-indigo-500", "border-none", "text-white", "mb-3", 3, "click"], [1, "text-xs", "text-center", "text-gray-500"], [1, "bg-linear-to-br", "from-indigo-600", "to-purple-700", "rounded-xl", "shadow-lg", "p-6", "text-white", "text-center"], [1, "font-bold", "text-lg", "mb-2"], [1, "text-indigo-100", "text-sm", "mb-4"], ["target", "_blank", 1, "btn", "bg-white", "text-indigo-600", "hover:bg-gray-100", "border-none", "w-full", 3, "href"], [1, "fab", "fa-whatsapp", "mr-2"], [1, "fas", "fa-star", "mr-1"], [1, "bg-white", "dark:bg-gray-800", "rounded-xl", "shadow-sm", "border", "border-gray-100", "dark:border-gray-700", "p-8", "sm:p-10"], [1, "max-w-3xl", "mx-auto", "text-center", "mb-10"], [1, "text-3xl", "font-bold", "mb-4", "text-gray-900", "dark:text-white"], [1, "text-xl", "text-gray-600", "dark:text-gray-300"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-10", "items-center"], [1, "text-xl", "font-bold", "text-indigo-600", "dark:text-indigo-400", "mb-4"], [1, "space-y-4"], [1, "flex", "items-start"], [1, "relative", "h-64", "sm:h-80", "rounded-xl", "overflow-hidden", "shadow-lg", "transform", "rotate-2", "hover:rotate-0", "transition-all", "duration-500"], ["src", "assets/img/cursos/academy/salida_laboral_propia.jpeg", "alt", "Alumno reparando", 1, "w-full", "h-full", "object-cover"], [1, "absolute", "inset-0", "bg-linear-to-t", "from-black/60", "to-transparent", "flex", "items-end", "p-6"], [1, "text-white", "font-bold", "text-lg"], [1, "bg-indigo-900", "rounded-2xl", "p-8", "sm:p-12", "text-white", "shadow-xl", "relative", "overflow-hidden"], [1, "absolute", "top-0", "right-0", "-mt-10", "-mr-10", "w-64", "h-64", "bg-white/5", "rounded-full", "blur-3xl"], [1, "absolute", "bottom-0", "left-0", "-mb-10", "-ml-10", "w-64", "h-64", "bg-indigo-500/20", "rounded-full", "blur-3xl"], [1, "relative", "z-10", "text-center", "mb-12"], [1, "inline-block", "py-1", "px-3", "rounded-full", "bg-green-500/20", "border", "border-green-500/30", "text-green-300", "text-sm", "font-bold", "tracking-wide", "uppercase", "mb-4"], [1, "text-3xl", "sm:text-4xl", "font-bold", "mb-4"], [1, "text-indigo-100", "text-lg", "max-w-2xl", "mx-auto"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-4", "gap-6"], [1, "bg-white/10", "backdrop-blur-sm", "border", "border-white/10", "rounded-xl", "p-6", "hover:bg-white/15", "transition-colors"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-8", "items-center"], [1, "rounded-xl", "overflow-hidden", "shadow-lg", "transform", "rotate-1", "hover:rotate-0", "transition-transform", "duration-500"], ["src", "assets/img/cursos/academy/capacitaciones.jpeg", "alt", "Clases 100% Pr\xE1cticas", 1, "w-full", "h-full", "object-cover"], [1, "w-12", "h-12", "rounded-lg", "bg-blue-100", "text-blue-600", "flex", "items-center", "justify-center", "text-2xl", "mb-2"], [1, "fas", "fa-tools"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-white"], [1, "text-gray-600", "dark:text-gray-300", "text-lg"], [1, "space-y-2"], [1, "flex", "items-center", "text-gray-700", "dark:text-gray-300"], [1, "fas", "fa-check-circle", "text-green-500", "mr-3"], [1, "bg-indigo-900", "text-white", "rounded-xl", "shadow-xl", "overflow-hidden"], [1, "grid", "grid-cols-1", "md:grid-cols-2"], [1, "p-10", "flex", "flex-col", "justify-center"], [1, "text-indigo-300", "font-bold", "tracking-wider", "uppercase", "text-sm", "mb-2"], [1, "text-3xl", "font-bold", "mb-6"], [1, "text-indigo-100", "text-lg", "mb-6"], [1, "flex", "items-center", "space-x-4"], [1, "flex", "-space-x-4"], [1, "w-10", "h-10", "rounded-full", "bg-gray-300", "border-2", "border-indigo-900"], [1, "w-10", "h-10", "rounded-full", "bg-gray-400", "border-2", "border-indigo-900"], [1, "w-10", "h-10", "rounded-full", "bg-gray-500", "border-2", "border-indigo-900"], [1, "text-sm", "font-medium"], [1, "h-164", "md:h-auto", "relative"], ["src", "assets/img/cursos/academy/eddis_educativa.jpeg", "alt", "Instructor Experto", 1, "absolute", "inset-0", "w-full", "h-full", "object-cover", "opacity-90", "hover:opacity-100", "transition-opacity"], [1, "order-2", "md:order-1", "space-y-4"], [1, "w-12", "h-12", "rounded-lg", "bg-purple-100", "text-purple-600", "flex", "items-center", "justify-center", "text-2xl", "mb-2"], [1, "fas", "fa-building"], [1, "text-sm", "text-gray-500"], [1, "order-1", "md:order-2", "rounded-xl", "overflow-hidden", "shadow-lg", "transform", "-rotate-1", "hover:rotate-0", "transition-transform", "duration-500"], ["src", "assets/img/cursos/academy/profe_de_reparacion-de-celulares.jpeg", "alt", "Instalaciones", 1, "w-full", "h-64", "object-cover"], [1, "bg-gray-50", "dark:bg-gray-800/50", "rounded-2xl", "p-8", "border", "border-gray-200", "dark:border-gray-700"], [1, "flex", "flex-col", "md:flex-row", "gap-10"], [1, "md:w-1/3"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-white", "mb-4"], [1, "text-gray-600", "dark:text-gray-400", "mb-6"], [1, "btn", "btn-outline", "w-full", "normal-case", "hidden", "md:block", 3, "click"], [1, "md:w-2/3", "space-y-6"], [1, "flex", "gap-4"], [1, "bg-gray-50", "dark:bg-gray-700/30", "rounded-xl", "p-8", "border", "border-gray-100", "dark:border-gray-700"], [1, "h-64", "rounded-xl", "overflow-hidden", "shadow-sm"], ["src", "assets/img/cursos/academy/aprender.jpeg", "alt", "Grupo de Alumnos", 1, "w-full", "h-full", "object-cover"], [1, "text-gray-600", "dark:text-gray-300", "mb-4"], [1, "btn", "btn-outline", "btn-sm", 3, "click"], [1, "text-2xl", "font-bold", "text-center", "mb-10", "text-gray-900", "dark:text-white"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "lg:grid-cols-6", "gap-4"], [1, "flex", "flex-col", "items-center", "justify-center", "p-4", "bg-white", "dark:bg-gray-800", "rounded-xl", "border", "border-gray-100", "dark:border-gray-700", "text-center", "h-32"], [1, "pt-8", "border-t", "border-gray-100", "dark:border-gray-700"], [1, "text-2xl", "font-bold", "mb-6", "text-gray-900", "dark:text-white", "flex", "items-center"], [1, "fas", "fa-newspaper", "text-indigo-500", "mr-3"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6"], ["target", "_blank", 1, "flex", "flex-col", "md:flex-row", "bg-white", "dark:bg-gray-800", "rounded-lg", "overflow-hidden", "border", "border-gray-100", "dark:border-gray-700", "hover:shadow-lg", "transition-all", "transform", "hover:-translate-y-1", "group", 3, "href"], [1, "bg-gray-900", "text-white", "rounded-xl", "p-8", "flex", "flex-col", "md:flex-row", "items-center", "gap-8", "border", "border-gray-800"], [1, "shrink-0"], [1, "w-24", "h-24", "rounded-full", "bg-white/10", "flex", "items-center", "justify-center", "text-4xl", "text-yellow-400"], [1, "fas", "fa-shield-alt"], [1, "text-center", "md:text-left"], [1, "text-2xl", "font-bold", "mb-2"], [1, "text-gray-400", "mb-0"], [1, "max-w-3xl", "mx-auto"], [1, "text-2xl", "font-bold", "text-center", "mb-8", "text-gray-900", "dark:text-white"], [1, "collapse", "collapse-plus", "bg-white", "dark:bg-gray-800", "border", "border-gray-200", "dark:border-gray-700", "rounded-xl"], [1, "text-center", "pt-8"], [1, "text-2xl", "font-bold", "text-gray-900", "dark:text-white", "mb-6"], [1, "flex", "flex-col", "sm:flex-row", "justify-center", "gap-4"], [1, "btn", "btn-primary", "btn-lg", "shadow-xl", "shadow-indigo-500/30", 3, "click"], ["target", "_blank", 1, "btn", "btn-outline", "btn-lg", 3, "href"], [1, "mt-4", "text-sm", "text-gray-500"], [1, "mt-12", "pt-8", "border-t", "border-gray-100", "dark:border-gray-700", "text-center", "opacity-70", "hover:opacity-100", "transition-opacity"], ["src", "/assets/img/brands/logo/log.png", "alt", "Arecofix Academy", 1, "h-8", "mx-auto", "mb-4", "grayscale"], [1, "text-sm"], [1, "mr-3", "mt-1", "w-6", "h-6", "bg-indigo-100", "dark:bg-indigo-900/50", "rounded-full", "flex", "items-center", "justify-center", "shrink-0"], [1, "fas", "fa-check", "text-indigo-600", "dark:text-indigo-400", "text-xs"], [1, "text-gray-700", "dark:text-gray-200"], [1, "flex", "justify-between", "items-start", "mb-4"], [1, "fas", "fa-tools", "text-2xl", "text-indigo-300"], [1, "text-xs", "bg-green-500", "text-white", "px-2", "py-0.5", "rounded", "font-bold"], [1, "text-2xl", "font-bold", "text-green-300"], [1, "text-xs", "text-indigo-200", "mt-1"], [1, "flex", "flex-col", "items-center"], [1, "w-8", "h-8", "rounded-full", "bg-indigo-600", "text-white", "flex", "items-center", "justify-center", "text-sm", "font-bold", "shrink-0"], ["class", "h-full w-0.5 bg-indigo-100 dark:bg-gray-700 my-2", 4, "ngIf"], [1, "pb-6"], [1, "text-xs", "font-bold", "text-indigo-600", "dark:text-indigo-400", "uppercase", "tracking-wide"], [1, "text-lg", "font-bold", "text-gray-900", "dark:text-white"], [1, "text-gray-600", "dark:text-gray-400", "text-sm", "mt-1"], [1, "h-full", "w-0.5", "bg-indigo-100", "dark:bg-gray-700", "my-2"], [1, "text-sm", "font-bold", "text-gray-700", "dark:text-gray-300"], [1, "w-full", "md:w-1/3", "h-48", "md:h-auto", "overflow-hidden"], ["onerror", "this.src='assets/img/logo-placeholder.png'", 1, "w-full", "h-full", "object-cover", "group-hover:scale-105", "transition-transform", "duration-500", 3, "src", "alt"], [1, "w-full", "md:w-2/3", "p-6", "flex", "flex-col", "justify-center"], [1, "text-xs", "font-bold", "text-indigo-600", "dark:text-indigo-400", "uppercase", "tracking-wider", "mb-2"], [1, "font-bold", "text-gray-900", "dark:text-white", "text-lg", "leading-tight", "mb-3", "group-hover:text-indigo-600", "transition-colors"], [1, "text-sm", "text-gray-500", "mt-auto", "flex", "items-center", "font-medium"], [1, "fas", "fa-arrow-right", "ml-2", "opacity-0", "-translate-x-2", "group-hover:opacity-100", "group-hover:translate-x-0", "transition-all"], ["type", "radio", "name", "faq-accordion"], [1, "collapse-title", "text-base", "font-bold", "text-gray-900", "dark:text-white"], [1, "collapse-content"], [1, "text-gray-600", "dark:text-gray-300"], [1, "text-2xl", "font-bold", "mb-6", "text-gray-900", "dark:text-white"], [1, "text-center", "py-8", "text-gray-500"], [1, "collapse", "collapse-plus", "bg-gray-50", "dark:bg-gray-700/50", "rounded-lg"], ["type", "radio", "name", "my-accordion-3"], [1, "collapse-title", "text-lg", "font-medium", "text-gray-900", "dark:text-white", "flex", "items-center"], [1, "w-8", "h-8", "rounded-full", "bg-indigo-100", "dark:bg-indigo-900", "text-indigo-600", "dark:text-indigo-400", "flex", "items-center", "justify-center", "text-sm", "mr-3", "font-bold"], [1, "text-gray-600", "dark:text-gray-300", "pt-2"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "gap-4"], [1, "aspect-square", "rounded-lg", "overflow-hidden", "bg-gray-200", "border", "border-gray-100", "dark:border-gray-700", "relative", "group"], ["alt", "Clase pr\xE1ctica", 1, "w-full", "h-full", "object-cover", "group-hover:scale-110", "transition-transform", "duration-500", 3, "src"], [1, "absolute", "inset-0", "bg-black/0", "group-hover:bg-black/20", "transition-colors"], [1, "mb-10"], [1, "aspect-video", "rounded-xl", "overflow-hidden", "shadow-xl", "bg-black"], ["frameborder", "0", "allow", "accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture", "allowfullscreen", "", 1, "w-full", "h-full", 3, "src"], [1, "mt-3", "text-center", "text-sm", "text-gray-500"], [1, "p-6", "bg-indigo-50", "dark:bg-indigo-900/20", "rounded-xl", "border", "border-indigo-100", "dark:border-indigo-800/50"], [1, "text-indigo-400", "text-6xl", "mr-4", "leading-none", "font-serif"], [1, "text-gray-700", "dark:text-gray-300", "italic", "mb-4", "text-lg"], [1, "flex", "items-center", "mt-4"], [1, "w-10", "h-10", "rounded-full", "bg-indigo-200", "flex", "items-center", "justify-center", "text-indigo-700", "font-bold", "mr-3"], [1, "font-bold", "text-gray-900", "dark:text-white"], [1, "text-xs", "text-gray-500"], [1, "p-6", "bg-white", "dark:bg-gray-700", "rounded-xl", "border", "border-gray-100", "dark:border-gray-600", "shadow-sm"], [1, "w-10", "h-10", "rounded-full", "bg-green-200", "flex", "items-center", "justify-center", "text-green-700", "font-bold", "mr-3"], [1, "modal", "modal-open", "modal-bottom", "sm:modal-middle", 3, "click"], [1, "modal-box", "bg-white", "dark:bg-gray-800", "text-left", "relative", 3, "click"], [1, "btn", "btn-sm", "btn-circle", "btn-ghost", "absolute", "right-2", "top-2", "text-gray-500", 3, "click"], [1, "text-xl", "font-bold", "text-gray-900", "dark:text-white", "mb-1"], [1, "text-sm", "text-gray-500", "dark:text-gray-400", "mb-6"], [1, "mt-2"], ["role", "alert", 1, "bg-green-50", "border", "border-green-200", "text-green-700", "p-6", "rounded-lg", "text-center"], ["method", "dialog", 1, "modal-backdrop"], [3, "click"], [1, "fas", "fa-check-circle", "text-5xl", "mb-4", "text-green-500"], [1, "text-xl", "font-bold", "mb-2"], [1, "mb-4"], [1, "bg-white", "p-4", "rounded-lg", "shadow-xs", "border", "border-green-100", "mb-6", "text-left"], [1, "font-bold", "text-gray-800", "mb-1"], [1, "text-gray-600", "mb-1"], [1, "font-mono", "font-bold", "text-gray-900", "select-all"], [1, "text-gray-600"], [1, "text-sm", "mb-4"], [1, "text-lg"], ["target", "_blank", 1, "btn", "btn-success", "w-full", "text-white", "no-underline", "hover:bg-green-600", "border-none", 3, "href"], [1, "fab", "fa-whatsapp", "mr-2", "text-xl"], [1, "btn", "btn-ghost", "w-full", "mt-4", 3, "click"], ["for", "full_name", 1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["type", "text", "id", "full_name", "name", "full_name", "placeholder", "Ej: Juan P\xE9rez", 1, "input", "input-bordered", "w-full", "dark:bg-gray-700", "dark:text-white", 3, "ngModelChange", "ngModel"], ["for", "email", 1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["type", "email", "id", "email", "name", "email", "placeholder", "tucorreo@ejemplo.com", 1, "input", "input-bordered", "w-full", "dark:bg-gray-700", "dark:text-white", 3, "ngModelChange", "ngModel"], ["for", "phone", 1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["type", "tel", "id", "phone", "name", "phone", "placeholder", "Ej: +54 9 11 1234 5678", 1, "input", "input-bordered", "w-full", "dark:bg-gray-700", "dark:text-white", 3, "ngModelChange", "ngModel"], [1, "text-red-500", "text-sm", "bg-red-50", "p-2", "rounded", "border", "border-red-100"], [1, "modal-action", "flex", "flex-col", "sm:flex-row-reverse", "gap-2", "mt-6"], ["type", "button", 1, "btn", "btn-primary", "w-full", "sm:w-auto", 3, "click", "disabled"], [1, "loading", "loading-spinner", "loading-xs"], ["type", "button", 1, "btn", "btn-ghost", "w-full", "sm:w-auto", 3, "click"]], template: function CourseDetailComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275conditionalCreate(1, CourseDetailComponent_Conditional_1_Template, 2, 0, "div", 1)(2, CourseDetailComponent_Conditional_2_Template, 4, 1, "div", 2)(3, CourseDetailComponent_Conditional_3_Template, 116, 49);
      \u0275\u0275conditionalCreate(4, CourseDetailComponent_Conditional_4_Template, 14, 2, "dialog", 3);
      \u0275\u0275elementStart(5, "a", 4);
      \u0275\u0275element(6, "i", 5);
      \u0275\u0275elementEnd()();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 1 : ctx.error || !ctx.course ? 2 : 3);
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.showRegistrationModal ? 4 : -1);
      \u0275\u0275advance();
      \u0275\u0275property("href", "https://wa.me/" + ctx.whatsappNumber + "?text=Hola,%20tengo%20consultas%20sobre%20los%20cursos", \u0275\u0275sanitizeUrl);
    }
  }, dependencies: [CommonModule, NgIf, RouterModule, RouterLink, IsLoadingComponent, IsErrorComponent, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, NgModel, NgForm, CurrencyPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CourseDetailComponent, [{
    type: Component,
    args: [{ selector: "app-course-detail", standalone: true, imports: [CommonModule, RouterModule, IsLoadingComponent, IsErrorComponent, FormsModule], template: `<div class="min-h-screen bg-gray-50 dark:bg-gray-900 pb-12">\r
  \r
  @if (loading) {\r
    <div class="flex justify-center items-center h-screen">\r
      <is-loading />\r
    </div>\r
  } @else if (error || !course) {\r
    <div class="container mx-auto px-4 py-20 text-center">\r
      <is-error [message]="error || 'Curso no encontrado'" />\r
      <a routerLink="/academy" class="btn btn-primary mt-4">Volver a Cursos</a>\r
    </div>\r
  } @else {\r
    <!-- Hero Section -->\r
    <div class="relative bg-gray-900 text-white py-16 overflow-hidden">\r
      <!-- Background Image with Overlay -->\r
      <div class="absolute inset-0">\r
          <img [src]="course.image_url" [alt]="course.title" class="w-full h-full object-cover opacity-30 blur-sm">\r
          <div class="absolute inset-0 bg-linear-to-t from-gray-900 to-transparent"></div>\r
      </div>\r
      \r
      <div class="relative container mx-auto px-4">\r
        <div class="max-w-4xl">\r
          <div class="text-sm breadcrumbs text-gray-300 mb-6">\r
            <ul>\r
              <li><a routerLink="/">Inicio</a></li>\r
              <li><a routerLink="/academy">Cursos</a></li>\r
              <li class="font-semibold text-white">{{course.title}}</li>\r
            </ul>\r
          </div>\r
          \r
          <div class="flex flex-wrap gap-2 mb-4">\r
              <span class="bg-indigo-600 text-white px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">{{course.level}}</span>\r
              @if(course.rating) {\r
                <span class="bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 px-3 py-1 rounded-full text-xs font-bold flex items-center">\r
                    <i class="fas fa-star mr-1"></i> {{course.rating}}\r
                </span>\r
              }\r
          </div>\r
\r
          <h1 class="text-4xl md:text-5xl font-bold mb-6 tracking-tight leading-tight">\r
            {{course.title}}\r
          </h1>\r
          \r
          <p class="text-xl text-gray-200 mb-8 max-w-2xl leading-relaxed">\r
            {{course.description}}\r
          </p>\r
          \r
          <div class="flex flex-col sm:flex-row gap-4 mt-8">\r
            <button (click)="openRegistration()" \r
              class="btn btn-primary bg-indigo-600 border-none hover:bg-indigo-500 text-white px-8 h-12 text-lg shadow-lg shadow-indigo-500/30">\r
              <i class="fas fa-pen-nib mr-2"></i> Inscribirme al Curso\r
            </button>\r
            <a routerLink="/login" \r
               class="btn btn-outline text-white hover:bg-white hover:text-gray-900 border-white/30 h-12 px-8 text-lg">\r
              <i class="fas fa-laptop-code mr-2"></i> Acceder al Curso\r
            </a>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
\r
    <!-- Main Content -->\r
    <div class="container mx-auto px-4 -mt-8 relative z-10">\r
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">\r
        \r
        <!-- Left Column: Details -->\r
        <div class="lg:col-span-2 space-y-8">\r
            <!-- Tabs Navigation -->\r
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-2 flex overflow-x-auto">\r
                <button (click)="activeTab = 'info'" \r
                    [class.bg-indigo-50]="activeTab === 'info'" \r
                    [class.text-indigo-600]="activeTab === 'info'"\r
                    [class.dark:bg-gray-700]="activeTab === 'info'"\r
                    [class.dark:text-white]="activeTab === 'info'"\r
                    class="flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap text-gray-600 dark:text-gray-300">\r
                    Informaci\xF3n\r
                </button>\r
                <button (click)="activeTab = 'temario'" \r
                    [class.bg-indigo-50]="activeTab === 'temario'" \r
                    [class.text-indigo-600]="activeTab === 'temario'"\r
                    [class.dark:bg-gray-700]="activeTab === 'temario'"\r
                    [class.dark:text-white]="activeTab === 'temario'"\r
                    class="flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap text-gray-600 dark:text-gray-300">\r
                    Temario\r
                </button>\r
                <button (click)="activeTab = 'galeria'" \r
                    [class.bg-indigo-50]="activeTab === 'galeria'" \r
                    [class.text-indigo-600]="activeTab === 'galeria'"\r
                    [class.dark:bg-gray-700]="activeTab === 'galeria'"\r
                    [class.dark:text-white]="activeTab === 'galeria'"\r
                    class="flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap text-gray-600 dark:text-gray-300">\r
                    Galer\xEDa\r
                </button>\r
                <button (click)="activeTab = 'testimonios'" \r
                    [class.bg-indigo-50]="activeTab === 'testimonios'" \r
                    [class.text-indigo-600]="activeTab === 'testimonios'"\r
                    [class.dark:bg-gray-700]="activeTab === 'testimonios'"\r
                    [class.dark:text-white]="activeTab === 'testimonios'"\r
                    class="flex-1 py-3 px-6 rounded-lg font-medium text-sm transition-colors whitespace-nowrap text-gray-600 dark:text-gray-300">\r
                    Testimonios\r
                </button>\r
            </div>\r
\r
\r
             <!-- Tab Content: Info -->\r
             @if (activeTab === 'info') {\r
                 <div class="space-y-16 fade-in pb-12">\r
                     \r
                     <!-- 1. Intro + Audience (From Initial Version - RESTORED) -->\r
                     <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 sm:p-10">\r
                         <div class="max-w-3xl mx-auto text-center mb-10">\r
                             <h2 class="text-3xl font-bold mb-4 text-gray-900 dark:text-white">\xBFBuscas una profesi\xF3n con futuro?</h2>\r
                             <p class="text-xl text-gray-600 dark:text-gray-300">\r
                                 La reparaci\xF3n de celulares es uno de los oficios m\xE1s rentables y demandados de la actualidad.\r
                             </p>\r
                         </div>\r
\r
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">\r
                             <div>\r
                                 <h3 class="text-xl font-bold text-indigo-600 dark:text-indigo-400 mb-4">Este curso es para vos si:</h3>\r
                                 <ul class="space-y-4">\r
                                     @for (item of audienceList; track item) {\r
                                         <li class="flex items-start">\r
                                             <div class="mr-3 mt-1 w-6 h-6 bg-indigo-100 dark:bg-indigo-900/50 rounded-full flex items-center justify-center shrink-0">\r
                                                 <i class="fas fa-check text-indigo-600 dark:text-indigo-400 text-xs"></i>\r
                                             </div>\r
                                             <span class="text-gray-700 dark:text-gray-200">{{item}}</span>\r
                                         </li>\r
                                     }\r
                                 </ul>\r
                             </div>\r
                             <div class="relative h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg transform rotate-2 hover:rotate-0 transition-all duration-500">\r
                                 <img src="assets/img/cursos/academy/salida_laboral_propia.jpeg" class="w-full h-full object-cover" alt="Alumno reparando">\r
                                 <div class="absolute inset-0 bg-linear-to-t from-black/60 to-transparent flex items-end p-6">\r
                                     <p class="text-white font-bold text-lg">"Hoy tengo mi propio taller"</p>\r
                                 </div>\r
                             </div>\r
                         </div>\r
                     </div>\r
\r
                     <!-- 2. ROI & Salida Laboral (From Initial Version - RESTORED) -->\r
                     <section class="bg-indigo-900 rounded-2xl p-8 sm:p-12 text-white shadow-xl relative overflow-hidden">\r
                         <div class="absolute top-0 right-0 -mt-10 -mr-10 w-64 h-64 bg-white/5 rounded-full blur-3xl"></div>\r
                         <div class="absolute bottom-0 left-0 -mb-10 -ml-10 w-64 h-64 bg-indigo-500/20 rounded-full blur-3xl"></div>\r
                         \r
                         <div class="relative z-10 text-center mb-12">\r
                             <span class="inline-block py-1 px-3 rounded-full bg-green-500/20 border border-green-500/30 text-green-300 text-sm font-bold tracking-wide uppercase mb-4">Oportunidad de Negocio</span>\r
                             <h2 class="text-3xl sm:text-4xl font-bold mb-4">Recupera tu inversi\xF3n en menos de un mes</h2>\r
                             <p class="text-indigo-100 text-lg max-w-2xl mx-auto">\r
                                 No necesitas miles de clientes. Con solo 3 o 4 reparaciones b\xE1sicas ya cubr\xEDs el costo del curso. El resto es ganancia pura.\r
                             </p>\r
                         </div>\r
\r
                         <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">\r
                             @for (roi of roiExamples; track roi.job) {\r
                                 <div class="bg-white/10 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/15 transition-colors">\r
                                     <div class="flex justify-between items-start mb-4">\r
                                         <i class="fas fa-tools text-2xl text-indigo-300"></i>\r
                                         @if (roi.earning) {\r
                                             <span class="text-xs bg-green-500 text-white px-2 py-0.5 rounded font-bold">Ganancia</span>\r
                                         }\r
                                     </div>\r
                                     <h3 class="font-bold text-lg mb-2">{{roi.job}}</h3>\r
                                     <p class="text-2xl font-bold text-green-300">{{roi.range}}</p>\r
                                     <p class="text-xs text-indigo-200 mt-1">promedio por trabajo</p>\r
                                 </div>\r
                             }\r
                         </div>\r
                     </section>\r
\r
                     <!-- 3. Methodology (Visual Section) -->\r
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">\r
                         <div class="rounded-xl overflow-hidden shadow-lg transform rotate-1 hover:rotate-0 transition-transform duration-500">\r
                             <img src="assets/img/cursos/academy/capacitaciones.jpeg" class="w-full h-full object-cover" alt="Clases 100% Pr\xE1cticas">\r
                         </div>\r
                         <div class="space-y-4">\r
                             <div class="w-12 h-12 rounded-lg bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-2">\r
                                 <i class="fas fa-tools"></i>\r
                             </div>\r
                             <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Metodolog\xEDa 100% Pr\xE1ctica</h3>\r
                             <p class="text-gray-600 dark:text-gray-300 text-lg">\r
                                 Creemos que la \xFAnica forma de aprender a reparar es reparando. Desde las primeras clases, trabajar\xE1s con equipos reales, mult\xEDmetros, estaciones de soldado y microscopios.\r
                             </p>\r
                             <ul class="space-y-2">\r
                                 <li class="flex items-center text-gray-700 dark:text-gray-300"><i class="fas fa-check-circle text-green-500 mr-3"></i> Diagn\xF3stico de placas</li>\r
                                 <li class="flex items-center text-gray-700 dark:text-gray-300"><i class="fas fa-check-circle text-green-500 mr-3"></i> Microsoldadura y reballing</li>\r
                                 <li class="flex items-center text-gray-700 dark:text-gray-300"><i class="fas fa-check-circle text-green-500 mr-3"></i> Cambio de m\xF3dulos y bater\xEDas</li>\r
                             </ul>\r
                         </div>\r
                     </div>\r
\r
                     <!-- 4. Instructors (Visual Section) -->\r
                     <div class="bg-indigo-900 text-white rounded-xl shadow-xl overflow-hidden">\r
                         <div class="grid grid-cols-1 md:grid-cols-2">\r
                             <div class="p-10 flex flex-col justify-center">\r
                                 <span class="text-indigo-300 font-bold tracking-wider uppercase text-sm mb-2">Mentoria Experta</span>\r
                                 <h3 class="text-3xl font-bold mb-6">Aprende de los Mejores</h3>\r
                                 <p class="text-indigo-100 text-lg mb-6">\r
                                     Nuestros instructores son t\xE9cnicos activos con a\xF1os de experiencia en el rubro. Transmiten los secretos del oficio que no est\xE1n en los libros.\r
                                 </p>\r
                                 <div class="flex items-center space-x-4">\r
                                     <div class="flex -space-x-4">\r
                                         <div class="w-10 h-10 rounded-full bg-gray-300 border-2 border-indigo-900"></div>\r
                                         <div class="w-10 h-10 rounded-full bg-gray-400 border-2 border-indigo-900"></div>\r
                                         <div class="w-10 h-10 rounded-full bg-gray-500 border-2 border-indigo-900"></div>\r
                                     </div>\r
                                     <span class="text-sm font-medium">Acompa\xF1amiento personalizado</span>\r
                                 </div>\r
                             </div>\r
                             <div class="h-164 md:h-auto relative">\r
                                 <img src="assets/img/cursos/academy/eddis_educativa.jpeg" class="absolute inset-0 w-full h-full object-cover opacity-90 hover:opacity-100 transition-opacity" alt="Instructor Experto">\r
                             </div>\r
                         </div>\r
                     </div>\r
\r
                     <!-- 5. Facilities (Visual Section) -->\r
                     <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">\r
                         <div class="order-2 md:order-1 space-y-4">\r
                             <div class="w-12 h-12 rounded-lg bg-purple-100 text-purple-600 flex items-center justify-center text-2xl mb-2">\r
                                 <i class="fas fa-building"></i>\r
                             </div>\r
                             <h3 class="text-2xl font-bold text-gray-900 dark:text-white">Instalaciones Profesionales</h3>\r
                             <p class="text-gray-600 dark:text-gray-300 text-lg">\r
                                 Laboratorios equipados simulando un entorno real de trabajo. \r
                                 <br><span class="text-sm text-gray-500">* Clases en sedes equipadas (CIC, Puntos Digitales, y Aulas Propias).</span>\r
                             </p>\r
                         </div>\r
                         <div class="order-1 md:order-2 rounded-xl overflow-hidden shadow-lg transform -rotate-1 hover:rotate-0 transition-transform duration-500">\r
                             <img src="assets/img/cursos/academy/profe_de_reparacion-de-celulares.jpeg" class="w-full h-64 object-cover" alt="Instalaciones">\r
                         </div>\r
                     </div>\r
\r
                     <!-- 6. Timeline (Syllabus) -->\r
                     <div class="bg-gray-50 dark:bg-gray-800/50 rounded-2xl p-8 border border-gray-200 dark:border-gray-700">\r
                         <div class="flex flex-col md:flex-row gap-10">\r
                             <div class="md:w-1/3">\r
                                 <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">Plan de Estudio</h3>\r
                                 <p class="text-gray-600 dark:text-gray-400 mb-6">\r
                                     Un programa dise\xF1ado paso a paso para llevarte de cero a experto. Sin rellenos, directo a la pr\xE1ctica.\r
                                 </p>\r
                                 <button (click)="activeTab = 'temario'" class="btn btn-outline w-full normal-case hidden md:block">\r
                                     Ver Temario Completo\r
                                 </button>\r
                             </div>\r
                             <div class="md:w-2/3 space-y-6">\r
                                 @for (step of syllabusTimeline; track step.week) {\r
                                     <div class="flex gap-4">\r
                                         <div class="flex flex-col items-center">\r
                                             <div class="w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center text-sm font-bold shrink-0">\r
                                                 {{$index + 1}}\r
                                             </div>\r
                                             <div class="h-full w-0.5 bg-indigo-100 dark:bg-gray-700 my-2" *ngIf="!$last"></div>\r
                                         </div>\r
                                         <div class="pb-6">\r
                                             <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wide">{{step.week}}</span>\r
                                             <h4 class="text-lg font-bold text-gray-900 dark:text-white">{{step.title}}</h4>\r
                                             <p class="text-gray-600 dark:text-gray-400 text-sm mt-1">{{step.desc}}</p>\r
                                         </div>\r
                                     </div>\r
                                 }\r
                             </div>\r
                         </div>\r
                     </div>\r
\r
                     <!-- 7. Community (Visual Section) -->\r
                     <div class="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-8 border border-gray-100 dark:border-gray-700">\r
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">\r
                             <div class="h-64 rounded-xl overflow-hidden shadow-sm">\r
                                  <img src="assets/img/cursos/academy/aprender.jpeg" class="w-full h-full object-cover" alt="Grupo de Alumnos">\r
                             </div>\r
                             <div>\r
                                 <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-4">M\xE1s que un Curso, una Comunidad</h3>\r
                                 <p class="text-gray-600 dark:text-gray-300 mb-4">\r
                                     Participa de foros, grupos de WhatsApp exclusivos y actualizaciones constantes.\r
                                 </p>\r
                                 <button (click)="activeTab = 'testimonios'" class="btn btn-outline btn-sm">Ver Testimonios de Alumni</button>\r
                             </div>\r
                         </div>\r
                     </div>\r
\r
                     <!-- 8. Inclusions (Grid) -->\r
                     <div>\r
                         <h2 class="text-2xl font-bold text-center mb-10 text-gray-900 dark:text-white">Todo lo que incluye tu inscripci\xF3n</h2>\r
                         <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">\r
                             @for (inc of inclusions; track inc.text) {\r
                                 <div class="flex flex-col items-center justify-center p-4 bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 text-center h-32">\r
                                     <i [class]="inc.icon + ' text-3xl text-gray-400 dark:text-gray-500 mb-3'"></i>\r
                                     <span class="text-sm font-bold text-gray-700 dark:text-gray-300">{{inc.text}}</span>\r
                                 </div>\r
                             }\r
                         </div>\r
                     </div>\r
\r
                     <!-- 9. Press Section -->\r
                     <div class="pt-8 border-t border-gray-100 dark:border-gray-700">\r
                         <h3 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white flex items-center">\r
                             <i class="fas fa-newspaper text-indigo-500 mr-3"></i> Arecofix en los medios\r
                         </h3>\r
                         <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                             @for (news of pressLinks; track news.url) {\r
                                 <a [href]="news.url" target="_blank" class="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-100 dark:border-gray-700 hover:shadow-lg transition-all transform hover:-translate-y-1 group">\r
                                     <div class="w-full md:w-1/3 h-48 md:h-auto overflow-hidden">\r
                                         <img [src]="news.image" [alt]="news.source" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='assets/img/logo-placeholder.png'">\r
                                     </div>\r
                                     <div class="w-full md:w-2/3 p-6 flex flex-col justify-center">\r
                                         <span class="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-2">{{news.source}}</span>\r
                                         <h4 class="font-bold text-gray-900 dark:text-white text-lg leading-tight mb-3 group-hover:text-indigo-600 transition-colors">{{news.title}}</h4>\r
                                         <span class="text-sm text-gray-500 mt-auto flex items-center font-medium">\r
                                             Leer art\xEDculo completo <i class="fas fa-arrow-right ml-2 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all"></i>\r
                                         </span>\r
                                     </div>\r
                                 </a>\r
                             }\r
                         </div>\r
                     </div>\r
\r
                     <!-- 10. Guarantee -->\r
                     <div class="bg-gray-900 text-white rounded-xl p-8 flex flex-col md:flex-row items-center gap-8 border border-gray-800">\r
                         <div class="shrink-0">\r
                             <div class="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-4xl text-yellow-400">\r
                                 <i class="fas fa-shield-alt"></i>\r
                             </div>\r
                         </div>\r
                         <div class="text-center md:text-left">\r
                             <h3 class="text-2xl font-bold mb-2">Garant\xEDa de Confianza Arecofix</h3>\r
                             <p class="text-gray-400 mb-0">\r
                                 Estamos tan seguros de nuestra calidad educativa que te ofrecemos una garant\xEDa de aprendizaje. \r
                                 Si sent\xEDs que necesitas reforzar alg\xFAn tema, podr\xE1s asistir a clases de repaso sin costo adicional hasta que domines la t\xE9cnica.\r
                             </p>\r
                         </div>\r
                     </div>\r
\r
                     <!-- 11. FAQ -->\r
                     <div class="max-w-3xl mx-auto">\r
                         <h2 class="text-2xl font-bold text-center mb-8 text-gray-900 dark:text-white">Preguntas Frecuentes</h2>\r
                         <div class="space-y-4">\r
                             @for (faq of faqs; track faq.question) {\r
                                 <div class="collapse collapse-plus bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl">\r
                                     <input type="radio" name="faq-accordion" /> \r
                                     <div class="collapse-title text-base font-bold text-gray-900 dark:text-white">\r
                                         {{faq.question}}\r
                                     </div>\r
                                     <div class="collapse-content"> \r
                                         <p class="text-gray-600 dark:text-gray-300">{{faq.answer}}</p>\r
                                     </div>\r
                                 </div>\r
                             }\r
                         </div>\r
                     </div>\r
\r
                     <!-- 12. Final CTA -->\r
                     <div class="text-center pt-8">\r
                         <h3 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">\xBFEst\xE1s listo para dar el siguiente paso?</h3>\r
                         <div class="flex flex-col sm:flex-row justify-center gap-4">\r
                             <button (click)="openRegistration()" class="btn btn-primary btn-lg shadow-xl shadow-indigo-500/30">\r
                                 Quiero Reservar mi Lugar\r
                             </button>\r
                             <a [href]="'https://wa.me/' + whatsappNumber" target="_blank" class="btn btn-outline btn-lg">\r
                                 <i class="fab fa-whatsapp mr-2"></i> Hablar con un Asesor\r
                             </a>\r
                         </div>\r
                         <p class="mt-4 text-sm text-gray-500">Cupos limitados por disponibilidad de laboratorio.</p>\r
                     </div>\r
\r
                     <!-- Mini Instructor Bio -->\r
                     <div class="mt-12 pt-8 border-t border-gray-100 dark:border-gray-700 text-center opacity-70 hover:opacity-100 transition-opacity">\r
                        <img src="/assets/img/brands/logo/log.png" alt="Arecofix Academy" class="h-8 mx-auto mb-4 grayscale">\r
                        <p class="text-sm">\r
                            <strong>Instructor Certificado:</strong> Ezequiel. Especialista en microsoldadura y reparaci\xF3n de dispositivos m\xF3viles con m\xE1s de 10 a\xF1os de experiencia en el gremio.\r
                        </p>\r
                     </div>\r
\r
                 </div>\r
             }\r
\r
             <!-- Tab Content: Temario -->\r
             @if (activeTab === 'temario') {\r
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 fade-in">\r
                    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Contenido del Curso</h2>\r
                    \r
                    @if (loadingModules) {\r
                        <is-loading />\r
                    } @else if (modules.length === 0) {\r
                        <div class="text-center py-8 text-gray-500">\r
                            No hay m\xF3dulos cargados para este curso a\xFAn.\r
                        </div>\r
                    } @else {\r
                        <div class="space-y-4">\r
                            @for (module of modules; track module.id) {\r
                                <div class="collapse collapse-plus bg-gray-50 dark:bg-gray-700/50 rounded-lg">\r
                                    <input type="radio" name="my-accordion-3" /> \r
                                    <div class="collapse-title text-lg font-medium text-gray-900 dark:text-white flex items-center">\r
                                        <span class="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-900 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-sm mr-3 font-bold">\r
                                            {{$index + 1}}\r
                                        </span>\r
                                        {{module.title}}\r
                                    </div>\r
                                    <div class="collapse-content"> \r
                                        <p class="text-gray-600 dark:text-gray-300 pt-2">{{module.description}}</p>\r
                                    </div>\r
                                </div>\r
                            }\r
                        </div>\r
                    }\r
                </div>\r
             }\r
\r
             <!-- Tab Content: Galer\xEDa -->\r
             @if (activeTab === 'galeria') {\r
                 <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 fade-in">\r
                    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Galer\xEDa de Clases</h2>\r
                    <div class="grid grid-cols-2 md:grid-cols-3 gap-4">\r
                        @for (img of galleryImages; track img) {\r
                            <div class="aspect-square rounded-lg overflow-hidden bg-gray-200 border border-gray-100 dark:border-gray-700 relative group">\r
                                <img [src]="img" class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="Clase pr\xE1ctica">\r
                                <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors"></div>\r
                            </div>\r
                        }\r
                    </div>\r
                </div>\r
             }\r
\r
             <!-- Tab Content: Testimonios -->\r
             @if (activeTab === 'testimonios') {\r
                <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-8 fade-in">\r
                    <h2 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">Lo que dicen nuestros alumnos</h2>\r
                    \r
                    <!-- Main Video Testimonial -->\r
                    <div class="mb-10">\r
                        <div class="aspect-video rounded-xl overflow-hidden shadow-xl bg-black">\r
                            <iframe \r
                                [src]="getVideoUrl()" \r
                                class="w-full h-full" \r
                                frameborder="0" \r
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" \r
                                allowfullscreen>\r
                            </iframe>\r
                        </div>\r
                        <p class="mt-3 text-center text-sm text-gray-500">\r
                            Mira c\xF3mo nuestros alumnos aplican lo aprendido en clase (Video gentileza Municipio de Marcos Paz)\r
                        </p>\r
                    </div>\r
\r
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">\r
                         <!-- Text Testimonial 1 -->\r
                         <div class="p-6 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-800/50">\r
                            <div class="flex items-start">\r
                                <div class="text-indigo-400 text-6xl mr-4 leading-none font-serif">"</div>\r
                                <div>\r
                                    <p class="text-gray-700 dark:text-gray-300 italic mb-4 text-lg">\r
                                        Incre\xEDble experiencia. No solo aprend\xED a reparar, sino que me dieron las herramientas para montar mi propio negocio. Hoy vivo de esto.\r
                                    </p>\r
                                    <div class="flex items-center mt-4">\r
                                        <div class="w-10 h-10 rounded-full bg-indigo-200 flex items-center justify-center text-indigo-700 font-bold mr-3">\r
                                            MR\r
                                        </div>\r
                                        <div>\r
                                            <h4 class="font-bold text-gray-900 dark:text-white">Mart\xEDn Rodriguez</h4>\r
                                            <p class="text-xs text-gray-500">Egresado 2024</p>\r
                                        </div>\r
                                    </div>\r
                                </div>\r
                            </div>\r
                         </div>\r
\r
                         <!-- Text Testimonial 2 -->\r
                         <div class="p-6 bg-white dark:bg-gray-700 rounded-xl border border-gray-100 dark:border-gray-600 shadow-sm">\r
                            <div class="flex items-start">\r
                                <div class="text-indigo-400 text-6xl mr-4 leading-none font-serif">"</div>\r
                                <div>\r
                                    <p class="text-gray-700 dark:text-gray-300 italic mb-4 text-lg">\r
                                        Los profesores explican con mucha paciencia y la pr\xE1ctica es constante. Me sent\xED muy c\xF3modo desde el primer d\xEDa.\r
                                    </p>\r
                                    <div class="flex items-center mt-4">\r
                                        <div class="w-10 h-10 rounded-full bg-green-200 flex items-center justify-center text-green-700 font-bold mr-3">\r
                                            LZ\r
                                        </div>\r
                                        <div>\r
                                            <h4 class="font-bold text-gray-900 dark:text-white">Lucas Zarate</h4>\r
                                            <p class="text-xs text-gray-500">Alumno Nivel B\xE1sico</p>\r
                                        </div>\r
                                    </div>\r
                                </div>\r
                            </div>\r
                         </div>\r
                    </div>\r
                </div>\r
             }\r
\r
        </div>\r
\r
        <!-- Right Column: Sidebar info -->\r
        <div class="lg:col-span-1 space-y-6">\r
            <div class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-6 sticky top-24">\r
                <div class="text-center mb-6">\r
                    <span class="text-gray-500 dark:text-gray-400 text-sm uppercase tracking-wide">Precio del Curso</span>\r
                    <div class="text-4xl font-bold text-gray-900 dark:text-white my-2">{{course.price | currency}}</div>\r
                    <span class="text-sm text-gray-500 dark:text-gray-400">Pago \xFAnico o en cuotas</span>\r
                </div>\r
\r
                <div class="space-y-4 mb-8">\r
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">\r
                        <div class="flex items-center text-gray-600 dark:text-gray-300">\r
                             <i class="fas fa-calendar-alt w-8 text-indigo-500"></i>\r
                             <span>Duraci\xF3n</span>\r
                        </div>\r
                        <span class="font-semibold text-gray-900 dark:text-white">{{course.duration}}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">\r
                         <div class="flex items-center text-gray-600 dark:text-gray-300">\r
                             <i class="fas fa-clock w-8 text-indigo-500"></i>\r
                             <span>Horario</span>\r
                         </div>\r
                         <span class="font-semibold text-gray-900 dark:text-white text-right text-sm max-w-[150px]">{{course.schedule}}</span>\r
                    </div>\r
                    <div class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">\r
                         <div class="flex items-center text-gray-600 dark:text-gray-300">\r
                             <i class="fas fa-map-marker-alt w-8 text-indigo-500"></i>\r
                             <span>Modalidad</span>\r
                         </div>\r
                         <div class="text-right">\r
                             <span class="block font-semibold text-gray-900 dark:text-white">Presencial + Virtual</span>\r
                             <span class="text-xs text-green-600 font-medium">\xA1Incluye Aula Virtual!</span>\r
                         </div>\r
                    </div>\r
                </div>\r
                \r
                <div class="bg-indigo-50 dark:bg-gray-700 p-4 rounded-lg mb-6 text-sm">\r
                    <h4 class="font-bold text-indigo-700 dark:text-indigo-300 mb-2"><i class="fas fa-laptop-house mr-2"></i>Capacitaci\xF3n H\xEDbrida</h4>\r
                    <p class="text-gray-600 dark:text-gray-300 mb-2">\r
                        Adem\xE1s de las clases presenciales, tendr\xE1s acceso a nuestra <strong>Aula Virtual</strong> exclusiva y soporte mediante <strong>Google Meet</strong>.\r
                    </p>\r
                    <ul class="space-y-1 text-gray-500 dark:text-gray-400">\r
                        <li><i class="fas fa-check text-green-500 mr-2"></i>Clases grabadas de repaso</li>\r
                        <li><i class="fas fa-check text-green-500 mr-2"></i>Material PDF descargable</li>\r
                        <li><i class="fas fa-check text-green-500 mr-2"></i>Consultas en vivo online</li>\r
                    </ul>\r
                </div>\r
\r
                <button (click)="openRegistration()" class="w-full btn btn-primary bg-indigo-600 hover:bg-indigo-500 border-none text-white mb-3">\r
                    Inscribirme Ahora\r
                </button>\r
                <p class="text-xs text-center text-gray-500">Cupos limitados. Reserva tu lugar hoy.</p>\r
            </div>\r
            \r
            <!-- Contact Widget -->\r
            <div class="bg-linear-to-br from-indigo-600 to-purple-700 rounded-xl shadow-lg p-6 text-white text-center">\r
                <h3 class="font-bold text-lg mb-2">\xBFTienes dudas?</h3>\r
                <p class="text-indigo-100 text-sm mb-4">Habla con un asesor educativo ahora mismo.</p>\r
                <a [href]="'https://wa.me/' + whatsappNumber" target="_blank" class="btn bg-white text-indigo-600 hover:bg-gray-100 border-none w-full">\r
                    <i class="fab fa-whatsapp mr-2"></i> Chatear\r
                </a>\r
            </div>\r
        </div>\r
      </div>\r
    </div>\r
  }\r
  \r
  <!-- Registration Modal (DaisyUI) -->\r
  @if (showRegistrationModal) {\r
    <dialog class="modal modal-open modal-bottom sm:modal-middle" (click)="closeRegistration()">\r
      <div class="modal-box bg-white dark:bg-gray-800 text-left relative" (click)="$event.stopPropagation()">\r
        <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-gray-500" (click)="closeRegistration()">\u2715</button>\r
        \r
        <h3 class="text-xl font-bold text-gray-900 dark:text-white mb-1">\r
          Inscripci\xF3n al curso\r
        </h3>\r
        <p class="text-sm text-gray-500 dark:text-gray-400 mb-6">{{course?.title}}</p>\r
        \r
        <div class="mt-2">\r
          @if (registrationSuccess) {\r
            <div class="bg-green-50 border border-green-200 text-green-700 p-6 rounded-lg text-center" role="alert">\r
                <i class="fas fa-check-circle text-5xl mb-4 text-green-500"></i>\r
                <h3 class="text-xl font-bold mb-2">\xA1Pre-inscripci\xF3n realizada!</h3>\r
                <p class="mb-4">Para confirmar tu vacante, por favor realiza el pago:</p>\r
                \r
                <div class="bg-white p-4 rounded-lg shadow-xs border border-green-100 mb-6 text-left">\r
                    <p class="font-bold text-gray-800 mb-1">Datos Bancarios:</p>\r
                    <p class="text-gray-600 mb-1">Alias: <span class="font-mono font-bold text-gray-900 select-all">arecofix</span></p>\r
                    <p class="text-gray-600">CBU: <span class="font-mono font-bold text-gray-900 select-all">ecocell</span></p>\r
                </div>\r
\r
                <p class="text-sm mb-4">\r
                    Una vez realizado el pago, env\xEDa el comprobante al: <br>\r
                    <strong class="text-lg">+54 9 11 2596-0900</strong>\r
                </p>\r
\r
                <a href="https://wa.me/5491125960900?text=Hola,%20adjunto%20comprobante%20de%20pago%20para%20el%20curso%20{{course?.title}}" \r
                    target="_blank"\r
                    class="btn btn-success w-full text-white no-underline hover:bg-green-600 border-none">\r
                    <i class="fab fa-whatsapp mr-2 text-xl"></i> Enviar Comprobante\r
                </a>\r
                \r
                <button (click)="closeRegistration()" class="btn btn-ghost w-full mt-4">Cerrar</button>\r
            </div>\r
          } @else {\r
            <form class="space-y-4">\r
              <div>\r
                <label for="full_name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Nombre Completo</label>\r
                <input type="text" id="full_name" [(ngModel)]="registrationForm.full_name" name="full_name" placeholder="Ej: Juan P\xE9rez" class="input input-bordered w-full dark:bg-gray-700 dark:text-white">\r
              </div>\r
              <div>\r
                <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>\r
                <input type="email" id="email" [(ngModel)]="registrationForm.email" name="email" placeholder="tucorreo@ejemplo.com" class="input input-bordered w-full dark:bg-gray-700 dark:text-white">\r
              </div>\r
              <div>\r
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Tel\xE9fono / WhatsApp</label>\r
                <input type="tel" id="phone" [(ngModel)]="registrationForm.phone" name="phone" placeholder="Ej: +54 9 11 1234 5678" class="input input-bordered w-full dark:bg-gray-700 dark:text-white">\r
              </div>\r
              @if (registrationError) {\r
                <p class="text-red-500 text-sm bg-red-50 p-2 rounded border border-red-100">{{registrationError}}</p>\r
              }\r
            </form>\r
            \r
            <div class="modal-action flex flex-col sm:flex-row-reverse gap-2 mt-6">\r
                <button type="button" (click)="submitRegistration()" [disabled]="registering" \r
                  class="btn btn-primary w-full sm:w-auto">\r
                  @if(registering) {\r
                      <span class="loading loading-spinner loading-xs"></span>\r
                  }\r
                  {{ registering ? 'Enviando...' : 'Confirmar Inscripci\xF3n' }}\r
                </button>\r
                <button type="button" (click)="closeRegistration()" class="btn btn-ghost w-full sm:w-auto">\r
                  Cancelar\r
                </button>\r
            </div>\r
          }\r
        </div>\r
      </div>\r
      <form method="dialog" class="modal-backdrop">\r
        <button (click)="closeRegistration()">close</button>\r
      </form>\r
    </dialog>\r
  }\r
\r
  <!-- Global Floating WhatsApp -->\r
  <a [href]="'https://wa.me/' + whatsappNumber + '?text=Hola,%20tengo%20consultas%20sobre%20los%20cursos'" \r
     target="_blank"\r
     class="fixed bottom-6 right-6 z-50 bg-green-500 hover:bg-green-600 text-white w-14 h-14 rounded-full shadow-2xl flex items-center justify-center transition-transform hover:scale-110 animate-bounce-slow"\r
     aria-label="Chat en WhatsApp">\r
      <i class="fab fa-whatsapp text-3xl"></i>\r
  </a>\r
</div>\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CourseDetailComponent, { className: "CourseDetailComponent", filePath: "src/app/public/cursos/course-detail/course-detail.component.ts", lineNumber: 18 });
})();
export {
  CourseDetailComponent
};
//# sourceMappingURL=chunk-XN4MMOCO.js.map
