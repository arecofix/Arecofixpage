import {
  ContactService
} from "./chunk-HAQM55HI.js";
import {
  ReservationCalendar
} from "./chunk-3YUMSUA6.js";
import {
  NotificationService
} from "./chunk-BL5IQYYM.js";
import {
  SeoService
} from "./chunk-UVURSWET.js";
import {
  BreadcrumbsComponent
} from "./chunk-KZLDKJUN.js";
import {
  AuthService
} from "./chunk-65AYZUFN.js";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgControlStatusGroup,
  NgForm,
  NgModel,
  RequiredValidator,
  ɵNgNoValidate
} from "./chunk-DEVYQMPB.js";
import {
  LoggerService
} from "./chunk-2IPP5M5M.js";
import {
  environment
} from "./chunk-TCBIYFRD.js";
import {
  CommonModule,
  DomSanitizer,
  NgForOf,
  NgOptimizedImage,
  RouterLink,
  RouterModule,
  SlicePipe
} from "./chunk-B7SLUDL7.js";
import {
  ChangeDetectorRef,
  Component,
  DOCUMENT,
  Input,
  PLATFORM_ID,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnamespaceHTML,
  ɵɵnamespaceSVG,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind3,
  ɵɵproperty,
  ɵɵpureFunction0,
  ɵɵpureFunction1,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeResourceUrl,
  ɵɵsanitizeUrl,
  ɵɵstyleProp,
  ɵɵtemplate,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-4O7IFJFV.js";
import "./chunk-GOMI4DH3.js";

// src/app/shared/components/product-carousel/product-carousel.component.ts
function ProductCarouselComponent_div_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 5);
    \u0275\u0275element(1, "div", 6);
    \u0275\u0275elementStart(2, "div", 7)(3, "div")(4, "p", 8);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 9);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "a", 10);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r1 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275styleProp("background-image", "url(" + item_r1.image + ")");
    \u0275\u0275attribute("aria-label", item_r1.name);
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(item_r1.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r1.description);
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", item_r1.link);
    \u0275\u0275attribute("aria-label", ctx_r1.addToCartText + " " + item_r1.name);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.addToCartText, " ");
  }
}
var ProductCarouselComponent = class _ProductCarouselComponent {
  title = "";
  items = [];
  addToCartText = "Agregar al carrito";
  static \u0275fac = function ProductCarouselComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ProductCarouselComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ProductCarouselComponent, selectors: [["app-product-carousel"]], inputs: { title: "title", items: "items", addToCartText: "addToCartText" }, decls: 6, vars: 2, consts: [[1, "w-full", "px-4", "py-12", "bg-white", "dark:bg-surface-dark"], [1, "text-gray-900", "dark:text-white", "text-2xl", "font-bold", "leading-tight", "tracking-tight", "px-4", "pb-6"], [1, "flex", "overflow-x-auto", "pb-4", "[-ms-scrollbar-style:none]", "[scrollbar-width:none]", "[&::-webkit-scrollbar]:hidden"], [1, "flex", "items-stretch", "px-4", "gap-4"], ["class", "flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-50 dark:bg-card-dark shadow-md dark:shadow-[0_0_4px_rgba(0,0,0,0.1)] min-w-[280px] border border-gray-200 dark:border-gray-800", 4, "ngFor", "ngForOf"], [1, "flex", "h-full", "flex-1", "flex-col", "gap-4", "rounded-xl", "bg-gray-50", "dark:bg-card-dark", "shadow-md", "dark:shadow-[0_0_4px_rgba(0,0,0,0.1)]", "min-w-[280px]", "border", "border-gray-200", "dark:border-gray-800"], ["role", "img", 1, "w-full", "bg-center", "bg-no-repeat", "aspect-square", "bg-cover", "rounded-t-xl"], [1, "flex", "flex-col", "flex-1", "justify-between", "p-4", "pt-0", "gap-4"], [1, "text-gray-900", "dark:text-white", "text-base", "font-medium", "leading-normal", "mt-2"], [1, "text-gray-500", "dark:text-[#97a2c3]", "text-sm", "font-normal", "leading-normal"], [1, "flex", "items-center", "justify-center", "w-full", "h-10", "px-4", "bg-brand-blue", "hover:bg-brand-dark-blue", "text-white", "text-sm", "font-bold", "rounded-full", "transition-colors", 3, "routerLink"]], template: function ProductCarouselComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h3", 1);
      \u0275\u0275text(2);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(3, "div", 2)(4, "div", 3);
      \u0275\u0275template(5, ProductCarouselComponent_div_5_Template, 10, 8, "div", 4);
      \u0275\u0275elementEnd()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.title);
      \u0275\u0275advance(3);
      \u0275\u0275property("ngForOf", ctx.items);
    }
  }, dependencies: [CommonModule, NgForOf, RouterModule, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ProductCarouselComponent, [{
    type: Component,
    args: [{ selector: "app-product-carousel", standalone: true, imports: [CommonModule, RouterModule], template: `<div class="w-full px-4 py-12 bg-white dark:bg-surface-dark">\r
  <h3 class="text-gray-900 dark:text-white text-2xl font-bold leading-tight tracking-tight px-4 pb-6">{{ title }}</h3>\r
  <div class="flex overflow-x-auto pb-4 [-ms-scrollbar-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">\r
    <div class="flex items-stretch px-4 gap-4">\r
      <div *ngFor="let item of items" class="flex h-full flex-1 flex-col gap-4 rounded-xl bg-gray-50 dark:bg-card-dark shadow-md dark:shadow-[0_0_4px_rgba(0,0,0,0.1)] min-w-[280px] border border-gray-200 dark:border-gray-800">\r
        <div class="w-full bg-center bg-no-repeat aspect-square bg-cover rounded-t-xl"\r
             [style.background-image]="'url(' + item.image + ')'" role="img" [attr.aria-label]="item.name"></div>\r
        <div class="flex flex-col flex-1 justify-between p-4 pt-0 gap-4">\r
          <div>\r
            <p class="text-gray-900 dark:text-white text-base font-medium leading-normal mt-2">{{ item.name }}</p>\r
            <p class="text-gray-500 dark:text-[#97a2c3] text-sm font-normal leading-normal">{{ item.description }}</p>\r
          </div>\r
          <a [routerLink]="item.link"\r
             class="flex items-center justify-center w-full h-10 px-4 bg-brand-blue hover:bg-brand-dark-blue text-white text-sm font-bold rounded-full transition-colors"\r
             [attr.aria-label]="addToCartText + ' ' + item.name">\r
            {{ addToCartText }}\r
          </a>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
</div>\r
` }]
  }], null, { title: [{
    type: Input
  }], items: [{
    type: Input
  }], addToCartText: [{
    type: Input
  }] });
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ProductCarouselComponent, { className: "ProductCarouselComponent", filePath: "src/app/shared/components/product-carousel/product-carousel.component.ts", lineNumber: 18 });
})();

// src/app/public/landing/celular/celular-landing.data.ts
var SPECIAL_OFFERS = [
  {
    image: "assets/img/products/a06.webp",
    name: "Samsung Galaxy A06",
    description: "Lo \xFAltimo de Samsung | Dise\xF1o Elegante | $320",
    price: "$320",
    category: "Celulares",
    link: "/productos"
  },
  {
    image: "assets/img/products/arreglo-consolas.webp",
    name: "Auriculares P9 Pro Max",
    description: "Sonido Premium | Cancelaci\xF3n de Ruido | $19.000",
    price: "$19000",
    category: "Celulares",
    link: "/productos"
  },
  {
    image: "assets/img/products/servicio-tecnico-consolas.webp",
    name: "Parlante Cargador Inal\xE1mbrico",
    description: "2 en 1: Bluetooth + Carga Qi | Sonido 360\xB0 | $27.000",
    price: "$27000",
    category: "Celulares",
    link: "/productos"
  },
  {
    image: "assets/img/products/reparacion-consolas.webp",
    name: "Joystick Play Station 4",
    description: "Original Sony PS4 | Precisi\xF3n Total | $47.800",
    price: "$47800",
    category: "Consoles",
    link: "/productos"
  }
];
var TECH_BEST = [
  {
    image: "assets/img/products/sam.webp",
    name: "Samsung Galaxy A31",
    description: "Oportunidad: Pantalla Super AMOLED | Azul | $79.000",
    price: "$79000",
    category: "Celulares",
    link: "/productos"
  },
  {
    image: "assets/img/products/iphx.webp",
    name: "iPhone X",
    description: "Dise\xF1o Todo Pantalla | Face ID | \xA1Consultar Precio!",
    price: "Consultar",
    category: "Celulares",
    link: "/productos"
  },
  {
    image: "assets/img/products/iph8plus.webp",
    name: "iPhone 8 Plus",
    description: "Cl\xE1sico Potente | Doble C\xE1mara | $290 USD",
    price: "$290 USD",
    category: "Celulares",
    link: "/productos"
  },
  {
    image: "assets/img/products/motorola.webp",
    name: "Motorola Moto E22",
    description: "Parlantes Stereo Dolby Atmos | 90Hz | $69.800",
    price: "$69800",
    category: "Celulares",
    link: "/productos"
  },
  {
    image: "assets/img/products/j2.webp",
    name: "Samsung Galaxy J2 Prime",
    description: "Econ\xF3mico y Funcional | Ideal Primer Celular | Consultar",
    price: "Consultar",
    category: "Celulares",
    link: "/productos"
  }
];
var COURSES_LIST = [
  {
    img: "assets/img/cursos/egresado-2025.jpg",
    title: "Tobias Marchi",
    subtitle: "Egresado 2025",
    slug: ""
  },
  {
    img: "assets/img/cursos/alumno3.jpg",
    title: "Curso Inicial",
    subtitle: "Nivel Principiante",
    duration: "3 Meses",
    days: "S\xE1bados 10hs",
    slug: "reparacion-celulares-basico"
  },
  {
    img: "assets/img/cursos/alumno2.jpg",
    title: "Curso Avanzado",
    subtitle: "Microelectr\xF3nica",
    duration: "4 Meses",
    days: "Mi\xE9rcoles 18hs",
    slug: "curso-avanzado-microelectronica"
  },
  {
    img: "assets/img/cursos/aprendizaje-practico.jpg",
    title: "Aprendizaje Pr\xE1ctico",
    subtitle: "85% pr\xE1ctica - 15% teor\xEDa",
    duration: "",
    days: "",
    slug: "aprendizaje-practico"
  }
];
var FAQS = [
  {
    question: "\xBFCu\xE1nto tiempo tarda la reparaci\xF3n de un celular?",
    answer: "La mayor\xEDa de las reparaciones como cambio de m\xF3dulo (pantalla) o bater\xEDa se realizan en el d\xEDa, generalmente entre 1 a 3 horas."
  },
  {
    question: "\xBFTienen garant\xEDa los arreglos?",
    answer: "S\xED, todas nuestras reparaciones cuentan con garant\xEDa escrita de 30 a 90 d\xEDas sobre el repuesto y la mano de obra."
  },
  {
    question: "\xBFSe pierden mis datos al reparar el equipo?",
    answer: "No. En cambios de pantalla, bater\xEDa y reparaciones de hardware, tus fotos y datos permanecen intactos."
  },
  {
    question: "\xBFAceptan tarjetas de cr\xE9dito/d\xE9bito?",
    answer: "S\xED, aceptamos efectivo, transferencia, tarjetas de cr\xE9dito y d\xE9bito, y Mercado Pago."
  }
];
var REVIEWS = [
  {
    name: "Marcela Pita",
    date: "hace 2 d\xEDas",
    stars: 5,
    initial: "M",
    bgColor: "bg-orange-500",
    text: "La verdad exelente trabajo ,responsable muy educado y sobre todo muy honesto Gracias Ezequiel !!!!!"
  },
  {
    name: "Mart\xEDn Rodriguez",
    date: "hace 1 semana",
    stars: 5,
    initial: "M",
    bgColor: "bg-blue-600",
    text: "Fui por un problema de carga en mi iPhone 11. Pens\xE9 que era el pin de carga pero me lo limpiaron y funcion\xF3 perfecto. Honestidad total, no me cobraron de m\xE1s."
  },
  {
    name: "Sof\xEDa Mendez",
    date: "hace 3 semanas",
    stars: 4,
    initial: "S",
    bgColor: "bg-green-600",
    text: "Buena atenci\xF3n y rapidez. Compr\xE9 un cargador original y funciona b\xE1rbaro. Lo \xFAnico que hay un poco de espera, pero vale la pena."
  },
  {
    name: "Carlos Alberto",
    date: "hace 1 mes",
    stars: 5,
    initial: "C",
    bgColor: "bg-green-600",
    text: "Llev\xE9 una notebook y un celular. Los dos quedaron perfectos. Son t\xE9cnicos de verdad, saben lo que hacen. El local est\xE1 muy bien puesto."
  }
];
var PROCESS_STEPS = [
  {
    title: "1. Recepci\xF3n",
    desc: "Tra\xE9s tu equipo a nuestra sede. Te generamos una orden de servicio \xFAnica.",
    icon: "fas fa-store",
    color: "text-indigo-600",
    bg: "bg-white"
  },
  {
    title: "2. Reparaci\xF3n",
    desc: "Experiencia pura. Nuestros t\xE9cnicos trabajan en tu equipo con repuestos de calidad.",
    icon: "fas fa-tools",
    color: "text-indigo-400",
    bg: "bg-gray-800"
  },
  {
    title: "3. Seguimiento App",
    desc: "\xA1Exclusivo! Segu\xED el estado de tu reparaci\xF3n en tiempo real desde nuestra App web.",
    icon: "fas fa-mobile-alt",
    color: "text-green-400",
    bg: "bg-gray-800"
  },
  {
    title: "4. A Disfrutar",
    desc: "Retir\xE1s tu equipo funcionando como nuevo y con garant\xEDa escrita.",
    icon: "fas fa-smile-beam",
    color: "text-yellow-500",
    bg: "bg-white"
  }
];
var GALLERY_ITEMS = [
  { type: "video", src: "assets/img/repair/4.mp4", poster: "assets/img/repair/iphone.jpg", alt: "Reparaci\xF3n iPhone", span: "col-span-2 row-span-2" },
  { type: "image", src: "assets/img/repair/13.jpg", alt: "Diagn\xF3stico avanzado", span: "" },
  { type: "image", src: "assets/img/repair/1.jpg", alt: "Laboratorio t\xE9cnico", span: "" },
  { type: "image", src: "assets/img/repair/19.jpg", alt: "Microsoldadura profesional", span: "" },
  { type: "image", src: "assets/img/repair/3.jpg", alt: "Cambio de pantalla", span: "" }
];
var PARTNERS = [
  { name: "MobiDoc", icon: "fas fa-user-md", color: "text-cyan-500", url: "https://mobidoc.com.ar" },
  { name: "La Clinica de tu celular", icon: "fas fa-hand-holding-usd", color: "text-blue-400" },
  { name: "Doctor de tu celular", icon: "fas fa-hand-holding-usd", color: "text-blue-400" }
];
var MENTIONS = [
  { name: "La Electr\xF3nica Online", url: "https://laelectronicaonline.com.ar/casa-electronica/arecofix-servicio-tecnico-de-celulares-venta-de-repuestos/" },
  { name: "Municipio Marcos Paz", url: "https://www.marcospaz.gov.ar/noticias/item/8551-j%C3%B3venes-del-programa-envi%C3%B3n-finalizaron-el-curso-de-reparaci%C3%B3n-de-celulares.html" },
  { name: "A1 Noticias", url: "https://a1noticias.com.ar/nota/9798/marcos-paz-jovenes-del-programa-envion-finalizaron-el-curso-de-reparacion-de-celulares" },
  { name: "Mobidoc", url: "https://mobidoc.com.ar/servicio-tecnico/arecofix-soluciones-digitales/" },
  { name: "Red Argentina", url: "https://www.redargentina.com.ar/arecofix-servicio-tecnico-de-celulares-en-marcos-paz-F120EC10E1AD945" },
  { name: "Marcos Paz Conectada", url: "https://noticias.marcospazconectada.com/2023/02/09/termino-el-curso-de-reparacion-de-celulares-del-programa-envion/" }
];
var BLOG_FEATURES = [
  {
    title: "Servicio T\xE9cnico en Marcos Paz",
    desc: "Conoc\xE9 en detalle c\xF3mo trabajamos y por qu\xE9 somos los elegidos en la zona.",
    img: "assets/img/repair/10.jpg",
    link: "/gsm"
  },
  {
    title: "Cursos de Reparaci\xF3n",
    desc: "Capacitate con nosotros. Salida laboral inmediata y certificaci\xF3n.",
    img: "assets/img/cursos/egresado-2025.jpg",
    link: "/academy"
  },
  {
    title: "Venta de Repuestos",
    desc: "Cat\xE1logo completo de m\xF3dulos, bater\xEDas y herramientas para el t\xE9cnico.",
    img: "assets/img/repuestos/1.webp",
    link: "/productos/categoria/repuestos"
  }
];
var APP_INFO = {
  title: "Llev\xE1 Arecofix en tu bolsillo",
  desc: "Segu\xED tus reparaciones en tiempo real, ped\xED presupuestos y acced\xE9 a descuentos exclusivos desde nuestra App.",
  features: ["Seguimiento de Orden", "Historial de Reparaciones", "Turnos Prioritarios"],
  downloadLink: "https://play.google.com/store/apps/details?id=com.arecofix.app&hl=es_AR&gl=US"
};
var RELATED_SERVICES = [
  {
    title: "Reparaci\xF3n de Tablets",
    desc: "Reparaci\xF3n especializada en tablets Android, iPad y Windows.",
    icon: "fa-tablet-alt",
    link: "/servicios/reparacion-tablets"
  },
  {
    title: "Reparaci\xF3n de Consolas",
    desc: "Servicio t\xE9cnico para PlayStation, Xbox y Nintendo Switch.",
    icon: "fa-gamepad",
    link: "/servicios/reparacion-de-consolas"
  },
  {
    title: "Micro Soldadura",
    desc: "Reparaciones a nivel componente (IC, Pistas) con tecnolog\xEDa de punta.",
    icon: "fa-microchip",
    link: "/servicios/servicio-tecnico-de-celulares-en-marcos-paz"
  }
];
var LOCATION_DATA = {
  address: "Jorge Newbery 69, Marcos Paz, Bs. As.",
  hours: "Lun a Sab: 09:00 - 13:00 / 16:00 - 20:00",
  phone: "11 2596-0900",
  mapEmbedUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3277.539502732569!2d-58.81797292339245!3d-34.76719126615129!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95bceb46770c86eb%3A0x73b48d51a83e8107!2sARECOFIX%20Servicio%20t%C3%A9cnico%20de%20celulares%20%7C%20Venta%20de%20Repuestos.!5e0!3m2!1ses-419!2sar!4v1771631396545!5m2!1ses-419!2sar"
};
var WHY_US = [
  {
    title: "7+ A\xF1os de Experiencia",
    desc: "Conocemos cada tornillo de tu equipo. Trayectoria comprobable en Marcos Paz.",
    icon: "fas fa-medal",
    color: "text-blue-600",
    bg: "bg-blue-100"
  },
  {
    title: "Garant\xEDa Real (30-90 d\xEDas)",
    desc: "Te damos un comprobante escrito. Si algo falla, respondemos sin vueltas.",
    icon: "fas fa-shield-alt",
    color: "text-green-600",
    bg: "bg-green-100"
  },
  {
    title: "Laboratorio Propio",
    desc: 'Tu equipo no "viaja" a otros lados. Se repara ac\xE1, con nuestras herramientas.',
    icon: "fas fa-microscope",
    color: "text-green-600",
    bg: "bg-green-100"
  }
];
var SEO_CONTENT = {
  title: "Servicio T\xE9cnico y Arreglo de Celulares en Marcos Paz",
  intro: "\xBFBuscas donde arreglar tu celular cerca de Marcos Paz? En Arecofix somos l\xEDderes en reparaci\xF3n de celulares en Marcos Paz, ofreciendo un servicio r\xE1pido, transparente y garantizado. No importa si ten\xE9s un iPhone, Samsung, Motorola o Xiaomi, nuestros t\xE9cnicos certificados est\xE1n listos para ayudarte.",
  sections: [
    {
      title: "Expertos en Reparaci\xF3n de Celulares",
      content: "Sabemos lo importante que es tu dispositivo para vos. Por eso, nos especializamos en brindar soluciones efectivas para todo tipo de fallas. Desde un simple cambio de m\xF3dulo hasta reparaciones complejas de microelectr\xF3nica. Si necesit\xE1s un arreglo de celulares en Marcos Paz de confianza, somos tu mejor opci\xF3n. Usamos repuestos originales y premium para asegurar la durabilidad de tu equipo."
    },
    {
      title: "\xBFPor qu\xE9 elegir Arecofix en Marcos Paz?",
      content: 'Nos destacamos por nuestra honestidad y profesionalismo. Te ofrecemos un diagn\xF3stico sin cargo para que sepas exactamente qu\xE9 tiene tu equipo antes de invertir. Adem\xE1s, todas nuestras reparaciones cuentan con garant\xEDa escrita de hasta 3 meses. No busques m\xE1s "donde arreglar mi celular", ven\xED a Arecofix en Jorge Newbery 69.'
    }
  ],
  features: [
    { label: "Reparaciones en el d\xEDa:", value: "La mayor\xEDa de los cambios de pantalla y bater\xEDa se realizan en menos de 2 horas." },
    { label: "Precios Competitivos:", value: "La mejor relaci\xF3n precio-calidad en servicio t\xE9cnico de la zona." },
    { label: "Atenci\xF3n Personalizada:", value: "Te mantenemos informado del estado de tu reparaci\xF3n v\xEDa WhatsApp." },
    { label: "Venta de Accesorios:", value: "Proteg\xE9 tu inversi\xF3n con nuestras fundas y vidrios templados de alta calidad." }
  ]
};

