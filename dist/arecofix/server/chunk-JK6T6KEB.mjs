import './polyfills.server.mjs';
import {
  PreferencesService
} from "./chunk-V2PF6MZP.mjs";
import {
  SeoService
} from "./chunk-66CEOCL3.mjs";
import {
  CheckboxControlValueAccessor,
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  NgControlStatus,
  NgControlStatusGroup,
  NgSelectOption,
  ReactiveFormsModule,
  SelectControlValueAccessor,
  Validators,
  ɵNgNoValidate,
  ɵNgSelectMultipleOption
} from "./chunk-Q3DS2EHQ.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  AsyncPipe,
  HttpClient,
  NgIf
} from "./chunk-YFUS3N4N.mjs";
import {
  Component,
  inject,
  map,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementContainerEnd,
  ɵɵelementContainerStart,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtrustConstantResourceUrl
} from "./chunk-CGATP5QV.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/public/contacto/contacto.content.ts
var CONTACTO_CONTENT = {
  es: {
    title: "Contacto",
    subtitle: "Cont\xE1ctanos",
    intro: "Si tienes alguna pregunta o necesitas ayuda, no dudes en ponerte en contacto con nosotros. Estamos aqu\xED para ayudarte y responderemos lo antes posible.",
    formTitle: "Env\xEDa un mensaje",
    nameLabel: "Nombre *",
    namePlaceholder: "Tu nombre completo",
    nameError: "Por favor ingresa tu nombre",
    emailLabel: "Correo electr\xF3nico *",
    emailPlaceholder: "tu@email.com",
    emailError: "Por favor ingresa un email v\xE1lido",
    phoneLabel: "Tel\xE9fono",
    phonePlaceholder: "+54 11 1234-5678",
    subjectLabel: "Asunto *",
    subjectPlaceholder: "Selecciona un asunto",
    subjectOptions: [
      { value: "Consulta general", label: "Consulta general" },
      { value: "Soporte t\xE9cnico", label: "Soporte t\xE9cnico" },
      { value: "Informaci\xF3n de ventas", label: "Informaci\xF3n de ventas" },
      { value: "Oportunidades de trabajo", label: "Oportunidades de trabajo" },
      { value: "Otro", label: "Otro" }
    ],
    messageLabel: "Mensaje *",
    messagePlaceholder: "Escribe tu mensaje aqu\xED...",
    messageError: "Por favor escribe tu mensaje",
    termsText: "Acepto los",
    termsLink: "t\xE9rminos y condiciones",
    privacyLink: "pol\xEDtica de privacidad",
    submitButton: "Enviar mensaje",
    sendingMessage: "Enviando mensaje...",
    successMessage: "\xA1Mensaje enviado con \xE9xito! Nos pondremos en contacto contigo pronto.",
    errorMessage: "Hubo un error al enviar el mensaje. Por favor, int\xE9ntalo de nuevo m\xE1s tarde.",
    contactInfoTitle: "Informaci\xF3n de contacto",
    addressLabel: "Direcci\xF3n",
    addressValue: "Jorge Newbery 69, Marcos paz, Buenos Aires, Argentina",
    phoneInfoLabel: "Tel\xE9fono",
    phoneInfoValue: "+54 11 2596-0900",
    phoneInfoHours: "Lunes a Viernes de 9:00 a 18:00",
    emailInfoLabel: "Correo electr\xF3nico",
    emailInfoValue: "Respuesta en menos de 24 horas",
    supportLabel: "Soporte",
    supportValue: "Asistencia t\xE9cnica especializada",
    socialTitle: "S\xEDguenos en redes"
  },
  en: {
    title: "Contact",
    subtitle: "Contact Us",
    intro: "If you have any questions or need help, do not hesitate to contact us. We are here to help and will respond as soon as possible.",
    formTitle: "Send a message",
    nameLabel: "Name *",
    namePlaceholder: "Your full name",
    nameError: "Please enter your name",
    emailLabel: "Email *",
    emailPlaceholder: "you@email.com",
    emailError: "Please enter a valid email",
    phoneLabel: "Phone",
    phonePlaceholder: "+54 11 1234-5678",
    subjectLabel: "Subject *",
    subjectPlaceholder: "Select a subject",
    subjectOptions: [
      { value: "General Inquiry", label: "General Inquiry" },
      { value: "Technical Support", label: "Technical Support" },
      { value: "Sales Information", label: "Sales Information" },
      { value: "Job Opportunities", label: "Job Opportunities" },
      { value: "Other", label: "Other" }
    ],
    messageLabel: "Message *",
    messagePlaceholder: "Write your message here...",
    messageError: "Please write your message",
    termsText: "I accept the",
    termsLink: "terms and conditions",
    privacyLink: "privacy policy",
    submitButton: "Send message",
    sendingMessage: "Sending message...",
    successMessage: "Message sent successfully! We will contact you soon.",
    errorMessage: "There was an error sending the message. Please try again later.",
    contactInfoTitle: "Contact Information",
    addressLabel: "Address",
    addressValue: "Jorge Newbery 69, Marcos Paz, Buenos Aires, Argentina",
    phoneInfoLabel: "Phone",
    phoneInfoValue: "+54 11 2596-0900",
    phoneInfoHours: "Monday to Friday from 9:00 to 18:00",
    emailInfoLabel: "Email",
    emailInfoValue: "Response in less than 24 hours",
    supportLabel: "Support",
    supportValue: "Specialized technical assistance",
    socialTitle: "Follow us on social media"
  }
};

