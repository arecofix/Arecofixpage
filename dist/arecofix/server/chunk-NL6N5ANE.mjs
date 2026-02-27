import './polyfills.server.mjs';
import {
  PostService
} from "./chunk-5UJWBTXV.mjs";
import {
  ReservationCalendar
} from "./chunk-XVKLQIVI.mjs";
import {
  ContactService
} from "./chunk-J2BN55TP.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-EBVHUSN7.mjs";
import {
  AuthService
} from "./chunk-EIU5CNMA.mjs";
import "./chunk-KAY2H7H4.mjs";
import "./chunk-QOHRYQPW.mjs";
import {
  environment
} from "./chunk-R72SLW3B.mjs";
import {
  ActivatedRoute,
  Meta,
  RouterLink,
  Title
} from "./chunk-GLYZDHZB.mjs";
import {
  CommonModule,
  DatePipe
} from "./chunk-NQCCIK3J.mjs";
import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵreference,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeHtml,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtrustConstantResourceUrl,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-SCNXJUDC.mjs";
import "./chunk-TB3YAHZW.mjs";

// src/app/public/posts/post-page.ts
function PostPage_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 3);
    \u0275\u0275element(1, "div", 5);
    \u0275\u0275elementEnd();
  }
}
function PostPage_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 6);
    \u0275\u0275element(2, "i", 7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h2", 8);
    \u0275\u0275text(4, "No pudimos cargar la entrada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 9);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 10);
    \u0275\u0275text(8, " Volver al Inicio ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(ctx_r0.error);
  }
}
function PostPage_Conditional_3_Conditional_0_Conditional_556_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 236);
  }
}
function PostPage_Conditional_3_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "div", 12)(2, "div", 13);
    \u0275\u0275element(3, "img", 14)(4, "div", 15);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 16)(6, "div", 17)(7, "ul")(8, "li")(9, "a", 18);
    \u0275\u0275text(10, "Inicio");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(11, "li")(12, "a", 19);
    \u0275\u0275text(13, "Blog");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "li", 20);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(16, "span", 21);
    \u0275\u0275text(17, "Servicio T\xE9cnico en Marcos Paz");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "h1", 22);
    \u0275\u0275text(19, " Tu celular tiene ");
    \u0275\u0275elementStart(20, "span", 23);
    \u0275\u0275text(21, "soluci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275text(22, ". ");
    \u0275\u0275element(23, "br");
    \u0275\u0275elementStart(24, "span", 24);
    \u0275\u0275text(25, "Nosotros sabemos c\xF3mo.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(26, "p", 25);
    \u0275\u0275text(27, " Especialistas en iPhone y Android. Diagn\xF3stico profesional, repuestos de calidad y garant\xEDa escrita. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div", 26)(29, "button", 27);
    \u0275\u0275listener("click", function PostPage_Conditional_3_Conditional_0_Template_button_click_29_listener() {
      \u0275\u0275restoreView(_r2);
      const reservationSection_r3 = \u0275\u0275reference(383);
      return \u0275\u0275resetView(reservationSection_r3.scrollIntoView({ behavior: "smooth" }));
    });
    \u0275\u0275element(30, "i", 28);
    \u0275\u0275text(31, " Reservar Turno ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(32, "a", 29);
    \u0275\u0275element(33, "i", 30);
    \u0275\u0275text(34, " Consultar Ahora ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(35, "div", 31)(36, "div", 32);
    \u0275\u0275element(37, "i", 33);
    \u0275\u0275elementStart(38, "h3", 34);
    \u0275\u0275text(39, "Pantalla Rota");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "p", 35);
    \u0275\u0275text(41, "Cambio de m\xF3dulo o vidrio");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 32);
    \u0275\u0275element(43, "i", 36);
    \u0275\u0275elementStart(44, "h3", 34);
    \u0275\u0275text(45, "Bater\xEDa Agotada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "p", 35);
    \u0275\u0275text(47, "Dura poco o se apaga");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(48, "div", 32);
    \u0275\u0275element(49, "i", 37);
    \u0275\u0275elementStart(50, "h3", 34);
    \u0275\u0275text(51, "No Carga");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(52, "p", 35);
    \u0275\u0275text(53, "Falla de pin de carga");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(54, "div", 32);
    \u0275\u0275element(55, "i", 38);
    \u0275\u0275elementStart(56, "h3", 34);
    \u0275\u0275text(57, "Equipo Mojado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "p", 35);
    \u0275\u0275text(59, "Limpieza qu\xEDmica urgente");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(60, "div", 39)(61, "div", 40)(62, "div", 41)(63, "div", 42)(64, "span", 43);
    \u0275\u0275text(65, "Somos Expertos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(66, "h2", 44);
    \u0275\u0275text(67, "Reparaci\xF3n Multimarca Especializada");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "p", 45);
    \u0275\u0275text(69, " No importa la marca o modelo de tu equipo. En nuestra sede central contamos con el stock y la experiencia para resolverlo. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(70, "div", 46)(71, "div", 47);
    \u0275\u0275element(72, "i", 48);
    \u0275\u0275elementStart(73, "span", 49);
    \u0275\u0275text(74, "iPhone");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(75, "div", 47);
    \u0275\u0275element(76, "i", 50);
    \u0275\u0275elementStart(77, "span", 49);
    \u0275\u0275text(78, "Android");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(79, "div", 47)(80, "span", 51);
    \u0275\u0275text(81, "Samsung");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(82, "span", 52);
    \u0275\u0275text(83, "Galaxy");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(84, "div", 47)(85, "span", 51);
    \u0275\u0275text(86, "Xiaomi");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "span", 52);
    \u0275\u0275text(88, "Redmi/Poco");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(89, "div", 47)(90, "span", 51);
    \u0275\u0275text(91, "Motorola");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "span", 52);
    \u0275\u0275text(93, "Moto");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(94, "div", 47)(95, "span", 51);
    \u0275\u0275text(96, "LG");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "span", 52);
    \u0275\u0275text(98, "ThinQ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(99, "div", 53);
    \u0275\u0275element(100, "div", 54)(101, "img", 55);
    \u0275\u0275elementStart(102, "div", 56)(103, "p", 57);
    \u0275\u0275text(104, "\u{1F4CD} Taller Especializado");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(105, "div", 58);
    \u0275\u0275element(106, "i", 59)(107, "i", 59)(108, "i", 59)(109, "i", 59)(110, "i", 59);
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(111, "div", 60)(112, "div", 40)(113, "div", 61)(114, "h2", 62);
    \u0275\u0275text(115, "Soluciones Frecuentes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(116, "p", 63);
    \u0275\u0275text(117, "Los problemas m\xE1s comunes que resolvemos en el d\xEDa.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(118, "div", 64)(119, "div", 65)(120, "div", 66);
    \u0275\u0275element(121, "i", 67);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(122, "h4", 68);
    \u0275\u0275text(123, "Cambio de M\xF3dulo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(124, "p", 69);
    \u0275\u0275text(125, "Pantallas rotas o sin imagen.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(126, "div", 65)(127, "div", 70);
    \u0275\u0275element(128, "i", 71);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(129, "h4", 68);
    \u0275\u0275text(130, "Bater\xEDa Nueva");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(131, "p", 69);
    \u0275\u0275text(132, "Recuper\xE1 la autonom\xEDa.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(133, "div", 65)(134, "div", 72);
    \u0275\u0275element(135, "i", 73);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(136, "h4", 68);
    \u0275\u0275text(137, "Pin de Carga");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(138, "p", 69);
    \u0275\u0275text(139, "Si no conecta o carga lento.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(140, "div", 65)(141, "div", 74);
    \u0275\u0275element(142, "i", 75);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(143, "h4", 68);
    \u0275\u0275text(144, "Micro-Soldadura");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(145, "p", 69);
    \u0275\u0275text(146, "Fallas complejas de placa.");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(147, "div", 76)(148, "div", 77)(149, "div", 61)(150, "h2", 78);
    \u0275\u0275text(151, "Precios Orientativos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(152, "p", 79);
    \u0275\u0275text(153, "Transparencia ante todo. Consultanos por tu modelo exacto.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(154, "div", 80)(155, "table", 81)(156, "thead")(157, "tr", 82)(158, "th", 83);
    \u0275\u0275text(159, "Servicio");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(160, "th", 84);
    \u0275\u0275text(161, "Precio Desde");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(162, "tbody", 85)(163, "tr", 86)(164, "td", 87);
    \u0275\u0275element(165, "i", 88);
    \u0275\u0275text(166, " Diagn\xF3stico (si repara)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(167, "td", 89);
    \u0275\u0275text(168, "Bonificado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(169, "tr", 86)(170, "td", 87);
    \u0275\u0275text(171, "Cambio de M\xF3dulo (Pantalla)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(172, "td", 90);
    \u0275\u0275text(173, "$45.000");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(174, "tr", 86)(175, "td", 87);
    \u0275\u0275text(176, "Cambio de Bater\xEDa Original/Premium");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(177, "td", 90);
    \u0275\u0275text(178, "$25.000");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(179, "tr", 86)(180, "td", 87);
    \u0275\u0275text(181, "Cambio de Pin de Carga");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(182, "td", 90);
    \u0275\u0275text(183, "$18.000");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(184, "tr", 86)(185, "td", 87);
    \u0275\u0275text(186, "Limpieza Qu\xEDmica (Humedad)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(187, "td", 90);
    \u0275\u0275text(188, "$20.000");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(189, "tr", 91)(190, "td", 87);
    \u0275\u0275text(191, "Software / Flasheo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(192, "td", 90);
    \u0275\u0275text(193, "$15.000");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(194, "p", 92);
    \u0275\u0275text(195, "* Precios estimados sujetos a cambio seg\xFAn modelo y cotizaci\xF3n del d\xF3lar.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(196, "div", 93)(197, "div", 40)(198, "div", 94)(199, "span", 43);
    \u0275\u0275text(200, "\xBFPor qu\xE9 Arecofix?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(201, "h2", 95);
    \u0275\u0275text(202, "M\xE1s que un cambio de piezas");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(203, "div", 96)(204, "div", 97)(205, "div", 98);
    \u0275\u0275element(206, "i", 99);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(207, "h3", 100);
    \u0275\u0275text(208, "7+ A\xF1os de Experiencia");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(209, "p", 101);
    \u0275\u0275text(210, "No improvisamos. Conocemos a fondo la electr\xF3nica de tu equipo, desde un iPhone hasta un Xiaomi.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(211, "div", 97)(212, "div", 102);
    \u0275\u0275element(213, "i", 103);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(214, "h3", 100);
    \u0275\u0275text(215, "Garant\xEDa Real");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(216, "p", 101);
    \u0275\u0275text(217, "30 d\xEDas de garant\xEDa escrita. Si algo falla, respondemos. Sin vueltas ni letra chica.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(218, "div", 97)(219, "div", 104);
    \u0275\u0275element(220, "i", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(221, "h3", 100);
    \u0275\u0275text(222, "4.9 Estrellas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(223, "p", 101);
    \u0275\u0275text(224, "M\xE1s de 270 vecinos de Marcos Paz conf\xEDan en nosotros. Sus rese\xF1as son nuestra mejor carta de presentaci\xF3n.");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(225, "div", 105)(226, "div", 40)(227, "div", 41)(228, "div", 42)(229, "span", 43);
    \u0275\u0275text(230, "Laboratorio Profesional");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(231, "h2", 44);
    \u0275\u0275text(232, "Tecnolog\xEDa de Punta para tu Equipo");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(233, "p", 45);
    \u0275\u0275text(234, " Invertimos constantemente en equipamiento para realizar reparaciones que otros no pueden. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(235, "ul", 106)(236, "li", 107);
    \u0275\u0275element(237, "i", 108);
    \u0275\u0275text(238, " Microscopios Trinoculares para micro-soldadura.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(239, "li", 107);
    \u0275\u0275element(240, "i", 109);
    \u0275\u0275text(241, " Estaciones de Soldado JBC / Quick de precisi\xF3n.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(242, "li", 107);
    \u0275\u0275element(243, "i", 110);
    \u0275\u0275text(244, " Separadoras de Glass y Laminadoras OCA.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(245, "li", 107);
    \u0275\u0275element(246, "i", 111);
    \u0275\u0275text(247, " Software de diagn\xF3stico y programadoras de FaceID.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(248, "div", 53);
    \u0275\u0275element(249, "div", 54)(250, "img", 112);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(251, "div", 113);
    \u0275\u0275element(252, "div", 114);
    \u0275\u0275elementStart(253, "div", 115)(254, "div", 94)(255, "h2", 116);
    \u0275\u0275text(256, "As\xED Trabajamos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(257, "p", 117);
    \u0275\u0275text(258, "Simple, transparente y con tecnolog\xEDa a tu favor.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(259, "div", 118)(260, "div", 119)(261, "div", 120);
    \u0275\u0275element(262, "i", 121);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(263, "h4", 122);
    \u0275\u0275text(264, "1. Recepci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(265, "p", 123);
    \u0275\u0275text(266, "Tra\xE9s tu equipo a nuestra sede. Te generamos una orden de servicio \xFAnica.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(267, "div", 119)(268, "div", 124);
    \u0275\u0275element(269, "i", 125);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(270, "h4", 122);
    \u0275\u0275text(271, "2. Reparaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(272, "p", 123);
    \u0275\u0275text(273, "Experiencia pura. Nuestros t\xE9cnicos trabajan en tu equipo con repuestos de calidad.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(274, "div", 119)(275, "div", 126);
    \u0275\u0275element(276, "i", 127);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(277, "h4", 128);
    \u0275\u0275text(278, "3. Seguimiento App");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(279, "p", 123);
    \u0275\u0275text(280, " \xA1Exclusivo! Segu\xED el estado de tu reparaci\xF3n en ");
    \u0275\u0275elementStart(281, "strong");
    \u0275\u0275text(282, "tiempo real");
    \u0275\u0275elementEnd();
    \u0275\u0275text(283, " desde nuestra App web. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(284, "div", 119)(285, "div", 129);
    \u0275\u0275element(286, "i", 130);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(287, "h4", 122);
    \u0275\u0275text(288, "4. A Disfrutar");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(289, "p", 123);
    \u0275\u0275text(290, "Retir\xE1s tu equipo funcionando como nuevo y con garant\xEDa escrita.");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(291, "div", 131)(292, "div", 40)(293, "h2", 132);
    \u0275\u0275text(294, "Galer\xEDa de Trabajos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(295, "p", 133);
    \u0275\u0275text(296, "Desde microsoldadura hasta cambios de m\xF3dulo. As\xED trabajamos.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(297, "div", 134)(298, "div", 135);
    \u0275\u0275element(299, "video", 136);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(300, "div", 137);
    \u0275\u0275element(301, "img", 138);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(302, "div", 137);
    \u0275\u0275element(303, "img", 139);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(304, "div", 137);
    \u0275\u0275element(305, "img", 140);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(306, "div", 137);
    \u0275\u0275element(307, "img", 141);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(308, "div", 76)(309, "div", 40)(310, "div", 142)(311, "div")(312, "h3", 143);
    \u0275\u0275text(313, "Somos T\xE9cnicos, No Revendedores");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(314, "p", 144);
    \u0275\u0275text(315, ' A diferencia de locales que solo "cambian plaquetas", nosotros ');
    \u0275\u0275elementStart(316, "span", 145);
    \u0275\u0275text(317, "reparamos");
    \u0275\u0275elementEnd();
    \u0275\u0275text(318, " a nivel componente. ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(319, "ul", 146)(320, "li", 147);
    \u0275\u0275element(321, "i", 148);
    \u0275\u0275text(322, " Salvamos tu placa original (y tus datos).");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(323, "li", 147);
    \u0275\u0275element(324, "i", 148);
    \u0275\u0275text(325, " Solucionamos fallas complejas de encendido.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(326, "li", 147);
    \u0275\u0275element(327, "i", 148);
    \u0275\u0275text(328, ' Si no se puede reparar, no te cobramos "intentos".');
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(329, "div")(330, "h3", 143);
    \u0275\u0275text(331, "Calidad de Repuestos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(332, "p", 144);
    \u0275\u0275text(333, " Te explicamos la diferencia y vos eleg\xEDs qu\xE9 ponerle a tu equipo. ");
    \u0275\u0275elementEnd();
    \u0275\u0275element(334, "img", 149);
    \u0275\u0275elementStart(335, "div", 106)(336, "div", 150)(337, "h4", 151);
    \u0275\u0275text(338, "Original / Service Pack");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(339, "p", 152);
    \u0275\u0275text(340, "La misma pieza que trae de f\xE1brica. M\xE1xima calidad y brillo.");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(341, "div", 153)(342, "h4", 154);
    \u0275\u0275text(343, "Premium AAA / OLED");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(344, "p", 152);
    \u0275\u0275text(345, "Excelente alternativa costo-beneficio. Garantizada.");
    \u0275\u0275elementEnd()()()()()()();
    \u0275\u0275elementStart(346, "div", 155)(347, "div", 156);
    \u0275\u0275element(348, "i", 157);
    \u0275\u0275elementStart(349, "h2", 143);
    \u0275\u0275text(350, "Privacidad y Seguridad de Datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(351, "p", 101);
    \u0275\u0275text(352, " Entendemos que tu celular tiene tu vida. En Arecofix ");
    \u0275\u0275elementStart(353, "span", 158);
    \u0275\u0275text(354, "NO borramos");
    \u0275\u0275elementEnd();
    \u0275\u0275text(355, " nada sin tu permiso y ");
    \u0275\u0275elementStart(356, "span", 158);
    \u0275\u0275text(357, "NO accedemos");
    \u0275\u0275elementEnd();
    \u0275\u0275text(358, " a tu informaci\xF3n personal (fotos, chats). Trabajamos con protocolos de privacidad estrictos. ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(359, "div", 159)(360, "div", 160)(361, "div", 161)(362, "span", 162);
    \u0275\u0275text(363, "Ubicaci\xF3n");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(364, "h2", 163);
    \u0275\u0275text(365, "Estamos a 3 Cuadras de Ruta 40");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(366, "p", 164);
    \u0275\u0275element(367, "i", 165);
    \u0275\u0275text(368, " Marcos Paz");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(369, "p", 166)(370, "strong");
    \u0275\u0275text(371, "Horarios:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(372, " Lunes a S\xE1bado de 08:00 a 18:30 hs.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(373, "p", 167)(374, "strong");
    \u0275\u0275text(375, "Referencia:");
    \u0275\u0275elementEnd();
    \u0275\u0275text(376, " Jorge Newbery 69, Barrio La Paz, zona comercial.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(377, "a", 168);
    \u0275\u0275element(378, "i", 169);
    \u0275\u0275text(379, " C\xF3mo LLegar ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(380, "div", 170);
    \u0275\u0275element(381, "iframe", 171);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(382, "div", 172, 0)(384, "div", 173)(385, "h2", 174);
    \u0275\u0275text(386, "Reserva tu Turno");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(387, "p", 175);
    \u0275\u0275text(388, " Evit\xE1 esperas. Eleg\xED el d\xEDa y la hora para traer tu equipo. El diagn\xF3stico es gratuito. ");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(389, "div", 176);
    \u0275\u0275element(390, "app-reservation-calendar");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(391, "div", 177)(392, "div", 178)(393, "p", 179);
    \u0275\u0275text(394, "Conf\xEDan en Nosotros");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(395, "div", 180)(396, "div", 181);
    \u0275\u0275element(397, "i", 182);
    \u0275\u0275text(398, " MobiDoc");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(399, "div", 183);
    \u0275\u0275element(400, "i", 184);
    \u0275\u0275text(401, " Reviews");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(402, "div", 185);
    \u0275\u0275text(403, "Mercado Pago");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(404, "div", 186)(405, "p", 187);
    \u0275\u0275text(406, "Mencionado en");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(407, "div", 188)(408, "a", 189);
    \u0275\u0275text(409, " La Electr\xF3nica Online ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(410, "span", 190);
    \u0275\u0275text(411, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(412, "a", 191);
    \u0275\u0275text(413, " Municipio Marcos Paz ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(414, "span", 190);
    \u0275\u0275text(415, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(416, "a", 192);
    \u0275\u0275text(417, " A1 Noticias ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(418, "span", 190);
    \u0275\u0275text(419, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(420, "a", 193);
    \u0275\u0275text(421, " Mobidoc ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(422, "span", 190);
    \u0275\u0275text(423, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(424, "a", 194);
    \u0275\u0275text(425, " Red Argentina ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(426, "span", 190);
    \u0275\u0275text(427, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(428, "a", 195);
    \u0275\u0275text(429, " Marcos Paz Conectada ");
    \u0275\u0275elementEnd()()()()();
    \u0275\u0275elementStart(430, "div", 76)(431, "div", 196)(432, "h2", 197);
    \u0275\u0275text(433, "Preguntas Frecuentes");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(434, "div", 106)(435, "div", 198);
    \u0275\u0275element(436, "input", 199);
    \u0275\u0275elementStart(437, "div", 200);
    \u0275\u0275text(438, "\xBFLa reparaci\xF3n tiene garant\xEDa?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(439, "div", 201)(440, "p");
    \u0275\u0275text(441, "S\xED, 30 d\xEDas de garant\xEDa escrita sobre el repuesto y la mano de obra.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(442, "div", 198);
    \u0275\u0275element(443, "input", 202);
    \u0275\u0275elementStart(444, "div", 200);
    \u0275\u0275text(445, "\xBFCu\xE1nto tarda el arreglo?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(446, "div", 201)(447, "p");
    \u0275\u0275text(448, "Muchas reparaciones (como cambios de pantalla) est\xE1n listas en 2 a 4 horas. Adem\xE1s, contamos con una ");
    \u0275\u0275elementStart(449, "strong");
    \u0275\u0275text(450, "App de Seguimiento");
    \u0275\u0275elementEnd();
    \u0275\u0275text(451, " exclusiva para que veas el estado de tu equipo minuto a minuto.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(452, "div", 198);
    \u0275\u0275element(453, "input", 202);
    \u0275\u0275elementStart(454, "div", 200);
    \u0275\u0275text(455, "\xBFSe borran mis datos?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(456, "div", 201)(457, "p")(458, "strong");
    \u0275\u0275text(459, "No.");
    \u0275\u0275elementEnd();
    \u0275\u0275text(460, " Respetamos absolutamente tu privacidad. No accedemos a fotos, contactos ni chats. Si fuera necesario borrar algo (casos de software extremos), siempre pedimos autorizaci\xF3n previa. Tus datos est\xE1n seguros.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(461, "div", 198);
    \u0275\u0275element(462, "input", 202);
    \u0275\u0275elementStart(463, "div", 200);
    \u0275\u0275text(464, "\xBFAceptan tarjetas de cr\xE9dito/d\xE9bito?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(465, "div", 201)(466, "p");
    \u0275\u0275text(467, "S\xED, aceptamos efectivo, transferencia, tarjetas de cr\xE9dito y d\xE9bito, y Mercado Pago. Consult\xE1 por cuotas vigentes.");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(468, "div", 203);
    \u0275\u0275element(469, "div", 204)(470, "div", 205);
    \u0275\u0275elementStart(471, "div", 115)(472, "h2", 206);
    \u0275\u0275text(473, "Opiniones Reales");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(474, "div", 96)(475, "div", 207);
    \u0275\u0275element(476, "i", 208);
    \u0275\u0275elementStart(477, "div", 209);
    \u0275\u0275element(478, "i", 59)(479, "i", 59)(480, "i", 59)(481, "i", 59)(482, "i", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(483, "p", 210);
    \u0275\u0275text(484, '"Me salvaron el celular que se me hab\xEDa ca\xEDdo al agua. En otro lado me dijeron que no serv\xEDa m\xE1s. Unos genios."');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(485, "div", 211)(486, "div", 212);
    \u0275\u0275text(487, "L");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(488, "span", 213);
    \u0275\u0275text(489, "Lucas M.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(490, "div", 207);
    \u0275\u0275element(491, "i", 208);
    \u0275\u0275elementStart(492, "div", 209);
    \u0275\u0275element(493, "i", 59)(494, "i", 59)(495, "i", 59)(496, "i", 59)(497, "i", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(498, "p", 210);
    \u0275\u0275text(499, '"Excelente atenci\xF3n. Me cambiaron la bater\xEDa del iPhone en el momento y me mostraron la condici\xF3n en la compu."');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(500, "div", 211)(501, "div", 214);
    \u0275\u0275text(502, "S");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(503, "span", 213);
    \u0275\u0275text(504, "Sofia R.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(505, "div", 207);
    \u0275\u0275element(506, "i", 208);
    \u0275\u0275elementStart(507, "div", 209);
    \u0275\u0275element(508, "i", 59)(509, "i", 59)(510, "i", 59)(511, "i", 59)(512, "i", 59);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(513, "p", 210);
    \u0275\u0275text(514, '"Muy profesional el sistema de seguimiento. Sab\xEDa exactamente cu\xE1ndo estaba listo mi equipo para retirar."');
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(515, "div", 211)(516, "div", 215);
    \u0275\u0275text(517, "P");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(518, "span", 213);
    \u0275\u0275text(519, "Pablo G.");
    \u0275\u0275elementEnd()()()()()();
    \u0275\u0275elementStart(520, "div", 216)(521, "div", 217)(522, "div", 218)(523, "div", 219);
    \u0275\u0275element(524, "i", 220);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(525, "div")(526, "h3", 221);
    \u0275\u0275text(527, "\xA1Listo para reparar tu equipo?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(528, "p", 222);
    \u0275\u0275text(529, "Mencion\xE1 que ven\xEDs de la web y obten\xE9 un ");
    \u0275\u0275elementStart(530, "span", 223);
    \u0275\u0275text(531, "10% OFF");
    \u0275\u0275elementEnd();
    \u0275\u0275text(532, " en mano de obra.");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(533, "button", 224);
    \u0275\u0275listener("click", function PostPage_Conditional_3_Conditional_0_Template_button_click_533_listener() {
      \u0275\u0275restoreView(_r2);
      const contactSection_r4 = \u0275\u0275reference(536);
      return \u0275\u0275resetView(contactSection_r4.scrollIntoView({ behavior: "smooth" }));
    });
    \u0275\u0275text(534, " Quiero mi Descuento ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(535, "div", 225, 1)(537, "div", 156)(538, "div", 226)(539, "h2", 227);
    \u0275\u0275text(540, "\xBFTen\xE9s alguna duda?");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(541, "form", 228);
    \u0275\u0275listener("ngSubmit", function PostPage_Conditional_3_Conditional_0_Template_form_ngSubmit_541_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r0.sendContactForm());
    });
    \u0275\u0275elementStart(542, "div", 229)(543, "div")(544, "label", 230);
    \u0275\u0275text(545, "Nombre");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(546, "input", 231);
    \u0275\u0275twoWayListener("ngModelChange", function PostPage_Conditional_3_Conditional_0_Template_input_ngModelChange_546_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.contactName, $event) || (ctx_r0.contactName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(547, "div")(548, "label", 230);
    \u0275\u0275text(549, "Tel\xE9fono / WhatsApp");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(550, "input", 232);
    \u0275\u0275twoWayListener("ngModelChange", function PostPage_Conditional_3_Conditional_0_Template_input_ngModelChange_550_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.contactPhone, $event) || (ctx_r0.contactPhone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(551, "div", 233)(552, "label", 230);
    \u0275\u0275text(553, "Mensaje / Consulta");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(554, "textarea", 234);
    \u0275\u0275twoWayListener("ngModelChange", function PostPage_Conditional_3_Conditional_0_Template_textarea_ngModelChange_554_listener($event) {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext(2);
      \u0275\u0275twoWayBindingSet(ctx_r0.contactMessage, $event) || (ctx_r0.contactMessage = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(555, "button", 235);
    \u0275\u0275conditionalCreate(556, PostPage_Conditional_3_Conditional_0_Conditional_556_Template, 1, 0, "span", 236);
    \u0275\u0275text(557, " Enviar Consulta ");
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(3);
    \u0275\u0275property("src", ctx_r0.post.image || "assets/img/hero-repair.jpg", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(12);
    \u0275\u0275textInterpolate(ctx_r0.post.title);
    \u0275\u0275advance(531);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.contactName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.contactPhone);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r0.contactMessage);
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r0.sendingContact);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.sendingContact ? 556 : -1);
  }
}
function PostPage_Conditional_3_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 237);
    \u0275\u0275element(1, "div", 251)(2, "img", 252);
    \u0275\u0275elementStart(3, "div", 253)(4, "div", 77)(5, "a", 254);
    \u0275\u0275element(6, "i", 255);
    \u0275\u0275text(7, " Volver ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h1", 256);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "div", 257)(11, "span", 258);
    \u0275\u0275text(12, "Blog");
    \u0275\u0275elementEnd();
    \u0275\u0275element(13, "i", 259);
    \u0275\u0275elementStart(14, "time");
    \u0275\u0275text(15);
    \u0275\u0275pipe(16, "date");
    \u0275\u0275elementEnd()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(2);
    \u0275\u0275property("src", ctx_r0.post.image, \u0275\u0275sanitizeUrl)("alt", ctx_r0.post.title);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1(" ", ctx_r0.post.title, " ");
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(16, 4, ctx_r0.post.created_at, "longDate"));
  }
}
function PostPage_Conditional_3_Conditional_1_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 238)(1, "div", 77)(2, "a", 260);
    \u0275\u0275element(3, "i", 255);
    \u0275\u0275text(4, " Volver al Inicio ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "h1", 261);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 262);
    \u0275\u0275element(8, "i", 259);
    \u0275\u0275elementStart(9, "time");
    \u0275\u0275text(10);
    \u0275\u0275pipe(11, "date");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(3);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", ctx_r0.post.title, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(11, 2, ctx_r0.post.created_at, "longDate"));
  }
}
function PostPage_Conditional_3_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "article");
    \u0275\u0275conditionalCreate(1, PostPage_Conditional_3_Conditional_1_Conditional_1_Template, 17, 7, "div", 237)(2, PostPage_Conditional_3_Conditional_1_Conditional_2_Template, 12, 5, "div", 238);
    \u0275\u0275elementStart(3, "div", 239);
    \u0275\u0275element(4, "div", 240);
    \u0275\u0275elementStart(5, "div", 241)(6, "div", 242)(7, "div", 243);
    \u0275\u0275text(8, " Compartir esta entrada: ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 244)(10, "button", 245);
    \u0275\u0275element(11, "i", 246);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "button", 247);
    \u0275\u0275element(13, "i", 248);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "button", 249);
    \u0275\u0275element(15, "i", 250);
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.post.image ? 1 : 2);
    \u0275\u0275advance(3);
    \u0275\u0275property("innerHTML", ctx_r0.post.content, \u0275\u0275sanitizeHtml);
  }
}
function PostPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, PostPage_Conditional_3_Conditional_0_Template, 558, 7, "div", 11)(1, PostPage_Conditional_3_Conditional_1_Template, 16, 2, "article");
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275conditional(ctx_r0.currentSlug === "servicio-tecnico-de-celulares-en-marcos-paz" ? 0 : 1);
  }
}
var PostPage = class _PostPage {
  route = inject(ActivatedRoute);
  postService = inject(PostService);
  cdr = inject(ChangeDetectorRef);
  titleService = inject(Title);
  metaService = inject(Meta);
  auth = inject(AuthService);
  contactService = inject(ContactService);
  document = inject(DOCUMENT);
  post = null;
  loading = true;
  error = null;
  currentSlug = null;
  jsonLdScript = null;
  // Contact Form Data
  contactName = "";
  contactPhone = "";
  contactMessage = "";
  sendingContact = false;
  async ngOnInit() {
    this.route.paramMap.subscribe(async (params) => {
      const slug = params.get("slug");
      if (slug) {
        await this.loadPost(slug);
      }
    });
  }
  ngOnDestroy() {
    this.removeJsonLd();
  }
  async loadPost(slug) {
    try {
      this.loading = true;
      this.error = null;
      this.post = await this.postService.getPostBySlug(slug);
      this.currentSlug = slug;
      if (this.post) {
        this.handleSeo(this.post, slug);
      } else {
        if (slug.includes("tcnico")) {
          const correctedSlug = slug.replace("tcnico", "tecnico");
          this.post = await this.postService.getPostBySlug(correctedSlug);
          if (this.post) {
            this.handleSeo(this.post, correctedSlug);
            return;
          }
        }
        this.error = "Entrada no encontrada";
      }
    } catch (e) {
      this.error = "Error al cargar la entrada";
    } finally {
      this.loading = false;
      this.cdr.markForCheck();
    }
  }
  handleSeo(post, slug) {
    const isLandingPage = slug === "servicio-tecnico-de-celulares-en-marcos-paz";
    if (isLandingPage) {
      this.titleService.setTitle("Servicio T\xE9cnico de Celulares en Marcos Paz | Arecofix - Reparaci\xF3n en el Acto");
      this.metaService.updateTag({
        name: "description",
        content: "Reparaci\xF3n de celulares en Marcos Paz. Cambio de m\xF3dulo, bater\xEDa y pin de carga en el acto. Especialistas en iPhone, Samsung y Motorola. \xA1Ped\xED tu presupuesto GRATIS!"
      });
      this.metaService.updateTag({
        name: "keywords",
        content: "servicio tecnico celulares marcos paz, reparacion celulares, cambio pantalla iphone, arreglo samsung, cambio bateria celular, marcos paz, motorola, xiaomi, lg"
      });
      this.metaService.updateTag({ property: "og:title", content: "Reparaci\xF3n de Celulares en Marcos Paz | Arecofix" });
      this.metaService.updateTag({ property: "og:description", content: "Servicio t\xE9cnico especializado. Reparamos iPhone, Samsung, Motorola y m\xE1s en el acto. \xA1Tu celular en las mejores manos!" });
      this.metaService.updateTag({ property: "og:image", content: `${environment.baseUrl}/assets/img/repair/1.jpg` });
      this.metaService.updateTag({ property: "og:url", content: `${environment.baseUrl}/posts/servicio-tecnico-de-celulares-en-marcos-paz` });
      this.metaService.updateTag({ property: "og:type", content: "website" });
      this.injectJsonLd();
    } else {
      this.titleService.setTitle(`${post.title} | Arecofix`);
      if (post.meta_description) {
        this.metaService.updateTag({ name: "description", content: post.meta_description });
      }
      if (post.meta_title) {
        this.metaService.updateTag({ name: "title", content: post.meta_title });
      }
    }
  }
  injectJsonLd() {
    this.removeJsonLd();
    const schema = {
      "@context": "https://schema.org",
      "@type": "MobilePhoneStore",
      "name": "Arecofix - Servicio T\xE9cnico de Celulares",
      "image": `${environment.baseUrl}/assets/img/cursos/local.webp`,
      "description": "Servicio t\xE9cnico especializado en reparaci\xF3n de celulares en Marcos Paz. Cambio de pantallas, bater\xEDas y micro-soldadura.",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Sarmiento 2050",
        // Placeholder address
        "addressLocality": "Marcos Paz",
        "addressRegion": "Buenos Aires",
        "postalCode": "1727",
        "addressCountry": "AR"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": "-34.77",
        // Placeholder
        "longitude": "-58.83"
        // Placeholder
      },
      "url": environment.baseUrl,
      "telephone": "+5491125960900",
      "priceRange": "$$",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
          "opens": "09:00",
          "closes": "20:00"
        }
      ],
      "sameAs": [
        "https://www.instagram.com/arecofix",
        "https://www.facebook.com/arecofix"
      ]
    };
    this.jsonLdScript = this.document.createElement("script");
    this.jsonLdScript.type = "application/ld+json";
    this.jsonLdScript.text = JSON.stringify(schema);
    this.document.head.appendChild(this.jsonLdScript);
  }
  removeJsonLd() {
    if (this.jsonLdScript) {
      this.document.head.removeChild(this.jsonLdScript);
      this.jsonLdScript = null;
    }
  }
  async sendContactForm() {
    if (!this.contactName || !this.contactPhone || !this.contactMessage) {
      alert("Por favor completa todos los campos");
      return;
    }
    this.sendingContact = true;
    this.cdr.markForCheck();
    try {
      await this.contactService.createMessage({
        name: this.contactName,
        phone: this.contactPhone,
        email: "web-contact@arecofix.com",
        // Placeholder
        subject: "Consulta desde Landing Servicio T\xE9cnico",
        message: this.contactMessage
      });
      alert("\xA1Consulta enviada con \xE9xito! Te responderemos a la brevedad.");
      this.contactName = "";
      this.contactPhone = "";
      this.contactMessage = "";
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Ocurri\xF3 un error al enviar el mensaje. Por favor intenta por WhatsApp.");
    } finally {
      this.sendingContact = false;
      this.cdr.markForCheck();
    }
  }
  static \u0275fac = function PostPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PostPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PostPage, selectors: [["app-post-page"]], decls: 4, vars: 1, consts: [["reservationSection", ""], ["contactSection", ""], [1, "min-h-screen", "bg-white"], [1, "flex", "justify-center", "items-center", "h-screen"], [1, "flex", "flex-col", "items-center", "justify-center", "h-[60vh]", "text-center", "px-4"], [1, "animate-spin", "rounded-full", "h-12", "w-12", "border-t-2", "border-b-2", "border-indigo-600"], [1, "bg-red-50", "p-4", "rounded-full", "mb-4"], [1, "fas", "fa-exclamation-triangle", "text-red-500", "text-2xl"], [1, "text-2xl", "font-bold", "text-gray-900", "mb-2"], [1, "text-gray-500", "mb-6"], ["routerLink", "/", 1, "px-6", "py-3", "bg-indigo-600", "hover:bg-indigo-700", "text-white", "font-medium", "rounded-full", "transition-colors"], [1, "font-sans", "text-gray-800"], [1, "relative", "bg-gray-900", "text-white", "overflow-hidden"], [1, "absolute", "inset-0", "z-0"], ["alt", "Reparaci\xF3n de Celulares Marcos Paz", 1, "w-full", "h-full", "object-cover", "opacity-20", 3, "src"], [1, "absolute", "inset-0", "bg-linear-to-b", "from-gray-900/50", "to-gray-900"], [1, "relative", "z-10", "container", "mx-auto", "px-4", "py-20", "md:py-32", "flex", "flex-col", "items-center", "text-center"], [1, "text-sm", "breadcrumbs", "text-gray-400", "mb-6", "-mt-8"], ["routerLink", "/", 1, "hover:text-white", "transition-colors"], ["routerLink", "/blog", 1, "hover:text-white", "transition-colors"], [1, "font-semibold", "text-white", "truncate", "max-w-[200px]"], [1, "inline-block", "py-1", "px-3", "rounded-full", "bg-indigo-500/20", "border", "border-indigo-500/30", "text-indigo-300", "text-sm", "font-bold", "tracking-wide", "uppercase", "mb-6", "animate-fade-in-up"], [1, "text-4xl", "md:text-6xl", "font-extrabold", "mb-6", "leading-tight", "animate-fade-in-up", "delay-100"], [1, "text-indigo-400"], [1, "text-white/80", "text-3xl", "md:text-5xl"], [1, "text-xl", "text-gray-300", "max-w-2xl", "mb-10", "leading-relaxed", "animate-fade-in-up", "delay-200"], [1, "flex", "flex-col", "sm:flex-row", "gap-4", "w-full", "sm:w-auto", "animate-fade-in-up", "delay-300"], [1, "btn", "btn-primary", "bg-indigo-600", "border-none", "hover:bg-indigo-500", "text-white", "px-8", "py-4", "h-auto", "text-lg", "rounded-full", "shadow-lg", "shadow-indigo-900/50", "transition-all", "transform", "hover:scale-105", 3, "click"], [1, "far", "fa-calendar-check", "mr-2"], ["href", "https://wa.me/5491125960900", "target", "_blank", 1, "btn", "btn-outline", "text-white", "hover:bg-white", "hover:text-gray-900", "px-8", "py-4", "h-auto", "text-lg", "rounded-full"], [1, "fab", "fa-whatsapp", "mr-2"], [1, "mt-20", "grid", "grid-cols-2", "md:grid-cols-4", "gap-4", "w-full", "max-w-4xl", "text-left"], [1, "bg-white/10", "backdrop-blur-sm", "p-4", "rounded-xl", "border", "border-white/10", "hover:bg-white/20", "transition-colors"], [1, "fas", "fa-mobile-alt", "text-red-400", "text-2xl", "mb-2"], [1, "font-bold", "text-sm"], [1, "text-xs", "text-gray-400"], [1, "fas", "fa-battery-empty", "text-yellow-400", "text-2xl", "mb-2"], [1, "fas", "fa-charging-station", "text-green-400", "text-2xl", "mb-2"], [1, "fas", "fa-water", "text-blue-400", "text-2xl", "mb-2"], [1, "py-20", "bg-gray-50"], [1, "container", "mx-auto", "px-4"], [1, "flex", "flex-col", "md:flex-row", "items-center", "gap-12"], [1, "md:w-1/2"], [1, "text-indigo-600", "font-bold", "tracking-widest", "uppercase", "text-sm"], [1, "text-3xl", "font-bold", "text-gray-900", "mt-2", "mb-6"], [1, "text-lg", "text-gray-600", "mb-6"], [1, "flex", "flex-wrap", "gap-8", "opacity-70", "grayscale", "items-center", "justify-center", "md:justify-start"], [1, "flex", "flex-col", "items-center"], [1, "fab", "fa-apple", "text-5xl", "mb-2"], [1, "text-xs", "font-bold"], [1, "fab", "fa-android", "text-5xl", "text-green-600", "mb-2"], [1, "font-bold", "text-xl", "mb-2"], [1, "text-xs", "text-gray-500"], [1, "md:w-1/2", "relative"], [1, "absolute", "-inset-4", "bg-indigo-600/20", "rounded-full", "blur-3xl"], ["src", "assets/img/repair/apple.jpg", "alt", "Especialistas Apple Marcos Paz", 1, "relative", "rounded-2xl", "shadow-2xl", "transform", "rotate-1", "hover:rotate-0", "transition-transform", "duration-500", "w-full", "object-cover"], [1, "absolute", "-bottom-6", "-right-6", "bg-white", "p-4", "rounded-xl", "shadow-xl", "border", "border-gray-100", "hidden", "md:block"], [1, "text-sm", "font-bold", "text-gray-900"], [1, "flex", "text-yellow-400", "text-xs", "mt-1"], [1, "fas", "fa-star"], [1, "py-20", "bg-white", "border-b", "border-gray-100"], [1, "text-center", "mb-12"], [1, "text-3xl", "font-bold", "text-gray-900"], [1, "text-gray-500", "mt-2"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-6"], [1, "text-center", "p-6", "border", "rounded-xl", "hover:shadow-lg", "transition-all", "group", "cursor-pointer", "hover:border-indigo-500"], [1, "w-16", "h-16", "mx-auto", "bg-blue-50", "text-blue-500", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "mb-4", "group-hover:bg-blue-500", "group-hover:text-white", "transition-colors"], [1, "fas", "fa-mobile-alt"], [1, "font-bold", "text-lg", "mb-2"], [1, "text-sm", "text-gray-400"], [1, "w-16", "h-16", "mx-auto", "bg-green-50", "text-green-500", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "mb-4", "group-hover:bg-green-500", "group-hover:text-white", "transition-colors"], [1, "fas", "fa-battery-full"], [1, "w-16", "h-16", "mx-auto", "bg-yellow-50", "text-yellow-500", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "mb-4", "group-hover:bg-yellow-500", "group-hover:text-white", "transition-colors"], [1, "fas", "fa-bolt"], [1, "w-16", "h-16", "mx-auto", "bg-purple-50", "text-purple-500", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "mb-4", "group-hover:bg-purple-500", "group-hover:text-white", "transition-colors"], [1, "fas", "fa-microchip"], [1, "py-20", "bg-white"], [1, "container", "mx-auto", "px-4", "max-w-4xl"], [1, "text-3xl", "font-bold", "text-gray-900", "mb-4"], [1, "text-gray-500"], [1, "overflow-x-auto", "bg-white", "rounded-xl", "shadow-lg", "border", "border-gray-100"], [1, "table", "w-full"], [1, "bg-gray-50", "text-gray-600", "text-sm", "uppercase"], [1, "py-4", "px-6", "text-left"], [1, "py-4", "px-6", "text-right"], [1, "text-gray-700"], [1, "border-b", "border-gray-100", "hover:bg-gray-50"], [1, "py-4", "px-6", "font-medium"], [1, "fas", "fa-microscope", "text-indigo-500", "mr-2"], [1, "py-4", "px-6", "text-right", "font-bold", "text-green-600"], [1, "py-4", "px-6", "text-right", "font-bold"], [1, "hover:bg-gray-50"], [1, "text-xs", "text-gray-400", "mt-4", "text-center"], [1, "py-20", "bg-gray-50", "border-y", "border-gray-200"], [1, "text-center", "mb-16"], [1, "text-3xl", "md:text-4xl", "font-bold", "mt-2", "text-gray-900"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-8"], [1, "bg-white", "p-8", "rounded-2xl", "shadow-sm", "border", "border-gray-100", "text-center", "hover:shadow-md", "transition-shadow"], [1, "w-16", "h-16", "mx-auto", "bg-indigo-100", "rounded-full", "flex", "items-center", "justify-center", "text-indigo-600", "text-2xl", "mb-6"], [1, "fas", "fa-medal"], [1, "text-xl", "font-bold", "text-gray-900", "mb-3"], [1, "text-gray-600"], [1, "w-16", "h-16", "mx-auto", "bg-green-100", "rounded-full", "flex", "items-center", "justify-center", "text-green-600", "text-2xl", "mb-6"], [1, "fas", "fa-check-shield"], [1, "w-16", "h-16", "mx-auto", "bg-blue-100", "rounded-full", "flex", "items-center", "justify-center", "text-blue-600", "text-2xl", "mb-6"], [1, "py-20", "bg-white", "overflow-hidden"], [1, "space-y-4"], [1, "flex", "items-center", "text-gray-700"], [1, "fas", "fa-microscope", "text-indigo-500", "w-8"], [1, "fas", "fa-temperature-high", "text-indigo-500", "w-8"], [1, "fas", "fa-layer-group", "text-indigo-500", "w-8"], [1, "fas", "fa-laptop-code", "text-indigo-500", "w-8"], ["src", "assets/img/repair/6.jpg", "alt", "Microscopio y Laboratorio", 1, "relative", "rounded-2xl", "shadow-2xl", "transform", "rotate-2", "hover:rotate-0", "transition-transform", "duration-500"], [1, "bg-gray-900", "text-white", "py-20", "relative", "overflow-hidden"], [1, "absolute", "inset-0", "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]", "opacity-10"], [1, "container", "mx-auto", "px-4", "relative", "z-10"], [1, "text-3xl", "font-bold"], [1, "text-gray-400", "mt-2"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "md:grid-cols-4", "gap-8"], [1, "relative", "items-center", "flex", "flex-col", "group"], [1, "w-20", "h-20", "bg-indigo-600", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "font-bold", "mb-6", "shadow-lg", "shadow-indigo-500/50", "group-hover:scale-110", "transition-transform"], [1, "fas", "fa-store"], [1, "text-xl", "font-bold", "mb-2"], [1, "text-gray-400", "text-center", "text-sm", "px-4"], [1, "w-20", "h-20", "bg-gray-800", "border", "border-gray-700", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "font-bold", "mb-6", "group-hover:border-indigo-500", "transition-colors"], [1, "fas", "fa-tools", "text-indigo-400"], [1, "w-20", "h-20", "bg-gray-800", "border", "border-gray-700", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "font-bold", "mb-6", "group-hover:border-green-500", "transition-colors"], [1, "fas", "fa-mobile-alt", "text-green-400"], [1, "text-xl", "font-bold", "mb-2", "text-green-400"], [1, "w-20", "h-20", "bg-white", "text-gray-900", "rounded-full", "flex", "items-center", "justify-center", "text-3xl", "font-bold", "mb-6", "shadow-xl"], [1, "fas", "fa-smile-beam", "text-yellow-500"], [1, "py-20", "bg-indigo-50"], [1, "text-3xl", "font-bold", "text-center", "text-gray-900", "mb-4"], [1, "text-center", "text-gray-600", "mb-12"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4"], [1, "col-span-2", "row-span-2", "rounded-xl", "overflow-hidden", "shadow-md", "group", "relative", "bg-black"], ["src", "assets/img/repair/4.mp4", "controls", "", "playsinline", "", "preload", "metadata", "poster", "assets/img/repair/1.jpg", 1, "w-full", "h-full", "object-cover"], [1, "aspect-square", "rounded-xl", "overflow-hidden", "shadow-md", "hover:shadow-xl", "transition-all", "hover:scale-105", "cursor-pointer", "group", "relative"], ["src", "assets/img/repair/1.jpg", "alt", "Reparaci\xF3n Arecofix 1", 1, "w-full", "h-full", "object-cover"], ["src", "assets/img/repair/2.jpg", "alt", "Reparaci\xF3n Arecofix 2", 1, "w-full", "h-full", "object-cover"], ["src", "assets/img/repair/3.jpg", "alt", "Reparaci\xF3n Arecofix 3", 1, "w-full", "h-full", "object-cover"], ["src", "assets/img/repair/iphone.jpg", "alt", "Nuestro Local", 1, "w-full", "h-full", "object-cover"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-16"], [1, "text-2xl", "font-bold", "text-gray-900", "mb-4"], [1, "text-gray-600", "mb-6"], [1, "font-bold", "text-indigo-600"], [1, "space-y-3"], [1, "flex", "items-start"], [1, "fas", "fa-check", "text-green-500", "mt-1", "mr-3"], ["src", "assets/img/cursos/local.jpg", "alt", "Repuestos iPhone", 1, "rounded-xl", "shadow-lg", "mb-6", "w-full", "h-48", "object-cover"], [1, "p-4", "border", "border-indigo-100", "rounded-lg", "bg-indigo-50"], [1, "font-bold", "text-indigo-700"], [1, "text-sm", "text-gray-600"], [1, "p-4", "border", "border-gray-200", "rounded-lg"], [1, "font-bold", "text-gray-800"], [1, "py-16", "bg-gray-50", "text-center"], [1, "container", "mx-auto", "px-4", "max-w-2xl"], [1, "fas", "fa-user-lock", "text-5xl", "text-gray-400", "mb-6"], [1, "font-bold"], [1, "py-0"], [1, "grid", "grid-cols-1", "md:grid-cols-2"], [1, "bg-gray-900", "text-white", "p-12", "flex", "flex-col", "justify-center"], [1, "text-indigo-400", "font-bold", "uppercase", "tracking-widest", "text-sm", "mb-4"], [1, "text-3xl", "font-bold", "mb-6"], [1, "text-xl", "mb-8", "text-gray-300"], [1, "fas", "fa-map-marker-alt", "text-red-500", "mr-2"], [1, "mb-2"], [1, "mb-8"], ["href", "https://maps.app.goo.gl/somelink", "target", "_blank", 1, "btn", "btn-outline", "text-white", "hover:bg-white", "hover:text-gray-900", "w-fit"], [1, "fas", "fa-directions", "mr-2"], [1, "h-96", "md:h-auto", "bg-gray-200"], ["src", \u0275\u0275trustConstantResourceUrl`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.539502732569!2d-58.81797292339245!3d-34.76719126615129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bceb46770c86eb%3A0x73b48d51a83e8107!2sARECOFIX%20Servicio%20t%C3%A9cnico%20de%20celulares%20%7C%20Venta%20de%20Repuestos.!5e0!3m2!1ses-419!2sar!4v1771631396545!5m2!1ses-419!2sar`, "width", "100%", "height", "100%", "allowfullscreen", "", "loading", "lazy", "referrerpolicy", "no-referrer-when-downgrade", 2, "border", "0"], [1, "py-20", "bg-indigo-600"], [1, "container", "mx-auto", "px-4", "text-center", "mb-12"], [1, "text-3xl", "font-bold", "text-white", "mb-4"], [1, "text-indigo-100", "max-w-2xl", "mx-auto"], [1, "px-4"], [1, "py-12", "bg-gray-50", "border-b", "border-gray-200"], [1, "container", "mx-auto", "px-4", "text-center"], [1, "text-sm", "font-bold", "text-gray-400", "uppercase", "tracking-widest", "mb-8"], [1, "flex", "justify-center", "items-center", "gap-12", "flex-wrap", "opacity-60", "grayscale", "hover:grayscale-0", "transition-all"], [1, "flex", "items-center", "gap-2", "text-xl", "font-bold", "text-cyan-600"], [1, "fas", "fa-user-md"], [1, "flex", "items-center", "gap-2", "text-xl", "font-bold", "text-blue-600"], [1, "fab", "fa-google"], [1, "flex", "items-center", "gap-2", "text-xl", "font-bold", "text-blue-400"], [1, "mt-8", "pt-8", "border-t", "border-gray-200"], [1, "text-xs", "text-gray-400", "uppercase", "tracking-widest", "mb-4"], [1, "flex", "flex-col", "md:flex-row", "justify-center", "items-center", "gap-4", "font-serif", "text-gray-500", "text-sm", "flex-wrap"], ["href", "https://laelectronicaonline.com.ar/casa-electronica/arecofix-servicio-tecnico-de-celulares-venta-de-repuestos/", "target", "_blank", "rel", "nofollow", 1, "hover:text-indigo-600", "transition-colors", "border-b", "border-gray-200", "hover:border-indigo-500"], [1, "hidden", "md:inline", "text-gray-300"], ["href", "https://www.marcospaz.gob.ar/noticias/item/8551-j%C3%B3venes-del-programa-envi%C3%B3n-finalizaron-el-curso-de-reparaci%C3%B3n-de-celulares.html", "target", "_blank", "rel", "nofollow", 1, "hover:text-indigo-600", "transition-colors", "border-b", "border-gray-200", "hover:border-indigo-500"], ["href", "https://a1noticias.com.ar/nota/9798/marcos-paz-jovenes-del-programa-envion-finalizaron-el-curso-de-reparacion-de-celulares", "target", "_blank", "rel", "nofollow", 1, "hover:text-indigo-600", "transition-colors", "border-b", "border-gray-200", "hover:border-indigo-500"], ["href", "https://mobidoc.com.ar/servicio-tecnico/arecofix-soluciones-digitales/", "target", "_blank", "rel", "dofollow", 1, "hover:text-indigo-600", "transition-colors", "border-b", "border-gray-200", "hover:border-indigo-500"], ["href", "https://www.redargentina.com.ar/arecofix-servicio-tecnico-de-celulares-en-marcos-paz-F120EC10E1AD945", "target", "_blank", "rel", "nofollow", 1, "hover:text-indigo-600", "transition-colors", "border-b", "border-gray-200", "hover:border-indigo-500"], ["href", "https://noticias.marcospazconectada.com/2023/02/09/termino-el-curso-de-reparacion-de-celulares-del-programa-envion/", "target", "_blank", "rel", "nofollow", 1, "hover:text-indigo-600", "transition-colors", "border-b", "border-gray-200", "hover:border-indigo-500"], [1, "container", "mx-auto", "px-4", "max-w-3xl"], [1, "text-3xl", "font-bold", "text-center", "text-gray-900", "mb-12"], [1, "collapse", "collapse-arrow", "bg-gray-50", "border", "border-gray-100", "rounded-xl"], ["type", "radio", "name", "faq", "checked", ""], [1, "collapse-title", "text-xl", "font-medium"], [1, "collapse-content"], ["type", "radio", "name", "faq"], [1, "py-20", "bg-indigo-900", "overflow-hidden", "relative"], [1, "absolute", "inset-0", "bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]", "opacity-10"], [1, "absolute", "inset-0", "bg-linear-to-b", "from-indigo-900/50", "via-indigo-800/20", "to-indigo-900/90", "pointer-events-none"], [1, "text-3xl", "font-bold", "text-center", "text-white", "mb-16", "drop-shadow-md"], [1, "bg-white/10", "backdrop-blur-md", "p-8", "rounded-2xl", "border", "border-white/10", "relative", "shadow-xl", "hover:bg-white/15", "transition-all", "duration-300", "hover:-translate-y-1"], [1, "fas", "fa-quote-left", "text-4xl", "text-indigo-400", "absolute", "-top-4", "-left-4", "bg-gray-900", "rounded-full", "p-2", "border", "border-gray-700"], [1, "flex", "text-yellow-400", "mb-4"], [1, "text-gray-200", "italic", "mb-6", "leading-relaxed"], [1, "flex", "items-center", "gap-3", "border-t", "border-white/10", "pt-4"], [1, "w-10", "h-10", "bg-indigo-500", "rounded-full", "flex", "items-center", "justify-center", "font-bold", "text-white", "shadow-lg"], [1, "text-white", "font-bold", "tracking-wide"], [1, "w-10", "h-10", "bg-pink-500", "rounded-full", "flex", "items-center", "justify-center", "font-bold", "text-white", "shadow-lg"], [1, "w-10", "h-10", "bg-green-500", "rounded-full", "flex", "items-center", "justify-center", "font-bold", "text-white", "shadow-lg"], [1, "py-12", "bg-linear-to-r", "from-yellow-400", "to-orange-500", "text-gray-900"], [1, "container", "mx-auto", "px-4", "flex", "flex-col", "md:flex-row", "items-center", "justify-between", "gap-6"], [1, "flex", "items-center", "gap-4"], [1, "bg-white", "p-3", "rounded-full", "text-orange-500", "shadow-md"], [1, "fas", "fa-tags", "text-2xl"], [1, "text-2xl", "font-bold"], [1, "font-medium", "text-gray-800"], [1, "bg-black", "text-yellow-400", "px-2", "rounded", "font-bold"], [1, "btn", "bg-black", "text-white", "border-none", "hover:bg-gray-800", "px-8", "rounded-full", "shadow-lg", 3, "click"], ["id", "contact", 1, "py-20", "bg-gray-50"], [1, "bg-white", "p-8", "md:p-12", "rounded-2xl", "shadow-xl", "border", "border-gray-100"], [1, "text-3xl", "font-bold", "text-gray-900", "mb-6", "text-center"], [3, "ngSubmit"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-6", "mb-6"], [1, "label-text", "font-medium", "mb-2", "block"], ["type", "text", "name", "name", "placeholder", "Tu nombre", "required", "", 1, "input", "input-bordered", "w-full", "text-gray-900", "bg-white", 3, "ngModelChange", "ngModel"], ["type", "tel", "name", "phone", "placeholder", "Ej: 11 1234 5678", "required", "", 1, "input", "input-bordered", "w-full", "text-gray-900", "bg-white", 3, "ngModelChange", "ngModel"], [1, "mb-6"], ["name", "message", "placeholder", "Hola, tengo un Samsung A32 que no carga...", "required", "", 1, "textarea", "textarea-bordered", "w-full", "h-32", "text-gray-900", "bg-white", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "btn", "btn-primary", "w-full", "text-lg", 3, "disabled"], [1, "loading", "loading-spinner"], [1, "relative", "h-[40vh]", "md:h-[50vh]", "w-full", "overflow-hidden"], [1, "bg-gray-900", "py-20", "md:py-32"], [1, "container", "mx-auto", "px-4", "max-w-3xl", "py-12", "md:py-20"], [1, "prose", "prose-lg", "md:prose-xl", "prose-indigo", "mx-auto", "text-gray-700", "leading-relaxed", 3, "innerHTML"], [1, "mt-16", "pt-8", "border-t", "border-gray-200"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-center", "gap-6"], [1, "text-gray-500", "font-medium"], [1, "flex", "gap-4"], [1, "w-10", "h-10", "rounded-full", "bg-[#25D366]", "text-white", "flex", "items-center", "justify-center", "hover:opacity-90", "transition-opacity"], [1, "fab", "fa-whatsapp", "text-xl"], [1, "w-10", "h-10", "rounded-full", "bg-[#1877F2]", "text-white", "flex", "items-center", "justify-center", "hover:opacity-90", "transition-opacity"], [1, "fab", "fa-facebook-f"], [1, "w-10", "h-10", "rounded-full", "bg-[#1DA1F2]", "text-white", "flex", "items-center", "justify-center", "hover:opacity-90", "transition-opacity"], [1, "fab", "fa-twitter"], [1, "absolute", "inset-0", "bg-black/40", "z-10"], [1, "w-full", "h-full", "object-cover", 3, "src", "alt"], [1, "absolute", "inset-0", "z-20", "flex", "items-end", "pb-12", "md:pb-20"], ["routerLink", "/", 1, "inline-flex", "items-center", "text-white/80", "hover:text-white", "mb-6", "transition-colors", "text-sm", "font-medium", "backdrop-blur-sm", "bg-black/20", "px-3", "py-1", "rounded-full"], [1, "fas", "fa-arrow-left", "mr-2"], [1, "text-3xl", "md:text-5xl", "lg:text-6xl", "font-bold", "text-white", "leading-tight", "drop-shadow-lg", "mb-4"], [1, "flex", "items-center", "text-white/90", "text-sm", "md:text-base", "font-medium"], [1, "bg-indigo-600", "px-3", "py-1", "rounded-full", "text-xs", "uppercase", "tracking-wider", "mr-4"], [1, "far", "fa-calendar-alt", "mr-2"], ["routerLink", "/", 1, "inline-flex", "items-center", "text-white/80", "hover:text-white", "mb-8", "transition-colors", "text-sm", "font-medium"], [1, "text-3xl", "md:text-5xl", "lg:text-6xl", "font-bold", "text-white", "leading-tight", "mb-6"], [1, "flex", "items-center", "text-gray-400", "text-sm", "md:text-base"]], template: function PostPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 2);
      \u0275\u0275conditionalCreate(1, PostPage_Conditional_1_Template, 2, 0, "div", 3)(2, PostPage_Conditional_2_Template, 9, 1, "div", 4)(3, PostPage_Conditional_3_Template, 2, 1);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.loading ? 1 : ctx.error ? 2 : ctx.post ? 3 : -1);
    }
  }, dependencies: [RouterLink, CommonModule, FormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, RequiredValidator, NgModel, NgForm, ReservationCalendar, DatePipe], encapsulation: 2, changeDetection: 0 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PostPage, [{
    type: Component,
    args: [{ selector: "app-post-page", standalone: true, imports: [RouterLink, DatePipe, CommonModule, FormsModule, ReservationCalendar], changeDetection: ChangeDetectionStrategy.OnPush, template: `<div class="min-h-screen bg-white">\r
    @if (loading) {\r
    <div class="flex justify-center items-center h-screen">\r
        <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>\r
    </div>\r
    } @else if (error) {\r
    <div class="flex flex-col items-center justify-center h-[60vh] text-center px-4">\r
        <div class="bg-red-50 p-4 rounded-full mb-4">\r
            <i class="fas fa-exclamation-triangle text-red-500 text-2xl"></i>\r
        </div>\r
        <h2 class="text-2xl font-bold text-gray-900 mb-2">No pudimos cargar la entrada</h2>\r
        <p class="text-gray-500 mb-6">{{ error }}</p>\r
        <a routerLink="/"\r
            class="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-full transition-colors">\r
            Volver al Inicio\r
        </a>\r
    </div>\r
    } @else if (post) {\r
      @if (currentSlug === 'servicio-tecnico-de-celulares-en-marcos-paz') {\r
        <!-- SERVICE LANDING PAGE (OPTIMIZED) -->\r
        <div class="font-sans text-gray-800">\r
            <!-- 1. Hero Section + Problems Solved -->\r
            <div class="relative bg-gray-900 text-white overflow-hidden">\r
                <div class="absolute inset-0 z-0">\r
                    <img [src]="post.image || 'assets/img/hero-repair.jpg'" alt="Reparaci\xF3n de Celulares Marcos Paz" class="w-full h-full object-cover opacity-20">\r
                    <div class="absolute inset-0 bg-linear-to-b from-gray-900/50 to-gray-900"></div>\r
                </div>\r
                <div class="relative z-10 container mx-auto px-4 py-20 md:py-32 flex flex-col items-center text-center">\r
                    <!-- Breadcrumbs -->\r
                    <div class="text-sm breadcrumbs text-gray-400 mb-6 -mt-8">\r
                        <ul>\r
                            <li><a routerLink="/" class="hover:text-white transition-colors">Inicio</a></li>\r
                            <li><a routerLink="/blog" class="hover:text-white transition-colors">Blog</a></li>\r
                            <li class="font-semibold text-white truncate max-w-[200px]">{{ post.title }}</li>\r
                        </ul>\r
                    </div>\r
\r
                    <span class="inline-block py-1 px-3 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-300 text-sm font-bold tracking-wide uppercase mb-6 animate-fade-in-up">Servicio T\xE9cnico en Marcos Paz</span>\r
                    <h1 class="text-4xl md:text-6xl font-extrabold mb-6 leading-tight animate-fade-in-up delay-100">\r
                        Tu celular tiene <span class="text-indigo-400">soluci\xF3n</span>.\r
                        <br><span class="text-white/80 text-3xl md:text-5xl">Nosotros sabemos c\xF3mo.</span>\r
                    </h1>\r
                    <p class="text-xl text-gray-300 max-w-2xl mb-10 leading-relaxed animate-fade-in-up delay-200">\r
                        Especialistas en iPhone y Android. Diagn\xF3stico profesional, repuestos de calidad y garant\xEDa escrita.\r
                    </p>\r
                    \r
                    <div class="flex flex-col sm:flex-row gap-4 w-full sm:w-auto animate-fade-in-up delay-300">\r
                        <button (click)="reservationSection.scrollIntoView({behavior: 'smooth'})" class="btn btn-primary bg-indigo-600 border-none hover:bg-indigo-500 text-white px-8 py-4 h-auto text-lg rounded-full shadow-lg shadow-indigo-900/50 transition-all transform hover:scale-105">\r
                            <i class="far fa-calendar-check mr-2"></i> Reservar Turno\r
                        </button>\r
                        <a href="https://wa.me/5491125960900" target="_blank" class="btn btn-outline text-white hover:bg-white hover:text-gray-900 px-8 py-4 h-auto text-lg rounded-full">\r
                            <i class="fab fa-whatsapp mr-2"></i> Consultar Ahora\r
                        </a>\r
                    </div>\r
\r
                    <!-- Problems Grid (Quick ID) -->\r
                    <div class="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-4xl text-left">\r
                        <div class="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">\r
                            <i class="fas fa-mobile-alt text-red-400 text-2xl mb-2"></i>\r
                            <h3 class="font-bold text-sm">Pantalla Rota</h3>\r
                            <p class="text-xs text-gray-400">Cambio de m\xF3dulo o vidrio</p>\r
                        </div>\r
                        <div class="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">\r
                            <i class="fas fa-battery-empty text-yellow-400 text-2xl mb-2"></i>\r
                            <h3 class="font-bold text-sm">Bater\xEDa Agotada</h3>\r
                            <p class="text-xs text-gray-400">Dura poco o se apaga</p>\r
                        </div>\r
                        <div class="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">\r
                            <i class="fas fa-charging-station text-green-400 text-2xl mb-2"></i>\r
                            <h3 class="font-bold text-sm">No Carga</h3>\r
                            <p class="text-xs text-gray-400">Falla de pin de carga</p>\r
                        </div>\r
                        <div class="bg-white/10 backdrop-blur-sm p-4 rounded-xl border border-white/10 hover:bg-white/20 transition-colors">\r
                            <i class="fas fa-water text-blue-400 text-2xl mb-2"></i>\r
                            <h3 class="font-bold text-sm">Equipo Mojado</h3>\r
                            <p class="text-xs text-gray-400">Limpieza qu\xEDmica urgente</p>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- NEW: Multimarca & Sede Section -->\r
            <div class="py-20 bg-gray-50">\r
                <div class="container mx-auto px-4">\r
                    <div class="flex flex-col md:flex-row items-center gap-12">\r
                        <div class="md:w-1/2">\r
                            <span class="text-indigo-600 font-bold tracking-widest uppercase text-sm">Somos Expertos</span>\r
                            <h2 class="text-3xl font-bold text-gray-900 mt-2 mb-6">Reparaci\xF3n Multimarca Especializada</h2>\r
                            <p class="text-lg text-gray-600 mb-6">\r
                                No importa la marca o modelo de tu equipo. En nuestra sede central contamos con el stock y la experiencia para resolverlo.\r
                            </p>\r
                            <div class="flex flex-wrap gap-8 opacity-70 grayscale items-center justify-center md:justify-start">\r
                                <div class="flex flex-col items-center">\r
                                    <i class="fab fa-apple text-5xl mb-2"></i>\r
                                    <span class="text-xs font-bold">iPhone</span>\r
                                </div>\r
                                <div class="flex flex-col items-center">\r
                                    <i class="fab fa-android text-5xl text-green-600 mb-2"></i>\r
                                    <span class="text-xs font-bold">Android</span>\r
                                </div>\r
                                <div class="flex flex-col items-center">\r
                                    <span class="font-bold text-xl mb-2">Samsung</span>\r
                                    <span class="text-xs text-gray-500">Galaxy</span>\r
                                </div>\r
                                <div class="flex flex-col items-center">\r
                                    <span class="font-bold text-xl mb-2">Xiaomi</span>\r
                                    <span class="text-xs text-gray-500">Redmi/Poco</span>\r
                                </div>\r
                                <div class="flex flex-col items-center">\r
                                    <span class="font-bold text-xl mb-2">Motorola</span>\r
                                    <span class="text-xs text-gray-500">Moto</span>\r
                                </div>\r
                                <div class="flex flex-col items-center">\r
                                    <span class="font-bold text-xl mb-2">LG</span>\r
                                    <span class="text-xs text-gray-500">ThinQ</span>\r
                                </div>\r
                            </div>\r
                        </div>\r
                        <div class="md:w-1/2 relative">\r
                            <div class="absolute -inset-4 bg-indigo-600/20 rounded-full blur-3xl"></div>\r
                            <img src="assets/img/repair/apple.jpg" class="relative rounded-2xl shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500 w-full object-cover" alt="Especialistas Apple Marcos Paz">\r
                            <div class="absolute -bottom-6 -right-6 bg-white p-4 rounded-xl shadow-xl border border-gray-100 hidden md:block">\r
                                <p class="text-sm font-bold text-gray-900">\u{1F4CD} Taller Especializado</p>\r
                                <div class="flex text-yellow-400 text-xs mt-1">\r
                                    <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i>\r
                                </div>\r
                            </div>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- NEW: Visual Services List -->\r
            <div class="py-20 bg-white border-b border-gray-100">\r
                <div class="container mx-auto px-4">\r
                    <div class="text-center mb-12">\r
                        <h2 class="text-3xl font-bold text-gray-900">Soluciones Frecuentes</h2>\r
                        <p class="text-gray-500 mt-2">Los problemas m\xE1s comunes que resolvemos en el d\xEDa.</p>\r
                    </div>\r
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-6">\r
                        <div class="text-center p-6 border rounded-xl hover:shadow-lg transition-all group cursor-pointer hover:border-indigo-500">\r
                            <div class="w-16 h-16 mx-auto bg-blue-50 text-blue-500 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">\r
                                <i class="fas fa-mobile-alt"></i>\r
                            </div>\r
                            <h4 class="font-bold text-lg mb-2">Cambio de M\xF3dulo</h4>\r
                            <p class="text-sm text-gray-400">Pantallas rotas o sin imagen.</p>\r
                        </div>\r
                        <div class="text-center p-6 border rounded-xl hover:shadow-lg transition-all group cursor-pointer hover:border-indigo-500">\r
                            <div class="w-16 h-16 mx-auto bg-green-50 text-green-500 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-green-500 group-hover:text-white transition-colors">\r
                                <i class="fas fa-battery-full"></i>\r
                            </div>\r
                            <h4 class="font-bold text-lg mb-2">Bater\xEDa Nueva</h4>\r
                            <p class="text-sm text-gray-400">Recuper\xE1 la autonom\xEDa.</p>\r
                        </div>\r
                        <div class="text-center p-6 border rounded-xl hover:shadow-lg transition-all group cursor-pointer hover:border-indigo-500">\r
                            <div class="w-16 h-16 mx-auto bg-yellow-50 text-yellow-500 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-yellow-500 group-hover:text-white transition-colors">\r
                                <i class="fas fa-bolt"></i>\r
                            </div>\r
                            <h4 class="font-bold text-lg mb-2">Pin de Carga</h4>\r
                            <p class="text-sm text-gray-400">Si no conecta o carga lento.</p>\r
                        </div>\r
                        <div class="text-center p-6 border rounded-xl hover:shadow-lg transition-all group cursor-pointer hover:border-indigo-500">\r
                            <div class="w-16 h-16 mx-auto bg-purple-50 text-purple-500 rounded-full flex items-center justify-center text-3xl mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">\r
                                <i class="fas fa-microchip"></i>\r
                            </div>\r
                            <h4 class="font-bold text-lg mb-2">Micro-Soldadura</h4>\r
                            <p class="text-sm text-gray-400">Fallas complejas de placa.</p>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- 2. Prices & Services Table -->\r
            <div class="py-20 bg-white">\r
                <div class="container mx-auto px-4 max-w-4xl">\r
                    <div class="text-center mb-12">\r
                        <h2 class="text-3xl font-bold text-gray-900 mb-4">Precios Orientativos</h2>\r
                        <p class="text-gray-500">Transparencia ante todo. Consultanos por tu modelo exacto.</p>\r
                    </div>\r
\r
                    <div class="overflow-x-auto bg-white rounded-xl shadow-lg border border-gray-100">\r
                        <table class="table w-full">\r
                            <thead>\r
                                <tr class="bg-gray-50 text-gray-600 text-sm uppercase">\r
                                    <th class="py-4 px-6 text-left">Servicio</th>\r
                                    <th class="py-4 px-6 text-right">Precio Desde</th>\r
                                </tr>\r
                            </thead>\r
                            <tbody class="text-gray-700">\r
                                <tr class="border-b border-gray-100 hover:bg-gray-50">\r
                                    <td class="py-4 px-6 font-medium"><i class="fas fa-microscope text-indigo-500 mr-2"></i> Diagn\xF3stico (si repara)</td>\r
                                    <td class="py-4 px-6 text-right font-bold text-green-600">Bonificado</td>\r
                                </tr>\r
                                <tr class="border-b border-gray-100 hover:bg-gray-50">\r
                                    <td class="py-4 px-6 font-medium">Cambio de M\xF3dulo (Pantalla)</td>\r
                                    <td class="py-4 px-6 text-right font-bold">$45.000</td>\r
                                </tr>\r
                                <tr class="border-b border-gray-100 hover:bg-gray-50">\r
                                    <td class="py-4 px-6 font-medium">Cambio de Bater\xEDa Original/Premium</td>\r
                                    <td class="py-4 px-6 text-right font-bold">$25.000</td>\r
                                </tr>\r
                                <tr class="border-b border-gray-100 hover:bg-gray-50">\r
                                    <td class="py-4 px-6 font-medium">Cambio de Pin de Carga</td>\r
                                    <td class="py-4 px-6 text-right font-bold">$18.000</td>\r
                                </tr>\r
                                <tr class="border-b border-gray-100 hover:bg-gray-50">\r
                                    <td class="py-4 px-6 font-medium">Limpieza Qu\xEDmica (Humedad)</td>\r
                                    <td class="py-4 px-6 text-right font-bold">$20.000</td>\r
                                </tr>\r
                                <tr class="hover:bg-gray-50">\r
                                    <td class="py-4 px-6 font-medium">Software / Flasheo</td>\r
                                    <td class="py-4 px-6 text-right font-bold">$15.000</td>\r
                                </tr>\r
                            </tbody>\r
                        </table>\r
                    </div>\r
                    <p class="text-xs text-gray-400 mt-4 text-center">* Precios estimados sujetos a cambio seg\xFAn modelo y cotizaci\xF3n del d\xF3lar.</p>\r
                </div>\r
            </div>\r
\r
            <!-- 3. Why Choose Us (Differentiators) -->\r
            <div class="py-20 bg-gray-50 border-y border-gray-200">\r
                <div class="container mx-auto px-4">\r
                    <div class="text-center mb-16">\r
                        <span class="text-indigo-600 font-bold tracking-widest uppercase text-sm">\xBFPor qu\xE9 Arecofix?</span>\r
                        <h2 class="text-3xl md:text-4xl font-bold mt-2 text-gray-900">M\xE1s que un cambio de piezas</h2>\r
                    </div>\r
\r
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">\r
                        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">\r
                            <div class="w-16 h-16 mx-auto bg-indigo-100 rounded-full flex items-center justify-center text-indigo-600 text-2xl mb-6">\r
                                <i class="fas fa-medal"></i>\r
                            </div>\r
                            <h3 class="text-xl font-bold text-gray-900 mb-3">7+ A\xF1os de Experiencia</h3>\r
                            <p class="text-gray-600">No improvisamos. Conocemos a fondo la electr\xF3nica de tu equipo, desde un iPhone hasta un Xiaomi.</p>\r
                        </div>\r
                        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">\r
                            <div class="w-16 h-16 mx-auto bg-green-100 rounded-full flex items-center justify-center text-green-600 text-2xl mb-6">\r
                                <i class="fas fa-check-shield"></i>\r
                            </div>\r
                            <h3 class="text-xl font-bold text-gray-900 mb-3">Garant\xEDa Real</h3>\r
                            <p class="text-gray-600">30 d\xEDas de garant\xEDa escrita. Si algo falla, respondemos. Sin vueltas ni letra chica.</p>\r
                        </div>\r
                        <div class="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 text-center hover:shadow-md transition-shadow">\r
                            <div class="w-16 h-16 mx-auto bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl mb-6">\r
                                <i class="fas fa-star"></i>\r
                            </div>\r
                            <h3 class="text-xl font-bold text-gray-900 mb-3">4.9 Estrellas</h3>\r
                            <p class="text-gray-600">M\xE1s de 270 vecinos de Marcos Paz conf\xEDan en nosotros. Sus rese\xF1as son nuestra mejor carta de presentaci\xF3n.</p>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- 4. Technology & Tools -->\r
            <div class="py-20 bg-white overflow-hidden">\r
                <div class="container mx-auto px-4">\r
                    <div class="flex flex-col md:flex-row items-center gap-12">\r
                        <div class="md:w-1/2">\r
                            <span class="text-indigo-600 font-bold tracking-widest uppercase text-sm">Laboratorio Profesional</span>\r
                            <h2 class="text-3xl font-bold text-gray-900 mt-2 mb-6">Tecnolog\xEDa de Punta para tu Equipo</h2>\r
                            <p class="text-lg text-gray-600 mb-6">\r
                                Invertimos constantemente en equipamiento para realizar reparaciones que otros no pueden.\r
                            </p>\r
                            <ul class="space-y-4">\r
                                <li class="flex items-center text-gray-700"><i class="fas fa-microscope text-indigo-500 w-8"></i> Microscopios Trinoculares para micro-soldadura.</li>\r
                                <li class="flex items-center text-gray-700"><i class="fas fa-temperature-high text-indigo-500 w-8"></i> Estaciones de Soldado JBC / Quick de precisi\xF3n.</li>\r
                                <li class="flex items-center text-gray-700"><i class="fas fa-layer-group text-indigo-500 w-8"></i> Separadoras de Glass y Laminadoras OCA.</li>\r
                                <li class="flex items-center text-gray-700"><i class="fas fa-laptop-code text-indigo-500 w-8"></i> Software de diagn\xF3stico y programadoras de FaceID.</li>\r
                            </ul>\r
                        </div>\r
                        <div class="md:w-1/2 relative">\r
                            <div class="absolute -inset-4 bg-indigo-600/20 rounded-full blur-3xl"></div>\r
                            <img src="assets/img/repair/6.jpg" class="relative rounded-2xl shadow-2xl transform rotate-2 hover:rotate-0 transition-transform duration-500" alt="Microscopio y Laboratorio">\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- 5. Simple Process (Updated) -->\r
            <div class="bg-gray-900 text-white py-20 relative overflow-hidden">\r
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>\r
                <div class="container mx-auto px-4 relative z-10">\r
                    <div class="text-center mb-16">\r
                        <h2 class="text-3xl font-bold">As\xED Trabajamos</h2>\r
                        <p class="text-gray-400 mt-2">Simple, transparente y con tecnolog\xEDa a tu favor.</p>\r
                    </div>\r
                    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">\r
                        <!-- Step 1 -->\r
                        <div class="relative items-center flex flex-col group">\r
                            <div class="w-20 h-20 bg-indigo-600 rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-lg shadow-indigo-500/50 group-hover:scale-110 transition-transform">\r
                                <i class="fas fa-store"></i>\r
                            </div>\r
                            <h4 class="text-xl font-bold mb-2">1. Recepci\xF3n</h4>\r
                            <p class="text-gray-400 text-center text-sm px-4">Tra\xE9s tu equipo a nuestra sede. Te generamos una orden de servicio \xFAnica.</p>\r
                        </div>\r
                        <!-- Step 2 -->\r
                        <div class="relative items-center flex flex-col group">\r
                            <div class="w-20 h-20 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-3xl font-bold mb-6 group-hover:border-indigo-500 transition-colors">\r
                                <i class="fas fa-tools text-indigo-400"></i>\r
                            </div>\r
                            <h4 class="text-xl font-bold mb-2">2. Reparaci\xF3n</h4>\r
                            <p class="text-gray-400 text-center text-sm px-4">Experiencia pura. Nuestros t\xE9cnicos trabajan en tu equipo con repuestos de calidad.</p>\r
                        </div>\r
                        <!-- Step 3 -->\r
                        <div class="relative items-center flex flex-col group">\r
                            <div class="w-20 h-20 bg-gray-800 border border-gray-700 rounded-full flex items-center justify-center text-3xl font-bold mb-6 group-hover:border-green-500 transition-colors">\r
                                <i class="fas fa-mobile-alt text-green-400"></i>\r
                            </div>\r
                            <h4 class="text-xl font-bold mb-2 text-green-400">3. Seguimiento App</h4>\r
                            <p class="text-gray-400 text-center text-sm px-4">\r
                                \xA1Exclusivo! Segu\xED el estado de tu reparaci\xF3n en <strong>tiempo real</strong> desde nuestra App web.\r
                            </p>\r
                        </div>\r
                        <!-- Step 4 -->\r
                        <div class="relative items-center flex flex-col group">\r
                            <div class="w-20 h-20 bg-white text-gray-900 rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-xl">\r
                                <i class="fas fa-smile-beam text-yellow-500"></i>\r
                            </div>\r
                            <h4 class="text-xl font-bold mb-2">4. A Disfrutar</h4>\r
                            <p class="text-gray-400 text-center text-sm px-4">Retir\xE1s tu equipo funcionando como nuevo y con garant\xEDa escrita.</p>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- 6. Real Cases Gallery (Updated) -->\r
            <div class="py-20 bg-indigo-50">\r
                <div class="container mx-auto px-4">\r
                    <h2 class="text-3xl font-bold text-center text-gray-900 mb-4">Galer\xEDa de Trabajos</h2>\r
                    <p class="text-center text-gray-600 mb-12">Desde microsoldadura hasta cambios de m\xF3dulo. As\xED trabajamos.</p>\r
                    \r
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4">\r
                        <!-- Video -->\r
                        <div class="col-span-2 row-span-2 rounded-xl overflow-hidden shadow-md group relative bg-black">\r
                            <video src="assets/img/repair/4.mp4" controls playsinline preload="metadata" class="w-full h-full object-cover" poster="assets/img/repair/1.jpg"></video>\r
                        </div>\r
                        \r
                        <div class="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer group relative">\r
                            <img src="assets/img/repair/1.jpg" class="w-full h-full object-cover" alt="Reparaci\xF3n Arecofix 1">\r
                        </div>\r
                        <div class="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer group relative">\r
                            <img src="assets/img/repair/2.jpg" class="w-full h-full object-cover" alt="Reparaci\xF3n Arecofix 2">\r
                        </div>\r
                        <div class="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer group relative">\r
                            <img src="assets/img/repair/3.jpg" class="w-full h-full object-cover" alt="Reparaci\xF3n Arecofix 3">\r
                        </div>\r
                        <div class="aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer group relative">\r
                            <img src="assets/img/repair/iphone.jpg" class="w-full h-full object-cover" alt="Nuestro Local">\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- 7 & 9. Technicians, Not Resellers & Spare Parts -->\r
            <div class="py-20 bg-white">\r
                <div class="container mx-auto px-4">\r
                    <div class="grid grid-cols-1 md:grid-cols-2 gap-16">\r
                        <div>\r
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">Somos T\xE9cnicos, No Revendedores</h3>\r
                            <p class="text-gray-600 mb-6">\r
                                A diferencia de locales que solo "cambian plaquetas", nosotros <span class="font-bold text-indigo-600">reparamos</span> a nivel componente.\r
                            </p>\r
                            <ul class="space-y-3">\r
                                <li class="flex items-start"><i class="fas fa-check text-green-500 mt-1 mr-3"></i> Salvamos tu placa original (y tus datos).</li>\r
                                <li class="flex items-start"><i class="fas fa-check text-green-500 mt-1 mr-3"></i> Solucionamos fallas complejas de encendido.</li>\r
                                <li class="flex items-start"><i class="fas fa-check text-green-500 mt-1 mr-3"></i> Si no se puede reparar, no te cobramos "intentos".</li>\r
                            </ul>\r
                        </div>\r
                        <div>\r
                            <h3 class="text-2xl font-bold text-gray-900 mb-4">Calidad de Repuestos</h3>\r
                            <p class="text-gray-600 mb-6">\r
                                Te explicamos la diferencia y vos eleg\xEDs qu\xE9 ponerle a tu equipo.\r
                            </p>\r
                            <img src="assets/img/cursos/local.jpg" class="rounded-xl shadow-lg mb-6 w-full h-48 object-cover" alt="Repuestos iPhone">\r
                            <div class="space-y-4">\r
                                <div class="p-4 border border-indigo-100 rounded-lg bg-indigo-50">\r
                                    <h4 class="font-bold text-indigo-700">Original / Service Pack</h4>\r
                                    <p class="text-sm text-gray-600">La misma pieza que trae de f\xE1brica. M\xE1xima calidad y brillo.</p>\r
                                </div>\r
                                <div class="p-4 border border-gray-200 rounded-lg">\r
                                    <h4 class="font-bold text-gray-800">Premium AAA / OLED</h4>\r
                                    <p class="text-sm text-gray-600">Excelente alternativa costo-beneficio. Garantizada.</p>\r
                                </div>\r
                            </div>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- 8. Security & Data -->\r
            <div class="py-16 bg-gray-50 text-center">\r
                <div class="container mx-auto px-4 max-w-2xl">\r
                    <i class="fas fa-user-lock text-5xl text-gray-400 mb-6"></i>\r
                    <h2 class="text-2xl font-bold text-gray-900 mb-4">Privacidad y Seguridad de Datos</h2>\r
                    <p class="text-gray-600">\r
                        Entendemos que tu celular tiene tu vida. En Arecofix <span class="font-bold">NO borramos</span> nada sin tu permiso y <span class="font-bold">NO accedemos</span> a tu informaci\xF3n personal (fotos, chats). Trabajamos con protocolos de privacidad estrictos.\r
                    </p>\r
                </div>\r
            </div>\r
\r
            <!-- 10. Location -->\r
            <div class="py-0">\r
                <div class="grid grid-cols-1 md:grid-cols-2">\r
                    <div class="bg-gray-900 text-white p-12 flex flex-col justify-center">\r
                        <span class="text-indigo-400 font-bold uppercase tracking-widest text-sm mb-4">Ubicaci\xF3n</span>\r
                        <h2 class="text-3xl font-bold mb-6">Estamos a 3 Cuadras de Ruta 40</h2>\r
                        <p class="text-xl mb-8 text-gray-300"><i class="fas fa-map-marker-alt text-red-500 mr-2"></i> Marcos Paz</p>\r
                        <p class="mb-2"><strong>Horarios:</strong> Lunes a S\xE1bado de 08:00 a 18:30 hs.</p>\r
                        <p class="mb-8"><strong>Referencia:</strong> Jorge Newbery 69, Barrio La Paz, zona comercial.</p>\r
                        <a href="https://maps.app.goo.gl/somelink" target="_blank" class="btn btn-outline text-white hover:bg-white hover:text-gray-900 w-fit">\r
                            <i class="fas fa-directions mr-2"></i> C\xF3mo LLegar\r
                        </a>\r
                    </div>\r
                    <div class="h-96 md:h-auto bg-gray-200">\r
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.539502732569!2d-58.81797292339245!3d-34.76719126615129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bceb46770c86eb%3A0x73b48d51a83e8107!2sARECOFIX%20Servicio%20t%C3%A9cnico%20de%20celulares%20%7C%20Venta%20de%20Repuestos.!5e0!3m2!1ses-419!2sar!4v1771631396545!5m2!1ses-419!2sar" width="100%" height="100%" style="border:0;" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- 13. Reservation Section (With Calendar) -->\r
            <div class="py-20 bg-indigo-600" #reservationSection>\r
                <div class="container mx-auto px-4 text-center mb-12">\r
                    <h2 class="text-3xl font-bold text-white mb-4">Reserva tu Turno</h2>\r
                    <p class="text-indigo-100 max-w-2xl mx-auto">\r
                        Evit\xE1 esperas. Eleg\xED el d\xEDa y la hora para traer tu equipo. El diagn\xF3stico es gratuito.\r
                    </p>\r
                </div>\r
                <!-- Calendar Component -->\r
                <div class="px-4">\r
                    <app-reservation-calendar></app-reservation-calendar>\r
                </div>\r
            </div>\r
\r
            <!-- 11. Allies & Social Proof -->\r
            <div class="py-12 bg-gray-50 border-b border-gray-200">\r
                 <div class="container mx-auto px-4 text-center">\r
                    <p class="text-sm font-bold text-gray-400 uppercase tracking-widest mb-8">Conf\xEDan en Nosotros</p>\r
                    <div class="flex justify-center items-center gap-12 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all">\r
                        <div class="flex items-center gap-2 text-xl font-bold text-cyan-600"><i class="fas fa-user-md"></i> MobiDoc</div>\r
                        <div class="flex items-center gap-2 text-xl font-bold text-blue-600"><i class="fab fa-google"></i> Reviews</div>\r
                        <div class="flex items-center gap-2 text-xl font-bold text-blue-400">Mercado Pago</div>\r
                    </div>\r
                    <!-- NEW: Mentioned In -->\r
                    <div class="mt-8 pt-8 border-t border-gray-200">\r
                        <p class="text-xs text-gray-400 uppercase tracking-widest mb-4">Mencionado en</p>\r
                        <div class="flex flex-col md:flex-row justify-center items-center gap-4 font-serif text-gray-500 text-sm flex-wrap">\r
                            <a href="https://laelectronicaonline.com.ar/casa-electronica/arecofix-servicio-tecnico-de-celulares-venta-de-repuestos/" target="_blank" rel="nofollow" class="hover:text-indigo-600 transition-colors border-b border-gray-200 hover:border-indigo-500">\r
                                La Electr\xF3nica Online\r
                            </a>\r
                            <span class="hidden md:inline text-gray-300">\u2022</span>\r
                            <a href="https://www.marcospaz.gob.ar/noticias/item/8551-j%C3%B3venes-del-programa-envi%C3%B3n-finalizaron-el-curso-de-reparaci%C3%B3n-de-celulares.html" target="_blank" rel="nofollow" class="hover:text-indigo-600 transition-colors border-b border-gray-200 hover:border-indigo-500">\r
                                Municipio Marcos Paz\r
                            </a>\r
                            <span class="hidden md:inline text-gray-300">\u2022</span>\r
                            <a href="https://a1noticias.com.ar/nota/9798/marcos-paz-jovenes-del-programa-envion-finalizaron-el-curso-de-reparacion-de-celulares" target="_blank" rel="nofollow" class="hover:text-indigo-600 transition-colors border-b border-gray-200 hover:border-indigo-500">\r
                                A1 Noticias\r
                            </a>\r
                            <span class="hidden md:inline text-gray-300">\u2022</span>\r
                            <a href="https://mobidoc.com.ar/servicio-tecnico/arecofix-soluciones-digitales/" target="_blank" rel="dofollow" class="hover:text-indigo-600 transition-colors border-b border-gray-200 hover:border-indigo-500">\r
                                Mobidoc\r
                            </a>\r
                            <span class="hidden md:inline text-gray-300">\u2022</span>\r
                            <a href="https://www.redargentina.com.ar/arecofix-servicio-tecnico-de-celulares-en-marcos-paz-F120EC10E1AD945" target="_blank" rel="nofollow" class="hover:text-indigo-600 transition-colors border-b border-gray-200 hover:border-indigo-500">\r
                                Red Argentina\r
                            </a>\r
                            <span class="hidden md:inline text-gray-300">\u2022</span>\r
                            <a href="https://noticias.marcospazconectada.com/2023/02/09/termino-el-curso-de-reparacion-de-celulares-del-programa-envion/" target="_blank" rel="nofollow" class="hover:text-indigo-600 transition-colors border-b border-gray-200 hover:border-indigo-500">\r
                                Marcos Paz Conectada\r
                            </a>\r
                        </div>\r
                    </div>\r
                 </div>\r
            </div>\r
\r
            <!-- 12. FAQ (Expanded) -->\r
            <div class="py-20 bg-white">\r
                <div class="container mx-auto px-4 max-w-3xl">\r
                    <h2 class="text-3xl font-bold text-center text-gray-900 mb-12">Preguntas Frecuentes</h2>\r
                    <div class="space-y-4">\r
                        <div class="collapse collapse-arrow bg-gray-50 border border-gray-100 rounded-xl">\r
                            <input type="radio" name="faq" checked /> \r
                            <div class="collapse-title text-xl font-medium">\xBFLa reparaci\xF3n tiene garant\xEDa?</div>\r
                            <div class="collapse-content"><p>S\xED, 30 d\xEDas de garant\xEDa escrita sobre el repuesto y la mano de obra.</p></div>\r
                        </div>\r
                        <div class="collapse collapse-arrow bg-gray-50 border border-gray-100 rounded-xl">\r
                            <input type="radio" name="faq" /> \r
                            <div class="collapse-title text-xl font-medium">\xBFCu\xE1nto tarda el arreglo?</div>\r
                            <div class="collapse-content"><p>Muchas reparaciones (como cambios de pantalla) est\xE1n listas en 2 a 4 horas. Adem\xE1s, contamos con una <strong>App de Seguimiento</strong> exclusiva para que veas el estado de tu equipo minuto a minuto.</p></div>\r
                        </div>\r
                        <div class="collapse collapse-arrow bg-gray-50 border border-gray-100 rounded-xl">\r
                            <input type="radio" name="faq" /> \r
                            <div class="collapse-title text-xl font-medium">\xBFSe borran mis datos?</div>\r
                            <div class="collapse-content"><p><strong>No.</strong> Respetamos absolutamente tu privacidad. No accedemos a fotos, contactos ni chats. Si fuera necesario borrar algo (casos de software extremos), siempre pedimos autorizaci\xF3n previa. Tus datos est\xE1n seguros.</p></div>\r
                        </div>\r
                        <div class="collapse collapse-arrow bg-gray-50 border border-gray-100 rounded-xl">\r
                            <input type="radio" name="faq" /> \r
                            <div class="collapse-title text-xl font-medium">\xBFAceptan tarjetas de cr\xE9dito/d\xE9bito?</div>\r
                            <div class="collapse-content"><p>S\xED, aceptamos efectivo, transferencia, tarjetas de cr\xE9dito y d\xE9bito, y Mercado Pago. Consult\xE1 por cuotas vigentes.</p></div>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- NEW: Customer Reviews -->\r
            <div class="py-20 bg-indigo-900 overflow-hidden relative">\r
                <div class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>\r
                <!-- Gradient Overlay -->\r
                <div class="absolute inset-0 bg-linear-to-b from-indigo-900/50 via-indigo-800/20 to-indigo-900/90 pointer-events-none"></div>\r
\r
                <div class="container mx-auto px-4 relative z-10">\r
                    <h2 class="text-3xl font-bold text-center text-white mb-16 drop-shadow-md">Opiniones Reales</h2>\r
                    <div class="grid grid-cols-1 md:grid-cols-3 gap-8">\r
                        <!-- Card 1 -->\r
                        <div class="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 relative shadow-xl hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">\r
                            <i class="fas fa-quote-left text-4xl text-indigo-400 absolute -top-4 -left-4 bg-gray-900 rounded-full p-2 border border-gray-700"></i>\r
                            <div class="flex text-yellow-400 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>\r
                            <p class="text-gray-200 italic mb-6 leading-relaxed">"Me salvaron el celular que se me hab\xEDa ca\xEDdo al agua. En otro lado me dijeron que no serv\xEDa m\xE1s. Unos genios."</p>\r
                            <div class="flex items-center gap-3 border-t border-white/10 pt-4">\r
                                <div class="w-10 h-10 bg-indigo-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">L</div>\r
                                <span class="text-white font-bold tracking-wide">Lucas M.</span>\r
                            </div>\r
                        </div>\r
                        <!-- Card 2 -->\r
                        <div class="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 relative shadow-xl hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">\r
                            <i class="fas fa-quote-left text-4xl text-indigo-400 absolute -top-4 -left-4 bg-gray-900 rounded-full p-2 border border-gray-700"></i>\r
                            <div class="flex text-yellow-400 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>\r
                            <p class="text-gray-200 italic mb-6 leading-relaxed">"Excelente atenci\xF3n. Me cambiaron la bater\xEDa del iPhone en el momento y me mostraron la condici\xF3n en la compu."</p>\r
                            <div class="flex items-center gap-3 border-t border-white/10 pt-4">\r
                                <div class="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">S</div>\r
                                <span class="text-white font-bold tracking-wide">Sofia R.</span>\r
                            </div>\r
                        </div>\r
                        <!-- Card 3 -->\r
                        <div class="bg-white/10 backdrop-blur-md p-8 rounded-2xl border border-white/10 relative shadow-xl hover:bg-white/15 transition-all duration-300 hover:-translate-y-1">\r
                            <i class="fas fa-quote-left text-4xl text-indigo-400 absolute -top-4 -left-4 bg-gray-900 rounded-full p-2 border border-gray-700"></i>\r
                            <div class="flex text-yellow-400 mb-4"><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i></div>\r
                            <p class="text-gray-200 italic mb-6 leading-relaxed">"Muy profesional el sistema de seguimiento. Sab\xEDa exactamente cu\xE1ndo estaba listo mi equipo para retirar."</p>\r
                            <div class="flex items-center gap-3 border-t border-white/10 pt-4">\r
                                <div class="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center font-bold text-white shadow-lg">P</div>\r
                                <span class="text-white font-bold tracking-wide">Pablo G.</span>\r
                            </div>\r
                        </div>\r
                    </div>\r
                </div>\r
            </div>\r
\r
            <!-- NEW: Discount Coupon -->\r
            <div class="py-12 bg-linear-to-r from-yellow-400 to-orange-500 text-gray-900">\r
                <div class="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">\r
                    <div class="flex items-center gap-4">\r
                        <div class="bg-white p-3 rounded-full text-orange-500 shadow-md">\r
                            <i class="fas fa-tags text-2xl"></i>\r
                        </div>\r
                        <div>\r
                            <h3 class="text-2xl font-bold">\xA1Listo para reparar tu equipo?</h3>\r
                            <p class="font-medium text-gray-800">Mencion\xE1 que ven\xEDs de la web y obten\xE9 un <span class="bg-black text-yellow-400 px-2 rounded font-bold">10% OFF</span> en mano de obra.</p>\r
                        </div>\r
                    </div>\r
                    <button (click)="contactSection.scrollIntoView({behavior: 'smooth'})" class="btn bg-black text-white border-none hover:bg-gray-800 px-8 rounded-full shadow-lg">\r
                        Quiero mi Descuento\r
                    </button>\r
                </div>\r
            </div>\r
\r
            <!-- 14. Contact Form -->\r
            <div class="py-20 bg-gray-50" id="contact" #contactSection>\r
                <div class="container mx-auto px-4 max-w-2xl">\r
                    <div class="bg-white p-8 md:p-12 rounded-2xl shadow-xl border border-gray-100">\r
                        <h2 class="text-3xl font-bold text-gray-900 mb-6 text-center">\xBFTen\xE9s alguna duda?</h2>\r
                        <form (ngSubmit)="sendContactForm()">\r
                            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">\r
                                <div>\r
                                    <label class="label-text font-medium mb-2 block">Nombre</label>\r
                                    <input type="text" [(ngModel)]="contactName" name="name" class="input input-bordered w-full text-gray-900 bg-white" placeholder="Tu nombre" required>\r
                                </div>\r
                                <div>\r
                                    <label class="label-text font-medium mb-2 block">Tel\xE9fono / WhatsApp</label>\r
                                    <input type="tel" [(ngModel)]="contactPhone" name="phone" class="input input-bordered w-full text-gray-900 bg-white" placeholder="Ej: 11 1234 5678" required>\r
                                </div>\r
                            </div>\r
                            <div class="mb-6">\r
                                <label class="label-text font-medium mb-2 block">Mensaje / Consulta</label>\r
                                <textarea [(ngModel)]="contactMessage" name="message" class="textarea textarea-bordered w-full h-32 text-gray-900 bg-white" placeholder="Hola, tengo un Samsung A32 que no carga..." required></textarea>\r
                            </div>\r
                            <button type="submit" [disabled]="sendingContact" class="btn btn-primary w-full text-lg">\r
                                @if(sendingContact) { <span class="loading loading-spinner"></span> }\r
                                Enviar Consulta\r
                            </button>\r
                        </form>\r
                    </div>\r
                </div>\r
            </div>\r
\r
           \r
        </div>\r
      } @else {\r
        <!-- STANDARD POST LAYOUT -->\r
    <article>\r
        <!-- Hero Section -->\r
        @if (post.image) {\r
        <div class="relative h-[40vh] md:h-[50vh] w-full overflow-hidden">\r
            <div class="absolute inset-0 bg-black/40 z-10"></div>\r
            <img [src]="post.image" [alt]="post.title" class="w-full h-full object-cover">\r
            <div class="absolute inset-0 z-20 flex items-end pb-12 md:pb-20">\r
                <div class="container mx-auto px-4 max-w-4xl">\r
                    <a routerLink="/"\r
                        class="inline-flex items-center text-white/80 hover:text-white mb-6 transition-colors text-sm font-medium backdrop-blur-sm bg-black/20 px-3 py-1 rounded-full">\r
                        <i class="fas fa-arrow-left mr-2"></i> Volver\r
                    </a>\r
                    <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight drop-shadow-lg mb-4">\r
                        {{ post.title }}\r
                    </h1>\r
                    <div class="flex items-center text-white/90 text-sm md:text-base font-medium">\r
                        <span\r
                            class="bg-indigo-600 px-3 py-1 rounded-full text-xs uppercase tracking-wider mr-4">Blog</span>\r
                        <i class="far fa-calendar-alt mr-2"></i>\r
                        <time>{{ post.created_at | date:'longDate' }}</time>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
        } @else {\r
        <div class="bg-gray-900 py-20 md:py-32">\r
            <div class="container mx-auto px-4 max-w-4xl">\r
                <a routerLink="/"\r
                    class="inline-flex items-center text-white/80 hover:text-white mb-8 transition-colors text-sm font-medium">\r
                    <i class="fas fa-arrow-left mr-2"></i> Volver al Inicio\r
                </a>\r
                <h1 class="text-3xl md:text-5xl lg:text-6xl font-bold text-white leading-tight mb-6">\r
                    {{ post.title }}\r
                </h1>\r
                <div class="flex items-center text-gray-400 text-sm md:text-base">\r
                    <i class="far fa-calendar-alt mr-2"></i>\r
                    <time>{{ post.created_at | date:'longDate' }}</time>\r
                </div>\r
            </div>\r
        </div>\r
        }\r
\r
        <!-- Content Section -->\r
        <div class="container mx-auto px-4 max-w-3xl py-12 md:py-20">\r
            <div class="prose prose-lg md:prose-xl prose-indigo mx-auto text-gray-700 leading-relaxed" [innerHTML]="post.content">\r
            </div>\r
\r
            <!-- Share / Footer -->\r
            <div class="mt-16 pt-8 border-t border-gray-200">\r
                <div class="flex flex-col md:flex-row justify-between items-center gap-6">\r
                    <div class="text-gray-500 font-medium">\r
                        Compartir esta entrada:\r
                    </div>\r
                    <div class="flex gap-4">\r
                        <button\r
                            class="w-10 h-10 rounded-full bg-[#25D366] text-white flex items-center justify-center hover:opacity-90 transition-opacity">\r
                            <i class="fab fa-whatsapp text-xl"></i>\r
                        </button>\r
                        <button\r
                            class="w-10 h-10 rounded-full bg-[#1877F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">\r
                            <i class="fab fa-facebook-f"></i>\r
                        </button>\r
                        <button\r
                            class="w-10 h-10 rounded-full bg-[#1DA1F2] text-white flex items-center justify-center hover:opacity-90 transition-opacity">\r
                            <i class="fab fa-twitter"></i>\r
                        </button>\r
                    </div>\r
                </div>\r
            </div>\r
        </div>\r
    </article>\r
      }\r
    }\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PostPage, { className: "PostPage", filePath: "src/app/public/posts/post-page.ts", lineNumber: 20 });
})();
export {
  PostPage
};
//# sourceMappingURL=chunk-NL6N5ANE.mjs.map