// src/app/public/landing/celular/celular-landing.component.ts
var _c0 = () => ({ category: "all" });
var _c1 = () => ({ category: "celulares" });
var _c2 = (a0) => ["/academy", a0];
var _c3 = () => [1, 2, 3, 4, 5];
var _forTrack0 = ($index, $item) => $item.title;
var _forTrack1 = ($index, $item) => $item.label;
var _forTrack2 = ($index, $item) => $item.src;
var _forTrack3 = ($index, $item) => $item.name;
var _forTrack4 = ($index, $item) => $item.question;
function CelularLandingComponent_For_71_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "h3");
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "p");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const section_r2 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(section_r2.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(section_r2.content);
  }
}
function CelularLandingComponent_For_74_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 49);
    \u0275\u0275element(1, "i", 289);
    \u0275\u0275elementStart(2, "div", 290)(3, "strong");
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275text(5);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const feature_r3 = ctx.$implicit;
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate(feature_r3.label);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", feature_r3.value, " ");
  }
}
function CelularLandingComponent_For_194_Conditional_8_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 296);
    \u0275\u0275element(1, "i", 298);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const course_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", course_r4.duration, " ");
  }
}
function CelularLandingComponent_For_194_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 297);
    \u0275\u0275element(1, "i", 299);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const course_r4 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", course_r4.days, " ");
  }
}
function CelularLandingComponent_For_194_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 115)(1, "figure", 291);
    \u0275\u0275element(2, "img", 292);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 293);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 294);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 295);
    \u0275\u0275conditionalCreate(8, CelularLandingComponent_For_194_Conditional_8_Template, 3, 1, "div", 296);
    \u0275\u0275conditionalCreate(9, CelularLandingComponent_For_194_Conditional_9_Template, 3, 1, "div", 297);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const course_r4 = ctx.$implicit;
    \u0275\u0275property("routerLink", course_r4.slug ? \u0275\u0275pureFunction1(7, _c2, course_r4.slug) : "/academy");
    \u0275\u0275advance(2);
    \u0275\u0275property("src", course_r4.img, \u0275\u0275sanitizeUrl)("alt", course_r4.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", course_r4.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(course_r4.subtitle);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(course_r4.duration ? 8 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(course_r4.days ? 9 : -1);
  }
}
function CelularLandingComponent_For_203_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 121)(1, "div");
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 300);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 301);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r5 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap("w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 " + item_r5.bg + " " + item_r5.color);
    \u0275\u0275advance();
    \u0275\u0275classMap(item_r5.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r5.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", item_r5.desc, " ");
  }
}
function CelularLandingComponent_For_303_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 176)(1, "div");
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 302);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 303);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const step_r6 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275classMap("w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-lg transition-transform group-hover:scale-110 " + step_r6.bg + " " + step_r6.color);
    \u0275\u0275advance();
    \u0275\u0275classMap(step_r6.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(step_r6.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", step_r6.desc, " ");
  }
}
function CelularLandingComponent_For_347_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "video", 304);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("rounded-xl overflow-hidden shadow-md group relative bg-black " + item_r7.span);
    \u0275\u0275advance();
    \u0275\u0275property("src", item_r7.src, \u0275\u0275sanitizeUrl)("poster", item_r7.poster);
  }
}
function CelularLandingComponent_For_347_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275element(1, "img", 305);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const item_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer group relative " + (item_r7.span || ""));
    \u0275\u0275advance();
    \u0275\u0275property("src", item_r7.src, \u0275\u0275sanitizeUrl)("alt", item_r7.alt);
  }
}
function CelularLandingComponent_For_347_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CelularLandingComponent_For_347_Conditional_0_Template, 2, 4, "div", 285)(1, CelularLandingComponent_For_347_Conditional_1_Template, 2, 4, "div", 285);
  }
  if (rf & 2) {
    const item_r7 = ctx.$implicit;
    \u0275\u0275conditional(item_r7.type === "video" ? 0 : 1);
  }
}
function CelularLandingComponent_For_354_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "img", 306);
  }
  if (rf & 2) {
    const partner_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275property("src", partner_r8.img, \u0275\u0275sanitizeUrl)("alt", partner_r8.name);
  }
}
function CelularLandingComponent_For_354_Conditional_1_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i");
  }
  if (rf & 2) {
    const partner_r8 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275classMap(partner_r8.icon);
  }
}
function CelularLandingComponent_For_354_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, CelularLandingComponent_For_354_Conditional_1_Conditional_1_Template, 1, 2, "i", 285);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const partner_r8 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap("flex items-center gap-2 text-xl font-bold " + partner_r8.color);
    \u0275\u0275advance();
    \u0275\u0275conditional(partner_r8.icon ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", partner_r8.name, " ");
  }
}
function CelularLandingComponent_For_354_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, CelularLandingComponent_For_354_Conditional_0_Template, 1, 2, "img", 306)(1, CelularLandingComponent_For_354_Conditional_1_Template, 3, 4, "div", 285);
  }
  if (rf & 2) {
    const partner_r8 = ctx.$implicit;
    \u0275\u0275conditional(partner_r8.img ? 0 : 1);
  }
}
function CelularLandingComponent_For_360_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 308);
    \u0275\u0275text(1, "\u2022");
    \u0275\u0275elementEnd();
  }
}
function CelularLandingComponent_For_360_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 307);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(2, CelularLandingComponent_For_360_Conditional_2_Template, 2, 0, "span", 308);
  }
  if (rf & 2) {
    const mention_r9 = ctx.$implicit;
    const \u0275$index_689_r10 = ctx.$index;
    const \u0275$count_689_r11 = ctx.$count;
    \u0275\u0275property("href", mention_r9.url, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", mention_r9.name, " ");
    \u0275\u0275advance();
    \u0275\u0275conditional(!(\u0275$index_689_r10 === \u0275$count_689_r11 - 1) ? 2 : -1);
  }
}
function CelularLandingComponent_For_379_For_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "i");
  }
  if (rf & 2) {
    const star_r12 = ctx.$implicit;
    const review_r13 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275classMap(star_r12 <= review_r13.stars ? "fas fa-star" : "far fa-star");
  }
}
function CelularLandingComponent_For_379_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 213)(1, "div")(2, "div", 309)(3, "div");
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "slice");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div")(7, "h3", 310);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 311)(10, "p");
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "\u2022");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(14, "div", 312);
    \u0275\u0275repeaterCreate(15, CelularLandingComponent_For_379_For_16_Template, 1, 2, "i", 285, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(17, "p", 313);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const review_r13 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275classMap("h-12 w-12 min-w-12 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden " + review_r13.bgColor);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", \u0275\u0275pipeBind3(5, 6, review_r13.initial, 0, 1), " ");
    \u0275\u0275advance(4);
    \u0275\u0275textInterpolate1(" ", review_r13.name, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(review_r13.date);
    \u0275\u0275advance(4);
    \u0275\u0275repeater(\u0275\u0275pureFunction0(10, _c3));
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(' "', review_r13.text, '" ');
  }
}
function CelularLandingComponent_For_389_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 220);
    \u0275\u0275element(1, "input", 314);
    \u0275\u0275elementStart(2, "div", 315);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 316)(5, "p");
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const faq_r14 = ctx.$implicit;
    const \u0275$index_774_r15 = ctx.$index;
    \u0275\u0275advance();
    \u0275\u0275property("checked", \u0275$index_774_r15 === 0);
    \u0275\u0275attribute("aria-label", faq_r14.question);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", faq_r14.question, " ");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(faq_r14.answer);
  }
}
function CelularLandingComponent_Conditional_464_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 253);
  }
}
function CelularLandingComponent_For_484_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 317)(1, "div", 318);
    \u0275\u0275element(2, "div", 319)(3, "img", 320);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 321)(5, "h3", 322);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "p", 323);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 324)(10, "span");
    \u0275\u0275text(11, "Leer M\xE1s");
    \u0275\u0275elementEnd();
    \u0275\u0275element(12, "i", 325);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const post_r16 = ctx.$implicit;
    const \u0275$index_947_r17 = ctx.$index;
    const \u0275$count_947_r18 = ctx.$count;
    \u0275\u0275classMap("group relative flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full " + (\u0275$index_947_r17 === \u0275$count_947_r18 - 1 ? "col-span-2 md:col-span-1" : ""));
    \u0275\u0275property("routerLink", post_r16.link);
    \u0275\u0275advance(3);
    \u0275\u0275property("src", post_r16.img, \u0275\u0275sanitizeUrl)("alt", post_r16.title);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", post_r16.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", post_r16.desc, " ");
  }
}
function CelularLandingComponent_For_498_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 275);
    \u0275\u0275element(1, "i", 326);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const feature_r19 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(feature_r19);
  }
}
function CelularLandingComponent_For_515_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 327);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 328);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 329);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "a", 330);
    \u0275\u0275text(8, " Ver Detalles ");
    \u0275\u0275element(9, "i", 331);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const service_r20 = ctx.$implicit;
    const \u0275$index_1026_r21 = ctx.$index;
    const \u0275$count_1026_r22 = ctx.$count;
    \u0275\u0275classMap("bg-gray-50 rounded-2xl p-4 md:p-8 hover:bg-white hover:shadow-xl transition-all border border-gray-100 group text-center " + (\u0275$index_1026_r21 === \u0275$count_1026_r22 - 1 ? "col-span-2 md:col-span-1" : ""));
    \u0275\u0275advance(2);
    \u0275\u0275classMap("fas " + service_r20.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", service_r20.title, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", service_r20.desc, " ");
    \u0275\u0275advance();
    \u0275\u0275property("routerLink", service_r20.link);
  }
}
var CelularLandingComponent = class _CelularLandingComponent {
  sanitizer = inject(DomSanitizer);
  safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(LOCATION_DATA.mapEmbedUrl);
  seoService = inject(SeoService);
  contactService = inject(ContactService);
  notificationService = inject(NotificationService);
  document = inject(DOCUMENT);
  platformId = inject(PLATFORM_ID);
  auth = inject(AuthService);
  // Kept if needed for other things, but logic moved
  cdr = inject(ChangeDetectorRef);
  logger = inject(LoggerService);
  whatsappNumber = environment.contact.whatsappNumber;
  breadcrumbItems = [
    { label: "Inicio", url: "/" },
    { label: "Servicio T\xE9cnico Celulares", url: "/celular" }
  ];
  // --- MIGRATED DATA ---
  specialOffers = SPECIAL_OFFERS;
  techBest = TECH_BEST;
  coursesList = COURSES_LIST;
  faqs = FAQS;
  reviews = REVIEWS;
  processSteps = PROCESS_STEPS;
  galleryItems = GALLERY_ITEMS;
  partners = PARTNERS;
  mentions = MENTIONS;
  blogFeatures = BLOG_FEATURES;
  appInfo = APP_INFO;
  relatedServices = RELATED_SERVICES;
  seoContent = SEO_CONTENT;
  whyUs = WHY_US;
  locationData = LOCATION_DATA;
  // Contact Form Data
  contactName = "";
  contactPhone = "";
  contactMessage = "";
  sendingContact = false;
  ngOnInit() {
  }
  async sendContactForm() {
    if (!this.contactName || !this.contactPhone || !this.contactMessage) {
      this.notificationService.showWarning("Por favor completa todos los campos.");
      return;
    }
    this.sendingContact = true;
    this.cdr.markForCheck();
    const contactData = {
      name: this.contactName,
      phone: this.contactPhone,
      email: "lp-celular@arecofix.com",
      // Explicitly setting destination/source email for this landing
      subject: "Consulta desde Landing Celulares",
      message: this.contactMessage
    };
    const { error } = await this.contactService.createMessage(contactData);
    if (error) {
      this.logger.error("Error sending message:", error);
      this.notificationService.showError("Hubo un problema al enviar el mensaje. Redireccionando a WhatsApp...");
      const text = `Hola Arecofix, soy ${this.contactName}. ${this.contactMessage}`;
      window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(text)}`, "_blank");
    } else {
      this.notificationService.showSuccess("\xA1Consulta enviada con \xE9xito! Te responderemos a la brevedad.");
      this.contactName = "";
      this.contactPhone = "";
      this.contactMessage = "";
    }
    this.sendingContact = false;
    this.cdr.markForCheck();
  }
  static \u0275fac = function CelularLandingComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CelularLandingComponent)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CelularLandingComponent, selectors: [["app-celular-landing"]], decls: 520, vars: 27, consts: [["appointmentSection", ""], [1, "bg-base-100", "min-h-screen", "font-sans"], [1, "relative", "min-h-[65vh]", "md:min-h-[75vh]", "flex", "items-center", "justify-center", "overflow-hidden"], [1, "absolute", "inset-0", "z-0"], ["ngSrc", "assets/img/repair/10.jpg", "alt", "Servicio T\xE9cnico Celulares Marcos Paz", "priority", "", "fill", "", 1, "w-full", "h-full", "object-cover", "object-[0%_0%]", "md:object-center"], [1, "absolute", "inset-0", "bg-linear-to-r", "from-black/90", "via-black/70", "to-black/40"], [1, "absolute", "top-0", "left-0", "w-full", "z-20", "pt-20", "md:pt-28", "px-4", "md:px-8"], [3, "items"], [1, "relative", "z-10", "w-full", "max-w-7xl", "mx-auto", "px-4", "flex", "flex-col", "md:flex-row", "items-center", "gap-12", "mt-16"], [1, "md:w-1/2", "text-left", "pt-20"], [1, "inline-block", "py-1", "px-3", "rounded-full", "bg-primary/20", "border", "border-primary/50", "text-focus", "text-sm", "font-bold", "tracking-wide", "uppercase", "mb-6", "animate-fade-in-up", "backdrop-blur-sm"], [1, "text-4xl", "md:text-6xl", "font-extrabold", "text-white", "mb-6", "leading-tight", "drop-shadow-2xl"], [1, "text-transparent", "bg-clip-text", "bg-linear-to-r", "from-[#352F85]", "to-[#5CE638]"], [1, "text-xl", "text-gray-200", "mb-8", "max-w-lg", "leading-relaxed", "font-light"], [1, "flex", "flex-col", "sm:flex-row", "gap-4"], ["routerLink", "/productos", 1, "btn", "btn-lg", "border-none", "bg-linear-to-r", "from-violet-600", "to-indigo-600", "hover:from-violet-500", "hover:to-indigo-500", "text-white", "rounded-full", "shadow-lg", "shadow-indigo-500/40", "hover:shadow-indigo-500/60", "hover:-translate-y-1", "transition-all", "duration-300", "px-10", "gap-3"], [1, "fas", "fa-shopping-bag", "text-xl"], [1, "font-bold"], ["target", "_blank", 1, "btn", "btn-outline", "btn-lg", "rounded-full", "text-white", "hover:bg-white", "hover:text-black", "hover:border-white", "px-8", 3, "href"], [1, "fa-brands", "fa-whatsapp", "mr-2"], [1, "mt-12", "flex", "gap-6", "text-sm", "font-medium", "text-gray-400"], [1, "flex", "items-center", "gap-2"], [1, "fas", "fa-check-circle", "text-green-500"], [1, "md:w-1/2", "relative", "hidden", "md:block"], [1, "relative", "w-80", "h-[550px]", "mx-auto", "bg-gray-900", "rounded-[3rem]", "border-8", "border-gray-800", "shadow-2xl", "overflow-hidden", "ring-4", "ring-white/10", "transform", "rotate-[-5deg]", "hover:rotate-0", "transition-all", "duration-500", "z-10"], [1, "absolute", "top-0", "left-1/2", "-ml-20", "w-40", "h-6", "bg-gray-800", "rounded-b-xl", "z-20"], ["src", "assets/img/repair/apple.jpg", "alt", "Reparando iPhone", 1, "w-full", "h-full", "object-cover", "opacity-90"], [1, "absolute", "bottom-6", "left-4", "right-4", "bg-white/10", "backdrop-blur-md", "p-4", "rounded-xl", "border", "border-white/20", "text-white"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-xs", "font-bold", "uppercase", "text-primary"], [1, "badge", "badge-success", "badge-sm"], [1, "text-sm", "font-medium"], [1, "text-xs", "text-gray-300"], [1, "absolute", "top-1/4", "-right-10", "w-72", "h-72", "bg-primary/30", "rounded-full", "blur-[100px]", "z-0"], [1, "absolute", "-bottom-10", "-left-10", "w-72", "h-72", "bg-secondary/30", "rounded-full", "blur-[100px]", "z-0"], [1, "bg-neutral", "text-neutral-content", "py-8", "border-b", "border-white/5"], [1, "max-w-7xl", "mx-auto", "px-4", "overflow-hidden"], [1, "text-center", "text-xs", "uppercase", "tracking-widest", "opacity-70", "mb-6"], [1, "flex", "flex-row", "flex-nowrap", "justify-center", "items-center", "opacity-60", "grayscale", "text-2xl", "md:text-4xl", "overflow-x-auto", "no-scrollbar", "py-4", "px-2"], [1, "shrink-0", "mx-4", "sm:mx-8", "transform", "hover:scale-105", "transition-transform", "duration-300"], [1, "font-bold", "hover:text-blue-500", "hover:opacity-100", "transition-colors", "cursor-default", "tracking-tighter"], [1, "font-bold", "hover:text-orange-500", "hover:opacity-100", "transition-colors", "cursor-default", "tracking-tighter"], [1, "font-bold", "hover:text-blue-300", "hover:opacity-100", "transition-colors", "cursor-default", "tracking-tighter"], [1, "py-16", "bg-white", "dark:bg-gray-800"], [1, "container", "mx-auto", "px-4", "max-w-4xl"], [1, "prose", "prose-lg", "dark:prose-invert", "mx-auto"], [1, "text-3xl", "font-bold", "text-center", "mb-8"], [1, "lead", "text-center", "mb-8"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "gap-4", "list-none", "pl-0", "my-8"], [1, "flex", "items-start", "gap-2"], [1, "py-20", "bg-base-100", "relative"], [1, "container", "mx-auto", "px-4"], [1, "flex", "flex-col", "lg:flex-row", "items-center", "gap-12"], [1, "lg:w-1/2"], [1, "text-primary", "font-bold", "tracking-widest", "uppercase", "text-sm", "mb-2", "block"], [1, "text-3xl", "md:text-5xl", "font-bold", "mb-6", "text-base-content"], [1, "text-primary"], [1, "text-lg", "text-base-content/70", "mb-8"], [1, "fas", "fa-map-marker-alt", "text-error", "mr-2"], [1, "grid", "grid-cols-2", "gap-4", "mb-8"], [1, "p-4", "bg-base-200", "rounded-xl"], [1, "fas", "fa-clock", "text-2xl", "text-primary", "mb-2"], [1, "text-xs"], [1, "fas", "fa-shield-alt", "text-2xl", "text-secondary", "mb-2"], [1, "lg:w-1/2", "w-full"], [1, "card", "bg-base-100", "shadow-2xl", "border", "border-base-200", "overflow-hidden"], [1, "card-body", "p-0"], [1, "bg-primary", "text-primary-content", "p-4", "text-center"], [1, "font-bold", "text-lg"], [1, "p-4"], [1, "py-16", "bg-base-200"], [1, "text-center", "mb-12"], [1, "text-3xl", "font-bold", "mb-4"], [1, "text-base-content/60"], [3, "title", "items", "addToCartText"], [1, "text-center", "mt-12"], ["routerLink", "/productos", 1, "btn", "btn-primary", "btn-wide", "btn-lg", "shadow-lg", "hover:scale-105", "transition-transform", "border-2", "border-primary-focus", "hover:border-white", "text-white", "font-bold", 3, "queryParams"], [1, "fas", "fa-store", "ml-2"], [1, "relative", "py-20", "bg-neutral", "text-neutral-content", "overflow-hidden"], [1, "absolute", "inset-0", "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]", "opacity-20"], [1, "container", "mx-auto", "px-4", "relative", "z-10", "text-center"], [1, "badge", "badge-accent", "mb-4", "p-3"], [1, "text-4xl", "md:text-5xl", "font-bold", "mb-6"], [1, "text-xl", "mb-8", "max-w-2xl", "mx-auto", "opacity-90"], [1, "flex", "justify-center", "gap-8", "mb-10", "text-lg", "font-medium"], [1, "fas", "fa-certificate", "text-yellow-400"], [1, "fas", "fa-boxes", "text-blue-400"], ["routerLink", "/productos/categoria/repuestos", 1, "btn", "btn-accent", "btn-lg", "shadow-lg", "hover:scale-105", "transition-transform"], [1, "py-16", "bg-base-100"], [1, "flex", "justify-between", "items-end", "mb-8"], [1, "text-3xl", "font-bold"], [1, "text-base-content/60", "mt-2"], ["routerLink", "/productos", 1, "btn", "btn-link", "no-underline", 3, "queryParams"], [1, "fas", "fa-arrow-right", "ml-2"], [1, "relative", "py-20", "bg-gray-900", "text-white", "overflow-hidden"], [1, "absolute", "top-0", "right-0", "w-1/2", "h-full", "bg-linear-to-l", "from-green-900/40", "to-transparent"], [1, "container", "mx-auto", "px-4", "relative", "z-10", "flex", "flex-col", "lg:flex-row", "items-center", "gap-12"], [1, "badge", "bg-[#317dc0]", "text-white", "border-none", "mb-4", "p-3"], [1, "fas", "fa-gamepad", "mr-2"], [1, "text-lg", "text-gray-300", "mb-8", "leading-relaxed"], [1, "flex", "gap-4"], ["target", "_blank", 1, "btn", "bg-[#317dc0]", "border-[#317dc0]", "text-white", "hover:bg-[#2a6ba3]", "hover:border-[#2a6ba3]", "btn-lg", 3, "href"], [1, "fas", "fa-wrench", "mr-2"], ["routerLink", "/productos/categoria/consolas", 1, "btn", "btn-outline", "text-white", "hover:bg-white", "hover:text-black"], [1, "lg:w-1/2", "flex", "justify-center"], ["src", "assets/img/products/arreglo-consolas.webp", "alt", "Reparaci\xF3n Consolas", 1, "rounded-2xl", "shadow-2xl", "border-4", "border-green-500/30", "w-full", "max-w-md", "hover:scale-105", "transition-transform", "duration-500"], [1, "relative", "isolate", "bg-gray-900", "py-24", "sm:py-32", "overflow-hidden"], ["aria-hidden", "true", 1, "absolute", "inset-x-0", "-top-3", "-z-10", "transform-gpu", "overflow-hidden", "px-36", "blur-3xl"], [1, "mx-auto", "aspect-1155/678", "w-6xl", "bg-linear-to-tr", "from-[#ff80b5]", "to-[#9089fc]", "opacity-20", 2, "clip-path", "polygon(\n            74.1% 44.1%,\n            100% 61.6%,\n            97.5% 26.9%,\n            85.5% 0.1%,\n            80.7% 2%,\n            72.5% 32.5%,\n            60.2% 62.4%,\n            52.4% 68.1%,\n            47.5% 58.3%,\n            45.2% 34.5%,\n            27.5% 76.7%,\n            0.1% 64.9%,\n            17.9% 100%,\n            27.6% 76.8%,\n            76.1% 97.7%,\n            74.1% 44.1%\n          )"], [1, "container", "mx-auto", "px-6", "lg:px-8"], [1, "mx-auto", "max-w-4xl", "text-center", "mb-16"], [1, "text-base/7", "font-semibold", "text-indigo-400"], [1, "mt-2", "text-4xl", "font-semibold", "tracking-tight", "text-balance", "text-white", "sm:text-5xl"], [1, "mx-auto", "mt-6", "max-w-2xl", "text-lg", "font-medium", "text-pretty", "text-gray-400"], [1, "mx-auto", "grid", "grid-cols-2", "gap-3", "md:gap-8", "lg:max-w-none", "lg:grid-cols-4"], [1, "flex", "flex-col", "rounded-2xl", "md:rounded-3xl", "bg-white/5", "p-3", "md:p-6", "ring-1", "ring-white/10", "hover:bg-white/10", "transition-colors", "hover:-translate-y-1", "duration-300", "cursor-pointer", "group", 3, "routerLink"], [1, "text-center", "mt-16"], ["routerLink", "/academy", 1, "inline-flex", "items-center", "justify-center", "rounded-full", "bg-indigo-600", "px-8", "py-3.5", "text-sm", "font-semibold", "text-white", "shadow-sm", "hover:bg-indigo-500", "focus-visible:outline-2", "focus-visible:outline-offset-2", "focus-visible:outline-indigo-500", "transition-all", "hover:scale-105"], [1, "fas", "fa-graduation-cap", "mr-2"], [1, "py-20", "bg-white", "dark:bg-gray-900"], [1, "grid", "grid-cols-1", "md:grid-cols-3", "gap-8", "text-center"], [1, "p-6"], [1, "bg-gray-900", "py-8", "sm:py-10"], [1, "mx-auto", "max-w-2xl", "px-6", "lg:max-w-7xl", "lg:px-8"], [1, "text-center", "text-base/7", "font-semibold", "text-indigo-400"], [1, "mx-auto", "mt-2", "max-w-lg", "text-center", "text-3xl", "font-semibold", "tracking-tight", "text-balance", "text-white", "sm:text-4xl"], [1, "mt-4", "grid", "gap-4", "sm:mt-6", "lg:grid-cols-3", "lg:grid-rows-2"], [1, "relative", "lg:row-span-2"], [1, "absolute", "inset-px", "rounded-lg", "bg-gray-800", "lg:rounded-l-4xl"], [1, "relative", "flex", "h-full", "flex-col", "overflow-hidden", "rounded-[calc(var(--radius-lg)+1px)]", "lg:rounded-l-[calc(2rem+1px)]"], [1, "px-6", "pt-6", "pb-2", "sm:px-8", "sm:pt-8", "sm:pb-0"], [1, "mt-2", "text-lg", "font-medium", "tracking-tight", "text-white", "max-lg:text-center"], [1, "mt-2", "max-w-lg", "text-sm/6", "text-gray-400", "max-lg:text-center"], [1, "@container", "relative", "min-h-40", "w-full", "grow", "max-lg:mx-auto", "max-lg:max-w-sm"], [1, "absolute", "inset-x-8", "top-8", "bottom-0", "overflow-hidden", "rounded-t-[12cqw]", "border-x-[3cqw]", "border-t-[3cqw]", "border-gray-700", "bg-gray-900", "outline", "outline-white/20"], [1, "pointer-events-none", "absolute", "inset-px", "rounded-lg", "shadow-sm", "outline", "outline-white/15", "lg:rounded-l-4xl"], [1, "relative", "max-lg:row-start-1"], [1, "absolute", "inset-px", "rounded-lg", "bg-gray-800", "max-lg:rounded-t-4xl"], [1, "relative", "flex", "h-full", "flex-col", "overflow-hidden", "rounded-[calc(var(--radius-lg)+1px)]", "max-lg:rounded-t-[calc(2rem+1px)]"], [1, "px-6", "pt-6", "sm:px-8", "sm:pt-8"], [1, "flex", "flex-1", "items-center", "justify-center", "px-6", "max-lg:pt-6", "max-lg:pb-8", "sm:px-8", "lg:pb-2"], ["src", "assets/img/repair/13.jpg", "alt", "Microsoldadura", 1, "w-full", "max-lg:max-w-xs", "rounded-lg", "object-cover", "h-24", "sm:h-32"], [1, "pointer-events-none", "absolute", "inset-px", "rounded-lg", "shadow-sm", "outline", "outline-white/15", "max-lg:rounded-t-4xl"], [1, "relative", "max-lg:row-start-3", "lg:col-start-2", "lg:row-start-2"], [1, "absolute", "inset-px", "rounded-lg", "bg-gray-800"], [1, "relative", "flex", "h-full", "flex-col", "overflow-hidden", "rounded-[calc(var(--radius-lg)+1px)]"], [1, "px-6", "pt-6", "pb-6", "sm:px-8", "sm:pt-8", "sm:pb-8"], [1, "pointer-events-none", "absolute", "inset-px", "rounded-lg", "shadow-sm", "outline", "outline-white/15"], [1, "absolute", "inset-px", "rounded-lg", "bg-gray-800", "max-lg:rounded-b-4xl", "lg:rounded-r-4xl"], [1, "relative", "flex", "h-full", "flex-col", "overflow-hidden", "rounded-[calc(var(--radius-lg)+1px)]", "max-lg:rounded-b-[calc(2rem+1px)]", "lg:rounded-r-[calc(2rem+1px)]"], [1, "relative", "min-h-40", "w-full", "grow"], [1, "absolute", "top-6", "right-0", "bottom-0", "left-6", "overflow-hidden", "rounded-tl-xl", "bg-gray-900/60", "outline", "outline-white/10"], [1, "flex", "bg-gray-900", "outline", "outline-white/5"], [1, "-mb-px", "flex", "text-sm/6", "font-medium", "text-gray-400"], [1, "border-r", "border-b", "border-r-white/10", "border-b-white/20", "bg-white/5", "px-4", "py-2", "text-white"], [1, "border-r", "border-gray-600/10", "px-4", "py-2"], [1, "px-6", "pt-4", "pb-8", "text-xs", "sm:text-sm", "leading-tight", "text-gray-300"], [1, "pointer-events-none", "absolute", "inset-px", "rounded-lg", "shadow-sm", "outline", "outline-white/15", "max-lg:rounded-b-4xl", "lg:rounded-r-4xl"], [1, "py-0", "grid", "grid-cols-1", "md:grid-cols-2", "bg-neutral", "text-neutral-content"], [1, "p-12", "flex", "flex-col", "justify-center"], [1, "text-primary", "font-bold", "tracking-widest", "uppercase", "mb-4"], [1, "text-3xl", "font-bold", "mb-6"], [1, "space-y-4", "text-lg"], [1, "fas", "fa-map-marker-alt", "text-error", "w-8"], [1, "fas", "fa-clock", "text-primary", "w-8"], [1, "fas", "fa-phone", "text-success", "w-8"], ["href", "https://maps.app.goo.gl/73b48d51a83e8107", "target", "_blank", 1, "btn", "btn-outline", "btn-white", "w-fit", "mt-8"], [1, "fas", "fa-directions", "mr-2"], [1, "h-80", "md:h-full", "min-h-[450px]", "bg-gray-200"], ["width", "100%", "height", "100%", "allowfullscreen", "", "loading", "lazy", "title", "Ubicaci\xF3n de Arecofix en Google Maps", "referrerpolicy", "no-referrer-when-downgrade", 2, "border", "0", 3, "src"], [1, "py-20", "bg-gray-900", "text-white", "relative", "overflow-hidden"], [1, "absolute", "inset-0", "bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]", "opacity-10"], [1, "container", "mx-auto", "px-4", "relative", "z-10"], [1, "text-center", "mb-16"], [1, "text-gray-400", "mt-2"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4", "md:gap-8"], [1, "relative", "items-center", "flex", "flex-col", "group"], [1, "overflow-hidden", "bg-gray-900", "py-24", "sm:py-32"], [1, "mx-auto", "max-w-7xl", "px-6", "lg:px-8"], [1, "mx-auto", "grid", "max-w-2xl", "grid-cols-1", "gap-x-8", "gap-y-16", "sm:gap-y-20", "lg:mx-0", "lg:max-w-none", "lg:grid-cols-2"], [1, "lg:pt-4", "lg:pr-8"], [1, "lg:max-w-lg"], [1, "mt-2", "text-4xl", "font-semibold", "tracking-tight", "text-pretty", "text-white", "sm:text-5xl"], [1, "mt-6", "text-lg/8", "text-gray-300"], [1, "mt-10", "max-w-xl", "space-y-8", "text-base/7", "text-gray-400", "lg:max-w-none"], [1, "relative", "pl-9"], [1, "inline", "font-semibold", "text-white"], ["viewBox", "0 0 20 20", "fill", "currentColor", "data-slot", "icon", "aria-hidden", "true", 1, "absolute", "top-1", "left-1", "size-5", "text-indigo-400"], ["d", "M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z", "clip-rule", "evenodd", "fill-rule", "evenodd"], [1, "inline"], ["d", "M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z", "clip-rule", "evenodd", "fill-rule", "evenodd"], ["d", "M4.632 3.533A2 2 0 0 1 6.577 2h6.846a2 2 0 0 1 1.945 1.533l1.976 8.234A3.489 3.489 0 0 0 16 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234Z"], ["d", "M4 13a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4H4Zm11.24 2a.75.75 0 0 1 .75-.75H16a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75V15Zm-2.25-.75a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75h-.01Z", "clip-rule", "evenodd", "fill-rule", "evenodd"], ["width", "2432", "height", "1442", "src", "https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png", "alt", "Product screenshot", 1, "w-3xl", "max-w-none", "rounded-xl", "shadow-xl", "ring-1", "ring-white/10", "sm:w-228", "md:-ml-4", "lg:ml-0"], [1, "py-20", "bg-base-100"], [1, "text-3xl", "font-bold", "text-center", "mb-4"], [1, "text-center", "text-base-content/60", "mb-12"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4"], [1, "py-12", "bg-base-200", "border-y", "border-base-300"], [1, "container", "mx-auto", "px-4", "text-center"], [1, "text-sm", "font-bold", "text-base-content/40", "uppercase", "tracking-widest", "mb-8"], [1, "flex", "justify-center", "items-center", "gap-12", "flex-wrap", "opacity-60", "grayscale", "hover:grayscale-0", "transition-all"], [1, "mt-8", "pt-8", "border-t", "border-base-300"], [1, "text-xs", "text-base-content/40", "uppercase", "tracking-widest", "mb-4"], [1, "flex", "flex-col", "md:flex-row", "justify-center", "items-center", "gap-4", "font-serif", "text-base-content/60", "text-sm", "flex-wrap"], [1, "py-20", "bg-base-200"], [1, "flex", "items-center", "justify-center", "gap-2", "mb-2"], [1, "text-2xl", "font-bold"], [1, "flex", "text-yellow-500"], [1, "fas", "fa-star"], [1, "fas", "fa-star-half-alt"], [1, "text-sm", "text-gray-500"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-6"], ["href", "https://share.google/Fnume9zIn9XpY4Xiu", "target", "_blank", 1, "relative", "flex", "h-full", "flex-col", "justify-between", "rounded-2xl", "bg-base-100", "p-6", "shadow-sm", "ring-1", "ring-base-200", "transition-all", "hover:shadow-md", "hover:-translate-y-1"], [1, "text-center", "mt-10"], ["href", "https://share.google/Fnume9zIn9XpY4Xiu", "target", "_blank", 1, "btn", "btn-outline", "btn-primary"], [1, "fas", "fa-pen", "mr-2"], [1, "py-20", "max-w-3xl", "mx-auto", "px-4"], [1, "text-3xl", "font-bold", "text-center", "mb-10", "text-base-content"], [1, "join", "join-vertical", "w-full", "bg-base-100", "rounded-2xl", "border", "border-base-200", "shadow-sm"], [1, "collapse", "collapse-arrow", "join-item", "border-b", "border-base-200"], [1, "relative", "isolate", "overflow-hidden", "bg-gray-900", "py-24", "sm:py-32"], ["src", "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply", "alt", "", 1, "absolute", "inset-0", "-z-10", "size-full", "object-cover", "object-right", "md:object-center"], ["aria-hidden", "true", 1, "hidden", "sm:absolute", "sm:-top-10", "sm:right-1/2", "sm:-z-10", "sm:mr-10", "sm:block", "sm:transform-gpu", "sm:blur-3xl"], [1, "aspect-1097/845", "w-274.25", "bg-linear-to-tr", "from-[#ff4694]", "to-[#776fff]", "opacity-20", 2, "clip-path", "polygon(\n            74.1% 44.1%,\n            100% 61.6%,\n            97.5% 26.9%,\n            85.5% 0.1%,\n            80.7% 2%,\n            72.5% 32.5%,\n            60.2% 62.4%,\n            52.4% 68.1%,\n            47.5% 58.3%,\n            45.2% 34.5%,\n            27.5% 76.7%,\n            0.1% 64.9%,\n            17.9% 100%,\n            27.6% 76.8%,\n            76.1% 97.7%,\n            74.1% 44.1%\n          )"], ["aria-hidden", "true", 1, "absolute", "-top-52", "left-1/2", "-z-10", "-translate-x-1/2", "transform-gpu", "blur-3xl", "sm:-top-112", "sm:ml-16", "sm:translate-x-0"], [1, "mx-auto", "max-w-2xl", "lg:mx-0"], [1, "text-5xl", "font-semibold", "tracking-tight", "text-white", "sm:text-7xl"], [1, "mt-8", "text-lg", "font-medium", "text-pretty", "text-gray-300", "sm:text-xl/8"], [1, "mx-auto", "mt-10", "max-w-2xl", "lg:mx-0", "lg:max-w-none"], [1, "grid", "grid-cols-1", "gap-x-8", "gap-y-6", "text-base/7", "font-semibold", "text-white", "sm:grid-cols-2", "md:flex", "lg:gap-x-10"], ["href", "#"], ["aria-hidden", "true"], [1, "mt-16", "grid", "grid-cols-1", "gap-8", "sm:mt-20", "sm:grid-cols-2", "lg:grid-cols-4"], [1, "flex", "flex-col-reverse", "gap-1"], [1, "text-base/7", "text-gray-300"], [1, "text-4xl", "font-semibold", "tracking-tight", "text-white"], ["id", "contact", 1, "py-20", "bg-base-200"], [1, "max-w-2xl", "mx-auto", "px-4"], [1, "card", "bg-base-100", "shadow-xl"], [1, "card-body"], [1, "card-title", "text-3xl", "justify-center", "mb-6", "text-base-content"], [3, "ngSubmit"], [1, "form-control", "mb-4"], ["for", "contactName", 1, "label"], [1, "label-text"], ["type", "text", "id", "contactName", "name", "name", "placeholder", "Tu nombre", "required", "", 1, "input", "input-bordered", "w-full", "bg-base-200", "text-base-content", "placeholder:text-base-content/60", 3, "ngModelChange", "ngModel"], ["for", "contactPhone", 1, "label"], ["type", "tel", "id", "contactPhone", "name", "phone", "placeholder", "11 1234 5678", "required", "", 1, "input", "input-bordered", "w-full", "bg-base-200", "text-base-content", "placeholder:text-base-content/60", 3, "ngModelChange", "ngModel"], [1, "form-control", "mb-6"], ["for", "contactMessage", 1, "label"], ["id", "contactMessage", "name", "message", "placeholder", "Hola, quer\xEDa saber el precio de...", "required", "", 1, "textarea", "textarea-bordered", "h-32", "w-full", "bg-base-200", "text-base-content", "placeholder:text-base-content/60", 3, "ngModelChange", "ngModel"], ["type", "submit", 1, "btn", "btn-primary", "w-full", "text-lg", 3, "disabled"], [1, "loading", "loading-spinner"], [1, "bg-primary", "text-primary-content", "py-4", "text-center", "font-bold", "text-lg", "md:text-xl", "shadow-lg", "relative", "z-20"], [1, "container", "mx-auto", "px-4", "flex", "justify-center", "items-center", "gap-2"], [1, "fas", "fa-shield-alt", "text-2xl"], [1, "pt-24", "pb-48", "bg-gray-50", "relative", "overflow-hidden"], [1, "absolute", "top-0", "right-0", "w-96", "h-96", "bg-blue-500/10", "rounded-full", "blur-3xl", "-translate-y-1/2", "translate-x-1/2"], [1, "absolute", "bottom-0", "left-0", "w-96", "h-96", "bg-green-500/10", "rounded-full", "blur-3xl", "translate-y-1/2", "-translate-x-1/2"], [1, "text-green-600", "font-bold", "tracking-widest", "uppercase", "text-sm", "mb-2", "block"], [1, "text-4xl", "md:text-5xl", "font-bold", "mb-4", "text-gray-900"], [1, "text-xl", "text-gray-600", "max-w-2xl", "mx-auto"], [1, "grid", "grid-cols-2", "md:grid-cols-2", "xl:grid-cols-4", "gap-4", "md:gap-6"], [3, "routerLink", "class"], [1, "col-span-2", "md:col-span-1", "lg:col-span-1", "h-full"], [1, "bg-[#1f2937]", "text-white", "rounded-3xl", "p-8", "shadow-2xl", "relative", "overflow-hidden", "group", "border", "border-gray-700", "h-full", "flex", "flex-col"], [1, "absolute", "top-0", "right-0", "w-32", "h-32", "bg-blue-500/20", "rounded-full", "blur-2xl"], [1, "absolute", "bottom-0", "left-0", "w-32", "h-32", "bg-green-500/20", "rounded-full", "blur-2xl"], [1, "relative", "z-10", "flex", "flex-col", "items-center", "text-center", "grow", "justify-between"], [1, "w-20", "h-20", "bg-white/5", "rounded-2xl", "flex", "items-center", "justify-center", "mb-6", "border", "border-white/10", "shadow-inner", "backdrop-blur-sm"], [1, "fas", "fa-mobile-screen-button", "text-4xl", "text-green-400"], [1, "text-2xl", "font-bold", "mb-3"], [1, "text-gray-400", "text-sm", "mb-8", "leading-relaxed"], [1, "text-left", "space-y-4", "mb-8", "w-full", "px-4"], [1, "flex", "items-center", "gap-3", "text-sm", "text-gray-300"], ["target", "_blank", 1, "w-full", "bg-white", "text-gray-900", "rounded-xl", "p-3", "flex", "items-center", "justify-center", "gap-3", "hover:bg-gray-100", "hover:scale-[1.02]", "transition-all", "duration-300", "shadow-lg", "group-hover:shadow-blue-500/20", 3, "href"], [1, "text-left"], [1, "text-[10px]", "uppercase", "font-bold", "tracking-wider", "text-gray-500"], [1, "text-lg", "font-bold", "leading-none"], [1, "mt-24", "mb-12"], [1, "text-green-600", "font-bold", "tracking-widest", "uppercase", "text-xs", "mb-3", "block"], [1, "text-3xl", "font-bold", "text-gray-900", "mb-4"], [1, "text-gray-600", "max-w-2xl", "mx-auto"], [1, "grid", "grid-cols-2", "md:grid-cols-3", "gap-4", "md:gap-8", "mb-12"], [3, "class"], [1, "text-center"], ["routerLink", "/servicios", 1, "inline-flex", "items-center", "justify-center", "gap-3", "bg-gray-900", "text-white", "px-8", "py-4", "rounded-full", "font-bold", "hover:bg-gray-800", "hover:-translate-y-1", "transition-all", "shadow-lg", "shadow-gray-900/20"], [1, "fas", "fa-layer-group"], [1, "fas", "fa-check-circle", "text-green-500", "mt-1"], [1, "text-sm"], [1, "aspect-video", "w-full", "overflow-hidden", "rounded-xl", "md:rounded-2xl", "mb-3", "md:mb-6", "shadow-lg"], [1, "w-full", "h-full", "object-cover", 3, "src", "alt"], [1, "text-lg", "font-bold", "text-white", "mb-2"], [1, "text-sm", "text-gray-300", "mb-4", "grow"], [1, "mt-auto", "space-y-2", "pt-4", "border-t", "border-white/10"], [1, "flex", "items-center", "gap-2", "text-sm", "text-indigo-400", "font-medium"], [1, "flex", "items-center", "gap-2", "text-sm", "text-indigo-300", "font-medium"], [1, "far", "fa-clock", "w-5", "text-center"], [1, "far", "fa-calendar-alt", "w-5", "text-center"], [1, "text-xl", "font-bold", "mb-2", "dark:text-white"], [1, "text-gray-500", "dark:text-gray-400"], [1, "text-xl", "font-bold", "mb-2"], [1, "text-gray-400", "text-center", "text-sm", "px-4"], ["controls", "", "playsinline", "", "webkit-playsinline", "", "preload", "metadata", 1, "w-full", "h-full", "object-cover", 3, "src", "poster"], ["loading", "lazy", 1, "w-full", "h-full", "object-cover", 3, "src", "alt"], [1, "h-8", 3, "src", "alt"], ["target", "_blank", "rel", "noopener noreferrer", 1, "hover:text-primary", "transition-colors", "border-b", "border-transparent", "hover:border-primary", 3, "href"], [1, "hidden", "md:inline", "text-base-content/20"], [1, "flex", "items-center", "gap-x-4", "mb-4"], [1, "text-lg", "font-semibold", "leading-7", "text-base-content"], [1, "flex", "items-center", "gap-1", "text-sm", "text-base-content/60"], [1, "flex", "text-yellow-400", "text-xs"], [1, "text-sm", "text-base-content/80", "line-clamp-4", "leading-relaxed"], ["type", "radio", "name", "my-accordion-4", 3, "checked"], [1, "collapse-title", "text-xl", "font-medium", "text-base-content"], [1, "collapse-content", "text-base-content/70"], [3, "routerLink"], [1, "h-48", "overflow-hidden", "relative"], [1, "absolute", "inset-0", "bg-gray-900/10", "group-hover:bg-transparent", "transition-colors", "z-10"], [1, "w-full", "h-full", "object-cover", "transform", "group-hover:scale-105", "transition-transform", "duration-500", 3, "src", "alt"], [1, "p-6", "flex", "flex-col", "grow"], [1, "text-xl", "font-bold", "text-gray-800", "mb-3", "group-hover:text-green-600", "transition-colors"], [1, "text-gray-600", "text-sm", "mb-6", "line-clamp-3", "grow"], [1, "mt-auto", "pt-4", "border-t", "border-gray-100", "flex", "items-center", "justify-between", "text-green-600", "font-bold", "text-sm"], [1, "fas", "fa-arrow-right", "transform", "group-hover:translate-x-1", "transition-transform"], [1, "fas", "fa-check-circle", "text-green-400"], [1, "w-12", "h-12", "md:w-16", "md:h-16", "mx-auto", "rounded-full", "bg-green-100", "text-green-600", "flex", "items-center", "justify-center", "text-xl", "md:text-2xl", "mb-3", "md:mb-6", "group-hover:scale-110", "transition-transform"], [1, "text-lg", "md:text-xl", "font-bold", "text-gray-900", "mb-2", "md:mb-3"], [1, "text-gray-600", "text-xs", "md:text-sm", "mb-4", "md:mb-6"], [1, "text-green-600", "font-bold", "text-xs", "md:text-sm", "hover:text-green-800", "transition-colors", "inline-flex", "items-center", "gap-2", 3, "routerLink"], [1, "fas", "fa-arrow-right"]], template: function CelularLandingComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 1)(1, "section", 2)(2, "div", 3);
      \u0275\u0275element(3, "img", 4)(4, "div", 5);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(5, "div", 6);
      \u0275\u0275element(6, "app-breadcrumbs", 7);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "div", 8)(8, "div", 9)(9, "span", 10);
      \u0275\u0275text(10, " En Marcos Paz, Merlo y Zona Oeste ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(11, "h1", 11);
      \u0275\u0275text(12, " Servicio T\xE9cnico de ");
      \u0275\u0275elementStart(13, "span", 12);
      \u0275\u0275text(14, "Celulares");
      \u0275\u0275elementEnd();
      \u0275\u0275text(15, " en Marcos Paz ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "p", 13);
      \u0275\u0275text(17, " Devolvele la vida a tu equipo. Pantallas, bater\xEDas y servicio t\xE9cnico oficial para iPhone, Samsung y Motorola. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(18, "div", 14)(19, "a", 15);
      \u0275\u0275element(20, "i", 16);
      \u0275\u0275elementStart(21, "span", 17);
      \u0275\u0275text(22, "Ver Productos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(23, "a", 18);
      \u0275\u0275element(24, "i", 19);
      \u0275\u0275text(25, " Consultar Ahora ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "div", 20)(27, "div", 21);
      \u0275\u0275element(28, "i", 22);
      \u0275\u0275text(29, " Garant\xEDa Escrita ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(30, "div", 21);
      \u0275\u0275element(31, "i", 22);
      \u0275\u0275text(32, " Repuestos Originales ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(33, "div", 23)(34, "div", 24);
      \u0275\u0275element(35, "div", 25)(36, "img", 26);
      \u0275\u0275elementStart(37, "div", 27)(38, "div", 28)(39, "span", 29);
      \u0275\u0275text(40, "Estado");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "span", 30);
      \u0275\u0275text(42, "Reparado");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(43, "p", 31);
      \u0275\u0275text(44, "Cambio de M\xF3dulo iPhone 13");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(45, "p", 32);
      \u0275\u0275text(46, "Tiempo: 45 min");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(47, "div", 33)(48, "div", 34);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(49, "section", 35)(50, "div", 36)(51, "p", 37);
      \u0275\u0275text(52, " Especialistas en todas las marcas ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "div", 38)(54, "div", 39)(55, "span", 40);
      \u0275\u0275text(56, "SAMSUNG");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(57, "div", 39)(58, "span", 41);
      \u0275\u0275text(59, "XIAOMI");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(60, "div", 39)(61, "span", 42);
      \u0275\u0275text(62, "MOTOROLA");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275elementStart(63, "section", 43)(64, "div", 44)(65, "div", 45)(66, "h2", 46);
      \u0275\u0275text(67);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "p", 47);
      \u0275\u0275text(69);
      \u0275\u0275elementEnd();
      \u0275\u0275repeaterCreate(70, CelularLandingComponent_For_71_Template, 4, 2, null, null, _forTrack0);
      \u0275\u0275elementStart(72, "ul", 48);
      \u0275\u0275repeaterCreate(73, CelularLandingComponent_For_74_Template, 6, 2, "li", 49, _forTrack1);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(75, "section", 50, 0)(77, "div", 51)(78, "div", 52)(79, "div", 53)(80, "span", 54);
      \u0275\u0275text(81, "Agenda Tu Visita");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "h2", 55);
      \u0275\u0275text(83, " Evit\xE1 esperas innecesarias.");
      \u0275\u0275element(84, "br");
      \u0275\u0275elementStart(85, "span", 56);
      \u0275\u0275text(86, "Reserv\xE1 tu turno");
      \u0275\u0275elementEnd();
      \u0275\u0275text(87, " hoy. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(88, "p", 57);
      \u0275\u0275text(89, " Nuestro laboratorio en ");
      \u0275\u0275elementStart(90, "strong");
      \u0275\u0275text(91, "Marcos Paz");
      \u0275\u0275elementEnd();
      \u0275\u0275text(92, " est\xE1 listo para recibirte. Seleccion\xE1 el d\xEDa y horario que mejor te quede. El diagn\xF3stico b\xE1sico es sin cargo. ");
      \u0275\u0275element(93, "br")(94, "br")(95, "i", 58);
      \u0275\u0275elementStart(96, "strong");
      \u0275\u0275text(97, "Jorge Newbery 69");
      \u0275\u0275elementEnd();
      \u0275\u0275text(98, ", Marcos Paz. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(99, "div", 59)(100, "div", 60);
      \u0275\u0275element(101, "i", 61);
      \u0275\u0275elementStart(102, "h3", 17);
      \u0275\u0275text(103, "R\xE1pido");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(104, "p", 62);
      \u0275\u0275text(105, "Prioridad por turno");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(106, "div", 60);
      \u0275\u0275element(107, "i", 63);
      \u0275\u0275elementStart(108, "h3", 17);
      \u0275\u0275text(109, "Seguro");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(110, "p", 62);
      \u0275\u0275text(111, "Datos protegidos");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(112, "div", 64)(113, "div", 65)(114, "div", 66)(115, "div", 67)(116, "h3", 68);
      \u0275\u0275text(117, "Calendario de Turnos");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(118, "div", 69);
      \u0275\u0275element(119, "app-reservation-calendar");
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275elementStart(120, "section", 70)(121, "div", 51)(122, "div", 71)(123, "h2", 72);
      \u0275\u0275text(124, "Ofertas Especiales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(125, "p", 73);
      \u0275\u0275text(126, " Equipos nuevos y accesorios seleccionados para vos. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(127, "app-product-carousel", 74);
      \u0275\u0275elementStart(128, "div", 75)(129, "a", 76);
      \u0275\u0275text(130, " Ver Todos los Productos ");
      \u0275\u0275element(131, "i", 77);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(132, "section", 78);
      \u0275\u0275element(133, "div", 79);
      \u0275\u0275elementStart(134, "div", 80)(135, "span", 81);
      \u0275\u0275text(136, "Repuestos Originales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(137, "h2", 82);
      \u0275\u0275text(138, " \xBFTu celular necesita vida nueva? ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(139, "p", 83);
      \u0275\u0275text(140, " Tenemos el repuesto exacto: Pantallas, bater\xEDas y m\xF3dulos originales con la mejor garant\xEDa del mercado. No pongas en riesgo tu equipo con copias baratas. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(141, "div", 84)(142, "span", 21);
      \u0275\u0275element(143, "i", 85);
      \u0275\u0275text(144, " Garant\xEDa Real");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(145, "span", 21);
      \u0275\u0275element(146, "i", 86);
      \u0275\u0275text(147, " Stock Inmediato");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(148, "a", 87);
      \u0275\u0275text(149, " Ver Cat\xE1logo de Repuestos ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(150, "section", 88)(151, "div", 51)(152, "div", 89)(153, "div")(154, "h2", 90);
      \u0275\u0275text(155, "Lo mejor en tecnolog\xEDa");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(156, "p", 91);
      \u0275\u0275text(157, " Equipos usados seleccionados con garant\xEDa. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(158, "a", 92);
      \u0275\u0275text(159, "Ver Todo ");
      \u0275\u0275element(160, "i", 93);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(161, "app-product-carousel", 74);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(162, "section", 94);
      \u0275\u0275element(163, "div", 95);
      \u0275\u0275elementStart(164, "div", 96)(165, "div", 53)(166, "div", 97);
      \u0275\u0275element(167, "i", 98);
      \u0275\u0275text(168, " Gamer Zone ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(169, "h2", 82);
      \u0275\u0275text(170, " Reparaci\xF3n de Consolas de Videojuegos ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(171, "p", 99);
      \u0275\u0275text(172, " Recuperamos tu diversi\xF3n. Ofrecemos mantenimiento preventivo (limpieza profunda + pasta t\xE9rmica), reballing, y reparaci\xF3n de hardware para PlayStation 4/5, Xbox y Nintendo Switch. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(173, "div", 100)(174, "a", 101);
      \u0275\u0275element(175, "i", 102);
      \u0275\u0275text(176, " Cotizar Reparaci\xF3n ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(177, "a", 103);
      \u0275\u0275text(178, " Ver Accesorios ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(179, "div", 104);
      \u0275\u0275element(180, "img", 105);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(181, "section", 106)(182, "div", 107);
      \u0275\u0275element(183, "div", 108);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(184, "div", 109)(185, "div", 110)(186, "h2", 111);
      \u0275\u0275text(187, "Capacitaci\xF3n");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(188, "p", 112);
      \u0275\u0275text(189, " Formaci\xF3n Profesional Certificada ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(190, "p", 113);
      \u0275\u0275text(191, " \xBFTe apasiona la tecnolog\xEDa? Aprend\xE9 a reparar celulares con nosotros. M\xE1s de 500 alumnos capacitados con nuestros m\xE9todos comprobados. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(192, "div", 114);
      \u0275\u0275repeaterCreate(193, CelularLandingComponent_For_194_Template, 10, 9, "div", 115, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(195, "div", 116)(196, "a", 117);
      \u0275\u0275element(197, "i", 118);
      \u0275\u0275text(198, " Ver Cursos y Capacitaciones ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(199, "section", 119)(200, "div", 51)(201, "div", 120);
      \u0275\u0275repeaterCreate(202, CelularLandingComponent_For_203_Template, 7, 6, "div", 121, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(204, "div", 122)(205, "div", 123)(206, "h2", 124);
      \u0275\u0275text(207, " Necesitas Reparar tu Celular? ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(208, "p", 125);
      \u0275\u0275text(209, " Nuestro equipo esta listo para ayudarte ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(210, "div", 126)(211, "div", 127);
      \u0275\u0275element(212, "div", 128);
      \u0275\u0275elementStart(213, "div", 129)(214, "div", 130)(215, "p", 131);
      \u0275\u0275text(216, " Contamos con profesionales expertos en Reparacion de Celulares ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(217, "p", 132);
      \u0275\u0275text(218, " Veni a Arecofix y solucionamos tus problemas. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(219, "div", 133);
      \u0275\u0275element(220, "div", 134);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(221, "div", 135);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(222, "div", 136);
      \u0275\u0275element(223, "div", 137);
      \u0275\u0275elementStart(224, "div", 138)(225, "div", 139)(226, "p", 131);
      \u0275\u0275text(227, " Servicio al cliente Personalizado ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(228, "p", 132);
      \u0275\u0275text(229, " Profesionales calificados para resolver tus problemas. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(230, "div", 140);
      \u0275\u0275element(231, "img", 141);
      \u0275\u0275elementEnd()();
      \u0275\u0275element(232, "div", 142);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(233, "div", 143);
      \u0275\u0275element(234, "div", 144);
      \u0275\u0275elementStart(235, "div", 145)(236, "div", 146)(237, "p", 131);
      \u0275\u0275text(238, " Arreglo de Celulares en Marcos Paz ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(239, "p", 132);
      \u0275\u0275text(240, " Diagn\xF3stico gratuito y soluci\xF3n efectiva. ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275element(241, "div", 147);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(242, "div", 127);
      \u0275\u0275element(243, "div", 148);
      \u0275\u0275elementStart(244, "div", 149)(245, "div", 130)(246, "p", 131);
      \u0275\u0275text(247, " Reparacion de Celulares ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(248, "p", 132);
      \u0275\u0275text(249, " Diagn\xF3stico totalmente Gratis. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(250, "div", 150)(251, "div", 151)(252, "div", 152)(253, "div", 153)(254, "div", 154);
      \u0275\u0275text(255, " Celulares ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(256, "div", 155);
      \u0275\u0275text(257, " Reparacion ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(258, "div", 156)(259, "p");
      \u0275\u0275text(260, "Venta de Celulares Nuevos y Reacondicionados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(261, "p");
      \u0275\u0275text(262, "Reparacion de Celulares en Marcos Paz");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(263, "p");
      \u0275\u0275text(264, "Arreglo de Celulares");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(265, "p");
      \u0275\u0275text(266, "Venta de Accesorios");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(267, "p");
      \u0275\u0275text(268, "Venta de iPhone");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(269, "p");
      \u0275\u0275text(270, "Servicio Tecnico Especializado");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275element(271, "div", 157);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(272, "section", 158)(273, "div", 159)(274, "span", 160);
      \u0275\u0275text(275, "Donde Estamos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(276, "h2", 161);
      \u0275\u0275text(277, "A 3 Cuadras de Ruta 40");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(278, "div", 162)(279, "p");
      \u0275\u0275element(280, "i", 163);
      \u0275\u0275text(281);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(282, "p");
      \u0275\u0275element(283, "i", 164);
      \u0275\u0275text(284);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(285, "p");
      \u0275\u0275element(286, "i", 165);
      \u0275\u0275text(287);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(288, "a", 166);
      \u0275\u0275element(289, "i", 167);
      \u0275\u0275text(290, " C\xF3mo Llegar ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(291, "div", 168);
      \u0275\u0275element(292, "iframe", 169);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(293, "section", 170);
      \u0275\u0275element(294, "div", 171);
      \u0275\u0275elementStart(295, "div", 172)(296, "div", 173)(297, "h2", 90);
      \u0275\u0275text(298, "As\xED Trabajamos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(299, "p", 174);
      \u0275\u0275text(300, " Simple, transparente y con tecnolog\xEDa a tu favor. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(301, "div", 175);
      \u0275\u0275repeaterCreate(302, CelularLandingComponent_For_303_Template, 7, 6, "div", 176, _forTrack0);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(304, "div", 177)(305, "div", 178)(306, "div", 179)(307, "div", 180)(308, "div", 181)(309, "h2", 111);
      \u0275\u0275text(310, " Reparacion de Celulares en Marcos Paz ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(311, "p", 182);
      \u0275\u0275text(312, " Tu servicio Tecnico de Confianza ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(313, "p", 183);
      \u0275\u0275text(314, " Brindamos Servicio Tecnico de Celulares en Marcos paz, Merlo, Las Heras, Ca\xF1uelas, Mariano Acosta, General Rodriguez, Moreno y todo el departamento de Bs As. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(315, "dl", 184)(316, "div", 185)(317, "dt", 186);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(318, "svg", 187);
      \u0275\u0275element(319, "path", 188);
      \u0275\u0275elementEnd();
      \u0275\u0275text(320, " Reparacion de Celulares. ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(321, "dd", 189);
      \u0275\u0275text(322, " Arreglamos Celulares de todas las marcas y modelos todos los problemas de tu celular resueltos en un solo lugar. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(323, "div", 185)(324, "dt", 186);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(325, "svg", 187);
      \u0275\u0275element(326, "path", 190);
      \u0275\u0275elementEnd();
      \u0275\u0275text(327, " Arreglo de Telefonos Celulares en Marcos Paz. ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(328, "dd", 189);
      \u0275\u0275text(329, " Con nosotros tus datos y privacidad estan totalmente seguros hacemos Reparacion de Celulares en Marcos Paz. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(330, "div", 185)(331, "dt", 186);
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(332, "svg", 187);
      \u0275\u0275element(333, "path", 191)(334, "path", 192);
      \u0275\u0275elementEnd();
      \u0275\u0275text(335, " Reparacion de Telefonos Celulares en Marcos Paz. ");
      \u0275\u0275elementEnd();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(336, "dd", 189);
      \u0275\u0275text(337, " Te ayudamos a recuperar esa informacion tan importante Fotos personales, videos, documentos, y todo lo que necesites. ");
      \u0275\u0275elementEnd()()()()();
      \u0275\u0275element(338, "img", 193);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(339, "section", 194)(340, "div", 51)(341, "h2", 195);
      \u0275\u0275text(342, " Marcos Paz Cell Mira Nuestros Trabajos ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(343, "p", 196);
      \u0275\u0275text(344, " Desde microsoldadura hasta cambios de m\xF3dulo. As\xED trabajamos. ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(345, "div", 197);
      \u0275\u0275repeaterCreate(346, CelularLandingComponent_For_347_Template, 2, 1, null, null, _forTrack2);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(348, "section", 198)(349, "div", 199)(350, "p", 200);
      \u0275\u0275text(351, " Conf\xEDan en Nosotros ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(352, "div", 201);
      \u0275\u0275repeaterCreate(353, CelularLandingComponent_For_354_Template, 2, 1, null, null, _forTrack3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(355, "div", 202)(356, "p", 203);
      \u0275\u0275text(357, " Mencionado en ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(358, "div", 204);
      \u0275\u0275repeaterCreate(359, CelularLandingComponent_For_360_Template, 3, 3, null, null, _forTrack3);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(361, "section", 205)(362, "div", 51)(363, "div", 71)(364, "h2", 72);
      \u0275\u0275text(365, "Lo que dicen nuestros clientes");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(366, "div", 206)(367, "span", 207);
      \u0275\u0275text(368, "4.8");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(369, "div", 208);
      \u0275\u0275element(370, "i", 209)(371, "i", 209)(372, "i", 209)(373, "i", 209)(374, "i", 210);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(375, "span", 211);
      \u0275\u0275text(376, "(120 rese\xF1as en Google)");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(377, "div", 212);
      \u0275\u0275repeaterCreate(378, CelularLandingComponent_For_379_Template, 19, 11, "a", 213, _forTrack3);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(380, "div", 214)(381, "a", 215);
      \u0275\u0275element(382, "i", 216);
      \u0275\u0275text(383, " Dejar una Rese\xF1a ");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(384, "section", 217)(385, "h2", 218);
      \u0275\u0275text(386, " Preguntas Frecuentes ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(387, "div", 219);
      \u0275\u0275repeaterCreate(388, CelularLandingComponent_For_389_Template, 7, 4, "div", 220, _forTrack4);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(390, "div", 221);
      \u0275\u0275element(391, "img", 222);
      \u0275\u0275elementStart(392, "div", 223);
      \u0275\u0275element(393, "div", 224);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(394, "div", 225);
      \u0275\u0275element(395, "div", 224);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(396, "div", 178)(397, "div", 226)(398, "h2", 227);
      \u0275\u0275text(399, " \xBFBuscas Donde reparar Celulares en Mariano Acosta? ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(400, "p", 228);
      \u0275\u0275text(401, " En Arecofix somos los doctores de tu celular encontr\xE1s la soluci\xF3n para tus celulares. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(402, "div", 229)(403, "div", 230)(404, "a", 231);
      \u0275\u0275text(405, "Reparaciones ");
      \u0275\u0275elementStart(406, "span", 232);
      \u0275\u0275text(407, "\u2192");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(408, "a", 231);
      \u0275\u0275text(409, "Servicio al cliente ");
      \u0275\u0275elementStart(410, "span", 232);
      \u0275\u0275text(411, "\u2192");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(412, "a", 231);
      \u0275\u0275text(413, "Tecnicos de Celulares Calificados ");
      \u0275\u0275elementStart(414, "span", 232);
      \u0275\u0275text(415, "\u2192");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(416, "a", 231);
      \u0275\u0275text(417, "Deja tu celular en manos de profesionales ");
      \u0275\u0275elementStart(418, "span", 232);
      \u0275\u0275text(419, "\u2192");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(420, "dl", 233)(421, "div", 234)(422, "dt", 235);
      \u0275\u0275text(423, "Arreglos");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(424, "dd", 236);
      \u0275\u0275text(425, "12");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(426, "div", 234)(427, "dt", 235);
      \u0275\u0275text(428, "Servicio Tecnico");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(429, "dd", 236);
      \u0275\u0275text(430, " 300+ ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(431, "div", 234)(432, "dt", 235);
      \u0275\u0275text(433, "Tecnicos Calificados");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(434, "dd", 236);
      \u0275\u0275text(435, "40");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(436, "div", 234)(437, "dt", 235);
      \u0275\u0275text(438, " Servicio Tecnico de Celulares en Marcos Paz | Reparacion de Celulares iPhone en Marcos Paz | Reparacion de Celulares en Marcos Paz | ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(439, "dd", 236);
      \u0275\u0275text(440, " Servicio Tecnico Liderado por Expertos ");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(441, "section", 237)(442, "div", 238)(443, "div", 239)(444, "div", 240)(445, "h2", 241);
      \u0275\u0275text(446, " \xBFTen\xE9s otra consulta? ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(447, "form", 242);
      \u0275\u0275listener("ngSubmit", function CelularLandingComponent_Template_form_ngSubmit_447_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.sendContactForm());
      });
      \u0275\u0275elementStart(448, "div", 243)(449, "label", 244)(450, "span", 245);
      \u0275\u0275text(451, "Nombre");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(452, "input", 246);
      \u0275\u0275twoWayListener("ngModelChange", function CelularLandingComponent_Template_input_ngModelChange_452_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.contactName, $event) || (ctx.contactName = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(453, "div", 243)(454, "label", 247)(455, "span", 245);
      \u0275\u0275text(456, "Tel\xE9fono / WhatsApp");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(457, "input", 248);
      \u0275\u0275twoWayListener("ngModelChange", function CelularLandingComponent_Template_input_ngModelChange_457_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.contactPhone, $event) || (ctx.contactPhone = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(458, "div", 249)(459, "label", 250)(460, "span", 245);
      \u0275\u0275text(461, "Mensaje");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(462, "textarea", 251);
      \u0275\u0275twoWayListener("ngModelChange", function CelularLandingComponent_Template_textarea_ngModelChange_462_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.contactMessage, $event) || (ctx.contactMessage = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(463, "button", 252);
      \u0275\u0275conditionalCreate(464, CelularLandingComponent_Conditional_464_Template, 1, 0, "span", 253);
      \u0275\u0275text(465, " Enviar Mensaje ");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(466, "div", 254)(467, "div", 255);
      \u0275\u0275element(468, "i", 256);
      \u0275\u0275elementStart(469, "span");
      \u0275\u0275text(470, "Garant\xEDa de 30 d\xEDas en todas nuestras reparaciones");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(471, "section", 257);
      \u0275\u0275element(472, "div", 258)(473, "div", 259);
      \u0275\u0275elementStart(474, "div", 172)(475, "div", 173)(476, "span", 260);
      \u0275\u0275text(477, "Blog & Comunidad");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(478, "h2", 261);
      \u0275\u0275text(479, " Novedades y Recursos ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(480, "p", 262);
      \u0275\u0275text(481, " Mantenete al d\xEDa con lo \xFAltimo en tecnolog\xEDa, gu\xEDas de reparaci\xF3n y novedades de Arecofix. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(482, "div", 263);
      \u0275\u0275repeaterCreate(483, CelularLandingComponent_For_484_Template, 13, 7, "a", 264, _forTrack0);
      \u0275\u0275elementStart(485, "div", 265)(486, "div", 266);
      \u0275\u0275element(487, "div", 267)(488, "div", 268);
      \u0275\u0275elementStart(489, "div", 269)(490, "div", 270);
      \u0275\u0275element(491, "i", 271);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(492, "h3", 272);
      \u0275\u0275text(493);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(494, "p", 273);
      \u0275\u0275text(495);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(496, "ul", 274);
      \u0275\u0275repeaterCreate(497, CelularLandingComponent_For_498_Template, 4, 1, "li", 275, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(499, "a", 276)(500, "div", 277)(501, "div", 278);
      \u0275\u0275text(502, " Disponible en ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(503, "div", 279);
      \u0275\u0275text(504, "Google Play");
      \u0275\u0275elementEnd()()()()()()()()();
      \u0275\u0275elementStart(505, "div", 280)(506, "div", 71)(507, "span", 281);
      \u0275\u0275text(508, "Soluciones Integrales");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(509, "h2", 282);
      \u0275\u0275text(510, " Otros Servicios Relacionados ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(511, "p", 283);
      \u0275\u0275text(512, " Adem\xE1s de reparar celulares, somos expertos en una amplia gama de dispositivos electr\xF3nicos. ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(513, "div", 284);
      \u0275\u0275repeaterCreate(514, CelularLandingComponent_For_515_Template, 10, 7, "div", 285, _forTrack0);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(516, "div", 286)(517, "a", 287);
      \u0275\u0275text(518, " Ver Todos los Servicios ");
      \u0275\u0275element(519, "i", 288);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275property("items", ctx.breadcrumbItems);
      \u0275\u0275advance(17);
      \u0275\u0275property("href", "https://wa.me/" + ctx.whatsappNumber, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(44);
      \u0275\u0275textInterpolate1(" ", ctx.seoContent.title, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.seoContent.intro, " ");
      \u0275\u0275advance();
      \u0275\u0275repeater(ctx.seoContent.sections);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.seoContent.features);
      \u0275\u0275advance(54);
      \u0275\u0275property("title", "")("items", ctx.specialOffers)("addToCartText", "Ver Detalles");
      \u0275\u0275advance(2);
      \u0275\u0275property("queryParams", \u0275\u0275pureFunction0(25, _c0));
      \u0275\u0275advance(29);
      \u0275\u0275property("queryParams", \u0275\u0275pureFunction0(26, _c1));
      \u0275\u0275advance(3);
      \u0275\u0275property("title", "")("items", ctx.techBest)("addToCartText", "Me Interesa");
      \u0275\u0275advance(13);
      \u0275\u0275property("href", "https://wa.me/" + ctx.whatsappNumber + "?text=Hola,%20tengo%20una%20consola%20para%20reparar", \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(19);
      \u0275\u0275repeater(ctx.coursesList);
      \u0275\u0275advance(9);
      \u0275\u0275repeater(ctx.whyUs);
      \u0275\u0275advance(79);
      \u0275\u0275textInterpolate1(" ", ctx.locationData.address, " ");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.locationData.hours, " ");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate1(" ", ctx.locationData.phone, " ");
      \u0275\u0275advance(5);
      \u0275\u0275property("src", ctx.safeMapUrl, \u0275\u0275sanitizeResourceUrl);
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.processSteps);
      \u0275\u0275advance(44);
      \u0275\u0275repeater(ctx.galleryItems);
      \u0275\u0275advance(7);
      \u0275\u0275repeater(ctx.partners);
      \u0275\u0275advance(6);
      \u0275\u0275repeater(ctx.mentions);
      \u0275\u0275advance(19);
      \u0275\u0275repeater(ctx.reviews);
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.faqs);
      \u0275\u0275advance(64);
      \u0275\u0275twoWayProperty("ngModel", ctx.contactName);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.contactPhone);
      \u0275\u0275advance(5);
      \u0275\u0275twoWayProperty("ngModel", ctx.contactMessage);
      \u0275\u0275advance();
      \u0275\u0275property("disabled", ctx.sendingContact);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.sendingContact ? 464 : -1);
      \u0275\u0275advance(19);
      \u0275\u0275repeater(ctx.blogFeatures);
      \u0275\u0275advance(10);
      \u0275\u0275textInterpolate(ctx.appInfo.title);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.appInfo.desc, " ");
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.appInfo.features);
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.appInfo.downloadLink, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(15);
      \u0275\u0275repeater(ctx.relatedServices);
    }
  }, dependencies: [
    CommonModule,
    RouterModule,
    RouterLink,
    FormsModule,
    \u0275NgNoValidate,
    DefaultValueAccessor,
    NgControlStatus,
    NgControlStatusGroup,
    RequiredValidator,
    NgModel,
    NgForm,
    ReservationCalendar,
    ProductCarouselComponent,
    BreadcrumbsComponent,
    NgOptimizedImage,
    SlicePipe
  ], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CelularLandingComponent, [{
    type: Component,
    args: [{ selector: "app-celular-landing", standalone: true, imports: [
      CommonModule,
      RouterModule,
      FormsModule,
      ReservationCalendar,
      ProductCarouselComponent,
      BreadcrumbsComponent,
      NgOptimizedImage
    ], template: `<div class="bg-base-100 min-h-screen font-sans">\r
  <!-- HERO SECTION -->\r
  <section\r
    class="relative min-h-[65vh] md:min-h-[75vh] flex items-center justify-center overflow-hidden"\r
  >\r
    <!-- Optimized Background Image (WebP) -->\r
    <div class="absolute inset-0 z-0">\r
      <img\r
        ngSrc="assets/img/repair/10.jpg"\r
        class="w-full h-full object-cover object-[0%_0%] md:object-center"\r
        alt="Servicio T\xE9cnico Celulares Marcos Paz"\r
        priority\r
        fill\r
      />\r
      <div\r
        class="absolute inset-0 bg-linear-to-r from-black/90 via-black/70 to-black/40"\r
      ></div>\r
    </div>\r
\r
    <!-- Breadcrumbs (Absolute Top Left) -->\r
    <div class="absolute top-0 left-0 w-full z-20 pt-20 md:pt-28 px-4 md:px-8">\r
      <app-breadcrumbs [items]="breadcrumbItems"></app-breadcrumbs>\r
    </div>\r
\r
    <div\r
      class="relative z-10 w-full max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center gap-12 mt-16"\r
    >\r
      <div class="md:w-1/2 text-left pt-20">\r
        <span\r
          class="inline-block py-1 px-3 rounded-full bg-primary/20 border border-primary/50 text-focus text-sm font-bold tracking-wide uppercase mb-6 animate-fade-in-up backdrop-blur-sm"\r
        >\r
          En Marcos Paz, Merlo y Zona Oeste\r
        </span>\r
        <h1\r
          class="text-4xl md:text-6xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl"\r
        >\r
          Servicio T\xE9cnico de\r
          <span\r
            class="text-transparent bg-clip-text bg-linear-to-r from-[#352F85] to-[#5CE638]"\r
            >Celulares</span\r
          >\r
          en Marcos Paz\r
        </h1>\r
        <p\r
          class="text-xl text-gray-200 mb-8 max-w-lg leading-relaxed font-light"\r
        >\r
          Devolvele la vida a tu equipo. Pantallas, bater\xEDas y servicio t\xE9cnico\r
          oficial para iPhone, Samsung y Motorola.\r
        </p>\r
        <div class="flex flex-col sm:flex-row gap-4">\r
          <a\r
            routerLink="/productos"\r
            class="btn btn-lg border-none bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white rounded-full shadow-lg shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:-translate-y-1 transition-all duration-300 px-10 gap-3"\r
          >\r
            <i class="fas fa-shopping-bag text-xl"></i>\r
            <span class="font-bold">Ver Productos</span>\r
          </a>\r
          <a\r
            [href]="'https://wa.me/' + whatsappNumber"\r
            target="_blank"\r
            class="btn btn-outline btn-lg rounded-full text-white hover:bg-white hover:text-black hover:border-white px-8"\r
          >\r
            <i class="fa-brands fa-whatsapp mr-2"></i> Consultar Ahora\r
          </a>\r
        </div>\r
        <!-- Trust Badges -->\r
        <div class="mt-12 flex gap-6 text-sm font-medium text-gray-400">\r
          <div class="flex items-center gap-2">\r
            <i class="fas fa-check-circle text-green-500"></i> Garant\xEDa Escrita\r
          </div>\r
          <div class="flex items-center gap-2">\r
            <i class="fas fa-check-circle text-green-500"></i> Repuestos\r
            Originales\r
          </div>\r
        </div>\r
      </div>\r
\r
      <!-- Dynamic Hero Visual (Floating Phone or Workbench) -->\r
      <div class="md:w-1/2 relative hidden md:block">\r
        <div\r
          class="relative w-80 h-[550px] mx-auto bg-gray-900 rounded-[3rem] border-8 border-gray-800 shadow-2xl overflow-hidden ring-4 ring-white/10 transform rotate-[-5deg] hover:rotate-0 transition-all duration-500 z-10"\r
        >\r
          <div\r
            class="absolute top-0 left-1/2 -ml-20 w-40 h-6 bg-gray-800 rounded-b-xl z-20"\r
          ></div>\r
          <img\r
            src="assets/img/repair/apple.jpg"\r
            class="w-full h-full object-cover opacity-90"\r
            alt="Reparando iPhone"\r
          />\r
          <!-- Floating Card Overlay -->\r
          <div\r
            class="absolute bottom-6 left-4 right-4 bg-white/10 backdrop-blur-md p-4 rounded-xl border border-white/20 text-white"\r
          >\r
            <div class="flex items-center justify-between mb-2">\r
              <span class="text-xs font-bold uppercase text-primary"\r
                >Estado</span\r
              >\r
              <span class="badge badge-success badge-sm">Reparado</span>\r
            </div>\r
            <p class="text-sm font-medium">Cambio de M\xF3dulo iPhone 13</p>\r
            <p class="text-xs text-gray-300">Tiempo: 45 min</p>\r
          </div>\r
        </div>\r
        <!-- Decorative Blobs -->\r
        <div\r
          class="absolute top-1/4 -right-10 w-72 h-72 bg-primary/30 rounded-full blur-[100px] z-0"\r
        ></div>\r
        <div\r
          class="absolute -bottom-10 -left-10 w-72 h-72 bg-secondary/30 rounded-full blur-[100px] z-0"\r
        ></div>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- BRANDS CAROUSEL (Top Persuasion) -->\r
  <section class="bg-neutral text-neutral-content py-8 border-b border-white/5">\r
    <div class="max-w-7xl mx-auto px-4 overflow-hidden">\r
      <p class="text-center text-xs uppercase tracking-widest opacity-70 mb-6">\r
        Especialistas en todas las marcas\r
      </p>\r
      <div\r
        class="flex flex-row flex-nowrap justify-center items-center opacity-60 grayscale text-2xl md:text-4xl overflow-x-auto no-scrollbar py-4 px-2"\r
      >\r
        <div\r
          class="shrink-0 mx-4 sm:mx-8 transform hover:scale-105 transition-transform duration-300"\r
        >\r
          <span\r
            class="font-bold hover:text-blue-500 hover:opacity-100 transition-colors cursor-default tracking-tighter"\r
            >SAMSUNG</span\r
          >\r
        </div>\r
        <div\r
          class="shrink-0 mx-4 sm:mx-8 transform hover:scale-105 transition-transform duration-300"\r
        >\r
          <span\r
            class="font-bold hover:text-orange-500 hover:opacity-100 transition-colors cursor-default tracking-tighter"\r
            >XIAOMI</span\r
          >\r
        </div>\r
        <div\r
          class="shrink-0 mx-4 sm:mx-8 transform hover:scale-105 transition-transform duration-300"\r
        >\r
          <span\r
            class="font-bold hover:text-blue-300 hover:opacity-100 transition-colors cursor-default tracking-tighter"\r
            >MOTOROLA</span\r
          >\r
        </div>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- SEO CONTENT SECTION -->\r
  <section class="py-16 bg-white dark:bg-gray-800">\r
    <div class="container mx-auto px-4 max-w-4xl">\r
      <div class="prose prose-lg dark:prose-invert mx-auto">\r
        <h2 class="text-3xl font-bold text-center mb-8">\r
          {{ seoContent.title }}\r
        </h2>\r
\r
        <p class="lead text-center mb-8">\r
          {{ seoContent.intro }}\r
        </p>\r
\r
        @for (section of seoContent.sections; track section.title) {\r
          <h3>{{ section.title }}</h3>\r
          <p>{{ section.content }}</p>\r
        }\r
\r
        <ul class="grid grid-cols-1 md:grid-cols-2 gap-4 list-none pl-0 my-8">\r
          @for (feature of seoContent.features; track feature.label) {\r
            <li class="flex items-start gap-2">\r
              <i class="fas fa-check-circle text-green-500 mt-1"></i>\r
              <div class="text-sm">\r
                <strong>{{ feature.label }}</strong> {{ feature.value }}\r
              </div>\r
            </li>\r
          }\r
        </ul>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- APPOINTMENT / CALENDAR SECTION (Priority as requested) -->\r
  <section class="py-20 bg-base-100 relative" #appointmentSection>\r
    <div class="container mx-auto px-4">\r
      <div class="flex flex-col lg:flex-row items-center gap-12">\r
        <div class="lg:w-1/2">\r
          <span\r
            class="text-primary font-bold tracking-widest uppercase text-sm mb-2 block"\r
            >Agenda Tu Visita</span\r
          >\r
          <h2 class="text-3xl md:text-5xl font-bold mb-6 text-base-content">\r
            Evit\xE1 esperas innecesarias.<br />\r
            <span class="text-primary">Reserv\xE1 tu turno</span> hoy.\r
          </h2>\r
          <p class="text-lg text-base-content/70 mb-8">\r
            Nuestro laboratorio en <strong>Marcos Paz</strong> est\xE1 listo para\r
            recibirte. Seleccion\xE1 el d\xEDa y horario que mejor te quede. El\r
            diagn\xF3stico b\xE1sico es sin cargo. <br /><br />\r
            <i class="fas fa-map-marker-alt text-error mr-2"></i>\r
            <strong>Jorge Newbery 69</strong>, Marcos Paz.\r
          </p>\r
\r
          <div class="grid grid-cols-2 gap-4 mb-8">\r
            <div class="p-4 bg-base-200 rounded-xl">\r
              <i class="fas fa-clock text-2xl text-primary mb-2"></i>\r
              <h3 class="font-bold">R\xE1pido</h3>\r
              <p class="text-xs">Prioridad por turno</p>\r
            </div>\r
            <div class="p-4 bg-base-200 rounded-xl">\r
              <i class="fas fa-shield-alt text-2xl text-secondary mb-2"></i>\r
              <h3 class="font-bold">Seguro</h3>\r
              <p class="text-xs">Datos protegidos</p>\r
            </div>\r
          </div>\r
        </div>\r
\r
        <!-- Embedded Calendar -->\r
        <div class="lg:w-1/2 w-full">\r
          <div\r
            class="card bg-base-100 shadow-2xl border border-base-200 overflow-hidden"\r
          >\r
            <div class="card-body p-0">\r
              <div class="bg-primary text-primary-content p-4 text-center">\r
                <h3 class="font-bold text-lg">Calendario de Turnos</h3>\r
              </div>\r
              <div class="p-4">\r
                <app-reservation-calendar></app-reservation-calendar>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- MIGRATED: SPECIAL OFFERS (Product Carousel) -->\r
  <section class="py-16 bg-base-200">\r
    <div class="container mx-auto px-4">\r
      <div class="text-center mb-12">\r
        <h2 class="text-3xl font-bold mb-4">Ofertas Especiales</h2>\r
        <p class="text-base-content/60">\r
          Equipos nuevos y accesorios seleccionados para vos.\r
        </p>\r
      </div>\r
      <app-product-carousel\r
        [title]="''"\r
        [items]="specialOffers"\r
        [addToCartText]="'Ver Detalles'"\r
      ></app-product-carousel>\r
\r
      <div class="text-center mt-12">\r
        <a\r
          routerLink="/productos"\r
          [queryParams]="{ category: 'all' }"\r
          class="btn btn-primary btn-wide btn-lg shadow-lg hover:scale-105 transition-transform border-2 border-primary-focus hover:border-white text-white font-bold"\r
        >\r
          Ver Todos los Productos <i class="fas fa-store ml-2"></i>\r
        </a>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- PARTS PROMO SECTION -->\r
  <section\r
    class="relative py-20 bg-neutral text-neutral-content overflow-hidden"\r
  >\r
    <div\r
      class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"\r
    ></div>\r
    <div class="container mx-auto px-4 relative z-10 text-center">\r
      <span class="badge badge-accent mb-4 p-3">Repuestos Originales</span>\r
      <h2 class="text-4xl md:text-5xl font-bold mb-6">\r
        \xBFTu celular necesita vida nueva?\r
      </h2>\r
      <p class="text-xl mb-8 max-w-2xl mx-auto opacity-90">\r
        Tenemos el repuesto exacto: Pantallas, bater\xEDas y m\xF3dulos originales con\r
        la mejor garant\xEDa del mercado. No pongas en riesgo tu equipo con copias\r
        baratas.\r
      </p>\r
      <div class="flex justify-center gap-8 mb-10 text-lg font-medium">\r
        <span class="flex items-center gap-2"\r
          ><i class="fas fa-certificate text-yellow-400"></i> Garant\xEDa\r
          Real</span\r
        >\r
        <span class="flex items-center gap-2"\r
          ><i class="fas fa-boxes text-blue-400"></i> Stock Inmediato</span\r
        >\r
      </div>\r
      <a\r
        routerLink="/productos/categoria/repuestos"\r
        class="btn btn-accent btn-lg shadow-lg hover:scale-105 transition-transform"\r
      >\r
        Ver Cat\xE1logo de Repuestos\r
      </a>\r
    </div>\r
  </section>\r
\r
  <!-- MIGRATED: TECH BEST (More Products) -->\r
  <section class="py-16 bg-base-100">\r
    <div class="container mx-auto px-4">\r
      <div class="flex justify-between items-end mb-8">\r
        <div>\r
          <h2 class="text-3xl font-bold">Lo mejor en tecnolog\xEDa</h2>\r
          <p class="text-base-content/60 mt-2">\r
            Equipos usados seleccionados con garant\xEDa.\r
          </p>\r
        </div>\r
        <a\r
          routerLink="/productos"\r
          [queryParams]="{ category: 'celulares' }"\r
          class="btn btn-link no-underline"\r
          >Ver Todo <i class="fas fa-arrow-right ml-2"></i\r
        ></a>\r
      </div>\r
      <app-product-carousel\r
        [title]="''"\r
        [items]="techBest"\r
        [addToCartText]="'Me Interesa'"\r
      ></app-product-carousel>\r
    </div>\r
  </section>\r
\r
  <!-- MIGRATED: CONSOLES SECTION -->\r
  <section class="relative py-20 bg-gray-900 text-white overflow-hidden">\r
    <!-- Decoration -->\r
    <div\r
      class="absolute top-0 right-0 w-1/2 h-full bg-linear-to-l from-green-900/40 to-transparent"\r
    ></div>\r
\r
    <div\r
      class="container mx-auto px-4 relative z-10 flex flex-col lg:flex-row items-center gap-12"\r
    >\r
      <div class="lg:w-1/2">\r
        <div class="badge bg-[#317dc0] text-white border-none mb-4 p-3">\r
          <i class="fas fa-gamepad mr-2"></i> Gamer Zone\r
        </div>\r
        <h2 class="text-4xl md:text-5xl font-bold mb-6">\r
          Reparaci\xF3n de Consolas de Videojuegos\r
        </h2>\r
        <p class="text-lg text-gray-300 mb-8 leading-relaxed">\r
          Recuperamos tu diversi\xF3n. Ofrecemos mantenimiento preventivo (limpieza\r
          profunda + pasta t\xE9rmica), reballing, y reparaci\xF3n de hardware para\r
          PlayStation 4/5, Xbox y Nintendo Switch.\r
        </p>\r
        <div class="flex gap-4">\r
          <a\r
            [href]="\r
              'https://wa.me/' +\r
              whatsappNumber +\r
              '?text=Hola,%20tengo%20una%20consola%20para%20reparar'\r
            "\r
            target="_blank"\r
            class="btn bg-[#317dc0] border-[#317dc0] text-white hover:bg-[#2a6ba3] hover:border-[#2a6ba3] btn-lg"\r
          >\r
            <i class="fas fa-wrench mr-2"></i> Cotizar Reparaci\xF3n\r
          </a>\r
          <a\r
            routerLink="/productos/categoria/consolas"\r
            class="btn btn-outline text-white hover:bg-white hover:text-black"\r
          >\r
            Ver Accesorios\r
          </a>\r
        </div>\r
      </div>\r
      <div class="lg:w-1/2 flex justify-center">\r
        <img\r
          src="assets/img/products/arreglo-consolas.webp"\r
          class="rounded-2xl shadow-2xl border-4 border-green-500/30 w-full max-w-md hover:scale-105 transition-transform duration-500"\r
          alt="Reparaci\xF3n Consolas"\r
        />\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- MIGRATED: COURSES SECTION (Redesigned) -->\r
  <section class="relative isolate bg-gray-900 py-24 sm:py-32 overflow-hidden">\r
    <!-- Background decoration -->\r
    <div\r
      aria-hidden="true"\r
      class="absolute inset-x-0 -top-3 -z-10 transform-gpu overflow-hidden px-36 blur-3xl"\r
    >\r
      <div\r
        style="\r
          clip-path: polygon(\r
            74.1% 44.1%,\r
            100% 61.6%,\r
            97.5% 26.9%,\r
            85.5% 0.1%,\r
            80.7% 2%,\r
            72.5% 32.5%,\r
            60.2% 62.4%,\r
            52.4% 68.1%,\r
            47.5% 58.3%,\r
            45.2% 34.5%,\r
            27.5% 76.7%,\r
            0.1% 64.9%,\r
            17.9% 100%,\r
            27.6% 76.8%,\r
            76.1% 97.7%,\r
            74.1% 44.1%\r
          );\r
        "\r
        class="mx-auto aspect-1155/678 w-6xl bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-20"\r
      ></div>\r
    </div>\r
\r
    <div class="container mx-auto px-6 lg:px-8">\r
      <div class="mx-auto max-w-4xl text-center mb-16">\r
        <h2 class="text-base/7 font-semibold text-indigo-400">Capacitaci\xF3n</h2>\r
        <p\r
          class="mt-2 text-4xl font-semibold tracking-tight text-balance text-white sm:text-5xl"\r
        >\r
          Formaci\xF3n Profesional Certificada\r
        </p>\r
        <p\r
          class="mx-auto mt-6 max-w-2xl text-lg font-medium text-pretty text-gray-400"\r
        >\r
          \xBFTe apasiona la tecnolog\xEDa? Aprend\xE9 a reparar celulares con nosotros.\r
          M\xE1s de 500 alumnos capacitados con nuestros m\xE9todos comprobados.\r
        </p>\r
      </div>\r
\r
      <div\r
        class="mx-auto grid grid-cols-2 gap-3 md:gap-8 lg:max-w-none lg:grid-cols-4"\r
      >\r
        @for (course of coursesList; track course.title) {\r
          <div\r
            [routerLink]="course.slug ? ['/academy', course.slug] : '/academy'"\r
            class="flex flex-col rounded-2xl md:rounded-3xl bg-white/5 p-3 md:p-6 ring-1 ring-white/10 hover:bg-white/10 transition-colors hover:-translate-y-1 duration-300 cursor-pointer group"\r
          >\r
            <figure\r
              class="aspect-video w-full overflow-hidden rounded-xl md:rounded-2xl mb-3 md:mb-6 shadow-lg"\r
            >\r
              <img\r
                [src]="course.img"\r
                [alt]="course.title"\r
                class="w-full h-full object-cover"\r
              />\r
            </figure>\r
\r
            <h3 class="text-lg font-bold text-white mb-2">\r
              {{ course.title }}\r
            </h3>\r
            <p class="text-sm text-gray-300 mb-4 grow">{{ course.subtitle }}</p>\r
\r
            <div class="mt-auto space-y-2 pt-4 border-t border-white/10">\r
              @if (course.duration) {\r
                <div\r
                  class="flex items-center gap-2 text-sm text-indigo-400 font-medium"\r
                >\r
                  <i class="far fa-clock w-5 text-center"></i>\r
                  {{ course.duration }}\r
                </div>\r
              }\r
              @if (course.days) {\r
                <div\r
                  class="flex items-center gap-2 text-sm text-indigo-300 font-medium"\r
                >\r
                  <i class="far fa-calendar-alt w-5 text-center"></i>\r
                  {{ course.days }}\r
                </div>\r
              }\r
            </div>\r
          </div>\r
        }\r
      </div>\r
\r
      <div class="text-center mt-16">\r
        <a\r
          routerLink="/academy"\r
          class="inline-flex items-center justify-center rounded-full bg-indigo-600 px-8 py-3.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500 transition-all hover:scale-105"\r
        >\r
          <i class="fas fa-graduation-cap mr-2"></i> Ver Cursos y Capacitaciones\r
        </a>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- BLOG CONTENT INTEGRATION: "Why Us" / Differentiators -->\r
  <section class="py-20 bg-white dark:bg-gray-900">\r
    <div class="container mx-auto px-4">\r
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">\r
        @for (item of whyUs; track item.title) {\r
          <div class="p-6">\r
            <div\r
              [class]="\r
                'w-16 h-16 rounded-full flex items-center justify-center text-2xl mx-auto mb-4 ' +\r
                item.bg +\r
                ' ' +\r
                item.color\r
              "\r
            >\r
              <i [class]="item.icon"></i>\r
            </div>\r
            <h3 class="text-xl font-bold mb-2 dark:text-white">\r
              {{ item.title }}\r
            </h3>\r
            <p class="text-gray-500 dark:text-gray-400">\r
              {{ item.desc }}\r
            </p>\r
          </div>\r
        }\r
      </div>\r
    </div>\r
  </section>\r
\r
  <div class="bg-gray-900 py-8 sm:py-10">\r
    <div class="mx-auto max-w-2xl px-6 lg:max-w-7xl lg:px-8">\r
      <h2 class="text-center text-base/7 font-semibold text-indigo-400">\r
        Necesitas Reparar tu Celular?\r
      </h2>\r
      <p\r
        class="mx-auto mt-2 max-w-lg text-center text-3xl font-semibold tracking-tight text-balance text-white sm:text-4xl"\r
      >\r
        Nuestro equipo esta listo para ayudarte\r
      </p>\r
      <div class="mt-4 grid gap-4 sm:mt-6 lg:grid-cols-3 lg:grid-rows-2">\r
        <div class="relative lg:row-span-2">\r
          <div\r
            class="absolute inset-px rounded-lg bg-gray-800 lg:rounded-l-4xl"\r
          ></div>\r
          <div\r
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] lg:rounded-l-[calc(2rem+1px)]"\r
          >\r
            <div class="px-6 pt-6 pb-2 sm:px-8 sm:pt-8 sm:pb-0">\r
              <p\r
                class="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center"\r
              >\r
                Contamos con profesionales expertos en Reparacion de Celulares\r
              </p>\r
              <p\r
                class="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center"\r
              >\r
                Veni a Arecofix y solucionamos tus problemas.\r
              </p>\r
            </div>\r
            <div\r
              class="@container relative min-h-40 w-full grow max-lg:mx-auto max-lg:max-w-sm"\r
            >\r
              <div\r
                class="absolute inset-x-8 top-8 bottom-0 overflow-hidden rounded-t-[12cqw] border-x-[3cqw] border-t-[3cqw] border-gray-700 bg-gray-900 outline outline-white/20"\r
              ></div>\r
            </div>\r
          </div>\r
          <div\r
            class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 lg:rounded-l-4xl"\r
          ></div>\r
        </div>\r
        <div class="relative max-lg:row-start-1">\r
          <div\r
            class="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-t-4xl"\r
          ></div>\r
          <div\r
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-t-[calc(2rem+1px)]"\r
          >\r
            <div class="px-6 pt-6 sm:px-8 sm:pt-8">\r
              <p\r
                class="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center"\r
              >\r
                Servicio al cliente Personalizado\r
              </p>\r
              <p\r
                class="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center"\r
              >\r
                Profesionales calificados para resolver tus problemas.\r
              </p>\r
            </div>\r
            <div\r
              class="flex flex-1 items-center justify-center px-6 max-lg:pt-6 max-lg:pb-8 sm:px-8 lg:pb-2"\r
            >\r
              <img\r
                src="assets/img/repair/13.jpg"\r
                alt="Microsoldadura"\r
                class="w-full max-lg:max-w-xs rounded-lg object-cover h-24 sm:h-32"\r
              />\r
            </div>\r
          </div>\r
          <div\r
            class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-t-4xl"\r
          ></div>\r
        </div>\r
        <div class="relative max-lg:row-start-3 lg:col-start-2 lg:row-start-2">\r
          <div class="absolute inset-px rounded-lg bg-gray-800"></div>\r
          <div\r
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)]"\r
          >\r
            <div class="px-6 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8">\r
              <p\r
                class="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center"\r
              >\r
                Arreglo de Celulares en Marcos Paz\r
              </p>\r
              <p\r
                class="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center"\r
              >\r
                Diagn\xF3stico gratuito y soluci\xF3n efectiva.\r
              </p>\r
            </div>\r
          </div>\r
          <div\r
            class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15"\r
          ></div>\r
        </div>\r
        <div class="relative lg:row-span-2">\r
          <div\r
            class="absolute inset-px rounded-lg bg-gray-800 max-lg:rounded-b-4xl lg:rounded-r-4xl"\r
          ></div>\r
          <div\r
            class="relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius-lg)+1px)] max-lg:rounded-b-[calc(2rem+1px)] lg:rounded-r-[calc(2rem+1px)]"\r
          >\r
            <div class="px-6 pt-6 pb-2 sm:px-8 sm:pt-8 sm:pb-0">\r
              <p\r
                class="mt-2 text-lg font-medium tracking-tight text-white max-lg:text-center"\r
              >\r
                Reparacion de Celulares\r
              </p>\r
              <p\r
                class="mt-2 max-w-lg text-sm/6 text-gray-400 max-lg:text-center"\r
              >\r
                Diagn\xF3stico totalmente Gratis.\r
              </p>\r
            </div>\r
            <div class="relative min-h-40 w-full grow">\r
              <div\r
                class="absolute top-6 right-0 bottom-0 left-6 overflow-hidden rounded-tl-xl bg-gray-900/60 outline outline-white/10"\r
              >\r
                <div class="flex bg-gray-900 outline outline-white/5">\r
                  <div class="-mb-px flex text-sm/6 font-medium text-gray-400">\r
                    <div\r
                      class="border-r border-b border-r-white/10 border-b-white/20 bg-white/5 px-4 py-2 text-white"\r
                    >\r
                      Celulares\r
                    </div>\r
                    <div class="border-r border-gray-600/10 px-4 py-2">\r
                      Reparacion\r
                    </div>\r
                  </div>\r
                </div>\r
                <div\r
                  class="px-6 pt-4 pb-8 text-xs sm:text-sm leading-tight text-gray-300"\r
                >\r
                  <p>Venta de Celulares Nuevos y Reacondicionados</p>\r
                  <p>Reparacion de Celulares en Marcos Paz</p>\r
                  <p>Arreglo de Celulares</p>\r
                  <p>Venta de Accesorios</p>\r
                  <p>Venta de iPhone</p>\r
                  <p>Servicio Tecnico Especializado</p>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
          <div\r
            class="pointer-events-none absolute inset-px rounded-lg shadow-sm outline outline-white/15 max-lg:rounded-b-4xl lg:rounded-r-4xl"\r
          ></div>\r
        </div>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- MIGRATED: LOCATION SECTION -->\r
  <section\r
    class="py-0 grid grid-cols-1 md:grid-cols-2 bg-neutral text-neutral-content"\r
  >\r
    <div class="p-12 flex flex-col justify-center">\r
      <span class="text-primary font-bold tracking-widest uppercase mb-4"\r
        >Donde Estamos</span\r
      >\r
      <h2 class="text-3xl font-bold mb-6">A 3 Cuadras de Ruta 40</h2>\r
      <div class="space-y-4 text-lg">\r
        <p>\r
          <i class="fas fa-map-marker-alt text-error w-8"></i>\r
          {{ locationData.address }}\r
        </p>\r
        <p>\r
          <i class="fas fa-clock text-primary w-8"></i> {{ locationData.hours }}\r
        </p>\r
        <p>\r
          <i class="fas fa-phone text-success w-8"></i> {{ locationData.phone }}\r
        </p>\r
      </div>\r
      <a\r
        href="https://maps.app.goo.gl/73b48d51a83e8107"\r
        target="_blank"\r
        class="btn btn-outline btn-white w-fit mt-8"\r
      >\r
        <i class="fas fa-directions mr-2"></i> C\xF3mo Llegar\r
      </a>\r
    </div>\r
    <div class="h-80 md:h-full min-h-[450px] bg-gray-200">\r
      <iframe\r
        [src]="safeMapUrl"\r
        width="100%"\r
        height="100%"\r
        style="border: 0"\r
        allowfullscreen=""\r
        loading="lazy"\r
        title="Ubicaci\xF3n de Arecofix en Google Maps"\r
        referrerpolicy="no-referrer-when-downgrade"\r
      ></iframe>\r
    </div>\r
  </section>\r