// src/app/public/contacto/contacto.ts
var _forTrack0 = ($index, $item) => $item.value;
function ContactoComponent_ng_container_0_Conditional_27_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const content_r3 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(content_r3.nameError);
  }
}
function ContactoComponent_ng_container_0_Conditional_32_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const content_r3 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(content_r3.emailError);
  }
}
function ContactoComponent_ng_container_0_For_44_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "option", 29);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const option_r4 = ctx.$implicit;
    \u0275\u0275property("value", option_r4.value);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(option_r4.label);
  }
}
function ContactoComponent_ng_container_0_Conditional_49_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 21);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const content_r3 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(content_r3.messageError);
  }
}
function ContactoComponent_ng_container_0_Conditional_65_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 40);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(1, "svg", 67);
    \u0275\u0275element(2, "circle", 68)(3, "path", 69);
    \u0275\u0275elementEnd();
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const content_r3 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", content_r3.sendingMessage, " ");
  }
}
function ContactoComponent_ng_container_0_Conditional_66_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 41);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const content_r3 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", content_r3.successMessage, " ");
  }
}
function ContactoComponent_ng_container_0_Conditional_67_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 42);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const content_r3 = \u0275\u0275nextContext().ngIf;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", content_r3.errorMessage, " ");
  }
}
function ContactoComponent_ng_container_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275elementContainerStart(0);
    \u0275\u0275elementStart(1, "div", 1)(2, "header", 2)(3, "div", 3)(4, "a", 4);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(5, "svg", 5);
    \u0275\u0275element(6, "path", 6);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(7, "h1", 7);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275element(9, "div", 8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "main", 9)(11, "div", 10)(12, "section", 11)(13, "h2", 12);
    \u0275\u0275text(14);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 13);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "div", 14)(18, "section", 15)(19, "h3", 16);
    \u0275\u0275text(20);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(21, "form", 17);
    \u0275\u0275listener("ngSubmit", function ContactoComponent_ng_container_0_Template_form_ngSubmit_21_listener() {
      \u0275\u0275restoreView(_r1);
      const ctx_r1 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r1.onSubmit());
    });
    \u0275\u0275elementStart(22, "div", 18)(23, "div")(24, "label", 19);
    \u0275\u0275text(25);
    \u0275\u0275elementEnd();
    \u0275\u0275element(26, "input", 20);
    \u0275\u0275conditionalCreate(27, ContactoComponent_ng_container_0_Conditional_27_Template, 2, 1, "p", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(28, "div")(29, "label", 22);
    \u0275\u0275text(30);
    \u0275\u0275elementEnd();
    \u0275\u0275element(31, "input", 23);
    \u0275\u0275conditionalCreate(32, ContactoComponent_ng_container_0_Conditional_32_Template, 2, 1, "p", 21);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(33, "div")(34, "label", 24);
    \u0275\u0275text(35);
    \u0275\u0275elementEnd();
    \u0275\u0275element(36, "input", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div")(38, "label", 26);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "select", 27)(41, "option", 28);
    \u0275\u0275text(42);
    \u0275\u0275elementEnd();
    \u0275\u0275repeaterCreate(43, ContactoComponent_ng_container_0_For_44_Template, 2, 2, "option", 29, _forTrack0);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(45, "div")(46, "label", 30);
    \u0275\u0275text(47);
    \u0275\u0275elementEnd();
    \u0275\u0275element(48, "textarea", 31);
    \u0275\u0275conditionalCreate(49, ContactoComponent_ng_container_0_Conditional_49_Template, 2, 1, "p", 21);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 32)(51, "div", 33);
    \u0275\u0275element(52, "input", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(53, "div", 35)(54, "label", 36);
    \u0275\u0275text(55);
    \u0275\u0275elementStart(56, "a", 37);
    \u0275\u0275text(57);
    \u0275\u0275elementEnd();
    \u0275\u0275text(58, " y la ");
    \u0275\u0275elementStart(59, "a", 37);
    \u0275\u0275text(60);
    \u0275\u0275elementEnd();
    \u0275\u0275text(61, ". ");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(62, "div", 38)(63, "button", 39);
    \u0275\u0275text(64);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(65, ContactoComponent_ng_container_0_Conditional_65_Template, 5, 1, "div", 40);
    \u0275\u0275conditionalCreate(66, ContactoComponent_ng_container_0_Conditional_66_Template, 2, 1, "div", 41);
    \u0275\u0275conditionalCreate(67, ContactoComponent_ng_container_0_Conditional_67_Template, 2, 1, "div", 42);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(68, "section", 43)(69, "h3", 44);
    \u0275\u0275text(70);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(71, "div", 45);
    \u0275\u0275element(72, "iframe", 46);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(73, "div", 47)(74, "div", 48)(75, "div", 49);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(76, "svg", 50);
    \u0275\u0275element(77, "path", 51);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(78, "div")(79, "h4", 52);
    \u0275\u0275text(80);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(81, "p", 53);
    \u0275\u0275text(82);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(83, "div", 48)(84, "div", 49);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(85, "svg", 50);
    \u0275\u0275element(86, "path", 54);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(87, "div")(88, "h4", 52);
    \u0275\u0275text(89);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(90, "p", 53);
    \u0275\u0275text(91);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(92, "p", 55);
    \u0275\u0275text(93);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(94, "div", 48)(95, "div", 49);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(96, "svg", 50);
    \u0275\u0275element(97, "path", 56);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(98, "div")(99, "h4", 52);
    \u0275\u0275text(100);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(101, "p", 55);
    \u0275\u0275text(102);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(103, "div", 48)(104, "div", 49);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(105, "svg", 50);
    \u0275\u0275element(106, "path", 57);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(107, "div")(108, "h4", 52);
    \u0275\u0275text(109);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(110, "p", 55);
    \u0275\u0275text(111);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(112, "div", 58)(113, "h4", 59);
    \u0275\u0275text(114);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(115, "div", 60)(116, "a", 61);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(117, "svg", 5);
    \u0275\u0275element(118, "path", 62);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(119, "a", 63);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(120, "svg", 5);
    \u0275\u0275element(121, "path", 64);
    \u0275\u0275elementEnd()();
    \u0275\u0275namespaceHTML();
    \u0275\u0275elementStart(122, "a", 65);
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(123, "svg", 5);
    \u0275\u0275element(124, "path", 66);
    \u0275\u0275elementEnd()()()()()()()()();
    \u0275\u0275elementContainerEnd();
  }
  if (rf & 2) {
    let tmp_9_0;
    let tmp_12_0;
    let tmp_20_0;
    const content_r3 = ctx.ngIf;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(content_r3.title);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(content_r3.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", content_r3.intro, " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(content_r3.formTitle);
    \u0275\u0275advance();
    \u0275\u0275property("formGroup", ctx_r1.contactForm);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(content_r3.nameLabel);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", content_r3.namePlaceholder);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_9_0 = ctx_r1.contactForm.get("name")) == null ? null : tmp_9_0.invalid) && ((tmp_9_0 = ctx_r1.contactForm.get("name")) == null ? null : tmp_9_0.touched) ? 27 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(content_r3.emailLabel);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", content_r3.emailPlaceholder);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_12_0 = ctx_r1.contactForm.get("email")) == null ? null : tmp_12_0.invalid) && ((tmp_12_0 = ctx_r1.contactForm.get("email")) == null ? null : tmp_12_0.touched) ? 32 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(content_r3.phoneLabel);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", content_r3.phonePlaceholder);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(content_r3.subjectLabel);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(content_r3.subjectPlaceholder);
    \u0275\u0275advance();
    \u0275\u0275repeater(content_r3.subjectOptions);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(content_r3.messageLabel);
    \u0275\u0275advance();
    \u0275\u0275property("placeholder", content_r3.messagePlaceholder);
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_20_0 = ctx_r1.contactForm.get("message")) == null ? null : tmp_20_0.invalid) && ((tmp_20_0 = ctx_r1.contactForm.get("message")) == null ? null : tmp_20_0.touched) ? 49 : -1);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", content_r3.termsText, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r3.termsLink);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(content_r3.privacyLink);
    \u0275\u0275advance(3);
    \u0275\u0275property("disabled", ctx_r1.isLoading);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", content_r3.submitButton, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.isLoading ? 65 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showSuccess ? 66 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r1.showError ? 67 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(content_r3.contactInfoTitle);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(content_r3.addressLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r3.addressValue);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(content_r3.phoneInfoLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r3.phoneInfoValue);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r3.phoneInfoHours);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(content_r3.emailInfoLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r3.emailInfoValue);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(content_r3.supportLabel);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(content_r3.supportValue);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(content_r3.socialTitle);
  }
}
var ContactoComponent = class _ContactoComponent {
  fb = inject(FormBuilder);
  http = inject(HttpClient);
  preferencesService = inject(PreferencesService);
  seoService = inject(SeoService);
  contactForm = this.fb.group({
    name: ["", Validators.required],
    email: ["", [Validators.required, Validators.email]],
    phone: [""],
    subject: ["", Validators.required],
    message: ["", Validators.required],
    terms: [false, Validators.requiredTrue]
  });
  isLoading = false;
  showSuccess = false;
  showError = false;
  contactoContent = CONTACTO_CONTENT;
  content$;
  constructor() {
    this.content$ = this.preferencesService.language$.pipe(map((lang) => this.contactoContent[lang]));
  }
  ngOnInit() {
    this.seoService.setPageData({
      title: "Contacto",
      description: "Ponte en contacto con nosotros. Estamos listos para escuchar tu idea y convertirla en realidad. Whatsapp, Email y Redes Sociales.",
      imageUrl: "assets/img/branding/og-contact.jpg"
    });
  }
  onSubmit() {
    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }
    this.isLoading = true;
    this.showSuccess = false;
    this.showError = false;
    const formData = this.contactForm.value;
    this.http.post("https://formspree.io/f/mpwrwebv", formData).subscribe({
      next: () => {
        this.isLoading = false;
        this.showSuccess = true;
        this.contactForm.reset();
      },
      error: (err) => {
        console.error("Error sending form:", err);
        this.isLoading = false;
        this.showError = true;
      }
    });
  }
  static \u0275fac = function ContactoComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ContactoComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ContactoComponent, selectors: [["app-contacto"]], decls: 2, vars: 3, consts: [[4, "ngIf"], [1, "min-h-screen", "flex", "flex-col"], [1, "bg-white", "dark:bg-white/5", "backdrop-blur-sm", "shadow-sm", "sticky", "top-0", "z-10", "border-b", "border-gray-200", "dark:border-white/10"], [1, "container", "mx-auto", "px-4", "py-3", "flex", "items-center", "justify-between"], ["href", "./", "aria-label", "Volver", 1, "text-gray-900", "dark:text-white", "flex", "items-center", "hover:text-blue-600", "dark:hover:text-blue-400", "transition-colors"], ["xmlns", "http://www.w3.org/2000/svg", "width", "24", "height", "24", "fill", "currentColor", "viewBox", "0 0 256 256"], ["d", "M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z"], [1, "text-gray-900", "dark:text-white", "text-lg", "font-bold", "leading-tight", "tracking-tight", "flex-1", "text-center", "px-4"], [1, "w-6"], [1, "grow", "container", "mx-auto", "px-4", "py-6"], [1, "max-w-4xl", "mx-auto"], [1, "mb-8", "text-center"], [1, "text-2xl", "md:text-3xl", "font-bold", "leading-tight", "mb-2", "text-gray-900", "dark:text-white"], [1, "text-base", "md:text-lg", "leading-normal", "text-gray-600", "dark:text-gray-300", "max-w-2xl", "mx-auto"], [1, "flex", "flex-col", "lg:flex-row", "gap-8"], [1, "flex-1", "bg-white", "dark:bg-white/5", "backdrop-blur-md", "rounded-2xl", "shadow-xl", "p-8", "border", "border-gray-100", "dark:border-white/10", "card-modern"], [1, "text-2xl", "font-bold", "mb-6", "text-transparent", "bg-clip-text", "bg-linear-to-r", "from-blue-600", "to-purple-600", "dark:from-blue-400", "dark:to-purple-400"], [1, "space-y-4", 3, "ngSubmit", "formGroup"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4"], ["for", "name", 1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["type", "text", "id", "name", "formControlName", "name", 1, "w-full", "px-4", "py-3", "rounded-lg", "border", "border-gray-300", "dark:border-white/20", "bg-gray-50", "dark:bg-white/5", "text-gray-900", "dark:text-white", "focus:outline-none", "focus:border-blue-500", "focus:ring-1", "focus:ring-blue-500", "transition-all", "placeholder-gray-500", 3, "placeholder"], [1, "mt-1", "text-sm", "text-red-500", "dark:text-red-400"], ["for", "email", 1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["type", "email", "id", "email", "formControlName", "email", 1, "w-full", "px-4", "py-3", "rounded-lg", "border", "border-gray-300", "dark:border-white/20", "bg-gray-50", "dark:bg-white/5", "text-gray-900", "dark:text-white", "focus:outline-none", "focus:border-blue-500", "focus:ring-1", "focus:ring-blue-500", "transition-all", "placeholder-gray-500", 3, "placeholder"], ["for", "phone", 1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["type", "tel", "id", "phone", "formControlName", "phone", 1, "w-full", "px-4", "py-3", "rounded-lg", "border", "border-gray-300", "dark:border-white/20", "bg-gray-50", "dark:bg-white/5", "text-gray-900", "dark:text-white", "focus:outline-none", "focus:border-blue-500", "focus:ring-1", "focus:ring-blue-500", "transition-all", "placeholder-gray-500", 3, "placeholder"], ["for", "subject", 1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["id", "subject", "formControlName", "subject", 1, "w-full", "px-4", "py-3", "rounded-lg", "border", "border-gray-300", "dark:border-white/20", "bg-gray-50", "dark:bg-gray-800", "text-gray-900", "dark:text-white", "focus:outline-none", "focus:border-blue-500", "focus:ring-1", "focus:ring-blue-500", "transition-all"], ["value", "", "disabled", "", "selected", ""], [3, "value"], ["for", "message", 1, "block", "text-sm", "font-medium", "text-gray-700", "dark:text-gray-300", "mb-1"], ["id", "message", "formControlName", "message", "rows", "5", 1, "w-full", "px-4", "py-3", "rounded-lg", "border", "border-gray-300", "dark:border-white/20", "bg-gray-50", "dark:bg-white/5", "text-gray-900", "dark:text-white", "focus:outline-none", "focus:border-blue-500", "focus:ring-1", "focus:ring-blue-500", "transition-all", "placeholder-gray-500", 3, "placeholder"], [1, "flex", "items-start"], [1, "flex", "items-center", "h-5"], ["id", "terms", "formControlName", "terms", "type", "checkbox", 1, "focus:ring-blue-500", "h-4", "w-4", "text-blue-600", "border-gray-300", "rounded", "bg-gray-50", "dark:bg-white/5"], [1, "ml-3", "text-sm"], ["for", "terms", 1, "font-medium", "text-gray-700", "dark:text-gray-300"], ["href", "#", 1, "text-blue-600", "dark:text-blue-400", "hover:text-blue-500", "dark:hover:text-blue-300"], [1, "pt-4"], ["type", "submit", 1, "w-full", "md:w-auto", "px-8", "py-3", "btn-premium", "rounded-xl", "shadow-lg", "disabled:opacity-50", "disabled:cursor-not-allowed", 3, "disabled"], [1, "mt-4", "p-4", "rounded-lg", "bg-blue-50", "dark:bg-blue-900/30", "text-blue-800", "dark:text-blue-200", "flex", "items-center", "border", "border-blue-200", "dark:border-blue-500/30"], [1, "mt-4", "p-4", "rounded-lg", "bg-green-50", "dark:bg-green-900/30", "text-green-800", "dark:text-green-200", "border", "border-green-200", "dark:border-green-500/30"], [1, "mt-4", "p-4", "rounded-lg", "bg-red-50", "dark:bg-red-900/30", "text-red-800", "dark:text-red-200", "border", "border-red-200", "dark:border-red-500/30"], [1, "flex-1", "bg-white", "dark:bg-white/5", "backdrop-blur-md", "rounded-2xl", "shadow-xl", "p-8", "border", "border-gray-100", "dark:border-white/10", "card-modern", "h-fit"], [1, "text-2xl", "font-bold", "mb-6", "text-gray-900", "dark:text-white"], [1, "map-container", "mb-6", "rounded-lg", "overflow-hidden", "shadow-lg", "border", "border-gray-200", "dark:border-white/10"], ["src", \u0275\u0275trustConstantResourceUrl`https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.539502732569!2d-58.81797292339245!3d-34.76719126615129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bceb46770c86eb%3A0x73b48d51a83e8107!2sARECOFIX%20Servicio%20t%C3%A9cnico%20de%20celulares%20%7C%20Venta%20de%20Repuestos.!5e0!3m2!1ses-419!2sar!4v1771631396545!5m2!1ses-419!2sar`, "allowfullscreen", "", "loading", "lazy", "referrerpolicy", "no-referrer-when-downgrade", "title", "Ubicaci\xF3n de Arecofix en el mapa", 1, "w-full", "h-64"], [1, "space-y-4"], [1, "flex", "items-start", "gap-4"], [1, "flex", "items-center", "justify-center", "rounded-lg", "bg-indigo-100", "dark:bg-white/10", "shrink-0", "size-10", "mt-1", "text-indigo-600", "dark:text-white"], ["xmlns", "http://www.w3.org/2000/svg", "width", "20", "height", "20", "fill", "currentColor", "viewBox", "0 0 256 256"], ["d", "M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z"], [1, "text-gray-900", "dark:text-white", "font-medium"], [1, "text-gray-600", "dark:text-gray-300"], ["d", "M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z"], [1, "text-gray-500", "dark:text-gray-400", "text-sm", "mt-1"], ["d", "M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z"], ["d", "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z"], [1, "mt-8"], [1, "text-gray-900", "dark:text-white", "font-medium", "mb-3"], [1, "flex", "gap-4"], ["href", "https://facebook.com/arecofix", "aria-label", "Facebook", 1, "text-gray-400", "hover:text-blue-600", "dark:hover:text-blue-500", "transition-all"], ["d", "M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z"], ["href", "https://linkedin.com/in/ezequiel-enrico-areco", "aria-label", "LinkedIn", 1, "text-gray-400", "hover:text-blue-700", "dark:hover:text-blue-600", "transition-all"], ["d", "M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"], ["href", "https://instagram.com/arecofix", "aria-label", "Instagram", 1, "text-gray-400", "hover:text-pink-600", "dark:hover:text-pink-500", "transition-all"], ["d", "M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "-ml-1", "mr-3", "h-5", "w-5", "text-blue-600", "dark:text-blue-400"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"]], template: function ContactoComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275template(0, ContactoComponent_ng_container_0_Template, 125, 37, "ng-container", 0);
      \u0275\u0275pipe(1, "async");
    }
    if (rf & 2) {
      \u0275\u0275property("ngIf", \u0275\u0275pipeBind1(1, 1, ctx.content$));
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, NgSelectOption, \u0275NgSelectMultipleOption, DefaultValueAccessor, CheckboxControlValueAccessor, SelectControlValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, NgIf, AsyncPipe], styles: ["\n\n.map-container[_ngcontent-%COMP%] {\n  position: relative;\n  width: 100%;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden;\n}\n.responsive-map[_ngcontent-%COMP%] {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: none;\n}\n.input-focus[_ngcontent-%COMP%]:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.btn-hover[_ngcontent-%COMP%]:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.btn-active[_ngcontent-%COMP%]:active {\n  transform: translateY(0);\n}\n/*# sourceMappingURL=contacto.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ContactoComponent, [{
    type: Component,
    args: [{ selector: "app-contacto", standalone: true, imports: [
      ReactiveFormsModule,
      NgIf,
      AsyncPipe
    ], template: `<ng-container *ngIf="content$ | async as content">\r
  <div class="min-h-screen flex flex-col">\r
    <!-- Header -->\r
    <header class="bg-white dark:bg-white/5 backdrop-blur-sm shadow-sm sticky top-0 z-10 border-b border-gray-200 dark:border-white/10">\r
      <div class="container mx-auto px-4 py-3 flex items-center justify-between">\r
        <a href="./" class="text-gray-900 dark:text-white flex items-center hover:text-blue-600 dark:hover:text-blue-400 transition-colors" aria-label="Volver">\r
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 256 256">\r
            <path\r
              d="M224,128a8,8,0,0,1-8,8H59.31l58.35,58.34a8,8,0,0,1-11.32,11.32l-72-72a8,8,0,0,1,0-11.32l72-72a8,8,0,0,1,11.32,11.32L59.31,120H216A8,8,0,0,1,224,128Z">\r
            </path>\r
          </svg>\r
        </a>\r
        <h1 class="text-gray-900 dark:text-white text-lg font-bold leading-tight tracking-tight flex-1 text-center px-4">{{ content.title }}</h1>\r
        <div class="w-6"></div> <!-- Spacer para balancear el dise\xF1o -->\r
      </div>\r
    </header>\r
  \r
    <!-- Main Content -->\r
    <main class="grow container mx-auto px-4 py-6">\r
      <div class="max-w-4xl mx-auto">\r
        <!-- Hero Section -->\r
        <section class="mb-8 text-center">\r
          <h2 class="text-2xl md:text-3xl font-bold leading-tight mb-2 text-gray-900 dark:text-white">{{ content.subtitle }}</h2>\r
          <p class="text-base md:text-lg leading-normal text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">\r
            {{ content.intro }}\r
          </p>\r
        </section>\r
  \r
        <div class="flex flex-col lg:flex-row gap-8">\r
          <!-- Form Section -->\r
          <section class="flex-1 bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/10 card-modern">\r
            <h3 class="text-2xl font-bold mb-6 text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">{{ content.formTitle }}</h3>\r
  \r
            <form [formGroup]="contactForm" (ngSubmit)="onSubmit()" class="space-y-4">\r
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">\r
                <!-- Nombre -->\r
                <div>\r
                  <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ content.nameLabel }}</label>\r
                  <input type="text" id="name" formControlName="name" [placeholder]="content.namePlaceholder"\r
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500">\r
                  @if (contactForm.get('name')?.invalid && contactForm.get('name')?.touched) {\r
                    <p class="mt-1 text-sm text-red-500 dark:text-red-400">{{ content.nameError }}</p>\r
                  }\r
                </div>\r
  \r
                <!-- Email -->\r
                <div>\r
                  <label for="email" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ content.emailLabel }}</label>\r
                  <input type="email" id="email" formControlName="email" [placeholder]="content.emailPlaceholder"\r
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500">\r
                  @if (contactForm.get('email')?.invalid && contactForm.get('email')?.touched) {\r
                    <p class="mt-1 text-sm text-red-500 dark:text-red-400">{{ content.emailError }}</p>\r
                  }\r
                </div>\r
              </div>\r
  \r
              <!-- Tel\xE9fono -->\r
              <div>\r
                <label for="phone" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ content.phoneLabel }}</label>\r
                <input type="tel" id="phone" formControlName="phone" [placeholder]="content.phonePlaceholder"\r
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500">\r
              </div>\r
  \r
              <!-- Asunto -->\r
              <div>\r
                <label for="subject" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ content.subjectLabel }}</label>\r
                <select id="subject" formControlName="subject"\r
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all">\r
                  <option value="" disabled selected>{{ content.subjectPlaceholder }}</option>\r
                  @for (option of content.subjectOptions; track option.value) {\r
                    <option [value]="option.value">{{ option.label }}</option>\r
                  }\r
                </select>\r
              </div>\r
  \r
              <!-- Mensaje -->\r
              <div>\r
                <label for="message" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{{ content.messageLabel }}</label>\r
                <textarea id="message" formControlName="message" rows="5" [placeholder]="content.messagePlaceholder"\r
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-white/20 bg-gray-50 dark:bg-white/5 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all placeholder-gray-500"></textarea>\r
                @if (contactForm.get('message')?.invalid && contactForm.get('message')?.touched) {\r
                  <p class="mt-1 text-sm text-red-500 dark:text-red-400">{{ content.messageError }}</p>\r
                }\r
              </div>\r
  \r
              <!-- T\xE9rminos y condiciones -->\r
              <div class="flex items-start">\r
                <div class="flex items-center h-5">\r
                  <input id="terms" formControlName="terms" type="checkbox"\r
                    class="focus:ring-blue-500 h-4 w-4 text-blue-600 border-gray-300 rounded bg-gray-50 dark:bg-white/5">\r
                </div>\r
                <div class="ml-3 text-sm">\r
                  <label for="terms" class="font-medium text-gray-700 dark:text-gray-300">\r
                    {{ content.termsText }} <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">{{ content.termsLink }}</a> y la\r
                    <a href="#" class="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300">{{ content.privacyLink }}</a>.\r
                  </label>\r
                </div>\r
              </div>\r
  \r
              <!-- Submit Button -->\r
              <div class="pt-4">\r
                <button type="submit" [disabled]="isLoading"\r
                  class="w-full md:w-auto px-8 py-3 btn-premium rounded-xl shadow-lg disabled:opacity-50 disabled:cursor-not-allowed">\r
                  {{ content.submitButton }}\r
                </button>\r
              </div>\r
  \r
              <!-- Loading and Success/Error Messages -->\r
              @if (isLoading) {\r
                <div class="mt-4 p-4 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 flex items-center border border-blue-200 dark:border-blue-500/30">\r
                  <svg class="animate-spin -ml-1 mr-3 h-5 w-5 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
                  </svg>\r
                  {{ content.sendingMessage }}\r
                </div>\r
              }\r
  \r
              @if (showSuccess) {\r
                <div class="mt-4 p-4 rounded-lg bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-200 border border-green-200 dark:border-green-500/30">\r
                  {{ content.successMessage }}\r
                </div>\r
              }\r
  \r
              @if (showError) {\r
                <div class="mt-4 p-4 rounded-lg bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-200 border border-red-200 dark:border-red-500/30">\r
                  {{ content.errorMessage }}\r
                </div>\r
              }\r
            </form>\r
          </section>\r
  \r
          <!-- Contact Info Section -->\r
          <section class="flex-1 bg-white dark:bg-white/5 backdrop-blur-md rounded-2xl shadow-xl p-8 border border-gray-100 dark:border-white/10 card-modern h-fit">\r
            <h3 class="text-2xl font-bold mb-6 text-gray-900 dark:text-white">{{ content.contactInfoTitle }}</h3>\r
  \r
            <!-- Mapa Responsive -->\r
            <div class="map-container mb-6 rounded-lg overflow-hidden shadow-lg border border-gray-200 dark:border-white/10">\r
              <iframe\r
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.539502732569!2d-58.81797292339245!3d-34.76719126615129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bceb46770c86eb%3A0x73b48d51a83e8107!2sARECOFIX%20Servicio%20t%C3%A9cnico%20de%20celulares%20%7C%20Venta%20de%20Repuestos.!5e0!3m2!1ses-419!2sar!4v1771631396545!5m2!1ses-419!2sar"\r
                class="w-full h-64" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"\r
                title="Ubicaci\xF3n de Arecofix en el mapa"></iframe>\r
            </div>\r
  \r
            <!-- Contact Details -->\r
            <div class="space-y-4">\r
              <div class="flex items-start gap-4">\r
                <div class="flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-white/10 shrink-0 size-10 mt-1 text-indigo-600 dark:text-white">\r
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"\r
                    viewBox="0 0 256 256">\r
                    <path\r
                      d="M128,64a40,40,0,1,0,40,40A40,40,0,0,0,128,64Zm0,64a24,24,0,1,1,24-24A24,24,0,0,1,128,128Zm0-112a88.1,88.1,0,0,0-88,88c0,31.4,14.51,64.68,42,96.25a254.19,254.19,0,0,0,41.45,38.3,8,8,0,0,0,9.18,0A254.19,254.19,0,0,0,174,200.25c27.45-31.57,42-64.85,42-96.25A88.1,88.1,0,0,0,128,16Zm0,206c-16.53-13-72-60.75-72-118a72,72,0,0,1,144,0C200,161.23,144.53,209,128,222Z">\r
                    </path>\r
                  </svg>\r
                </div>\r
                <div>\r
                  <h4 class="text-gray-900 dark:text-white font-medium">{{ content.addressLabel }}</h4>\r
                  <p class="text-gray-600 dark:text-gray-300">{{ content.addressValue }}</p>\r
                </div>\r
              </div>\r
  \r
              <div class="flex items-start gap-4">\r
                <div class="flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-white/10 shrink-0 size-10 mt-1 text-indigo-600 dark:text-white">\r
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"\r
                    viewBox="0 0 256 256">\r
                    <path\r
                      d="M222.37,158.46l-47.11-21.11-.13-.06a16,16,0,0,0-15.17,1.4,8.12,8.12,0,0,0-.75.56L134.87,160c-15.42-7.49-31.34-23.29-38.83-38.51l20.78-24.71c.2-.25.39-.5.57-.77a16,16,0,0,0,1.32-15.06l0-.12L97.54,33.64a16,16,0,0,0-16.62-9.52A56.26,56.26,0,0,0,32,80c0,79.4,64.6,144,144,144a56.26,56.26,0,0,0,55.88-48.92A16,16,0,0,0,222.37,158.46ZM176,208A128.14,128.14,0,0,1,48,80,40.2,40.2,0,0,1,82.87,40a.61.61,0,0,0,0,.12l21,47L83.2,111.86a6.13,6.13,0,0,0-.57.77,16,16,0,0,0-1,15.7c9.06,18.53,27.73,37.06,46.46,46.11a16,16,0,0,0,15.75-1.14,8.44,8.44,0,0,0,.74-.56L168.89,152l47,21.05h0s.08,0,.11,0A40.21,40.21,0,0,1,176,208Z">\r
                    </path>\r
                  </svg>\r
                </div>\r
                <div>\r
                  <h4 class="text-gray-900 dark:text-white font-medium">{{ content.phoneInfoLabel }}</h4>\r
                  <p class="text-gray-600 dark:text-gray-300">{{ content.phoneInfoValue }}</p>\r
                  <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ content.phoneInfoHours }}</p>\r
                </div>\r
              </div>\r
  \r
              <div class="flex items-start gap-4">\r
                <div class="flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-white/10 shrink-0 size-10 mt-1 text-indigo-600 dark:text-white">\r
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"\r
                    viewBox="0 0 256 256">\r
                    <path\r
                      d="M224,48H32a8,8,0,0,0-8,8V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V56A8,8,0,0,0,224,48Zm-96,85.15L52.57,64H203.43ZM98.71,128,40,181.81V74.19Zm11.84,10.85,12,11.05a8,8,0,0,0,10.82,0l12-11.05,58,53.15H52.57ZM157.29,128,216,74.18V181.82Z">\r
                    </path>\r
                  </svg>\r
                </div>\r
                <div>\r
                  <h4 class="text-gray-900 dark:text-white font-medium">{{ content.emailInfoLabel }}</h4>\r
                  <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ content.emailInfoValue }}</p>\r
                </div>\r
              </div>\r
  \r
              <div class="flex items-start gap-4">\r
                <div class="flex items-center justify-center rounded-lg bg-indigo-100 dark:bg-white/10 shrink-0 size-10 mt-1 text-indigo-600 dark:text-white">\r
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor"\r
                    viewBox="0 0 256 256">\r
                    <path\r
                      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm16-40a8,8,0,0,1-8,8,16,16,0,0,1-16-16V128a8,8,0,0,1,0-16,16,16,0,0,1,16,16v40A8,8,0,0,1,144,176ZM112,84a12,12,0,1,1,12,12A12,12,0,0,1,112,84Z">\r
                    </path>\r
                  </svg>\r
                </div>\r
                <div>\r
                  <h4 class="text-gray-900 dark:text-white font-medium">{{ content.supportLabel }}</h4>\r
                  <p class="text-gray-500 dark:text-gray-400 text-sm mt-1">{{ content.supportValue }}</p>\r
                </div>\r
              </div>\r
            </div>\r
  \r
            <!-- Social Media -->\r
            <div class="mt-8">\r
              <h4 class="text-gray-900 dark:text-white font-medium mb-3">{{ content.socialTitle }}</h4>\r
              <div class="flex gap-4">\r
                <a href="https://facebook.com/arecofix" aria-label="Facebook"\r
                  class="text-gray-400 hover:text-blue-600 dark:hover:text-blue-500 transition-all">\r
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"\r
                    viewBox="0 0 256 256">\r
                    <path\r
                      d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm8,191.63V152h24a8,8,0,0,0,0-16H136V112a16,16,0,0,1,16-16h16a8,8,0,0,0,0-16H152a32,32,0,0,0-32,32v24H96a8,8,0,0,0,0,16h24v63.63a88,88,0,1,1,16,0Z">\r
                    </path>\r
                  </svg>\r
                </a>\r
                <a href="https://linkedin.com/in/ezequiel-enrico-areco" aria-label="LinkedIn"\r
                  class="text-gray-400 hover:text-blue-700 dark:hover:text-blue-600 transition-all">\r
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"\r
                    viewBox="0 0 256 256">\r
                    <path\r
                      d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z">\r
                    </path>\r
                  </svg>\r
                </a>\r
                <a href="https://instagram.com/arecofix" aria-label="Instagram"\r
                  class="text-gray-400 hover:text-pink-600 dark:hover:text-pink-500 transition-all">\r
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor"\r
                    viewBox="0 0 256 256">\r
                    <path\r
                      d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40-40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z">\r
                    </path>\r
                  </svg>\r
                </a>\r
              </div>\r
            </div>\r
          </section>\r
        </div>\r
      </div>\r
    </main>\r
  </div>\r
</ng-container>`, styles: ["/* src/app/public/contacto/contacto.scss */\n.map-container {\n  position: relative;\n  width: 100%;\n  padding-bottom: 56.25%;\n  height: 0;\n  overflow: hidden;\n}\n.responsive-map {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  border: none;\n}\n.input-focus:focus {\n  border-color: #3b82f6;\n  box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);\n}\n.btn-hover:hover {\n  transform: translateY(-2px);\n  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);\n}\n.btn-active:active {\n  transform: translateY(0);\n}\n/*# sourceMappingURL=contacto.css.map */\n"] }]
  }], () => [], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ContactoComponent, { className: "ContactoComponent", filePath: "src/app/public/contacto/contacto.ts", lineNumber: 23 });
})();
export {
  ContactoComponent
};
//# sourceMappingURL=chunk-JK6T6KEB.mjs.map
