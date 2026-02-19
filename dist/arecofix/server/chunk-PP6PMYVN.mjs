import './polyfills.server.mjs';
import {
  PreferencesService
} from "./chunk-BAWL3Z4D.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel,
  NumberValueAccessor
} from "./chunk-62W3S7X6.mjs";
import {
  environment
} from "./chunk-PTNHDWI2.mjs";
import {
  AsyncPipe,
  CommonModule,
  DecimalPipe,
  Meta,
  RouterLink,
  Title
} from "./chunk-OW3O3C6K.mjs";
import {
  Component,
  Injectable,
  of,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdeclareLet,
  ɵɵdefineComponent,
  ɵɵdefineInjectable,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵpipeBind2,
  ɵɵproperty,
  ɵɵreadContextLet,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵstoreLet,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-TFR7QWGS.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/core/data/gsm.data.ts
var GSM_TOOLS = [
  {
    name: "UnlockTool",
    description: "Herramienta profesional para desbloqueo de FRP, Mi Account y Flasheo.",
    price: "Consultar",
    icon: "fas fa-unlock-alt",
    loginUrl: environment.externalUrls.gsm.unlocktool
  },
  {
    name: "Chimera Tool",
    description: "Soporte multimarca para reparaci\xF3n de IMEI, desbloqueo y m\xE1s.",
    price: "Consultar",
    icon: "fas fa-dragon",
    loginUrl: environment.externalUrls.gsm.chimeratool
  },
  {
    name: "Z3X Box",
    description: "Especializada en Samsung y LG. Reparaci\xF3n de IMEI y Flasheo.",
    price: "Consultar",
    icon: "fas fa-box-open",
    loginUrl: environment.externalUrls.gsm.z3x_team
  },
  {
    name: "SigmaKey",
    description: "Soluci\xF3n para Huawei, Motorola y otras marcas MTK/Qualcomm.",
    price: "Consultar",
    icon: "fas fa-key",
    loginUrl: environment.externalUrls.gsm.sigmakey
  }
];
var BRAND_SERVICES = [
  {
    name: "Apple",
    logo: "fab fa-apple",
    services: ["iCloud Bypass", "FMI Off", "Carrier Unlock"]
  },
  {
    name: "Samsung",
    logo: "fab fa-android",
    services: ["FRP Unlock", "KG Unlock", "Network Unlock"]
  },
  {
    name: "Xiaomi",
    logo: "fas fa-mobile",
    services: ["Mi Account Remove", "Bootloader Unlock", "Unbrick"]
  },
  {
    name: "Motorola",
    logo: "fas fa-mobile-alt",
    services: ["FRP Reset", "Repair IMEI", "Flash Firmware"]
  }
];

// src/app/public/gsm/services/gsm.service.ts
var GsmService = class _GsmService {
  getGsmTools() {
    return of(GSM_TOOLS);
  }
  getBrandServices() {
    return of(BRAND_SERVICES);
  }
  getDownloads() {
    return of([
      {
        name: "Samsung USB Drivers",
        version: "v1.7.59",
        size: "35 MB",
        downloadUrl: environment.externalUrls.gsm["samsung_usb"],
        icon: "fab fa-usb",
        description: "Drivers oficiales para dispositivos Samsung."
      },
      {
        name: "Odin Flash Tool",
        version: "v3.14.4",
        size: "2.5 MB",
        downloadUrl: environment.externalUrls.gsm["odin"],
        icon: "fas fa-bolt",
        description: "Herramienta de flasheo para Samsung."
      },
      {
        name: "Xiaomi ADB/Fastboot Tools",
        version: "v7.0.3",
        size: "15 MB",
        downloadUrl: environment.externalUrls.gsm["xiaomi_adb"],
        icon: "fas fa-tools",
        description: "Herramienta para gestionar dispositivos Xiaomi."
      },
      {
        name: "Platform Tools (ADB/Fastboot)",
        version: "Latest",
        size: "12 MB",
        downloadUrl: environment.externalUrls.gsm["platform_tools"],
        icon: "fas fa-terminal",
        description: "Herramientas de l\xEDnea de comandos del SDK de Android."
      },
      {
        name: "FlexiHub",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["flexihub"],
        icon: "fas fa-network-wired",
        description: "Acceso remoto a dispositivos USB y puertos COM."
      },
      {
        name: "Radmin VPN",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["radmin_vpn"],
        icon: "fas fa-shield-alt",
        description: "Red privada virtual segura y f\xE1cil de usar."
      },
      {
        name: "USB Redirector 2.5",
        version: "v2.5",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["usb_redirector"],
        // Assuming same base URL for now or need separate if different
        icon: "fas fa-plug",
        description: "Redirecci\xF3n de dispositivos USB por red."
      },
      {
        name: "USB Redirector 1.9.7",
        version: "v1.9.7",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["usb_redirector"],
        icon: "fas fa-plug",
        description: "Versi\xF3n legacy para compatibilidad espec\xEDfica."
      },
      {
        name: "RustDesk",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["rustdesk"],
        icon: "fas fa-desktop",
        description: "Software de escritorio remoto de c\xF3digo abierto."
      },
      {
        name: "TeamViewer",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["teamviewer"],
        icon: "fas fa-exchange-alt",
        description: "Soluci\xF3n l\xEDder para soporte remoto."
      },
      {
        name: "UltraViewer",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["ultraviewer"],
        icon: "fas fa-eye",
        description: "Control remoto de escritorio alternativo."
      },
      {
        name: "Psiphon",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["psiphon"],
        icon: "fas fa-globe",
        description: "Herramienta de elusi\xF3n de censura en Internet."
      },
      {
        name: "AnyDesk",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["anydesk"],
        icon: "fas fa-laptop-house",
        description: "Aplicaci\xF3n de escritorio remoto r\xE1pida."
      },
      {
        name: "VirtualHere Client",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["virtualhere"],
        icon: "fas fa-server",
        description: "Cliente para compartir USB sobre IP."
      },
      {
        name: "SamFw Tool",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["samfw"],
        icon: "fab fa-android",
        description: "Herramienta gratuita para Samsung FRP y m\xE1s."
      },
      {
        name: "SamFirm",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["samfirm"],
        icon: "fas fa-download",
        description: "Descarga firmwares oficiales de Samsung."
      },
      {
        name: "3uTools",
        version: "Latest",
        size: "-",
        downloadUrl: environment.externalUrls.gsm["tres_u_tools"],
        icon: "fab fa-apple",
        description: "Herramienta todo en uno para dispositivos iOS."
      }
    ]);
  }
  static \u0275fac = function GsmService_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GsmService)();
  };
  static \u0275prov = /* @__PURE__ */ \u0275\u0275defineInjectable({ token: _GsmService, factory: _GsmService.\u0275fac, providedIn: "root" });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GsmService, [{
    type: Injectable,
    args: [{
      providedIn: "root"
    }]
  }], null, null);
})();