\r
  <!-- PROCESS SECTION "As\xED Trabajamos" -->\r
  <section class="py-20 bg-gray-900 text-white relative overflow-hidden">\r
    <div\r
      class="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"\r
    ></div>\r
    <div class="container mx-auto px-4 relative z-10">\r
      <div class="text-center mb-16">\r
        <h2 class="text-3xl font-bold">As\xED Trabajamos</h2>\r
        <p class="text-gray-400 mt-2">\r
          Simple, transparente y con tecnolog\xEDa a tu favor.\r
        </p>\r
      </div>\r
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">\r
        @for (step of processSteps; track step.title) {\r
          <div class="relative items-center flex flex-col group">\r
            <div\r
              [class]="\r
                'w-20 h-20 rounded-full flex items-center justify-center text-3xl font-bold mb-6 shadow-lg transition-transform group-hover:scale-110 ' +\r
                step.bg +\r
                ' ' +\r
                step.color\r
              "\r
            >\r
              <i [class]="step.icon"></i>\r
            </div>\r
            <h3 class="text-xl font-bold mb-2">{{ step.title }}</h3>\r
            <p class="text-gray-400 text-center text-sm px-4">\r
              {{ step.desc }}\r
            </p>\r
          </div>\r
        }\r
      </div>\r
    </div>\r
  </section>\r
\r
  <div class="overflow-hidden bg-gray-900 py-24 sm:py-32">\r
    <div class="mx-auto max-w-7xl px-6 lg:px-8">\r
      <div\r
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-8 gap-y-16 sm:gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-2"\r
      >\r
        <div class="lg:pt-4 lg:pr-8">\r
          <div class="lg:max-w-lg">\r
            <h2 class="text-base/7 font-semibold text-indigo-400">\r
              Reparacion de Celulares en Marcos Paz\r
            </h2>\r
            <p\r
              class="mt-2 text-4xl font-semibold tracking-tight text-pretty text-white sm:text-5xl"\r
            >\r
              Tu servicio Tecnico de Confianza\r
            </p>\r
            <p class="mt-6 text-lg/8 text-gray-300">\r
              Brindamos Servicio Tecnico de Celulares en Marcos paz, Merlo, Las\r
              Heras, Ca\xF1uelas, Mariano Acosta, General Rodriguez, Moreno y todo\r
              el departamento de Bs As.\r
            </p>\r
            <dl\r
              class="mt-10 max-w-xl space-y-8 text-base/7 text-gray-400 lg:max-w-none"\r
            >\r
              <div class="relative pl-9">\r
                <dt class="inline font-semibold text-white">\r
                  <svg\r
                    viewBox="0 0 20 20"\r
                    fill="currentColor"\r
                    data-slot="icon"\r
                    aria-hidden="true"\r
                    class="absolute top-1 left-1 size-5 text-indigo-400"\r
                  >\r
                    <path\r
                      d="M5.5 17a4.5 4.5 0 0 1-1.44-8.765 4.5 4.5 0 0 1 8.302-3.046 3.5 3.5 0 0 1 4.504 4.272A4 4 0 0 1 15 17H5.5Zm3.75-2.75a.75.75 0 0 0 1.5 0V9.66l1.95 2.1a.75.75 0 1 0 1.1-1.02l-3.25-3.5a.75.75 0 0 0-1.1 0l-3.25 3.5a.75.75 0 1 0 1.1 1.02l1.95-2.1v4.59Z"\r
                      clip-rule="evenodd"\r
                      fill-rule="evenodd"\r
                    />\r
                  </svg>\r
                  Reparacion de Celulares.\r
                </dt>\r
                <dd class="inline">\r
                  Arreglamos Celulares de todas las marcas y modelos todos los\r
                  problemas de tu celular resueltos en un solo lugar.\r
                </dd>\r
              </div>\r
              <div class="relative pl-9">\r
                <dt class="inline font-semibold text-white">\r
                  <svg\r
                    viewBox="0 0 20 20"\r
                    fill="currentColor"\r
                    data-slot="icon"\r
                    aria-hidden="true"\r
                    class="absolute top-1 left-1 size-5 text-indigo-400"\r
                  >\r
                    <path\r
                      d="M10 1a4.5 4.5 0 0 0-4.5 4.5V9H5a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-.5V5.5A4.5 4.5 0 0 0 10 1Zm3 8V5.5a3 3 0 1 0-6 0V9h6Z"\r
                      clip-rule="evenodd"\r
                      fill-rule="evenodd"\r
                    />\r
                  </svg>\r
                  Arreglo de Telefonos Celulares en Marcos Paz.\r
                </dt>\r
                <dd class="inline">\r
                  Con nosotros tus datos y privacidad estan totalmente seguros\r
                  hacemos Reparacion de Celulares en Marcos Paz.\r
                </dd>\r
              </div>\r
              <div class="relative pl-9">\r
                <dt class="inline font-semibold text-white">\r
                  <svg\r
                    viewBox="0 0 20 20"\r
                    fill="currentColor"\r
                    data-slot="icon"\r
                    aria-hidden="true"\r
                    class="absolute top-1 left-1 size-5 text-indigo-400"\r
                  >\r
                    <path\r
                      d="M4.632 3.533A2 2 0 0 1 6.577 2h6.846a2 2 0 0 1 1.945 1.533l1.976 8.234A3.489 3.489 0 0 0 16 11.5H4c-.476 0-.93.095-1.344.267l1.976-8.234Z"\r
                    />\r
                    <path\r
                      d="M4 13a2 2 0 1 0 0 4h12a2 2 0 1 0 0-4H4Zm11.24 2a.75.75 0 0 1 .75-.75H16a.75.75 0 0 1 .75.75v.01a.75.75 0 0 1-.75.75h-.01a.75.75 0 0 1-.75-.75V15Zm-2.25-.75a.75.75 0 0 0-.75.75v.01c0 .414.336.75.75.75H13a.75.75 0 0 0 .75-.75V15a.75.75 0 0 0-.75-.75h-.01Z"\r
                      clip-rule="evenodd"\r
                      fill-rule="evenodd"\r
                    />\r
                  </svg>\r
                  Reparacion de Telefonos Celulares en Marcos Paz.\r
                </dt>\r
                <dd class="inline">\r
                  Te ayudamos a recuperar esa informacion tan importante Fotos\r
                  personales, videos, documentos, y todo lo que necesites.\r
                </dd>\r
              </div>\r
            </dl>\r
          </div>\r
        </div>\r
        <img\r
          width="2432"\r
          height="1442"\r
          src="https://tailwindcss.com/plus-assets/img/component-images/dark-project-app-screenshot.png"\r
          alt="Product screenshot"\r
          class="w-3xl max-w-none rounded-xl shadow-xl ring-1 ring-white/10 sm:w-228 md:-ml-4 lg:ml-0"\r
        />\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- GALLERY SECTION -->\r
  <section class="py-20 bg-base-100">\r
    <div class="container mx-auto px-4">\r
      <h2 class="text-3xl font-bold text-center mb-4">\r
        Marcos Paz Cell Mira Nuestros Trabajos\r
      </h2>\r
      <p class="text-center text-base-content/60 mb-12">\r
        Desde microsoldadura hasta cambios de m\xF3dulo. As\xED trabajamos.\r
      </p>\r