// src/app/public/gsm/gsm.component.ts
function GsmComponent_Conditional_11_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "div", 77)(2, "div", 78);
    \u0275\u0275elementEnd();
  }
}
function GsmComponent_Conditional_46_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 24);
  }
}
function GsmComponent_Conditional_119_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 79)(1, "div", 80);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 81);
    \u0275\u0275text(4);
    \u0275\u0275pipe(5, "number");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 82);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext();
    const lang_r3 = \u0275\u0275readContextLet(6);
    const theme_r4 = \u0275\u0275readContextLet(8);
    \u0275\u0275classProp("bg-gray-50", theme_r4 === "light")("border-gray-200", theme_r4 === "light")("bg-gray-800", theme_r4 === "dark")("border-gray-700", theme_r4 === "dark")("bg-black", theme_r4 === "high-contrast")("border-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275classProp("text-gray-500", theme_r4 === "light")("text-gray-400", theme_r4 === "dark")("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.translations[lang_r3].total_est);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-gray-800", theme_r4 === "light")("text-white", theme_r4 !== "light");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("$ ", \u0275\u0275pipeBind2(5, 30, ctx_r1.usdtTotal, "1.0-2"));
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-gray-400", theme_r4 !== "high-contrast")("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate2("", ctx_r1.translations[lang_r3].cot_ref, ": $ ", ctx_r1.usdtRate);
  }
}
function GsmComponent_For_129_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 83)(1, "div", 84)(2, "div", 85);
    \u0275\u0275element(3, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "span", 86);
    \u0275\u0275text(5, "Software");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(6, "h3", 87);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "p", 88);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "a", 89);
    \u0275\u0275text(11);
    \u0275\u0275element(12, "i", 41);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const tool_r5 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    const lang_r3 = \u0275\u0275readContextLet(6);
    const theme_r4 = \u0275\u0275readContextLet(8);
    \u0275\u0275classProp("bg-white", theme_r4 === "light")("border-gray-100", theme_r4 === "light")("bg-gray-800", theme_r4 === "dark")("border-gray-700", theme_r4 === "dark")("bg-black", theme_r4 === "high-contrast")("border-white", theme_r4 === "high-contrast");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-blue-50", theme_r4 === "light")("text-blue-600", theme_r4 === "light")("group-hover-bg-blue-600", theme_r4 === "light")("group-hover-text-white", theme_r4 === "light")("bg-gray-700", theme_r4 === "dark")("text-blue-400", theme_r4 === "dark")("group-hover-bg-blue-500", theme_r4 === "dark")("border", theme_r4 === "high-contrast")("border-white", theme_r4 === "high-contrast")("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275classMap(tool_r5.icon);
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-gray-100", theme_r4 === "light")("text-gray-600", theme_r4 === "light")("bg-gray-700", theme_r4 === "dark")("text-gray-300", theme_r4 === "dark")("bg-black", theme_r4 === "high-contrast")("text-white", theme_r4 === "high-contrast")("border", theme_r4 === "high-contrast")("border-white", theme_r4 === "high-contrast");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-gray-900", theme_r4 === "light")("group-hover-text-blue-600", theme_r4 === "light")("text-white", theme_r4 !== "light")("group-hover-text-blue-400", theme_r4 === "dark");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tool_r5.name);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-gray-500", theme_r4 === "light")("text-gray-400", theme_r4 === "dark")("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(tool_r5.description);
    \u0275\u0275advance();
    \u0275\u0275classProp("group-hover-btn-primary", theme_r4 !== "high-contrast")("text-white", theme_r4 === "high-contrast")("border-white", theme_r4 === "high-contrast");
    \u0275\u0275property("href", tool_r5.loginUrl, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", ctx_r1.translations[lang_r3].btn_login, " ");
  }
}
function GsmComponent_For_139_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 93)(1, "span", 94);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r1 = \u0275\u0275nextContext(2);
    const lang_r3 = \u0275\u0275readContextLet(6);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(ctx_r1.translations[lang_r3].btn_view_services);
  }
}
function GsmComponent_For_139_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 70)(1, "div", 90)(2, "div", 91);
    \u0275\u0275element(3, "i", 92);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h3", 51);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(6, GsmComponent_For_139_Conditional_6_Template, 3, 1, "div", 93);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const brand_r6 = ctx.$implicit;
    \u0275\u0275nextContext();
    const theme_r4 = \u0275\u0275readContextLet(8);
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-gray-50", theme_r4 === "light")("border-gray-100", theme_r4 === "light")("hover-border-blue-500", theme_r4 === "light")("hover-shadow-lg", theme_r4 === "light")("bg-gray-900", theme_r4 === "dark")("border-gray-700", theme_r4 === "dark")("hover-border-blue-400", theme_r4 === "dark")("bg-black", theme_r4 === "high-contrast")("border-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275classProp("text-gray-400", theme_r4 === "light")("group-hover-text-blue-600", theme_r4 === "light")("text-gray-500", theme_r4 === "dark")("group-hover-text-blue-400", theme_r4 === "dark")("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-gray-700", theme_r4 === "light")("group-hover-text-blue-700", theme_r4 === "light")("text-gray-300", theme_r4 === "dark")("group-hover-text-blue-300", theme_r4 === "dark")("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(brand_r6.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(theme_r4 !== "high-contrast" ? 6 : -1);
  }
}
function GsmComponent_For_153_Conditional_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 102);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const download_r7 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275nextContext();
    const theme_r4 = \u0275\u0275readContextLet(8);
    \u0275\u0275classProp("text-gray-400", theme_r4 !== "high-contrast")("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(download_r7.description);
  }
}
function GsmComponent_For_153_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 95)(1, "div", 96)(2, "div", 97);
    \u0275\u0275element(3, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div")(5, "h3", 51);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 98);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()()();
    \u0275\u0275conditionalCreate(9, GsmComponent_For_153_Conditional_9_Template, 2, 5, "p", 99);
    \u0275\u0275elementStart(10, "a", 100);
    \u0275\u0275element(11, "i", 101);
    \u0275\u0275text(12);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const download_r7 = ctx.$implicit;
    const ctx_r1 = \u0275\u0275nextContext();
    const lang_r3 = \u0275\u0275readContextLet(6);
    const theme_r4 = \u0275\u0275readContextLet(8);
    \u0275\u0275classProp("bg-gray-800", theme_r4 !== "high-contrast")("border-gray-700", theme_r4 !== "high-contrast")("hover-border-gray-500", theme_r4 !== "high-contrast")("bg-black", theme_r4 === "high-contrast")("border-white", theme_r4 === "high-contrast");
    \u0275\u0275advance(2);
    \u0275\u0275classProp("bg-gray-700", theme_r4 !== "high-contrast")("text-blue-400", theme_r4 !== "high-contrast")("group-hover-text-white", theme_r4 !== "high-contrast")("bg-white", theme_r4 === "high-contrast")("text-black", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275classMap(download_r7.icon);
    \u0275\u0275advance(2);
    \u0275\u0275classProp("text-gray-200", theme_r4 !== "high-contrast")("group-hover-text-white", theme_r4 !== "high-contrast")("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(download_r7.name);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-white", theme_r4 === "high-contrast");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate(ctx_r1.translations[lang_r3].utility);
    \u0275\u0275advance();
    \u0275\u0275conditional(download_r7.description ? 9 : -1);
    \u0275\u0275advance();
    \u0275\u0275classProp("text-blue-400", theme_r4 !== "high-contrast")("hover-text-blue-300", theme_r4 !== "high-contrast")("text-white", theme_r4 === "high-contrast")("underline", theme_r4 === "high-contrast");
    \u0275\u0275property("href", download_r7.downloadUrl, \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", ctx_r1.translations[lang_r3].btn_download, " ");
  }
}
var GsmComponent = class _GsmComponent {
  titleService;
  metaService;
  preferencesService;
  gsmService;
  gsmTools = [];
  brandServices = [];
  downloads = [];
  whatsappUrl = "https://wa.me/541125960900?text=Hola,%20necesito%20ayuda%20con%20herramientas%20GSM";
  // Translations
  translations = {
    es: {
      badge: "Plataforma Profesional GSM",
      title_sub: "Herramientas & Licencias",
      description: "Plataforma integral para t\xE9cnicos GSM, FRP y licencias digitales. Soluciones profesionales al alcance de un clic.",
      btn_whatsapp: "Soporte WhatsApp",
      btn_tools: "Ver Herramientas",
      offer_badge: "Oferta Activada",
      offer_desc: "Descuento exclusivo por tiempo limitado",
      region: "Regi\xF3n",
      mac_support: "Podemos hacerlo en una MAC",
      btn_offer: "Ver Oferta",
      calc_title: "Conversor R\xE1pido",
      calc_desc: "Calcul\xE1 tus operaciones de manera transparente y segura.",
      calc_label: "Calculadora USDT",
      calc_sub: "Cotizaci\xF3n en tiempo real",
      input_label: "Cantidad USDT",
      btn_calc: "CALCULAR TOTAL",
      total_est: "Total Estimado (ARS)",
      cot_ref: "Cotizaci\xF3n ref",
      tools_title: "Herramientas GSM & Licencias",
      tools_desc: "Software profesional para desbloqueo, flasheo y reparaci\xF3n de dispositivos m\xF3viles.",
      btn_login: "Inicia sesi\xF3n",
      brands_title: "Cat\xE1logo de Servicios",
      brands_desc: "Selecciona una marca para ver los servicios disponibles",
      btn_view_services: "Ver Servicios",
      downloads_title: "Descargas \xDAtiles",
      downloads_desc: "Drivers y herramientas esenciales para tu taller.",
      btn_view_all: "Ver todo",
      btn_download: "Descargar ahora",
      utility: "Utilidad",
      days: "D\xEDas",
      hours: "Hs",
      min: "Min",
      sec: "Seg"
    },
    en: {
      badge: "Professional GSM Platform",
      title_sub: "Tools & Licenses",
      description: "Comprehensive platform for GSM technicians, FRP, and digital licenses. Professional solutions just a click away.",
      btn_whatsapp: "WhatsApp Support",
      btn_tools: "View Tools",
      offer_badge: "Offer Activated",
      offer_desc: "Exclusive discount for a limited time",
      region: "Region",
      mac_support: "We can do it on a MAC",
      btn_offer: "View Offer",
      calc_title: "Quick Converter",
      calc_desc: "Calculate your operations transparently and securely.",
      calc_label: "USDT Calculator",
      calc_sub: "Real-time quotation",
      input_label: "USDT Amount",
      btn_calc: "CALCULATE TOTAL",
      total_est: "Estimated Total (ARS)",
      cot_ref: "Ref quote",
      tools_title: "GSM Tools & Licenses",
      tools_desc: "Professional software for unlocking, flashing, and repairing mobile devices.",
      btn_login: "Login",
      brands_title: "Service Catalog",
      brands_desc: "Select a brand to view available services",
      btn_view_services: "View Services",
      downloads_title: "Useful Downloads",
      downloads_desc: "Essential drivers and tools for your workshop.",
      btn_view_all: "View all",
      btn_download: "Download now",
      utility: "Utility",
      days: "Days",
      hours: "Hrs",
      min: "Min",
      sec: "Sec"
    }
  };
  constructor(titleService, metaService, preferencesService, gsmService) {
    this.titleService = titleService;
    this.metaService = metaService;
    this.preferencesService = preferencesService;
    this.gsmService = gsmService;
  }
  // Calculator
  usdtAmount = null;
  usdtRate = 1240;
  // Example rate, could be dynamic
  usdtTotal = null;
  // Countdown
  countdown = {
    days: 5,
    hours: 9,
    minutes: 8,
    seconds: 19
  };
  countdownInterval;
  ngOnInit() {
    this.titleService.setTitle("Herramientas GSM Profesionales - Licencias Digitales | ARECOFIX");
    this.metaService.addTags([
      { name: "description", content: "Plataforma integral para t\xE9cnicos GSM con herramientas profesionales, licencias digitales, servicios FRP y descargas \xFAtiles. ARECOFIX - Tu socio en reparaci\xF3n de m\xF3viles." },
      { name: "keywords", content: "GSM, herramientas GSM, FRP, licencias digitales, reparaci\xF3n m\xF3viles, Octoplus, SigmaKey, UMT Pro, desbloqueo, flasheo, t\xE9cnicos m\xF3viles" },
      { name: "author", content: "ARECOFIX" },
      { property: "og:title", content: "Herramientas GSM Profesionales | ARECOFIX" },
      { property: "og:description", content: "Accede a las mejores herramientas GSM, licencias digitales y recursos para t\xE9cnicos profesionales." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "https://arecofix.com.ar/#/gsm" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Herramientas GSM Profesionales | ARECOFIX" },
      { name: "twitter:description", content: "Plataforma integral para t\xE9cnicos GSM con herramientas profesionales y licencias digitales." }
    ]);
    this.loadData();
    this.startCountdown();
  }
  loadData() {
    this.gsmService.getGsmTools().subscribe((data) => this.gsmTools = data);
    this.gsmService.getBrandServices().subscribe((data) => this.brandServices = data);
    this.gsmService.getDownloads().subscribe((data) => this.downloads = data);
  }
  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }
  calculateUsdt() {
    if (this.usdtAmount) {
      this.usdtTotal = this.usdtAmount * this.usdtRate;
    } else {
      this.usdtTotal = null;
    }
  }
  startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.countdown.seconds > 0) {
        this.countdown.seconds--;
      } else {
        this.countdown.seconds = 59;
        if (this.countdown.minutes > 0) {
          this.countdown.minutes--;
        } else {
          this.countdown.minutes = 59;
          if (this.countdown.hours > 0) {
            this.countdown.hours--;
          } else {
            this.countdown.hours = 23;
            if (this.countdown.days > 0) {
              this.countdown.days--;
            } else {
              this.countdown = { days: 5, hours: 9, minutes: 8, seconds: 19 };
            }
          }
        }
      }
    }, 1e3);
  }
  static \u0275fac = function GsmComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _GsmComponent)(\u0275\u0275directiveInject(Title), \u0275\u0275directiveInject(Meta), \u0275\u0275directiveInject(PreferencesService), \u0275\u0275directiveInject(GsmService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _GsmComponent, selectors: [["app-gsm"]], decls: 154, vars: 354, consts: [[1, "min-h-screen", "font-sans", "transition-colors", "duration-300"], [1, "relative", "overflow-hidden", "transition-colors", "duration-300"], [1, "absolute", "top-0", "left-0", "w-full", "h-full", "overflow-hidden", "opacity-20", "pointer-events-none"], [1, "container", "mx-auto", "px-4", "py-12", "lg:py-20", "relative", "z-10"], [1, "text-sm", "breadcrumbs", "mb-6"], ["routerLink", "/", 1, "hover:underline"], [1, "font-semibold"], [1, "flex", "flex-col", "lg:flex-row", "items-center", "gap-12"], [1, "lg:w-1/2", "text-center", "lg:text-left", "space-y-6"], [1, "inline-flex", "items-center", "gap-2", "px-4", "py-2", "rounded-full", "border", "text-sm", "font-medium", "backdrop-blur-sm"], [1, "fas", "fa-microchip"], [1, "text-4xl", "lg:text-6xl", "font-bold", "leading-tight"], [1, "text-transparent", "bg-clip-text", "bg-linear-to-r", "from-blue-400", "to-purple-400"], [1, "text-2xl", "lg:text-3xl", "font-normal"], [1, "text-lg", "max-w-xl", "mx-auto", "lg:mx-0"], [1, "flex", "flex-wrap", "justify-center", "lg:justify-start", "gap-4"], ["target", "_blank", 1, "btn", "btn-lg", "gap-2", "border-none", "text-white", "transition-all", 3, "href"], [1, "fab", "fa-whatsapp", "text-xl"], ["href", "#tools", 1, "btn", "btn-ghost", "btn-lg", "gap-2", "text-white", "hover:bg-white/10"], [1, "fas", "fa-tools"], ["routerLink", "/fixtecnicos", 1, "btn", "btn-ghost", "btn-lg", "gap-2", "text-white", "hover:bg-white/10"], [1, "fas", "fa-users"], [1, "lg:w-1/2", "w-full", "max-w-md"], [1, "backdrop-blur-md", "border", "rounded-2xl", "p-6", "lg:p-8", "shadow-2xl", "relative", "overflow-hidden", "group", "transition-all", "duration-300"], [1, "absolute", "top-0", "-left-full", "w-full", "h-full", "bg-linear-to-r", "from-transparent", "via-white/10", "to-transparent", "transform", "-skew-x-12", "group-hover:animate-shine", "transition-all"], [1, "flex", "justify-between", "items-start", "mb-6"], [1, "px-3", "py-1", "rounded", "text-xs", "font-bold", "uppercase", "tracking-wider", "animate-pulse"], [1, "text-2xl", "font-bold", "mt-2", "text-white"], [1, "text-sm"], [1, "text-right"], [1, "text-xs", "uppercase", "tracking-wider"], [1, "font-bold", "text-white"], [1, "grid", "grid-cols-4", "gap-2", "mb-6"], [1, "rounded-lg", "p-2", "text-center", "border"], [1, "text-2xl", "font-bold", "font-mono", "text-white"], [1, "text-[10px]", "uppercase"], [1, "text-2xl", "font-bold", "font-mono"], [1, "space-y-4"], [1, "flex", "items-center", "gap-3", "text-sm", "p-3", "rounded-lg"], [1, "fab", "fa-apple", "text-xl"], [1, "btn", "btn-block", "border-none", "font-bold"], [1, "fas", "fa-arrow-right", "ml-2"], [1, "py-12", "border-b", "transition-colors", "duration-300"], [1, "container", "mx-auto", "px-4"], [1, "max-w-4xl", "mx-auto", "rounded-2xl", "shadow-xl", "border", "overflow-hidden", "flex", "flex-col", "md:flex-row"], [1, "md:w-1/2", "p-8", "text-white", "flex", "flex-col", "justify-center"], [1, "text-2xl", "font-bold", "mb-2"], [1, "mb-6"], [1, "flex", "items-center", "gap-4"], [1, "w-12", "h-12", "rounded-full", "flex", "items-center", "justify-center", "text-2xl"], [1, "fas", "fa-calculator"], [1, "font-bold"], [1, "md:w-1/2", "p-8"], [1, "form-control", "mb-4"], [1, "label"], [1, "label-text", "font-medium"], [1, "relative"], ["type", "number", "placeholder", "Ej: 100", 1, "input", "input-bordered", "w-full", "pl-10", 3, "ngModelChange", "ngModel"], [1, "absolute", "left-3", "top-1/2", "-translate-y-1/2", "text-gray-400"], [1, "fas", "fa-dollar-sign"], [1, "btn", "btn-primary", "w-full", "mb-6", 3, "click"], [1, "rounded-xl", "p-4", "text-center", "border", "animate-fade-in", 3, "bg-gray-50", "border-gray-200", "bg-gray-800", "border-gray-700", "bg-black", "border-white"], ["id", "tools", 1, "py-16", "transition-colors", "duration-300"], [1, "text-center", "mb-12"], [1, "text-3xl", "font-bold", "mb-4"], [1, "max-w-2xl", "mx-auto"], [1, "grid", "grid-cols-1", "sm:grid-cols-2", "lg:grid-cols-3", "gap-6"], [1, "rounded-xl", "p-6", "shadow-sm", "hover:shadow-xl", "transition-all", "duration-300", "border", "group", 3, "bg-white", "border-gray-100", "bg-gray-800", "border-gray-700", "bg-black", "border-white"], [1, "py-16", "transition-colors", "duration-300"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "lg:grid-cols-6", "gap-4"], [1, "group", "cursor-pointer"], [1, "py-16", "text-white", "transition-colors", "duration-300"], [1, "flex", "flex-col", "md:flex-row", "justify-between", "items-end", "mb-12", "gap-6"], [1, "text-gray-400"], [1, "btn", "btn-outline", "text-white", "hover:bg-white", "hover:text-gray-900"], [1, "grid", "grid-cols-1", "md:grid-cols-2", "lg:grid-cols-4", "gap-6"], [1, "rounded-xl", "p-6", "border", "transition-colors", "group", 3, "bg-gray-800", "border-gray-700", "hover-border-gray-500", "bg-black", "border-white"], [1, "absolute", "top-[-10%]", "left-[-10%]", "w-96", "h-96", "bg-blue-500", "rounded-full", "blur-3xl"], [1, "absolute", "bottom-[-10%]", "right-[-10%]", "w-96", "h-96", "bg-purple-500", "rounded-full", "blur-3xl"], [1, "rounded-xl", "p-4", "text-center", "border", "animate-fade-in"], [1, "text-sm", "mb-1"], [1, "text-3xl", "font-bold"], [1, "text-xs", "mt-1"], [1, "rounded-xl", "p-6", "shadow-sm", "hover:shadow-xl", "transition-all", "duration-300", "border", "group"], [1, "flex", "items-start", "justify-between", "mb-4"], [1, "w-12", "h-12", "rounded-lg", "flex", "items-center", "justify-center", "text-xl", "transition-colors"], [1, "px-2", "py-1", "text-xs", "rounded", "font-medium"], [1, "text-xl", "font-bold", "mb-2", "transition-colors"], [1, "text-sm", "mb-6", "line-clamp-2"], [1, "btn", "btn-outline", "btn-sm", "w-full", 3, "href"], [1, "rounded-xl", "p-6", "text-center", "border", "transition-all", "duration-300", "relative", "overflow-hidden"], [1, "text-3xl", "mb-3", "transition-colors"], [1, "fas", "fa-mobile-alt"], [1, "absolute", "inset-0", "bg-blue-600/90", "flex", "items-center", "justify-center", "opacity-0", "group-hover:opacity-100", "transition-opacity", "duration-300"], [1, "text-white", "font-bold", "text-sm"], [1, "rounded-xl", "p-6", "border", "transition-colors", "group"], [1, "flex", "items-center", "gap-4", "mb-4"], [1, "w-10", "h-10", "rounded", "flex", "items-center", "justify-center", "transition-colors"], [1, "text-xs", "text-gray-500"], [1, "text-sm", "mb-4", "line-clamp-2", 3, "text-gray-400", "text-white"], [1, "flex", "items-center", "text-sm", "font-medium", "transition-colors", 3, "href"], [1, "fas", "fa-download", "mr-2"], [1, "text-sm", "mb-4", "line-clamp-2"]], template: function GsmComponent_Template(rf, ctx) {
    if (rf & 1) {
      const _r1 = \u0275\u0275getCurrentView();
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275pipe(1, "async");
      \u0275\u0275pipe(2, "async");
      \u0275\u0275pipe(3, "async");
      \u0275\u0275pipe(4, "async");
      \u0275\u0275pipe(5, "async");
      \u0275\u0275declareLet(6);
      \u0275\u0275pipe(7, "async");
      \u0275\u0275declareLet(8);
      \u0275\u0275pipe(9, "async");
      \u0275\u0275elementStart(10, "section", 1);
      \u0275\u0275conditionalCreate(11, GsmComponent_Conditional_11_Template, 3, 0, "div", 2);
      \u0275\u0275elementStart(12, "div", 3)(13, "div", 4)(14, "ul")(15, "li")(16, "a", 5);
      \u0275\u0275text(17, "Inicio");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(18, "li", 6);
      \u0275\u0275text(19);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(20, "div", 7)(21, "div", 8)(22, "div", 9);
      \u0275\u0275element(23, "i", 10);
      \u0275\u0275elementStart(24, "span");
      \u0275\u0275text(25);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(26, "h1", 11)(27, "span", 12);
      \u0275\u0275text(28, "ARECOFIX");
      \u0275\u0275elementEnd();
      \u0275\u0275element(29, "br");
      \u0275\u0275elementStart(30, "span", 13);
      \u0275\u0275text(31);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(32, "p", 14);
      \u0275\u0275text(33);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(34, "div", 15)(35, "a", 16);
      \u0275\u0275element(36, "i", 17);
      \u0275\u0275text(37);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(38, "a", 18);
      \u0275\u0275element(39, "i", 19);
      \u0275\u0275text(40);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(41, "a", 20);
      \u0275\u0275element(42, "i", 21);
      \u0275\u0275text(43, " Ir a Fixtecnicos ");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(44, "div", 22)(45, "div", 23);
      \u0275\u0275conditionalCreate(46, GsmComponent_Conditional_46_Template, 1, 0, "div", 24);
      \u0275\u0275elementStart(47, "div", 25)(48, "div")(49, "span", 26);
      \u0275\u0275text(50);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(51, "h3", 27);
      \u0275\u0275text(52, "BYPASS IPHONE");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "p", 28);
      \u0275\u0275text(54);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(55, "div", 29)(56, "div", 30);
      \u0275\u0275text(57);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(58, "div", 31);
      \u0275\u0275text(59, "CH/A-L (CHINA)");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(60, "div", 32)(61, "div", 33)(62, "div", 34);
      \u0275\u0275text(63);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "div", 35);
      \u0275\u0275text(65);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(66, "div", 33)(67, "div", 34);
      \u0275\u0275text(68);
      \u0275\u0275pipe(69, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(70, "div", 35);
      \u0275\u0275text(71);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(72, "div", 33)(73, "div", 34);
      \u0275\u0275text(74);
      \u0275\u0275pipe(75, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "div", 35);
      \u0275\u0275text(77);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(78, "div", 33)(79, "div", 36);
      \u0275\u0275text(80);
      \u0275\u0275pipe(81, "number");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(82, "div", 35);
      \u0275\u0275text(83);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(84, "div", 37)(85, "div", 38);
      \u0275\u0275element(86, "i", 39);
      \u0275\u0275elementStart(87, "span");
      \u0275\u0275text(88);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(89, "button", 40);
      \u0275\u0275text(90);
      \u0275\u0275element(91, "i", 41);
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275elementStart(92, "section", 42)(93, "div", 43)(94, "div", 44)(95, "div", 45)(96, "h2", 46);
      \u0275\u0275text(97);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(98, "p", 47);
      \u0275\u0275text(99);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(100, "div", 48)(101, "div", 49);
      \u0275\u0275element(102, "i", 50);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(103, "div")(104, "div", 51);
      \u0275\u0275text(105);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(106, "div", 28);
      \u0275\u0275text(107);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(108, "div", 52)(109, "div", 53)(110, "label", 54)(111, "span", 55);
      \u0275\u0275text(112);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(113, "div", 56)(114, "input", 57);
      \u0275\u0275twoWayListener("ngModelChange", function GsmComponent_Template_input_ngModelChange_114_listener($event) {
        \u0275\u0275restoreView(_r1);
        \u0275\u0275twoWayBindingSet(ctx.usdtAmount, $event) || (ctx.usdtAmount = $event);
        return \u0275\u0275resetView($event);
      });
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(115, "div", 58);
      \u0275\u0275element(116, "i", 59);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(117, "button", 60);
      \u0275\u0275listener("click", function GsmComponent_Template_button_click_117_listener() {
        \u0275\u0275restoreView(_r1);
        return \u0275\u0275resetView(ctx.calculateUsdt());
      });
      \u0275\u0275text(118);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(119, GsmComponent_Conditional_119_Template, 8, 33, "div", 61);
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(120, "section", 62)(121, "div", 43)(122, "div", 63)(123, "h2", 64);
      \u0275\u0275text(124);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(125, "p", 65);
      \u0275\u0275text(126);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(127, "div", 66);
      \u0275\u0275repeaterCreate(128, GsmComponent_For_129_Template, 13, 74, "div", 67, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(130, "section", 68)(131, "div", 43)(132, "div", 63)(133, "h2", 64);
      \u0275\u0275text(134);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(135, "p");
      \u0275\u0275text(136);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(137, "div", 69);
      \u0275\u0275repeaterCreate(138, GsmComponent_For_139_Template, 7, 40, "div", 70, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(140, "section", 71)(141, "div", 43)(142, "div", 72)(143, "div")(144, "h2", 64);
      \u0275\u0275text(145);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(146, "p", 73);
      \u0275\u0275text(147);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(148, "button", 74);
      \u0275\u0275text(149);
      \u0275\u0275element(150, "i", 41);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(151, "div", 75);
      \u0275\u0275repeaterCreate(152, GsmComponent_For_153_Template, 13, 43, "div", 76, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()()()();
    }
    if (rf & 2) {
      \u0275\u0275classProp("bg-gray-50", \u0275\u0275pipeBind1(1, 329, ctx.preferencesService.theme$) === "light")("bg-gray-900", \u0275\u0275pipeBind1(2, 331, ctx.preferencesService.theme$) === "dark")("bg-black", \u0275\u0275pipeBind1(3, 333, ctx.preferencesService.theme$) === "high-contrast")("text-gray-900", \u0275\u0275pipeBind1(4, 335, ctx.preferencesService.theme$) === "light")("text-white", \u0275\u0275pipeBind1(5, 337, ctx.preferencesService.theme$) !== "light");
      \u0275\u0275advance(6);
      const lang_r8 = \u0275\u0275storeLet(\u0275\u0275pipeBind1(7, 339, ctx.preferencesService.language$) || "es");
      \u0275\u0275advance(2);
      const theme_r9 = \u0275\u0275storeLet(\u0275\u0275pipeBind1(9, 342, ctx.preferencesService.theme$) || "light");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-linear-to-br", theme_r9 === "dark")("from-gray-900", theme_r9 === "dark")("via-blue-900", theme_r9 === "dark")("to-gray-900", theme_r9 === "dark")("bg-blue-600", theme_r9 === "light")("bg-black", theme_r9 === "high-contrast")("text-white", true);
      \u0275\u0275advance();
      \u0275\u0275conditional(theme_r9 !== "high-contrast" ? 11 : -1);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("text-blue-100", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].badge);
      \u0275\u0275advance(3);
      \u0275\u0275classProp("bg-blue-500-20", theme_r9 !== "high-contrast")("border-blue-500-30", theme_r9 !== "high-contrast")("text-blue-300", theme_r9 !== "high-contrast")("bg-white", theme_r9 === "high-contrast")("text-black", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].badge);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("text-white", theme_r9 === "high-contrast")("bg-none", theme_r9 === "high-contrast");
      \u0275\u0275advance(3);
      \u0275\u0275classProp("text-gray-300", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].title_sub);
      \u0275\u0275advance();
      \u0275\u0275classProp("text-gray-400", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.translations[lang_r8].description, " ");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-linear-to-r", theme_r9 !== "high-contrast")("from-blue-600", theme_r9 !== "high-contrast")("to-blue-500", theme_r9 !== "high-contrast")("hover-from-blue-700", theme_r9 !== "high-contrast")("hover-to-blue-600", theme_r9 !== "high-contrast")("shadow-lg", theme_r9 !== "high-contrast")("shadow-blue-500-20", theme_r9 !== "high-contrast")("bg-white", theme_r9 === "high-contrast")("text-black", theme_r9 === "high-contrast")("border-2", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275property("href", ctx.whatsappUrl, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.translations[lang_r8].btn_whatsapp, " ");
      \u0275\u0275advance();
      \u0275\u0275classProp("border", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.translations[lang_r8].btn_tools, " ");
      \u0275\u0275advance();
      \u0275\u0275classProp("border", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(4);
      \u0275\u0275classProp("bg-white-10", theme_r9 !== "high-contrast")("border-white-20", theme_r9 !== "high-contrast")("hover-border-white-30", theme_r9 !== "high-contrast")("bg-black", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast")("border-2", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275conditional(theme_r9 !== "high-contrast" ? 46 : -1);
      \u0275\u0275advance(3);
      \u0275\u0275classProp("bg-red-500", theme_r9 !== "high-contrast")("text-white", true)("bg-white", theme_r9 === "high-contrast")("text-black", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.translations[lang_r8].offer_badge, " ");
      \u0275\u0275advance(3);
      \u0275\u0275classProp("text-blue-200", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].offer_desc);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("text-gray-400", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].region);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("bg-black-40", theme_r9 !== "high-contrast")("border-white-10", theme_r9 !== "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.countdown.days);
      \u0275\u0275advance();
      \u0275\u0275classProp("text-gray-400", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].days);
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-black-40", theme_r9 !== "high-contrast")("border-white-10", theme_r9 !== "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(69, 345, ctx.countdown.hours, "2.0"));
      \u0275\u0275advance(2);
      \u0275\u0275classProp("text-gray-400", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].hours);
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-black-40", theme_r9 !== "high-contrast")("border-white-10", theme_r9 !== "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(75, 348, ctx.countdown.minutes, "2.0"));
      \u0275\u0275advance(2);
      \u0275\u0275classProp("text-gray-400", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].min);
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-black-40", theme_r9 !== "high-contrast")("border-white-10", theme_r9 !== "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275classProp("text-red-400", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(81, 351, ctx.countdown.seconds, "2.0"));
      \u0275\u0275advance(2);
      \u0275\u0275classProp("text-gray-400", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].sec);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("text-gray-300", theme_r9 !== "high-contrast")("bg-black-20", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast")("border", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(3);
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].mac_support);
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-white", theme_r9 !== "high-contrast")("text-blue-900", theme_r9 !== "high-contrast")("hover-bg-gray-100", theme_r9 !== "high-contrast")("bg-black", theme_r9 === "high-contrast")("text-white", theme_r9 === "high-contrast")("border-2", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.translations[lang_r8].btn_offer, " ");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-white", theme_r9 === "light")("border-gray-200", theme_r9 === "light")("bg-gray-800", theme_r9 === "dark")("border-gray-700", theme_r9 === "dark")("bg-black", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-white", theme_r9 === "light")("border-gray-100", theme_r9 === "light")("bg-gray-900", theme_r9 === "dark")("border-gray-700", theme_r9 === "dark")("bg-black", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-blue-600", theme_r9 === "light")("bg-blue-900", theme_r9 === "dark")("bg-black", theme_r9 === "high-contrast")("border-r", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].calc_title);
      \u0275\u0275advance();
      \u0275\u0275classProp("text-blue-100", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].calc_desc);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-white-20", theme_r9 !== "high-contrast")("border", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance(4);
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].calc_label);
      \u0275\u0275advance();
      \u0275\u0275classProp("text-blue-200", theme_r9 !== "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].calc_sub);
      \u0275\u0275advance(4);
      \u0275\u0275classProp("text-gray-700", theme_r9 === "light")("text-gray-300", theme_r9 === "dark")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].input_label);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-white", theme_r9 === "light")("text-gray-900", theme_r9 === "light")("bg-gray-800", theme_r9 === "dark")("text-white", theme_r9 === "dark")("border-gray-600", theme_r9 === "dark")("bg-black", theme_r9 === "high-contrast")("text-white", theme_r9 === "high-contrast")("border-white", theme_r9 === "high-contrast");
      \u0275\u0275twoWayProperty("ngModel", ctx.usdtAmount);
      \u0275\u0275advance(3);
      \u0275\u0275classProp("btn-outline", theme_r9 === "high-contrast")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.translations[lang_r8].btn_calc, " ");
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.usdtTotal !== null ? 119 : -1);
      \u0275\u0275advance();
      \u0275\u0275classProp("bg-gray-50", theme_r9 === "light")("bg-gray-900", theme_r9 === "dark")("bg-black", theme_r9 === "high-contrast");
      \u0275\u0275advance(3);
      \u0275\u0275classProp("text-gray-900", theme_r9 === "light")("text-white", theme_r9 !== "light");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].tools_title);
      \u0275\u0275advance();
      \u0275\u0275classProp("text-gray-600", theme_r9 === "light")("text-gray-400", theme_r9 === "dark")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.translations[lang_r8].tools_desc, " ");
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.gsmTools);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-white", theme_r9 === "light")("bg-gray-800", theme_r9 === "dark")("bg-black", theme_r9 === "high-contrast");
      \u0275\u0275advance(3);
      \u0275\u0275classProp("text-gray-900", theme_r9 === "light")("text-white", theme_r9 !== "light");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].brands_title);
      \u0275\u0275advance();
      \u0275\u0275classProp("text-gray-600", theme_r9 === "light")("text-gray-400", theme_r9 === "dark")("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].brands_desc);
      \u0275\u0275advance(2);
      \u0275\u0275repeater(ctx.brandServices);
      \u0275\u0275advance(2);
      \u0275\u0275classProp("bg-gray-900", theme_r9 !== "high-contrast")("bg-black", theme_r9 === "high-contrast");
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].downloads_title);
      \u0275\u0275advance();
      \u0275\u0275classProp("text-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate(ctx.translations[lang_r8].downloads_desc);
      \u0275\u0275advance();
      \u0275\u0275classProp("border-white", theme_r9 === "high-contrast");
      \u0275\u0275advance();
      \u0275\u0275textInterpolate1(" ", ctx.translations[lang_r8].btn_view_all, " ");
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.downloads);
    }
  }, dependencies: [CommonModule, FormsModule, DefaultValueAccessor, NumberValueAccessor, NgControlStatus, NgModel, RouterLink, AsyncPipe, DecimalPipe], styles: ["\n\n@keyframes _ngcontent-%COMP%_shine {\n  100% {\n    left: 125%;\n  }\n}\n.animate-shine[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_shine 1s;\n}\n.animate-fade-in[_ngcontent-%COMP%] {\n  animation: _ngcontent-%COMP%_fadeIn 0.5s ease-out forwards;\n}\n@keyframes _ngcontent-%COMP%_fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\nhtml[_ngcontent-%COMP%] {\n  scroll-behavior: smooth;\n}\n/*# sourceMappingURL=gsm.component.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(GsmComponent, [{
    type: Component,
    args: [{ selector: "app-gsm", standalone: true, imports: [CommonModule, FormsModule, RouterLink], template: `<div class="min-h-screen font-sans transition-colors duration-300"\r
  [class.bg-gray-50]="(preferencesService.theme$ | async) === 'light'"\r
  [class.bg-gray-900]="(preferencesService.theme$ | async) === 'dark'"\r
  [class.bg-black]="(preferencesService.theme$ | async) === 'high-contrast'"\r
  [class.text-gray-900]="(preferencesService.theme$ | async) === 'light'"\r
  [class.text-white]="(preferencesService.theme$ | async) !== 'light'">\r
  \r
  @let lang = (preferencesService.language$ | async) || 'es';\r
  @let theme = (preferencesService.theme$ | async) || 'light';\r
\r
  <!-- Hero Section -->\r
  <section class="relative overflow-hidden transition-colors duration-300"\r
    [class.bg-linear-to-br]="theme === 'dark'"\r
    [class.from-gray-900]="theme === 'dark'"\r
    [class.via-blue-900]="theme === 'dark'"\r
    [class.to-gray-900]="theme === 'dark'"\r
    [class.bg-blue-600]="theme === 'light'"\r
    [class.bg-black]="theme === 'high-contrast'"\r
    [class.text-white]="true">\r
    \r
    <!-- Background Decoration -->\r
    @if (theme !== 'high-contrast') {\r
      <div class="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">\r
        <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-blue-500 rounded-full blur-3xl"></div>\r
        <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-purple-500 rounded-full blur-3xl"></div>\r
      </div>\r
    }\r
\r
    <div class="container mx-auto px-4 py-12 lg:py-20 relative z-10">\r
      <div class="text-sm breadcrumbs mb-6"\r
           [class.text-blue-100]="theme !== 'high-contrast'"\r
           [class.text-white]="theme === 'high-contrast'">\r
          <ul>\r
              <li><a routerLink="/" class="hover:underline">Inicio</a></li>\r
              <li class="font-semibold">{{ translations[lang].badge }}</li>\r
          </ul>\r
      </div>\r
\r
      <div class="flex flex-col lg:flex-row items-center gap-12">\r
        \r
        <!-- Hero Content (Left) -->\r
        <div class="lg:w-1/2 text-center lg:text-left space-y-6">\r
          <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium backdrop-blur-sm"\r
            [class.bg-blue-500-20]="theme !== 'high-contrast'"\r
            [class.border-blue-500-30]="theme !== 'high-contrast'"\r
            [class.text-blue-300]="theme !== 'high-contrast'"\r
            [class.bg-white]="theme === 'high-contrast'"\r
            [class.text-black]="theme === 'high-contrast'"\r
            [class.border-white]="theme === 'high-contrast'">\r
            <i class="fas fa-microchip"></i>\r
            <span>{{ translations[lang].badge }}</span>\r
          </div>\r
          \r
          <h1 class="text-4xl lg:text-6xl font-bold leading-tight">\r
            <span class="text-transparent bg-clip-text bg-linear-to-r from-blue-400 to-purple-400"\r
              [class.text-white]="theme === 'high-contrast'"\r
              [class.bg-none]="theme === 'high-contrast'">ARECOFIX</span>\r
            <br>\r
            <span class="text-2xl lg:text-3xl font-normal"\r
              [class.text-gray-300]="theme !== 'high-contrast'"\r
              [class.text-white]="theme === 'high-contrast'">{{ translations[lang].title_sub }}</span>\r
          </h1>\r
          \r
          <p class="text-lg max-w-xl mx-auto lg:mx-0"\r
            [class.text-gray-400]="theme !== 'high-contrast'"\r
            [class.text-white]="theme === 'high-contrast'">\r
            {{ translations[lang].description }}\r
          </p>\r
          \r
          <div class="flex flex-wrap justify-center lg:justify-start gap-4">\r
            <a [href]="whatsappUrl" target="_blank" class="btn btn-lg gap-2 border-none text-white transition-all"\r
               [class.bg-linear-to-r]="theme !== 'high-contrast'"\r
               [class.from-blue-600]="theme !== 'high-contrast'"\r
               [class.to-blue-500]="theme !== 'high-contrast'"\r
               [class.hover-from-blue-700]="theme !== 'high-contrast'"\r
               [class.hover-to-blue-600]="theme !== 'high-contrast'"\r
               [class.shadow-lg]="theme !== 'high-contrast'"\r
               [class.shadow-blue-500-20]="theme !== 'high-contrast'"\r
               [class.bg-white]="theme === 'high-contrast'"\r
               [class.text-black]="theme === 'high-contrast'"\r
               [class.border-2]="theme === 'high-contrast'"\r
               [class.border-white]="theme === 'high-contrast'">\r
              <i class="fab fa-whatsapp text-xl"></i>\r
              {{ translations[lang].btn_whatsapp }}\r
            </a>\r
            <a href="#tools" class="btn btn-ghost btn-lg gap-2 text-white hover:bg-white/10"\r
               [class.border]="theme === 'high-contrast'"\r
               [class.border-white]="theme === 'high-contrast'">\r
              <i class="fas fa-tools"></i>\r
              {{ translations[lang].btn_tools }}\r
            </a>\r
            <a routerLink="/fixtecnicos" class="btn btn-ghost btn-lg gap-2 text-white hover:bg-white/10"\r
               [class.border]="theme === 'high-contrast'"\r
               [class.border-white]="theme === 'high-contrast'">\r
              <i class="fas fa-users"></i>\r
              Ir a Fixtecnicos\r
            </a>\r
          </div>\r
        </div>\r
\r
        <!-- Offer Card (Right) -->\r
        <div class="lg:w-1/2 w-full max-w-md">\r
          <div class="backdrop-blur-md border rounded-2xl p-6 lg:p-8 shadow-2xl relative overflow-hidden group transition-all duration-300"\r
            [class.bg-white-10]="theme !== 'high-contrast'"\r
            [class.border-white-20]="theme !== 'high-contrast'"\r
            [class.hover-border-white-30]="theme !== 'high-contrast'"\r
            [class.bg-black]="theme === 'high-contrast'"\r
            [class.border-white]="theme === 'high-contrast'"\r
            [class.border-2]="theme === 'high-contrast'">\r
            \r
            <!-- Shine Effect -->\r
            @if (theme !== 'high-contrast') {\r
              <div class="absolute top-0 -left-full w-full h-full bg-linear-to-r from-transparent via-white/10 to-transparent transform -skew-x-12 group-hover:animate-shine transition-all"></div>\r
            }\r
\r
            <div class="flex justify-between items-start mb-6">\r
              <div>\r
                <span class="px-3 py-1 rounded text-xs font-bold uppercase tracking-wider animate-pulse"\r
                  [class.bg-red-500]="theme !== 'high-contrast'"\r
                  [class.text-white]="true"\r
                  [class.bg-white]="theme === 'high-contrast'"\r
                  [class.text-black]="theme === 'high-contrast'">\r
                  {{ translations[lang].offer_badge }}\r
                </span>\r
                <h3 class="text-2xl font-bold mt-2 text-white">BYPASS IPHONE</h3>\r
                <p class="text-sm"\r
                  [class.text-blue-200]="theme !== 'high-contrast'"\r
                  [class.text-white]="theme === 'high-contrast'">{{ translations[lang].offer_desc }}</p>\r
              </div>\r
              <div class="text-right">\r
                <div class="text-xs uppercase tracking-wider"\r
                  [class.text-gray-400]="theme !== 'high-contrast'"\r
                  [class.text-white]="theme === 'high-contrast'">{{ translations[lang].region }}</div>\r
                <div class="font-bold text-white">CH/A-L (CHINA)</div>\r
              </div>\r
            </div>\r
\r
            <!-- Countdown -->\r
            <div class="grid grid-cols-4 gap-2 mb-6">\r
              <div class="rounded-lg p-2 text-center border"\r
                [class.bg-black-40]="theme !== 'high-contrast'"\r
                [class.border-white-10]="theme !== 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'">\r
                <div class="text-2xl font-bold font-mono text-white">{{ countdown.days }}</div>\r
                <div class="text-[10px] uppercase"\r
                  [class.text-gray-400]="theme !== 'high-contrast'"\r
                  [class.text-white]="theme === 'high-contrast'">{{ translations[lang].days }}</div>\r
              </div>\r
              <div class="rounded-lg p-2 text-center border"\r
                [class.bg-black-40]="theme !== 'high-contrast'"\r
                [class.border-white-10]="theme !== 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'">\r
                <div class="text-2xl font-bold font-mono text-white">{{ countdown.hours | number:'2.0' }}</div>\r
                <div class="text-[10px] uppercase"\r
                  [class.text-gray-400]="theme !== 'high-contrast'"\r
                  [class.text-white]="theme === 'high-contrast'">{{ translations[lang].hours }}</div>\r
              </div>\r
              <div class="rounded-lg p-2 text-center border"\r
                [class.bg-black-40]="theme !== 'high-contrast'"\r
                [class.border-white-10]="theme !== 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'">\r
                <div class="text-2xl font-bold font-mono text-white">{{ countdown.minutes | number:'2.0' }}</div>\r
                <div class="text-[10px] uppercase"\r
                  [class.text-gray-400]="theme !== 'high-contrast'"\r
                  [class.text-white]="theme === 'high-contrast'">{{ translations[lang].min }}</div>\r
              </div>\r
              <div class="rounded-lg p-2 text-center border"\r
                [class.bg-black-40]="theme !== 'high-contrast'"\r
                [class.border-white-10]="theme !== 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'">\r
                <div class="text-2xl font-bold font-mono"\r
                  [class.text-red-400]="theme !== 'high-contrast'"\r
                  [class.text-white]="theme === 'high-contrast'">{{ countdown.seconds | number:'2.0' }}</div>\r
                <div class="text-[10px] uppercase"\r
                  [class.text-gray-400]="theme !== 'high-contrast'"\r
                  [class.text-white]="theme === 'high-contrast'">{{ translations[lang].sec }}</div>\r
              </div>\r
            </div>\r
\r
            <div class="space-y-4">\r
              <div class="flex items-center gap-3 text-sm p-3 rounded-lg"\r
                [class.text-gray-300]="theme !== 'high-contrast'"\r
                [class.bg-black-20]="theme !== 'high-contrast'"\r
                [class.text-white]="theme === 'high-contrast'"\r
                [class.border]="theme === 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'">\r
                <i class="fab fa-apple text-xl"></i>\r
                <span>{{ translations[lang].mac_support }}</span>\r
              </div>\r
              <button class="btn btn-block border-none font-bold"\r
                [class.bg-white]="theme !== 'high-contrast'"\r
                [class.text-blue-900]="theme !== 'high-contrast'"\r
                [class.hover-bg-gray-100]="theme !== 'high-contrast'"\r
                [class.bg-black]="theme === 'high-contrast'"\r
                [class.text-white]="theme === 'high-contrast'"\r
                [class.border-2]="theme === 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'">\r
                {{ translations[lang].btn_offer }}\r
                <i class="fas fa-arrow-right ml-2"></i>\r
              </button>\r
            </div>\r
          </div>\r
        </div>\r
\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- USDT Calculator Section -->\r
  <section class="py-12 border-b transition-colors duration-300"\r
    [class.bg-white]="theme === 'light'"\r
    [class.border-gray-200]="theme === 'light'"\r
    [class.bg-gray-800]="theme === 'dark'"\r
    [class.border-gray-700]="theme === 'dark'"\r
    [class.bg-black]="theme === 'high-contrast'"\r
    [class.border-white]="theme === 'high-contrast'">\r
    <div class="container mx-auto px-4">\r
      <div class="max-w-4xl mx-auto rounded-2xl shadow-xl border overflow-hidden flex flex-col md:flex-row"\r
        [class.bg-white]="theme === 'light'"\r
        [class.border-gray-100]="theme === 'light'"\r
        [class.bg-gray-900]="theme === 'dark'"\r
        [class.border-gray-700]="theme === 'dark'"\r
        [class.bg-black]="theme === 'high-contrast'"\r
        [class.border-white]="theme === 'high-contrast'">\r
        \r
        <div class="md:w-1/2 p-8 text-white flex flex-col justify-center"\r
          [class.bg-blue-600]="theme === 'light'"\r
          [class.bg-blue-900]="theme === 'dark'"\r
          [class.bg-black]="theme === 'high-contrast'"\r
          [class.border-r]="theme === 'high-contrast'"\r
          [class.border-white]="theme === 'high-contrast'">\r
          <h2 class="text-2xl font-bold mb-2">{{ translations[lang].calc_title }}</h2>\r
          <p class="mb-6"\r
            [class.text-blue-100]="theme !== 'high-contrast'"\r
            [class.text-white]="theme === 'high-contrast'">{{ translations[lang].calc_desc }}</p>\r
          <div class="flex items-center gap-4">\r
            <div class="w-12 h-12 rounded-full flex items-center justify-center text-2xl"\r
              [class.bg-white-20]="theme !== 'high-contrast'"\r
              [class.border]="theme === 'high-contrast'"\r
              [class.border-white]="theme === 'high-contrast'">\r
              <i class="fas fa-calculator"></i>\r
            </div>\r
            <div>\r
              <div class="font-bold">{{ translations[lang].calc_label }}</div>\r
              <div class="text-sm"\r
                [class.text-blue-200]="theme !== 'high-contrast'"\r
                [class.text-white]="theme === 'high-contrast'">{{ translations[lang].calc_sub }}</div>\r
            </div>\r
          </div>\r
        </div>\r
        \r
        <div class="md:w-1/2 p-8">\r
          <div class="form-control mb-4">\r
            <label class="label">\r
              <span class="label-text font-medium"\r
                [class.text-gray-700]="theme === 'light'"\r
                [class.text-gray-300]="theme === 'dark'"\r
                [class.text-white]="theme === 'high-contrast'">{{ translations[lang].input_label }}</span>\r
            </label>\r
            <div class="relative">\r
              <input type="number" [(ngModel)]="usdtAmount" placeholder="Ej: 100" \r
                class="input input-bordered w-full pl-10"\r
                [class.bg-white]="theme === 'light'"\r
                [class.text-gray-900]="theme === 'light'"\r
                [class.bg-gray-800]="theme === 'dark'"\r
                [class.text-white]="theme === 'dark'"\r
                [class.border-gray-600]="theme === 'dark'"\r
                [class.bg-black]="theme === 'high-contrast'"\r
                [class.text-white]="theme === 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'" />\r
              <div class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">\r
                <i class="fas fa-dollar-sign"></i>\r
              </div>\r
            </div>\r
          </div>\r
          \r
          <button (click)="calculateUsdt()" class="btn btn-primary w-full mb-6"\r
            [class.btn-outline]="theme === 'high-contrast'"\r
            [class.text-white]="theme === 'high-contrast'">\r
            {{ translations[lang].btn_calc }}\r
          </button>\r
\r
          @if (usdtTotal !== null) {\r
            <div class="rounded-xl p-4 text-center border animate-fade-in"\r
              [class.bg-gray-50]="theme === 'light'"\r
              [class.border-gray-200]="theme === 'light'"\r
              [class.bg-gray-800]="theme === 'dark'"\r
              [class.border-gray-700]="theme === 'dark'"\r
              [class.bg-black]="theme === 'high-contrast'"\r
              [class.border-white]="theme === 'high-contrast'">\r
              <div class="text-sm mb-1"\r
                [class.text-gray-500]="theme === 'light'"\r
                [class.text-gray-400]="theme === 'dark'"\r
                [class.text-white]="theme === 'high-contrast'">{{ translations[lang].total_est }}</div>\r
              <div class="text-3xl font-bold"\r
                [class.text-gray-800]="theme === 'light'"\r
                [class.text-white]="theme !== 'light'">$ {{ usdtTotal | number:'1.0-2' }}</div>\r
              <div class="text-xs mt-1"\r
                [class.text-gray-400]="theme !== 'high-contrast'"\r
                [class.text-white]="theme === 'high-contrast'">{{ translations[lang].cot_ref }}: $ {{ usdtRate }}</div>\r
            </div>\r
          }\r
        </div>\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- Tools Section -->\r
  <section id="tools" class="py-16 transition-colors duration-300"\r
    [class.bg-gray-50]="theme === 'light'"\r
    [class.bg-gray-900]="theme === 'dark'"\r
    [class.bg-black]="theme === 'high-contrast'">\r
    <div class="container mx-auto px-4">\r
      <div class="text-center mb-12">\r
        <h2 class="text-3xl font-bold mb-4"\r
          [class.text-gray-900]="theme === 'light'"\r
          [class.text-white]="theme !== 'light'">{{ translations[lang].tools_title }}</h2>\r
        <p class="max-w-2xl mx-auto"\r
          [class.text-gray-600]="theme === 'light'"\r
          [class.text-gray-400]="theme === 'dark'"\r
          [class.text-white]="theme === 'high-contrast'">\r
          {{ translations[lang].tools_desc }}\r
        </p>\r
      </div>\r
\r
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">\r
        @for (tool of gsmTools; track tool) {\r
          <div class="rounded-xl p-6 shadow-sm hover:shadow-xl transition-all duration-300 border group"\r
            [class.bg-white]="theme === 'light'"\r
            [class.border-gray-100]="theme === 'light'"\r
            [class.bg-gray-800]="theme === 'dark'"\r
            [class.border-gray-700]="theme === 'dark'"\r
            [class.bg-black]="theme === 'high-contrast'"\r
            [class.border-white]="theme === 'high-contrast'">\r
            <div class="flex items-start justify-between mb-4">\r
              <div class="w-12 h-12 rounded-lg flex items-center justify-center text-xl transition-colors"\r
                [class.bg-blue-50]="theme === 'light'"\r
                [class.text-blue-600]="theme === 'light'"\r
                [class.group-hover-bg-blue-600]="theme === 'light'"\r
                [class.group-hover-text-white]="theme === 'light'"\r
                [class.bg-gray-700]="theme === 'dark'"\r
                [class.text-blue-400]="theme === 'dark'"\r
                [class.group-hover-bg-blue-500]="theme === 'dark'"\r
                [class.border]="theme === 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'"\r
                [class.text-white]="theme === 'high-contrast'">\r
                <i [class]="tool.icon"></i>\r
              </div>\r
              <span class="px-2 py-1 text-xs rounded font-medium"\r
                [class.bg-gray-100]="theme === 'light'"\r
                [class.text-gray-600]="theme === 'light'"\r
                [class.bg-gray-700]="theme === 'dark'"\r
                [class.text-gray-300]="theme === 'dark'"\r
                [class.bg-black]="theme === 'high-contrast'"\r
                [class.text-white]="theme === 'high-contrast'"\r
                [class.border]="theme === 'high-contrast'"\r
                [class.border-white]="theme === 'high-contrast'">Software</span>\r
            </div>\r
            \r
            <h3 class="text-xl font-bold mb-2 transition-colors"\r
              [class.text-gray-900]="theme === 'light'"\r
              [class.group-hover-text-blue-600]="theme === 'light'"\r
              [class.text-white]="theme !== 'light'"\r
              [class.group-hover-text-blue-400]="theme === 'dark'">{{ tool.name }}</h3>\r
            <p class="text-sm mb-6 line-clamp-2"\r
              [class.text-gray-500]="theme === 'light'"\r
              [class.text-gray-400]="theme === 'dark'"\r
              [class.text-white]="theme === 'high-contrast'">{{ tool.description }}</p>\r
            \r
            <a [href]="tool.loginUrl" class="btn btn-outline btn-sm w-full"\r
              [class.group-hover-btn-primary]="theme !== 'high-contrast'"\r
              [class.text-white]="theme === 'high-contrast'"\r
              [class.border-white]="theme === 'high-contrast'">\r
              {{ translations[lang].btn_login }}\r
              <i class="fas fa-arrow-right ml-2"></i>\r
            </a>\r
          </div>\r
        }\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- Brands Section -->\r
  <section class="py-16 transition-colors duration-300"\r
    [class.bg-white]="theme === 'light'"\r
    [class.bg-gray-800]="theme === 'dark'"\r
    [class.bg-black]="theme === 'high-contrast'">\r
    <div class="container mx-auto px-4">\r
      <div class="text-center mb-12">\r
        <h2 class="text-3xl font-bold mb-4"\r
          [class.text-gray-900]="theme === 'light'"\r
          [class.text-white]="theme !== 'light'">{{ translations[lang].brands_title }}</h2>\r
        <p [class.text-gray-600]="theme === 'light'"\r
           [class.text-gray-400]="theme === 'dark'"\r
           [class.text-white]="theme === 'high-contrast'">{{ translations[lang].brands_desc }}</p>\r
      </div>\r
\r
      <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">\r
        @for (brand of brandServices; track brand) {\r
          <div class="group cursor-pointer">\r
            <div class="rounded-xl p-6 text-center border transition-all duration-300 relative overflow-hidden"\r
              [class.bg-gray-50]="theme === 'light'"\r
              [class.border-gray-100]="theme === 'light'"\r
              [class.hover-border-blue-500]="theme === 'light'"\r
              [class.hover-shadow-lg]="theme === 'light'"\r
              [class.bg-gray-900]="theme === 'dark'"\r
              [class.border-gray-700]="theme === 'dark'"\r
              [class.hover-border-blue-400]="theme === 'dark'"\r
              [class.bg-black]="theme === 'high-contrast'"\r
              [class.border-white]="theme === 'high-contrast'">\r
              <div class="text-3xl mb-3 transition-colors"\r
                [class.text-gray-400]="theme === 'light'"\r
                [class.group-hover-text-blue-600]="theme === 'light'"\r
                [class.text-gray-500]="theme === 'dark'"\r
                [class.group-hover-text-blue-400]="theme === 'dark'"\r
                [class.text-white]="theme === 'high-contrast'">\r
                <i class="fas fa-mobile-alt"></i>\r
              </div>\r
              <h3 class="font-bold"\r
                [class.text-gray-700]="theme === 'light'"\r
                [class.group-hover-text-blue-700]="theme === 'light'"\r
                [class.text-gray-300]="theme === 'dark'"\r
                [class.group-hover-text-blue-300]="theme === 'dark'"\r
                [class.text-white]="theme === 'high-contrast'">{{ brand.name }}</h3>\r
              \r
              <!-- Hover Overlay -->\r
              @if (theme !== 'high-contrast') {\r
                <div class="absolute inset-0 bg-blue-600/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">\r
                  <span class="text-white font-bold text-sm">{{ translations[lang].btn_view_services }}</span>\r
                </div>\r
              }\r
            </div>\r
          </div>\r
        }\r
      </div>\r
    </div>\r
  </section>\r
\r
  <!-- Downloads Section -->\r
  <section class="py-16 text-white transition-colors duration-300"\r
    [class.bg-gray-900]="theme !== 'high-contrast'"\r
    [class.bg-black]="theme === 'high-contrast'">\r
    <div class="container mx-auto px-4">\r
      <div class="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">\r
        <div>\r
          <h2 class="text-3xl font-bold mb-4">{{ translations[lang].downloads_title }}</h2>\r
          <p class="text-gray-400" [class.text-white]="theme === 'high-contrast'">{{ translations[lang].downloads_desc }}</p>\r
        </div>\r
        <button class="btn btn-outline text-white hover:bg-white hover:text-gray-900"\r
          [class.border-white]="theme === 'high-contrast'">\r
          {{ translations[lang].btn_view_all }}\r
          <i class="fas fa-arrow-right ml-2"></i>\r
        </button>\r
      </div>\r
\r
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">\r
        @for (download of downloads; track download) {\r
          <div class="rounded-xl p-6 border transition-colors group"\r
            [class.bg-gray-800]="theme !== 'high-contrast'"\r
            [class.border-gray-700]="theme !== 'high-contrast'"\r
            [class.hover-border-gray-500]="theme !== 'high-contrast'"\r
            [class.bg-black]="theme === 'high-contrast'"\r
            [class.border-white]="theme === 'high-contrast'">\r
            <div class="flex items-center gap-4 mb-4">\r
              <div class="w-10 h-10 rounded flex items-center justify-center transition-colors"\r
                [class.bg-gray-700]="theme !== 'high-contrast'"\r
                [class.text-blue-400]="theme !== 'high-contrast'"\r
                [class.group-hover-text-white]="theme !== 'high-contrast'"\r
                [class.bg-white]="theme === 'high-contrast'"\r
                [class.text-black]="theme === 'high-contrast'">\r
                <i [class]="download.icon"></i>\r
              </div>\r
              <div>\r
                <h3 class="font-bold"\r
                  [class.text-gray-200]="theme !== 'high-contrast'"\r
                  [class.group-hover-text-white]="theme !== 'high-contrast'"\r
                  [class.text-white]="theme === 'high-contrast'">{{ download.name }}</h3>\r
                <div class="text-xs text-gray-500" [class.text-white]="theme === 'high-contrast'">{{ translations[lang].utility }}</div>\r
              </div>\r
            </div>\r
            @if (download.description) {\r
              <p class="text-sm mb-4 line-clamp-2"\r
                [class.text-gray-400]="theme !== 'high-contrast'"\r
                [class.text-white]="theme === 'high-contrast'">{{ download.description }}</p>\r
            }\r
            <a [href]="download.downloadUrl" class="flex items-center text-sm font-medium transition-colors"\r
              [class.text-blue-400]="theme !== 'high-contrast'"\r
              [class.hover-text-blue-300]="theme !== 'high-contrast'"\r
              [class.text-white]="theme === 'high-contrast'"\r
              [class.underline]="theme === 'high-contrast'">\r
              <i class="fas fa-download mr-2"></i>\r
              {{ translations[lang].btn_download }}\r
            </a>\r
          </div>\r
        }\r
      </div>\r
    </div>\r
  </section>\r
\r
</div>`, styles: ["/* src/app/public/gsm/gsm.component.css */\n@keyframes shine {\n  100% {\n    left: 125%;\n  }\n}\n.animate-shine {\n  animation: shine 1s;\n}\n.animate-fade-in {\n  animation: fadeIn 0.5s ease-out forwards;\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n    transform: translateY(10px);\n  }\n  to {\n    opacity: 1;\n    transform: translateY(0);\n  }\n}\nhtml {\n  scroll-behavior: smooth;\n}\n/*# sourceMappingURL=gsm.component.css.map */\n"] }]
  }], () => [{ type: Title }, { type: Meta }, { type: PreferencesService }, { type: GsmService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(GsmComponent, { className: "GsmComponent", filePath: "src/app/public/gsm/gsm.component.ts", lineNumber: 17 });
})();

// src/app/public/gsm/gsm.routes.ts
var gsmRoutes = [
  {
    title: "GSM",
    path: "",
    component: GsmComponent
  }
];
export {
  gsmRoutes
};
//# sourceMappingURL=chunk-PP6PMYVN.mjs.map