\r
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4">\r
        @for (item of galleryItems; track item.src) {\r
          @if (item.type === "video") {\r
            <div\r
              [class]="\r
                'rounded-xl overflow-hidden shadow-md group relative bg-black ' +\r
                item.span\r
              "\r
            >\r
              <video\r
                [src]="item.src"\r
                controls\r
                playsinline\r
                webkit-playsinline\r
                preload="metadata"\r
                class="w-full h-full object-cover"\r
                [poster]="item.poster"\r
              ></video>\r
            </div>\r
          } @else {\r
            <div\r
              [class]="\r
                'aspect-square rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all hover:scale-105 cursor-pointer group relative ' +\r
                (item.span || '')\r
              "\r
            >\r
              <img\r
                [src]="item.src"\r
                loading="lazy"\r
                [alt]="item.alt"\r
                class="w-full h-full object-cover"\r
              />\r
            </div>\r
          }\r
        }\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- PARTNERS SECTION -->\r
  <section class="py-12 bg-base-200 border-y border-base-300">\r
    <div class="container mx-auto px-4 text-center">\r
      <p\r
        class="text-sm font-bold text-base-content/40 uppercase tracking-widest mb-8"\r
      >\r
        Conf\xEDan en Nosotros\r
      </p>\r
      <div\r
        class="flex justify-center items-center gap-12 flex-wrap opacity-60 grayscale hover:grayscale-0 transition-all"\r
      >\r
        @for (partner of partners; track partner.name) {\r
          @if (partner.img) {\r
            <img [src]="partner.img" [alt]="partner.name" class="h-8" />\r
          } @else {\r
            <div\r
              [class]="\r
                'flex items-center gap-2 text-xl font-bold ' + partner.color\r
              "\r
            >\r
              @if (partner.icon) {\r
                <i [class]="partner.icon"></i>\r
              }\r
              {{ partner.name }}\r
            </div>\r
          }\r
        }\r
      </div>\r
\r
      <!-- MENTIONS -->\r
      <div class="mt-8 pt-8 border-t border-base-300">\r
        <p class="text-xs text-base-content/40 uppercase tracking-widest mb-4">\r
          Mencionado en\r
        </p>\r
        <div\r
          class="flex flex-col md:flex-row justify-center items-center gap-4 font-serif text-base-content/60 text-sm flex-wrap"\r
        >\r
          @for (mention of mentions; track mention.name; let isLast = $last) {\r
            <a\r
              [href]="mention.url"\r
              target="_blank"\r
              rel="noopener noreferrer"\r
              class="hover:text-primary transition-colors border-b border-transparent hover:border-primary"\r
            >\r
              {{ mention.name }}\r
            </a>\r
            @if (!isLast) {\r
              <span class="hidden md:inline text-base-content/20">\u2022</span>\r
            }\r
          }\r
        </div>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- REVIEWS SECTION (Google Style) -->\r
  <section class="py-20 bg-base-200">\r
    <div class="container mx-auto px-4">\r
      <div class="text-center mb-12">\r
        <h2 class="text-3xl font-bold mb-4">Lo que dicen nuestros clientes</h2>\r
        <div class="flex items-center justify-center gap-2 mb-2">\r
          <span class="text-2xl font-bold">4.8</span>\r
          <div class="flex text-yellow-500">\r
            <i class="fas fa-star"></i>\r
            <i class="fas fa-star"></i>\r
            <i class="fas fa-star"></i>\r
            <i class="fas fa-star"></i>\r
            <i class="fas fa-star-half-alt"></i>\r
          </div>\r
          <span class="text-sm text-gray-500">(120 rese\xF1as en Google)</span>\r
        </div>\r
      </div>\r
\r
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">\r
        @for (review of reviews; track review.name) {\r
            <!-- Review Card -->\r
          <a\r
             href="https://share.google/Fnume9zIn9XpY4Xiu"\r
             target="_blank"\r
             class="relative flex h-full flex-col justify-between rounded-2xl bg-base-100 p-6 shadow-sm ring-1 ring-base-200 transition-all hover:shadow-md hover:-translate-y-1"\r
             >\r
            <div>\r
              <div class="flex items-center gap-x-4 mb-4">\r
                <div\r
                  [class]="\r
                    'h-12 w-12 min-w-12 shrink-0 rounded-full flex items-center justify-center text-white font-bold text-xl overflow-hidden ' +\r
                    review.bgColor\r
                  "\r
                >\r
                  {{ review.initial | slice:0:1 }}\r
                </div>\r
                <div>\r
                  <h3 class="text-lg font-semibold leading-7 text-base-content">\r
                    {{ review.name }}\r
                  </h3>\r
                  <div class="flex items-center gap-1 text-sm text-base-content/60">\r
                    <p>{{ review.date }}</p>\r
                    <span>\u2022</span>\r
                    <div class="flex text-yellow-400 text-xs">\r
                      @for (star of [1, 2, 3, 4, 5]; track star) {\r
                        <i\r
                          [class]="\r
                            star <= review.stars ? 'fas fa-star' : 'far fa-star'\r
                          "\r
                        ></i>\r
                      }\r
                    </div>\r
                  </div>\r
                </div>\r
              </div>\r
\r
              <!-- Review Text -->\r
              <p\r
                class="text-sm text-base-content/80 line-clamp-4 leading-relaxed"\r
              >\r
                "{{ review.text }}"\r
              </p>\r
            </div>\r
          </a>\r
        }\r
      </div>\r
\r
      <div class="text-center mt-10">\r
        <a\r
          href="https://share.google/Fnume9zIn9XpY4Xiu"\r
          target="_blank"\r
          class="btn btn-outline btn-primary"\r
        >\r
          <i class="fas fa-pen mr-2"></i> Dejar una Rese\xF1a\r
        </a>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- FAQ SECTION -->\r
  <section class="py-20 max-w-3xl mx-auto px-4">\r
    <h2 class="text-3xl font-bold text-center mb-10 text-base-content">\r
      Preguntas Frecuentes\r
    </h2>\r
    <div\r
      class="join join-vertical w-full bg-base-100 rounded-2xl border border-base-200 shadow-sm"\r
    >\r
      @for (faq of faqs; track faq.question; let i = $index) {\r
        <div class="collapse collapse-arrow join-item border-b border-base-200">\r
          <input\r
            type="radio"\r
            name="my-accordion-4"\r
            [checked]="i === 0"\r
            [attr.aria-label]="faq.question"\r
          />\r
          <div class="collapse-title text-xl font-medium text-base-content">\r
            {{ faq.question }}\r
          </div>\r
          <div class="collapse-content text-base-content/70">\r
            <p>{{ faq.answer }}</p>\r
          </div>\r
        </div>\r
      }\r
    </div>\r
  </section>\r
\r
  <div class="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">\r
    <img\r
      src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&crop=focalpoint&fp-y=.8&w=2830&h=1500&q=80&blend=111827&sat=-100&exp=15&blend-mode=multiply"\r
      alt=""\r
      class="absolute inset-0 -z-10 size-full object-cover object-right md:object-center"\r
    />\r
    <div\r
      aria-hidden="true"\r
      class="hidden sm:absolute sm:-top-10 sm:right-1/2 sm:-z-10 sm:mr-10 sm:block sm:transform-gpu sm:blur-3xl"\r
    >\r
      <div\r
        style="\r
          clip-path: polygon(\r
            74.1% 44.1%,\r
            100% 61.6%,\r
            97.5% 26.9%,\r
            85.5% 0.1%,\r
            80.7% 2%,\r
            72.5% 32.5%,\r
            60.2% 62.4%,\r
            52.4% 68.1%,\r
            47.5% 58.3%,\r
            45.2% 34.5%,\r
            27.5% 76.7%,\r
            0.1% 64.9%,\r
            17.9% 100%,\r
            27.6% 76.8%,\r
            76.1% 97.7%,\r
            74.1% 44.1%\r
          );\r
        "\r
        class="aspect-1097/845 w-274.25 bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"\r
      ></div>\r
    </div>\r
    <div\r
      aria-hidden="true"\r
      class="absolute -top-52 left-1/2 -z-10 -translate-x-1/2 transform-gpu blur-3xl sm:-top-112 sm:ml-16 sm:translate-x-0"\r
    >\r
      <div\r
        style="\r
          clip-path: polygon(\r
            74.1% 44.1%,\r
            100% 61.6%,\r
            97.5% 26.9%,\r
            85.5% 0.1%,\r
            80.7% 2%,\r
            72.5% 32.5%,\r
            60.2% 62.4%,\r
            52.4% 68.1%,\r
            47.5% 58.3%,\r
            45.2% 34.5%,\r
            27.5% 76.7%,\r
            0.1% 64.9%,\r
            17.9% 100%,\r
            27.6% 76.8%,\r
            76.1% 97.7%,\r
            74.1% 44.1%\r
          );\r
        "\r
        class="aspect-1097/845 w-274.25 bg-linear-to-tr from-[#ff4694] to-[#776fff] opacity-20"\r
      ></div>\r
    </div>\r
    <div class="mx-auto max-w-7xl px-6 lg:px-8">\r
      <div class="mx-auto max-w-2xl lg:mx-0">\r
        <h2\r
          class="text-5xl font-semibold tracking-tight text-white sm:text-7xl"\r
        >\r
          \xBFBuscas Donde reparar Celulares en Mariano Acosta?\r
        </h2>\r
        <p\r
          class="mt-8 text-lg font-medium text-pretty text-gray-300 sm:text-xl/8"\r
        >\r
          En Arecofix somos los doctores de tu celular encontr\xE1s la soluci\xF3n\r
          para tus celulares.\r
        </p>\r
      </div>\r
      <div class="mx-auto mt-10 max-w-2xl lg:mx-0 lg:max-w-none">\r
        <div\r
          class="grid grid-cols-1 gap-x-8 gap-y-6 text-base/7 font-semibold text-white sm:grid-cols-2 md:flex lg:gap-x-10"\r
        >\r
          <a href="#">Reparaciones <span aria-hidden="true">&rarr;</span></a>\r
          <a href="#"\r
            >Servicio al cliente <span aria-hidden="true">&rarr;</span></a\r
          >\r
          <a href="#"\r
            >Tecnicos de Celulares Calificados\r
            <span aria-hidden="true">&rarr;</span></a\r
          >\r
          <a href="#"\r
            >Deja tu celular en manos de profesionales\r
            <span aria-hidden="true">&rarr;</span></a\r
          >\r
        </div>\r
        <dl\r
          class="mt-16 grid grid-cols-1 gap-8 sm:mt-20 sm:grid-cols-2 lg:grid-cols-4"\r
        >\r
          <div class="flex flex-col-reverse gap-1">\r
            <dt class="text-base/7 text-gray-300">Arreglos</dt>\r
            <dd class="text-4xl font-semibold tracking-tight text-white">12</dd>\r
          </div>\r
          <div class="flex flex-col-reverse gap-1">\r
            <dt class="text-base/7 text-gray-300">Servicio Tecnico</dt>\r
            <dd class="text-4xl font-semibold tracking-tight text-white">\r
              300+\r
            </dd>\r
          </div>\r
          <div class="flex flex-col-reverse gap-1">\r
            <dt class="text-base/7 text-gray-300">Tecnicos Calificados</dt>\r
            <dd class="text-4xl font-semibold tracking-tight text-white">40</dd>\r
          </div>\r
          <div class="flex flex-col-reverse gap-1">\r
            <dt class="text-base/7 text-gray-300">\r
              Servicio Tecnico de Celulares en Marcos Paz | Reparacion de\r
              Celulares iPhone en Marcos Paz | Reparacion de Celulares en Marcos\r
              Paz |\r
            </dt>\r
            <dd class="text-4xl font-semibold tracking-tight text-white">\r
              Servicio Tecnico Liderado por Expertos\r
            </dd>\r
          </div>\r
        </dl>\r
      </div>\r
    </div>\r
  </div>\r
\r
  <!-- CONTACT FORM -->\r
  <section class="py-20 bg-base-200" id="contact">\r
    <div class="max-w-2xl mx-auto px-4">\r
      <div class="card bg-base-100 shadow-xl">\r
        <div class="card-body">\r
          <h2 class="card-title text-3xl justify-center mb-6 text-base-content">\r
            \xBFTen\xE9s otra consulta?\r
          </h2>\r
          <form (ngSubmit)="sendContactForm()">\r
            <div class="form-control mb-4">\r
              <label class="label" for="contactName"\r
                ><span class="label-text">Nombre</span></label\r
              >\r
              <input\r
                type="text"\r
                id="contactName"\r
                [(ngModel)]="contactName"\r
                name="name"\r
                class="input input-bordered w-full bg-base-200 text-base-content placeholder:text-base-content/60"\r
                placeholder="Tu nombre"\r
                required\r
              />\r
            </div>\r
            <div class="form-control mb-4">\r
              <label class="label" for="contactPhone"\r
                ><span class="label-text">Tel\xE9fono / WhatsApp</span></label\r
              >\r
              <input\r
                type="tel"\r
                id="contactPhone"\r
                [(ngModel)]="contactPhone"\r
                name="phone"\r
                class="input input-bordered w-full bg-base-200 text-base-content placeholder:text-base-content/60"\r
                placeholder="11 1234 5678"\r
                required\r
              />\r
            </div>\r
            <div class="form-control mb-6">\r
              <label class="label" for="contactMessage"\r
                ><span class="label-text">Mensaje</span></label\r
              >\r
              <textarea\r
                id="contactMessage"\r
                [(ngModel)]="contactMessage"\r
                name="message"\r
                class="textarea textarea-bordered h-32 w-full bg-base-200 text-base-content placeholder:text-base-content/60"\r
                placeholder="Hola, quer\xEDa saber el precio de..."\r
                required\r
              ></textarea>\r
            </div>\r
            <button\r
              type="submit"\r
              class="btn btn-primary w-full text-lg"\r
              [disabled]="sendingContact"\r
            >\r
              @if (sendingContact) {\r
                <span class="loading loading-spinner"></span>\r
              }\r
              Enviar Mensaje\r
            </button>\r
          </form>\r
        </div>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- WARRANTY BANNER -->\r
  <div\r
    class="bg-primary text-primary-content py-4 text-center font-bold text-lg md:text-xl shadow-lg relative z-20"\r
  >\r
    <div class="container mx-auto px-4 flex justify-center items-center gap-2">\r
      <i class="fas fa-shield-alt text-2xl"></i>\r
      <span>Garant\xEDa de 30 d\xEDas en todas nuestras reparaciones</span>\r
    </div>\r
  </div>\r
\r
  <!-- NOVEDADES Y RECURSOS (App & Blog) -->\r
  <section class="pt-24 pb-48 bg-gray-50 relative overflow-hidden">\r
    <!-- Background Blotches -->\r
    <div\r
      class="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"\r
    ></div>\r
    <div\r
      class="absolute bottom-0 left-0 w-96 h-96 bg-green-500/10 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2"\r
    ></div>\r
\r
    <div class="container mx-auto px-4 relative z-10">\r
      <div class="text-center mb-16">\r
        <span\r
          class="text-green-600 font-bold tracking-widest uppercase text-sm mb-2 block"\r
          >Blog & Comunidad</span\r
        >\r
        <h2 class="text-4xl md:text-5xl font-bold mb-4 text-gray-900">\r
          Novedades y Recursos\r
        </h2>\r
        <p class="text-xl text-gray-600 max-w-2xl mx-auto">\r
          Mantenete al d\xEDa con lo \xFAltimo en tecnolog\xEDa, gu\xEDas de reparaci\xF3n y\r
          novedades de Arecofix.\r
        </p>\r
      </div>\r
\r
      <!-- Unified Grid Layout -->\r
      <div\r
        class="grid grid-cols-2 md:grid-cols-2 xl:grid-cols-4 gap-4 md:gap-6"\r
      >\r
        <!-- Blog Posts (Dynamically Rendered) -->\r
        @for (post of blogFeatures; track post.title) {\r
          <a\r
            [routerLink]="post.link"\r
            [class]="\r
              'group relative flex flex-col bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 h-full ' +\r
              ($last ? 'col-span-2 md:col-span-1' : '')\r
            "\r
          >\r
            <!-- Image Container -->\r
            <div class="h-48 overflow-hidden relative">\r
              <div\r
                class="absolute inset-0 bg-gray-900/10 group-hover:bg-transparent transition-colors z-10"\r
              ></div>\r
              <img\r
                [src]="post.img"\r
                [alt]="post.title"\r
                class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"\r
              />\r
            </div>\r
\r
            <!-- Content -->\r
            <div class="p-6 flex flex-col grow">\r
              <h3\r
                class="text-xl font-bold text-gray-800 mb-3 group-hover:text-green-600 transition-colors"\r
              >\r
                {{ post.title }}\r
              </h3>\r
              <p class="text-gray-600 text-sm mb-6 line-clamp-3 grow">\r
                {{ post.desc }}\r
              </p>\r
\r
              <div\r
                class="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between text-green-600 font-bold text-sm"\r
              >\r
                <span>Leer M\xE1s</span>\r
                <i\r
                  class="fas fa-arrow-right transform group-hover:translate-x-1 transition-transform"\r
                ></i>\r
              </div>\r
            </div>\r
          </a>\r
        }\r
\r
        <!-- App Download Card (Takes 1 column) -->\r
        <div class="col-span-2 md:col-span-1 lg:col-span-1 h-full">\r
          <div\r
            class="bg-[#1f2937] text-white rounded-3xl p-8 shadow-2xl relative overflow-hidden group border border-gray-700 h-full flex flex-col"\r
          >\r
            <!-- Decorative Elements -->\r
            <div\r
              class="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-2xl"\r
            ></div>\r
            <div\r
              class="absolute bottom-0 left-0 w-32 h-32 bg-green-500/20 rounded-full blur-2xl"\r
            ></div>\r
\r
            <div\r
              class="relative z-10 flex flex-col items-center text-center grow justify-between"\r
            >\r
              <div\r
                class="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-6 border border-white/10 shadow-inner backdrop-blur-sm"\r
              >\r
                <i\r
                  class="fas fa-mobile-screen-button text-4xl text-green-400"\r
                ></i>\r
              </div>\r
\r
              <h3 class="text-2xl font-bold mb-3">{{ appInfo.title }}</h3>\r
              <p class="text-gray-400 text-sm mb-8 leading-relaxed">\r
                {{ appInfo.desc }}\r
              </p>\r
\r
              <ul class="text-left space-y-4 mb-8 w-full px-4">\r
                @for (feature of appInfo.features; track feature) {\r
                  <li class="flex items-center gap-3 text-sm text-gray-300">\r
                    <i class="fas fa-check-circle text-green-400"></i>\r
                    <span>{{ feature }}</span>\r
                  </li>\r
                }\r
              </ul>\r
\r
              <a\r
                [href]="appInfo.downloadLink"\r
                target="_blank"\r
                class="w-full bg-white text-gray-900 rounded-xl p-3 flex items-center justify-center gap-3 hover:bg-gray-100 hover:scale-[1.02] transition-all duration-300 shadow-lg group-hover:shadow-blue-500/20"\r
              >\r
                <div class="text-left">\r
                  <div\r
                    class="text-[10px] uppercase font-bold tracking-wider text-gray-500"\r
                  >\r
                    Disponible en\r
                  </div>\r
                  <div class="text-lg font-bold leading-none">Google Play</div>\r
                </div>\r
              </a>\r
            </div>\r
          </div>\r
        </div>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- RELATED SERVICES SECTION -->\r
  <div class="mt-24 mb-12">\r
    <div class="text-center mb-12">\r
      <span\r
        class="text-green-600 font-bold tracking-widest uppercase text-xs mb-3 block"\r
        >Soluciones Integrales</span\r
      >\r
      <h2 class="text-3xl font-bold text-gray-900 mb-4">\r
        Otros Servicios Relacionados\r
      </h2>\r
      <p class="text-gray-600 max-w-2xl mx-auto">\r
        Adem\xE1s de reparar celulares, somos expertos en una amplia gama de\r
        dispositivos electr\xF3nicos.\r
      </p>\r
    </div>\r
\r
    <div class="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 mb-12">\r
      @for (service of relatedServices; track service.title) {\r
        <div\r
          [class]="\r
            'bg-gray-50 rounded-2xl p-4 md:p-8 hover:bg-white hover:shadow-xl transition-all border border-gray-100 group text-center ' +\r
            ($last ? 'col-span-2 md:col-span-1' : '')\r
          "\r
        >\r
          <div\r
            class="w-12 h-12 md:w-16 md:h-16 mx-auto rounded-full bg-green-100 text-green-600 flex items-center justify-center text-xl md:text-2xl mb-3 md:mb-6 group-hover:scale-110 transition-transform"\r
          >\r
            <i [class]="'fas ' + service.icon"></i>\r
          </div>\r
          <h3 class="text-lg md:text-xl font-bold text-gray-900 mb-2 md:mb-3">\r
            {{ service.title }}\r
          </h3>\r
          <p class="text-gray-600 text-xs md:text-sm mb-4 md:mb-6">\r
            {{ service.desc }}\r
          </p>\r
          <!-- Using RouterLink to navigate to services page -->\r
          <a\r
            [routerLink]="service.link"\r
            class="text-green-600 font-bold text-xs md:text-sm hover:text-green-800 transition-colors inline-flex items-center gap-2"\r
          >\r
            Ver Detalles <i class="fas fa-arrow-right"></i>\r
          </a>\r
        </div>\r
      }\r
    </div>\r
\r
    <div class="text-center">\r
      <a\r
        routerLink="/servicios"\r
        class="inline-flex items-center justify-center gap-3 bg-gray-900 text-white px-8 py-4 rounded-full font-bold hover:bg-gray-800 hover:-translate-y-1 transition-all shadow-lg shadow-gray-900/20"\r
      >\r
        Ver Todos los Servicios <i class="fas fa-layer-group"></i>\r
      </a>\r
    </div>\r
  </div>\r
\r
  <!-- BRANDS CAROUSEL (Bottom) -->\r
</div>\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CelularLandingComponent, { className: "CelularLandingComponent", filePath: "src/app/public/landing/celular/celular-landing.component.ts", lineNumber: 61 });
})();
export {
  CelularLandingComponent
};
//# sourceMappingURL=chunk-EGMU7JAQ.js.map
