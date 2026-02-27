import {
  CertificateGalleryComponent
} from "./chunk-YLYUX466.js";
import {
  PreferencesService
} from "./chunk-EECV4RMG.js";
import {
  environment
} from "./chunk-TCBIYFRD.js";
import {
  RouterLink
} from "./chunk-CP6GQXNM.js";
import {
  CommonModule,
  NgClass,
  NgOptimizedImage
} from "./chunk-F32QBW3I.js";
import {
  Component,
  interval,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassMap,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdirectiveInject,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-DPJFS6PI.js";
import "./chunk-46DXP6YY.js";

// src/app/public/portfolio/portfolio.ts
function PortfolioComponent_For_85_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44)(1, "span", 86);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const line_r1 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(line_r1);
  }
}
function PortfolioComponent_For_93_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49)(1, "div", 87)(2, "span", 88);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 14)(5, "span", 8);
    \u0275\u0275element(6, "span", 89)(7, "span", 90);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(8, "div", 91)(9, "div")(10, "div", 92);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 93);
    \u0275\u0275text(13, "Latency");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "div", 94)(15, "div", 95);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 93);
    \u0275\u0275text(18, "Uptime");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(19, "div", 96);
    \u0275\u0275element(20, "div", 97)(21, "div", 98)(22, "div", 99)(23, "div", 100)(24, "div", 101)(25, "div", 102);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const status_r2 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(status_r2.name);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate1("", status_r2.latency, "ms");
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(status_r2.uptime);
  }
}
function PortfolioComponent_For_103_For_9_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div")(1, "div", 107);
    \u0275\u0275text(2);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 108);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const stat_r3 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r3.value);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(stat_r3.label);
  }
}
function PortfolioComponent_For_103_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 55)(1, "div", 103);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "h3", 104);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 105);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 106);
    \u0275\u0275repeaterCreate(8, PortfolioComponent_For_103_For_9_Template, 5, 2, "div", null, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275classMap(item_r4.icon);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(item_r4.description);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(item_r4.stats);
  }
}
function PortfolioComponent_For_107_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 109);
    \u0275\u0275listener("click", function PortfolioComponent_For_107_Template_button_click_0_listener() {
      const \u0275$index_249_r6 = \u0275\u0275restoreView(_r5).$index;
      const ctx_r6 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r6.activeSnippetIndex = \u0275$index_249_r6);
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const snippet_r8 = ctx.$implicit;
    const \u0275$index_249_r6 = ctx.$index;
    const ctx_r6 = \u0275\u0275nextContext();
    \u0275\u0275property("ngClass", ctx_r6.activeSnippetIndex === \u0275$index_249_r6 ? "bg-[#1a1d2d] text-cyan-400 border-b-2 border-b-cyan-500" : "text-gray-500");
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", snippet_r8.title, " ");
  }
}
function PortfolioComponent_For_137_For_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 113)(1, "div", 114);
    \u0275\u0275element(2, "i");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div")(4, "h4", 115);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 116);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const skill_r9 = ctx.$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275classMap(skill_r9.icon + " text-xl text-gray-400 group-hover:text-cyan-400 transition-colors");
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(skill_r9.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(skill_r9.description);
  }
}
function PortfolioComponent_For_137_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 73)(1, "h3", 110);
    \u0275\u0275element(2, "i", 111);
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "div", 112);
    \u0275\u0275repeaterCreate(5, PortfolioComponent_For_137_For_6_Template, 8, 4, "div", 113, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const category_r10 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", category_r10.category, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(category_r10.skills);
  }
}
function PortfolioComponent_For_147_For_14_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 123)(1, "span", 124);
    \u0275\u0275text(2, "$");
    \u0275\u0275elementEnd();
    \u0275\u0275text(3);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tech_r11 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" ", tech_r11, " ");
  }
}
function PortfolioComponent_For_147_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 75);
    \u0275\u0275element(1, "div", 117);
    \u0275\u0275elementStart(2, "div", 118)(3, "div")(4, "h3", 119);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "div", 120);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div", 121);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(10, "p", 122);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(12, "div", 68);
    \u0275\u0275repeaterCreate(13, PortfolioComponent_For_147_For_14_Template, 4, 1, "span", 123, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const exp_r12 = ctx.$implicit;
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(exp_r12.position);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(exp_r12.company);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", exp_r12.period, " ");
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", exp_r12.description, " ");
    \u0275\u0275advance(2);
    \u0275\u0275repeater(exp_r12.techStack);
  }
}
function PortfolioComponent_For_157_Conditional_1_Conditional_12_For_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "li", 139);
    \u0275\u0275element(1, "i", 140);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const feature_r13 = ctx.$implicit;
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(feature_r13);
  }
}
function PortfolioComponent_For_157_Conditional_1_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "ul", 134);
    \u0275\u0275repeaterCreate(1, PortfolioComponent_For_157_Conditional_1_Conditional_12_For_2_Template, 4, 1, "li", 139, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const project_r14 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275advance();
    \u0275\u0275repeater(project_r14.features);
  }
}
function PortfolioComponent_For_157_Conditional_1_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 136);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tag_r15 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tag_r15, " ");
  }
}
function PortfolioComponent_For_157_Conditional_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 138);
    \u0275\u0275element(1, "i", 141);
    \u0275\u0275text(2, " View Project ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const project_r14 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("href", project_r14.link, \u0275\u0275sanitizeUrl);
  }
}
function PortfolioComponent_For_157_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 125);
    \u0275\u0275element(1, "div", 126)(2, "img", 127);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 128)(4, "div", 129)(5, "span", 130);
    \u0275\u0275text(6, "Featured");
    \u0275\u0275elementEnd();
    \u0275\u0275element(7, "span", 131);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "h3", 132);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "p", 133);
    \u0275\u0275text(11);
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(12, PortfolioComponent_For_157_Conditional_1_Conditional_12_Template, 3, 0, "ul", 134);
    \u0275\u0275elementStart(13, "div", 135);
    \u0275\u0275repeaterCreate(14, PortfolioComponent_For_157_Conditional_1_For_15_Template, 2, 1, "span", 136, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(16, "div", 137);
    \u0275\u0275conditionalCreate(17, PortfolioComponent_For_157_Conditional_1_Conditional_17_Template, 3, 1, "a", 138);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const project_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngSrc", project_r14.image);
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(project_r14.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(project_r14.description);
    \u0275\u0275advance();
    \u0275\u0275conditional(project_r14.features ? 12 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(project_r14.techStack);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(project_r14.link ? 17 : -1);
  }
}
function PortfolioComponent_For_157_Conditional_2_For_10_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 149);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const tag_r16 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", tag_r16, " ");
  }
}
function PortfolioComponent_For_157_Conditional_2_Conditional_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 151);
    \u0275\u0275element(1, "i", 152);
    \u0275\u0275text(2, " Live Demo ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const project_r14 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("href", project_r14.link, \u0275\u0275sanitizeUrl);
  }
}
function PortfolioComponent_For_157_Conditional_2_Conditional_13_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "a", 151);
    \u0275\u0275element(1, "i", 153);
    \u0275\u0275text(2, " Source Code ");
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const project_r14 = \u0275\u0275nextContext(2).$implicit;
    \u0275\u0275property("href", project_r14.github, \u0275\u0275sanitizeUrl);
  }
}
function PortfolioComponent_For_157_Conditional_2_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 142);
    \u0275\u0275element(1, "div", 143)(2, "img", 144);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 145)(4, "h3", 146);
    \u0275\u0275text(5);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 147);
    \u0275\u0275text(7);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 148);
    \u0275\u0275repeaterCreate(9, PortfolioComponent_For_157_Conditional_2_For_10_Template, 2, 1, "span", 149, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 150);
    \u0275\u0275conditionalCreate(12, PortfolioComponent_For_157_Conditional_2_Conditional_12_Template, 3, 1, "a", 151);
    \u0275\u0275conditionalCreate(13, PortfolioComponent_For_157_Conditional_2_Conditional_13_Template, 3, 1, "a", 151);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const project_r14 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275property("ngSrc", project_r14.image);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(project_r14.title);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(project_r14.description);
    \u0275\u0275advance(2);
    \u0275\u0275repeater(project_r14.techStack);
    \u0275\u0275advance(3);
    \u0275\u0275conditional(project_r14.link ? 12 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(project_r14.github ? 13 : -1);
  }
}
function PortfolioComponent_For_157_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div");
    \u0275\u0275conditionalCreate(1, PortfolioComponent_For_157_Conditional_1_Template, 18, 5);
    \u0275\u0275conditionalCreate(2, PortfolioComponent_For_157_Conditional_2_Template, 14, 5);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const project_r14 = ctx.$implicit;
    \u0275\u0275classMap(project_r14.featured ? "group relative bg-[#131620]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 md:col-span-2 grid md:grid-cols-2" : "group relative bg-[#131620] rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all duration-300");
    \u0275\u0275advance();
    \u0275\u0275conditional(project_r14.featured ? 1 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(!project_r14.featured ? 2 : -1);
  }
}
var PortfolioComponent = class _PortfolioComponent {
  preferencesService;
  currentLanguage = "es";
  activeSnippetIndex = 0;
  terminalOutput = [];
  systemStatuses = [
    { name: "Supabase Auth", status: "operational", latency: 45, uptime: "99.99%" },
    { name: "PostgreSQL DB", status: "operational", latency: 12, uptime: "99.95%" },
    { name: "Node.js API", status: "operational", latency: 28, uptime: "99.90%" },
    { name: "Redis Cache", status: "operational", latency: 5, uptime: "99.99%" }
  ];
  simulationSubscription;
  portfolioContent = {
    es: {
      name: "EZEQUIEL ENRICO ARECO",
      role: "Senior Backend & Fullstack Engineer",
      tagline: "Arquitecto de Soluciones Escalables | Experto en Node.js & Cloud",
      location: "Buenos Aires, Argentina",
      email: "ezequielenrico15@gmail.com",
      linkedin: environment.contact.socialMedia.linkedin,
      github: environment.contact.socialMedia.github,
      cvUrl: environment.externalUrls.portfolio.cv,
      about: "Ingeniero de Software con profunda especializaci\xF3n en arquitectura de backend, dise\xF1o de APIs RESTful de alto rendimiento y optimizaci\xF3n de bases de datos. Mi enfoque combina la robustez de la ingenier\xEDa de sistemas con metodolog\xEDas modernas como Clean Architecture y TDD. Comprometido con la excelencia t\xE9cnica, la seguridad y la escalabilidad.",
      backendHighlights: [
        {
          title: "Arquitectura de Microservicios",
          icon: "fas fa-server",
          description: "Dise\xF1o e implementaci\xF3n de sistemas distribuidos desacoplados utilizando Node.js y comunicaci\xF3n por eventos.",
          stats: [{ label: "Escalabilidad", value: "Alta" }, { label: "Disponibilidad", value: "99.9%" }]
        },
        {
          title: "Optimizaci\xF3n de Bases de Datos",
          icon: "fas fa-database",
          description: "Tuning avanzado de consultas SQL, indexaci\xF3n estrat\xE9gica y modelado de datos eficiente en PostgreSQL y Supabase.",
          stats: [{ label: "Query Time", value: "-60%" }, { label: "Throughput", value: "2x" }]
        },
        {
          title: "Seguridad & Auth",
          icon: "fas fa-shield-alt",
          description: "Implementaci\xF3n de esquemas robustos de autenticaci\xF3n (JWT, OAuth2) y pol\xEDticas de seguridad Row Level Security (RLS) con enfoque en DevSecOps.",
          stats: [{ label: "Compliance", value: "OWASP" }, { label: "Seguridad", value: "A+" }]
        }
      ],
      codeSnippets: [
        {
          title: "Node.js Clean Architecture Controller",
          language: "typescript",
          description: "Implementaci\xF3n de un controlador gen\xE9rico siguiendo principios SOLID y manejo de errores centralizado.",
          code: `
export class BaseController {
  protected async execute(req: Request, res: Response): Promise<void | any> {
    try {
      await this.executeImpl(req, res);
    } catch (error) {
      console.error(\`[BaseController]: Uncaught controller error\`);
      console.error(error);
      this.fail(res, 'An unexpected error occurred');
    }
  }

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }
}`
        },
        {
          title: "Supabase RLS Policy (SQL)",
          language: "sql",
          description: "Pol\xEDtica de seguridad a nivel de fila para asegurar aislamiento de datos por tenant.",
          code: `
-- Enable RLS
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;

-- Create Policy
CREATE POLICY "Tenant Isolation Policy"
ON "orders"
FOR ALL
USING (
  tenant_id = auth.jwt() ->> 'tenant_id'
);`
        }
      ],
      technicalSkills: [
        {
          category: "High-Performance Backend",
          skills: [
            { name: "Java Enterprise", icon: "fa-brands fa-java", description: "Desarrollo de sistemas distribuidos robustos, multithreading y gesti\xF3n de memoria avanzada." },
            { name: "Spring Boot", icon: "fa-brands fa-envira", description: "Arquitectura de microservicios, Spring Cloud, Spring Security y DI para aplicaciones empresariales." },
            { name: "Node.js", icon: "fa-brands fa-node", description: "Event-driven, Streams API y escalabilidad horizontal para servicios de alta concurrencia." },
            { name: "C# .NET", icon: "fa-brands fa-microsoft", description: "Desarrollo de soluciones corporativas, LINQ, Entity Framework y optimizaci\xF3n de rendimiento." },
            { name: "Python", icon: "fa-brands fa-python", description: "Scripting de automatizaci\xF3n, an\xE1lisis de datos y desarrollo backend con Django/FastAPI." }
          ]
        },
        {
          category: "Cloud Infrastructure & DevOps",
          skills: [
            { name: "Docker & Kubernetes", icon: "fa-brands fa-docker", description: "Orquestaci\xF3n de contendores, CI/CD pipelines y gesti\xF3n de entornos aislados." },
            { name: "Supabase / Postgres", icon: "fas fa-database", description: "Dise\xF1o de esquemas complejos, Stored Procedures, Triggers y optimizaci\xF3n de \xEDndices." },
            { name: "Redis", icon: "fas fa-server", description: "Estrategias de caching distribuido, Pub/Sub y gesti\xF3n de sesiones de alta velocidad." },
            { name: "Linux Hardening", icon: "fa-brands fa-linux", description: "Administraci\xF3n de servidores, scripting bash y seguridad de nivel kernel." }
          ]
        },
        {
          category: "Modern Frontend & Architecture",
          skills: [
            { name: "Angular", icon: "fa-brands fa-angular", description: "Aplicaciones SPA escalables, RxJS avanzado, se\xF1ales y gesti\xF3n de estado reactivo." },
            { name: "Clean Architecture", icon: "fas fa-project-diagram", description: "Implementaci\xF3n estricta de principios SOLID, DDD y separaci\xF3n de responsabilidades." },
            { name: "System Design", icon: "fas fa-sitemap", description: "Dise\xF1o de sistemas de alto nivel, patrones de dise\xF1o y diagramado de arquitectura." }
          ]
        }
      ],
      projects: [
        {
          title: "Zarx \u2013 Plataforma Integral de Gesti\xF3n y Control Geoespacial",
          description: "Desarrollo de un ecosistema digital avanzado dise\xF1ado para la centralizaci\xF3n de datos, seguridad ciudadana y gesti\xF3n territorial. La aplicaci\xF3n resuelve la fragmentaci\xF3n de informaci\xF3n mediante un panel de control unificado que integra herramientas de seguridad, identidad digital y an\xE1lisis de datos en tiempo real.",
          image: "assets/img/cursos/certiicate/zarx.jpeg",
          techStack: ["Angular", "Java", "Python", "PostgreSQL", "Supabase"],
          features: [
            "Centralizaci\xF3n: Integraci\xF3n de m\xFAltiples m\xF3dulos (Finanzas, Identidad, Seguridad).",
            "Escalabilidad: Arquitectura Real-time para gran volumen de datos.",
            "Seguridad: Protocolos de verificaci\xF3n de identidad y prevenci\xF3n de fraudes."
          ],
          link: "https://zarx.arecofix.com.ar",
          featured: true
        },
        {
          title: "Sistema de Gesti\xF3n para Ecommerce",
          description: "Sistema integral de gesti\xF3n para E-commerce y Servicios T\xE9cnicos. Panel de administraci\xF3n robusto con control de inventario en tiempo real, gesti\xF3n de ventas, seguimiento de \xF3rdenes de servicio, clientes, y reportes financieros detallados. Incluye facturaci\xF3n automatizada, integraci\xF3n con pasarelas de pago, y m\xF3dulos de log\xEDstica.",
          image: "assets/img/cursos/certiicate/arecofix.png",
          techStack: ["Node.js", "Angular", "Supabase", "Redis", "Docker"],
          features: ["Gesti\xF3n de Inventario", "CRM & Ventas", "Reportes Financieros", "Trazabilidad de Servicio"],
          link: environment.baseUrl
        },
        {
          title: "Enterprise ERP System with Java Spring",
          description: "Reingenier\xEDa de legacy a microservicios. Sistema distribuido para gesti\xF3n de recursos empresariales en tiempo real.",
          image: "assets/img/projects/panel.png",
          techStack: ["Java 21", "Spring Boot 3", "Kafka", "PostgreSQL"],
          features: ["Event Sourcing", "Distributed Tracing", "CQRS Partner Integration"]
        }
      ],
      workExperience: [
        {
          position: "Profesor de Reparaci\xF3n de Art\xEDculos Electr\xF3nicos",
          company: "IAP Marcos Paz",
          period: "2025 - Presente",
          description: "Principalmente Reparaci\xF3n de Celulares. Dictado de cursos especializados en reparaci\xF3n de hardware, microelectr\xF3nica y diagn\xF3stico de fallas. Formaci\xF3n t\xE9cnica pr\xE1ctica y te\xF3rica para futuros t\xE9cnicos.",
          techStack: ["Microelectr\xF3nica", "Hardware", "Diagn\xF3stico Avanzado"]
        },
        {
          position: "L\xEDder T\xE9cnico & Desarrollador Fullstack",
          company: "Arecofix",
          period: "2020 - 2023",
          description: "Lider\xE9 la transformaci\xF3n digital del negocio, dise\xF1ando la arquitectura completa del sistema de gesti\xF3n y ventas. Implement\xE9 CI/CD pipelines y optimic\xE9 el rendimiento del servidor en un 300%.",
          techStack: ["Node.js", "Angular", "Supabase", "Docker"]
        },
        {
          position: "Instructor de Desarrollo de Software",
          company: "Eddis Educativa",
          period: "2022 - Presente",
          description: "Capacitaci\xF3n de m\xE1s de 50 alumnos en tecnolog\xEDas web modernas, mentoreando proyectos finales y ense\xF1ando mejores pr\xE1cticas de la industria.",
          techStack: ["HTML/CSS/JS", "Programaci\xF3n L\xF3gica"]
        },
        {
          position: "Equipo T\xE9cnico de Sistemas",
          company: "Municipio de Marcos Paz",
          period: "Until 2023",
          description: "Mantenimiento y evoluci\xF3n de sistemas gubernamentales cr\xEDticos. Gesti\xF3n de bases de datos y soporte de infraestructura.",
          techStack: ["Soporte IT", "Redes", "Sistemas Legacy"]
        }
      ]
    },
    en: {
      name: "EZEQUIEL ENRICO ARECO",
      role: "Senior Backend & Fullstack Engineer",
      tagline: "Scalable Solutions Architect | Node.js & Cloud Expert",
      location: "Buenos Aires, Argentina",
      email: "ezequielenrico15@gmail.com",
      linkedin: environment.contact.socialMedia.linkedin,
      github: environment.contact.socialMedia.github,
      cvUrl: environment.externalUrls.portfolio.cv,
      about: "Software Engineer with deep specialization in backend architecture, high-performance RESTful API design, and database optimization. My approach combines systems engineering robustness with modern methodologies like Clean Architecture and TDD. Committed to technical excellence, security, and scalability.",
      backendHighlights: [
        {
          title: "Microservices Architecture",
          icon: "fas fa-server",
          description: "Design and implementation of decoupled distributed systems using Node.js and event-driven communication.",
          stats: [{ label: "Scalability", value: "High" }, { label: "Availability", value: "99.9%" }]
        },
        {
          title: "Database Optimization",
          icon: "fas fa-database",
          description: "Advanced SQL query tuning, strategic indexing, and efficient data modeling in PostgreSQL and Supabase.",
          stats: [{ label: "Query Time", value: "-60%" }, { label: "Throughput", value: "2x" }]
        },
        {
          title: "Security & Auth",
          icon: "fas fa-shield-alt",
          description: "Implementation of robust authentication schemes (JWT, OAuth2) and Row Level Security (RLS) policies with a DevSecOps focus.",
          stats: [{ label: "Compliance", value: "OWASP" }, { label: "Security", value: "A+" }]
        }
      ],
      codeSnippets: [
        {
          title: "Node.js Clean Architecture Controller",
          language: "typescript",
          description: "Implementation of a generic controller following SOLID principles and centralized error handling.",
          code: `
export class BaseController {
  protected async execute(req: Request, res: Response): Promise<void | any> {
    try {
      await this.executeImpl(req, res);
    } catch (error) {
      console.error(\`[BaseController]: Uncaught controller error\`);
      console.error(error);
      this.fail(res, 'An unexpected error occurred');
    }
  }

  public static jsonResponse(res: Response, code: number, message: string) {
    return res.status(code).json({ message });
  }
}`
        },
        {
          title: "Supabase RLS Policy (SQL)",
          language: "sql",
          description: "Row Level Security policy to ensure data isolation by tenant.",
          code: `
-- Enable RLS
ALTER TABLE "orders" ENABLE ROW LEVEL SECURITY;

-- Create Policy
CREATE POLICY "Tenant Isolation Policy"
ON "orders"
FOR ALL
USING (
  tenant_id = auth.jwt() ->> 'tenant_id'
);`
        }
      ],
      technicalSkills: [
        {
          category: "High-Performance Backend",
          skills: [
            { name: "Java Enterprise", icon: "fa-brands fa-java", description: "Robust distributed systems, multithreading, and advanced memory management." },
            { name: "Spring Boot", icon: "fa-brands fa-envira", description: "Microservices architecture, Spring Cloud, Spring Security, and Enterprise DI." },
            { name: "Node.js", icon: "fa-brands fa-node", description: "Event-driven architecture, Streams API, and horizontal scalability for high-concurrency services." },
            { name: "C# .NET", icon: "fa-brands fa-microsoft", description: "Corporate solutions development, LINQ, Entity Framework, and performance optimization." },
            { name: "Python", icon: "fa-brands fa-python", description: "Automation scripting, data analysis, and backend development with Django/FastAPI." }
          ]
        },
        {
          category: "Cloud Infrastructure & DevOps",
          skills: [
            { name: "Docker & Kubernetes", icon: "fa-brands fa-docker", description: "Container orchestration, CI/CD pipelines, and isolated environment management." },
            { name: "Supabase / Postgres", icon: "fas fa-database", description: "Complex schema design, Stored Procedures, Triggers, and index optimization." },
            { name: "Redis", icon: "fas fa-server", description: "Distributed caching strategies, Pub/Sub, and high-speed session management." },
            { name: "Linux Hardening", icon: "fa-brands fa-linux", description: "Server administration, bash scripting, and kernel-level security." }
          ]
        },
        {
          category: "Modern Frontend & Architecture",
          skills: [
            { name: "Angular", icon: "fa-brands fa-angular", description: "Scalable SPA applications, advanced RxJS, signals, and reactive state management." },
            { name: "Clean Architecture", icon: "fas fa-project-diagram", description: "Strict implementation of SOLID principles, DDD, and separation of concerns." },
            { name: "System Design", icon: "fas fa-sitemap", description: "High-level system design, design patterns, and architectural diagramming." }
          ]
        }
      ],
      projects: [
        {
          title: "Zarx \u2013 Integral Geospatial Management Platform",
          description: "Development of an advanced digital ecosystem designed for data centralization, citizen security, and territorial management. The application solves information fragmentation through a unified control panel integrating security tools, digital identity, and real-time data analysis.",
          image: "assets/img/cursos/certiicate/zarx.jpeg",
          techStack: ["Angular", "Java", "Python", "PostgreSQL", "Supabase"],
          features: [
            "Centralization: Integration of multiple modules (Finance, Identity, Security).",
            "Scalability: Real-time architecture for high volume data.",
            "Security: Identity verification protocols and fraud prevention."
          ],
          link: "https://zarx.arecofix.com.ar",
          featured: true
        },
        {
          title: "System Management for Ecommerce",
          description: "Comprehensive management system for E-commerce and Technical Services. Robust admin panel with real-time inventory control, sales management, service order tracking, clients, and detailed financial reports. Includes automated invoicing, payment gateway integration, and logistics modules.",
          image: "assets/img/cursos/certiicate/arecofix.png",
          techStack: ["Node.js", "Angular", "Supabase", "Redis", "Docker"],
          features: ["Inventory Management", "CRM & Sales", "Financial Reports", "Service Traceability"],
          link: environment.baseUrl
        },
        {
          title: "Enterprise ERP System with Java Spring",
          description: "Legacy to microservices re-engineering. Distributed system for real-time enterprise resource management.",
          image: "assets/img/projects/panel.png",
          techStack: ["Java 21", "Spring Boot 3", "Kafka", "PostgreSQL"],
          features: ["Event Sourcing", "Distributed Tracing", "CQRS Partner Integration"]
        }
      ],
      workExperience: [
        {
          position: "Electronics Repair Professor",
          company: "IAP Marcos Paz",
          period: "2025 - Present",
          description: "Mainly Cell Phone Repair. Teaching specialized courses in hardware repair, microelectronics, and fault diagnosis. Practical and theoretical technical training for future technicians.",
          techStack: ["Microelectronics", "Hardware", "Advanced Diagnosis"]
        },
        {
          position: "Technical Lead & Fullstack Developer",
          company: "Arecofix",
          period: "2020 - 2023",
          description: "Led the digital transformation of the business, designing the complete architecture of the management and sales system. Implemented CI/CD pipelines and optimized server performance by 300%.",
          techStack: ["Node.js", "Angular", "Supabase", "Docker"]
        },
        {
          position: "Software Development Instructor",
          company: "Eddis Educativa",
          period: "2022 - Present",
          description: "Training over 50 students in modern web technologies, mentoring final projects, and teaching industry best practices.",
          techStack: ["HTML/CSS/JS", "Logic Programming"]
        },
        {
          position: "Systems Technical Team",
          company: "Municipality of Marcos Paz",
          period: "Until 2023",
          description: "Maintenance and evolution of critical government systems. Database management and infrastructure support.",
          techStack: ["IT Support", "Networking", "Legacy Systems"]
        }
      ]
    }
  };
  backgroundOptions = [
    { id: "gradient-5", name: "Dark Gray", class: "bg-surface-dark" }
  ];
  constructor(preferencesService) {
    this.preferencesService = preferencesService;
  }
  get currentContent() {
    return this.portfolioContent[this.currentLanguage];
  }
  ngOnInit() {
    this.preferencesService.language$.subscribe((lang) => {
      this.currentLanguage = lang;
    });
    this.simulationSubscription = interval(2e3).subscribe(() => {
      this.simulateSystemActivity();
    });
    this.terminalOutput = [
      "> Initializing system...",
      "> Connected to Supabase Engine v2.0",
      "> Loading modules...",
      "> System ready."
    ];
  }
  ngOnDestroy() {
    if (this.simulationSubscription) {
      this.simulationSubscription.unsubscribe();
    }
  }
  simulateSystemActivity() {
    this.systemStatuses.forEach((stat) => {
      const variation = Math.floor(Math.random() * 10) - 5;
      stat.latency = Math.max(1, stat.latency + variation);
    });
    const logs = [
      "[INFO] GET /api/v1/products 200 OK",
      "[INFO] Auth Check: Token Valid",
      "[DEBUG] Cache Hit: user_profile_123",
      "[INFO] Supabase: Realtime subscription active",
      "[WARN] High CPU load on Node-Worker-1 (transient)"
    ];
    const randomLog = logs[Math.floor(Math.random() * logs.length)];
    this.terminalOutput.push(`> ${(/* @__PURE__ */ new Date()).toLocaleTimeString()} ${randomLog}`);
    if (this.terminalOutput.length > 8)
      this.terminalOutput.shift();
  }
  static \u0275fac = function PortfolioComponent_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _PortfolioComponent)(\u0275\u0275directiveInject(PreferencesService));
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _PortfolioComponent, selectors: [["app-portfolio"]], decls: 168, vars: 9, consts: [[1, "min-h-screen", "bg-surface-dark", "text-gray-300", "font-mono", "selection:bg-cyan-500/30", "selection:text-cyan-200", "overflow-x-hidden"], [1, "fixed", "inset-0", "z-0", "pointer-events-none", "opacity-20", 2, "background-image", "linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px)", "background-size", "40px 40px"], [1, "relative", "z-10", "pt-20", "pb-20", "lg:ml-20"], [1, "max-w-7xl", "mx-auto", "px-4", "sm:px-6", "lg:px-8", "space-y-24"], [1, "grid", "lg:grid-cols-2", "gap-12", "items-center"], [1, "space-y-8", "animate-fade-in-up"], [1, "space-y-4"], [1, "inline-flex", "items-center", "gap-2", "px-3", "py-1", "rounded-full", "bg-cyan-500/10", "border", "border-cyan-500/20", "text-cyan-400", "text-sm", "font-medium"], [1, "relative", "flex", "h-2", "w-2"], [1, "animate-ping", "absolute", "inline-flex", "h-full", "w-full", "rounded-full", "bg-cyan-400", "opacity-75"], [1, "relative", "inline-flex", "rounded-full", "h-2", "w-2", "bg-cyan-500"], [1, "text-5xl", "md:text-7xl", "font-bold", "text-white", "tracking-tight"], [1, "text-2xl", "md:text-3xl", "text-cyan-500", "font-semibold"], [1, "flex", "flex-col", "gap-2", "text-gray-300", "font-mono", "text-sm", "py-2"], [1, "flex", "items-center", "gap-2"], [1, "fas", "fa-phone", "text-cyan-500"], ["href", "tel:1125960900", 1, "hover:text-white", "transition-colors"], [1, "fas", "fa-envelope", "text-cyan-500"], ["href", "mailto:EzequielEnrico15@gmail.com", 1, "hover:text-white", "transition-colors"], [1, "text-lg", "text-gray-400", "max-w-xl", "leading-relaxed", "border-l-4", "border-cyan-700/50", "pl-4"], [1, "flex", "flex-wrap", "gap-4"], ["download", "", 1, "group", "relative", "px-8", "py-4", "bg-cyan-600", "hover:bg-cyan-500", "text-white", "font-bold", "rounded-lg", "transition-all", "shadow-[0_0_20px_rgba(8,145,178,0.3)]", "hover:shadow-[0_0_30px_rgba(8,145,178,0.5)]", "overflow-hidden", 3, "href"], [1, "absolute", "inset-0", "w-full", "h-full", "bg-linear-to-r", "from-transparent", "via-white/20", "to-transparent", "-translate-x-full", "group-hover:translate-x-full", "transition-transform", "duration-1000"], [1, "relative", "flex", "items-center", "gap-2"], [1, "fas", "fa-download"], ["target", "_blank", 1, "group", "relative", "px-8", "py-4", "bg-[#1a1d2d]", "border", "border-gray-700", "hover:border-cyan-500/50", "text-gray-300", "hover:text-white", "rounded-lg", "transition-all", 3, "href"], [1, "relative"], [1, "relative", "group"], [1, "absolute", "-inset-1", "bg-linear-to-r", "from-cyan-600", "to-blue-600", "rounded-lg", "blur", "opacity-25", "group-hover:opacity-50", "transition", "duration-1000", "group-hover:duration-200"], [1, "relative", "bg-[#0d1017]", "rounded-lg", "border", "border-gray-800", "shadow-2xl", "overflow-hidden", "font-mono", "text-sm", "leading-relaxed"], [1, "bg-[#1a1d2d]", "px-4", "py-2", "flex", "items-center", "gap-2", "border-b", "border-gray-800"], [1, "flex", "gap-2"], [1, "w-3", "h-3", "rounded-full", "bg-red-500"], [1, "w-3", "h-3", "rounded-full", "bg-yellow-500"], [1, "w-3", "h-3", "rounded-full", "bg-green-500"], [1, "text-gray-500", "text-xs", "ml-4"], [1, "p-6", "text-gray-300", "h-[300px]", "overflow-hidden", "flex", "flex-col", "justify-end"], [1, "opacity-50", "mb-4"], [1, "text-green-500"], [1, "text-cyan-400"], [1, "grid", "grid-cols-[120px_1fr]", "gap-6", "mb-4"], [1, "text-cyan-500", "select-none"], [1, "space-y-1", "text-xs", "md:text-sm"], [1, "text-cyan-500", "font-bold"], [1, "animate-fade-in-up"], [1, "flex", "items-center"], [1, "text-green-500", "mr-2"], [1, "animate-pulse"], [1, "grid", "grid-cols-2", "md:grid-cols-4", "gap-4"], [1, "bg-[#131620]", "border", "border-gray-800", "p-4", "rounded-xl", "hover:border-cyan-500/30", "transition-colors"], [1, "flex", "items-center", "gap-4", "mb-12"], [1, "text-3xl", "font-bold", "text-white"], [1, "text-cyan-500"], [1, "h-px", "flex-1", "bg-gray-800"], [1, "grid", "lg:grid-cols-3", "gap-8", "mb-16"], [1, "bg-[#131620]", "border", "border-gray-800", "p-8", "rounded-2xl", "hover:-translate-y-2", "transition-transform", "duration-300", "group"], [1, "bg-[#0d1017]", "rounded-xl", "border", "border-gray-800", "overflow-hidden", "shadow-2xl"], [1, "flex", "border-b", "border-gray-800", "overflow-x-auto"], [1, "px-6", "py-4", "text-sm", "font-medium", "border-r", "border-gray-800", "hover:bg-[#1a1d2d]", "transition-colors", "whitespace-nowrap", 3, "ngClass"], [1, "p-0", "grid", "md:grid-cols-[1fr_300px]"], [1, "bg-[#0d1017]", "p-6", "overflow-x-auto"], [1, "font-mono", "text-sm", "leading-relaxed"], [1, "language-typescript", "text-gray-300"], [1, "bg-[#131620]", "p-6", "border-l", "border-gray-800"], [1, "text-white", "font-bold", "mb-4"], [1, "text-gray-400", "text-sm", "leading-relaxed"], [1, "mt-8"], [1, "text-xs", "font-bold", "text-gray-500", "uppercase", "tracking-widest", "mb-3"], [1, "flex", "flex-wrap", "gap-2"], [1, "px-2", "py-1", "bg-cyan-900/30", "text-cyan-300", "text-xs", "rounded-md", "border", "border-cyan-500/20"], [1, "px-2", "py-1", "bg-blue-900/30", "text-blue-300", "text-xs", "rounded-md", "border", "border-blue-500/20"], [1, "px-2", "py-1", "bg-purple-900/30", "text-purple-300", "text-xs", "rounded-md", "border", "border-purple-500/20"], [1, "grid", "lg:grid-cols-3", "gap-8"], [1, "bg-surface-dark", "p-6", "rounded-2xl", "border", "border-gray-800/50", "hover:border-cyan-500/30", "transition-all", "duration-300"], [1, "relative", "border-l", "border-gray-800", "ml-4", "md:ml-8", "space-y-16"], [1, "relative", "pl-8", "md:pl-12"], [1, "pb-20"], [1, "grid", "md:grid-cols-2", "gap-8"], [3, "class"], [1, "text-center", "pt-20", "border-t", "border-gray-800"], [1, "text-3xl", "font-bold", "text-white", "mb-6"], [1, "flex", "justify-center", "gap-4"], ["routerLink", "/contacto", 1, "px-8", "py-3", "bg-cyan-600", "text-white", "rounded-lg", "font-bold", "hover:bg-cyan-500", "transition-colors", "shadow-lg", "shadow-cyan-500/20", "cursor-pointer"], [1, "mt-16", "text-left"], [3, "title"], [1, "mt-8", "text-gray-600", "font-mono", "text-xs", "text-center"], [1, "text-gray-500"], [1, "flex", "items-center", "justify-between", "mb-2"], [1, "text-gray-400", "text-sm"], [1, "animate-ping", "absolute", "inline-flex", "h-full", "w-full", "rounded-full", "bg-green-400", "opacity-75"], [1, "relative", "inline-flex", "rounded-full", "h-2", "w-2", "bg-green-500"], [1, "flex", "items-end", "justify-between"], [1, "text-xl", "font-mono", "text-white"], [1, "text-xs", "text-gray-500"], [1, "text-right"], [1, "text-sm", "font-mono", "text-cyan-500"], [1, "mt-3", "flex", "items-end", "gap-1", "h-8", "opacity-30"], [1, "flex-1", "bg-cyan-500", "h-[40%]", "rounded-xs"], [1, "flex-1", "bg-cyan-500", "h-[70%]", "rounded-xs"], [1, "flex-1", "bg-cyan-500", "h-[50%]", "rounded-xs"], [1, "flex-1", "bg-cyan-500", "h-[90%]", "rounded-xs"], [1, "flex-1", "bg-cyan-500", "h-[60%]", "rounded-xs"], [1, "flex-1", "bg-cyan-500", "h-[80%]", "rounded-xs"], [1, "w-14", "h-14", "bg-cyan-500/10", "rounded-lg", "flex", "items-center", "justify-center", "text-2xl", "text-cyan-500", "mb-6", "group-hover:bg-cyan-500", "group-hover:text-black", "transition-colors"], [1, "text-xl", "font-bold", "text-white", "mb-3"], [1, "text-gray-400", "leading-relaxed", "mb-6", "h-20"], [1, "grid", "grid-cols-2", "gap-4", "pt-6", "border-t", "border-gray-800/50"], [1, "text-2xl", "font-mono", "font-bold", "text-white"], [1, "text-xs", "text-gray-500", "uppercase", "tracking-wider"], [1, "px-6", "py-4", "text-sm", "font-medium", "border-r", "border-gray-800", "hover:bg-[#1a1d2d]", "transition-colors", "whitespace-nowrap", 3, "click", "ngClass"], [1, "text-xl", "font-bold", "text-white", "mb-6", "flex", "items-center", "gap-3"], [1, "fas", "fa-layer-group", "text-cyan-500"], [1, "space-y-6"], [1, "group", "flex", "gap-4", "items-start", "p-3", "rounded-lg", "hover:bg-gray-800/30", "transition-colors"], [1, "w-10", "h-10", "rounded-lg", "bg-[#1a1d2d]", "flex", "items-center", "justify-center", "shrink-0", "border", "border-gray-700/50", "group-hover:border-cyan-500/50", "group-hover:bg-cyan-900/10", "transition-all"], [1, "text-white", "font-bold", "text-sm", "tracking-wide", "group-hover:text-cyan-300", "transition-colors"], [1, "text-gray-500", "text-xs", "mt-1", "leading-relaxed"], [1, "absolute", "-left-3", "top-0", "w-6", "h-6", "rounded-full", "bg-[#0f111a]", "border-4", "border-cyan-600", "shadow-[0_0_10px_rgba(8,145,178,0.5)]"], [1, "flex", "flex-col", "md:flex-row", "md:justify-between", "md:items-start", "mb-4", "gap-2"], [1, "text-2xl", "font-bold", "text-white"], [1, "text-cyan-500", "text-lg"], [1, "px-4", "py-1", "bg-gray-800", "rounded-full", "text-xs", "font-mono", "text-gray-300", "border", "border-gray-700"], [1, "text-gray-400", "text-lg", "leading-relaxed", "mb-6", "max-w-4xl"], [1, "px-3", "py-1", "bg-[#1a1d2d]", "hover:bg-gray-800", "text-gray-300", "hover:text-white", "text-xs", "font-mono", "rounded", "border", "border-gray-700", "hover:border-cyan-500/50", "transition-colors"], [1, "text-cyan-500", "mr-1"], [1, "relative", "overflow-hidden", "h-64", "md:h-auto", "min-h-[350px]"], [1, "absolute", "inset-0", "bg-cyan-900/20", "z-10", "mix-blend-overlay"], ["fill", "", 1, "object-cover", "w-full", "h-full", "transform", "scale-100", "group-hover:scale-110", "transition-transform", "duration-700", 3, "ngSrc"], [1, "p-6", "md:p-10", "flex", "flex-col", "justify-center"], [1, "inline-flex", "items-center", "gap-2", "mb-4"], [1, "px-2", "py-1", "rounded", "bg-cyan-500", "text-black", "text-xs", "font-bold", "uppercase", "tracking-wider"], [1, "w-2", "h-2", "rounded-full", "bg-green-500", "animate-pulse"], [1, "text-3xl", "font-bold", "text-white", "mb-4", "leading-tight"], [1, "text-gray-300", "mb-6", "text-lg", "leading-relaxed"], [1, "mb-8", "space-y-3"], [1, "flex", "flex-wrap", "gap-2", "mb-8"], [1, "text-sm", "font-medium", "text-cyan-300", "bg-cyan-950/50", "px-3", "py-1.5", "rounded", "border", "border-cyan-500/20"], [1, "flex", "gap-4", "mt-auto"], ["target", "_blank", 1, "px-6", "py-3", "bg-cyan-600", "hover:bg-cyan-500", "text-white", "font-bold", "rounded-lg", "transition-colors", "flex", "items-center", "gap-2", "shadow-lg", "shadow-cyan-500/20", 3, "href"], [1, "flex", "items-start", "gap-3", "text-sm", "text-gray-400"], [1, "fas", "fa-check-circle", "text-cyan-500", "mt-1", "shrink-0"], [1, "fas", "fa-rocket"], [1, "aspect-video", "bg-gray-900", "relative", "overflow-hidden"], [1, "absolute", "inset-0", "bg-linear-to-b", "from-transparent", "to-[#131620]", "z-10", "opacity-90", "transition-opacity", "group-hover:opacity-40"], ["fill", "", 1, "object-cover", "transform", "scale-100", "group-hover:scale-110", "transition-transform", "duration-700", "opacity-50", "group-hover:opacity-100", 3, "ngSrc"], [1, "p-8", "relative", "z-20", "-mt-10"], [1, "text-2xl", "font-bold", "text-white", "mb-2"], [1, "text-gray-400", "mb-6", "line-clamp-2", "h-12"], [1, "flex", "flex-wrap", "gap-2", "mb-6"], [1, "text-xs", "text-cyan-400", "bg-cyan-900/20", "px-2", "py-1", "rounded", "border", "border-cyan-500/20"], [1, "flex", "gap-4"], ["target", "_blank", 1, "text-sm", "font-bold", "text-white", "hover:text-cyan-400", "transition-colors", "flex", "items-center", "gap-1", 3, "href"], [1, "fas", "fa-external-link-alt"], [1, "fab", "fa-github"]], template: function PortfolioComponent_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0);
      \u0275\u0275element(1, "div", 1);
      \u0275\u0275elementStart(2, "div", 2)(3, "div", 3)(4, "section", 4)(5, "div", 5)(6, "div", 6)(7, "div", 7)(8, "span", 8);
      \u0275\u0275element(9, "span", 9)(10, "span", 10);
      \u0275\u0275elementEnd();
      \u0275\u0275text(11, " Available for Hire ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(12, "h1", 11);
      \u0275\u0275text(13);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(14, "h2", 12);
      \u0275\u0275text(15);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(16, "div", 13)(17, "div", 14);
      \u0275\u0275element(18, "i", 15);
      \u0275\u0275elementStart(19, "a", 16);
      \u0275\u0275text(20, "1125960900");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(21, "div", 14);
      \u0275\u0275element(22, "i", 17);
      \u0275\u0275elementStart(23, "a", 18);
      \u0275\u0275text(24, "EzequielEnrico15@gmail.com");
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(25, "p", 19);
      \u0275\u0275text(26);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(27, "div", 20)(28, "a", 21);
      \u0275\u0275element(29, "div", 22);
      \u0275\u0275elementStart(30, "span", 23);
      \u0275\u0275element(31, "i", 24);
      \u0275\u0275text(32, " Download CV ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(33, "a", 25)(34, "span", 26);
      \u0275\u0275text(35, "LinkedIn");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(36, "a", 25)(37, "span", 26);
      \u0275\u0275text(38, "GitHub");
      \u0275\u0275elementEnd()()()();
      \u0275\u0275elementStart(39, "div", 27);
      \u0275\u0275element(40, "div", 28);
      \u0275\u0275elementStart(41, "div", 29)(42, "div", 30)(43, "div", 31);
      \u0275\u0275element(44, "div", 32)(45, "div", 33)(46, "div", 34);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(47, "div", 35);
      \u0275\u0275text(48, "root@server:~");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(49, "div", 36)(50, "div", 37)(51, "span", 38);
      \u0275\u0275text(52, "\u279C");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(53, "span", 39);
      \u0275\u0275text(54, "~");
      \u0275\u0275elementEnd();
      \u0275\u0275text(55, " neofetch ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(56, "div", 40)(57, "div", 41);
      \u0275\u0275text(58, " _ _ (o)(o) / \\ (_/__\\_) _/ \\_ ");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(59, "div", 42)(60, "div")(61, "span", 43);
      \u0275\u0275text(62, "OS");
      \u0275\u0275elementEnd();
      \u0275\u0275text(63, ": Arch Linux x86_64");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(64, "div")(65, "span", 43);
      \u0275\u0275text(66, "Kernel");
      \u0275\u0275elementEnd();
      \u0275\u0275text(67, ": 5.15.0-76-generic");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(68, "div")(69, "span", 43);
      \u0275\u0275text(70, "Uptime");
      \u0275\u0275elementEnd();
      \u0275\u0275text(71, ": 5 years, 3 months");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(72, "div")(73, "span", 43);
      \u0275\u0275text(74, "Shell");
      \u0275\u0275elementEnd();
      \u0275\u0275text(75, ": zsh 5.8");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(76, "div")(77, "span", 43);
      \u0275\u0275text(78, "Backend");
      \u0275\u0275elementEnd();
      \u0275\u0275text(79, ": Node.js, Python, Java");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(80, "div")(81, "span", 43);
      \u0275\u0275text(82, "Database");
      \u0275\u0275elementEnd();
      \u0275\u0275text(83, ": Supabase (PostgreSQL), Redis");
      \u0275\u0275elementEnd()()();
      \u0275\u0275repeaterCreate(84, PortfolioComponent_For_85_Template, 3, 1, "div", 44, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementStart(86, "div", 45)(87, "span", 46);
      \u0275\u0275text(88, "\u279C");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(89, "span", 47);
      \u0275\u0275text(90, "_");
      \u0275\u0275elementEnd()()()()()();
      \u0275\u0275elementStart(91, "section", 48);
      \u0275\u0275repeaterCreate(92, PortfolioComponent_For_93_Template, 26, 3, "div", 49, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(94, "section")(95, "div", 50)(96, "h2", 51);
      \u0275\u0275text(97, "Engineering ");
      \u0275\u0275elementStart(98, "span", 52);
      \u0275\u0275text(99, "Excellence");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(100, "div", 53);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(101, "div", 54);
      \u0275\u0275repeaterCreate(102, PortfolioComponent_For_103_Template, 10, 4, "div", 55, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(104, "div", 56)(105, "div", 57);
      \u0275\u0275repeaterCreate(106, PortfolioComponent_For_107_Template, 2, 2, "button", 58, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(108, "div", 59)(109, "div", 60)(110, "pre", 61)(111, "code", 62);
      \u0275\u0275text(112);
      \u0275\u0275elementEnd()()();
      \u0275\u0275elementStart(113, "div", 63)(114, "h4", 64);
      \u0275\u0275text(115, "Code Analysis");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(116, "p", 65);
      \u0275\u0275text(117);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(118, "div", 66)(119, "div", 67);
      \u0275\u0275text(120, "Tech Stack");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(121, "div", 68)(122, "span", 69);
      \u0275\u0275text(123, "TypeScript");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(124, "span", 70);
      \u0275\u0275text(125, "Clean Arch");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(126, "span", 71);
      \u0275\u0275text(127, "Solid");
      \u0275\u0275elementEnd()()()()()()();
      \u0275\u0275elementStart(128, "section")(129, "div", 50)(130, "h2", 51);
      \u0275\u0275text(131, "Technical ");
      \u0275\u0275elementStart(132, "span", 52);
      \u0275\u0275text(133, "Mastery");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(134, "div", 53);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(135, "div", 72);
      \u0275\u0275repeaterCreate(136, PortfolioComponent_For_137_Template, 7, 1, "div", 73, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(138, "section")(139, "div", 50)(140, "h2", 51);
      \u0275\u0275text(141, "Experience ");
      \u0275\u0275elementStart(142, "span", 52);
      \u0275\u0275text(143, "Log");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(144, "div", 53);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(145, "div", 74);
      \u0275\u0275repeaterCreate(146, PortfolioComponent_For_147_Template, 15, 4, "div", 75, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(148, "section", 76)(149, "div", 50)(150, "h2", 51);
      \u0275\u0275text(151, "Deployed ");
      \u0275\u0275elementStart(152, "span", 52);
      \u0275\u0275text(153, "Systems");
      \u0275\u0275elementEnd()();
      \u0275\u0275element(154, "div", 53);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(155, "div", 77);
      \u0275\u0275repeaterCreate(156, PortfolioComponent_For_157_Template, 3, 4, "div", 78, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(158, "div", 79)(159, "h2", 80);
      \u0275\u0275text(160, "Ready to Scale Your Team?");
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(161, "div", 81)(162, "a", 82);
      \u0275\u0275text(163, " Initialize Contact Protocol ");
      \u0275\u0275elementEnd()();
      \u0275\u0275elementStart(164, "div", 83);
      \u0275\u0275element(165, "app-certificate-gallery", 84);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(166, "p", 85);
      \u0275\u0275text(167, " SYSTEM_ID: EZEQUIEL-ENRICO-V2.5.0 // STATUS: ONLINE ");
      \u0275\u0275elementEnd()()()()();
    }
    if (rf & 2) {
      \u0275\u0275advance(13);
      \u0275\u0275textInterpolate1(" ", ctx.currentContent.name, " ");
      \u0275\u0275advance(2);
      \u0275\u0275textInterpolate1(" ", ctx.currentContent.role, " ");
      \u0275\u0275advance(11);
      \u0275\u0275textInterpolate1(" ", ctx.currentContent.tagline, " ");
      \u0275\u0275advance(2);
      \u0275\u0275property("href", ctx.currentContent.cvUrl, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(5);
      \u0275\u0275property("href", ctx.currentContent.linkedin, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(3);
      \u0275\u0275property("href", ctx.currentContent.github, \u0275\u0275sanitizeUrl);
      \u0275\u0275advance(48);
      \u0275\u0275repeater(ctx.terminalOutput);
      \u0275\u0275advance(8);
      \u0275\u0275repeater(ctx.systemStatuses);
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.currentContent.backendHighlights);
      \u0275\u0275advance(4);
      \u0275\u0275repeater(ctx.currentContent.codeSnippets);
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.currentContent.codeSnippets[ctx.activeSnippetIndex].code);
      \u0275\u0275advance(5);
      \u0275\u0275textInterpolate1(" ", ctx.currentContent.codeSnippets[ctx.activeSnippetIndex].description, " ");
      \u0275\u0275advance(19);
      \u0275\u0275repeater(ctx.currentContent.technicalSkills);
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.currentContent.workExperience);
      \u0275\u0275advance(10);
      \u0275\u0275repeater(ctx.currentContent.projects);
      \u0275\u0275advance(9);
      \u0275\u0275property("title", "Verified Credentials");
    }
  }, dependencies: [CommonModule, NgClass, RouterLink, CertificateGalleryComponent, NgOptimizedImage], styles: ["\n\n/*# sourceMappingURL=portfolio.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(PortfolioComponent, [{
    type: Component,
    args: [{ selector: "app-portfolio", standalone: true, imports: [CommonModule, RouterLink, CertificateGalleryComponent, NgOptimizedImage], template: `<div class="min-h-screen bg-surface-dark text-gray-300 font-mono selection:bg-cyan-500/30 selection:text-cyan-200 overflow-x-hidden">\r
\r
  <!-- Background Grid Effect -->\r
  <div class="fixed inset-0 z-0 pointer-events-none opacity-20"\r
    style="background-image: linear-gradient(#1f2937 1px, transparent 1px), linear-gradient(90deg, #1f2937 1px, transparent 1px); background-size: 40px 40px;">\r
  </div>\r
\r
  <!-- Main Content Wrapper -->\r
  <div class="relative z-10 pt-20 pb-20 lg:ml-20"> <!-- Margin left for sidebar if exists, adjusted -->\r
\r
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24">\r
\r
      <!-- HERO SECTION -->\r
      <section class="grid lg:grid-cols-2 gap-12 items-center">\r
        <div class="space-y-8 animate-fade-in-up">\r
          <div class="space-y-4">\r
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 text-sm font-medium">\r
              <span class="relative flex h-2 w-2">\r
                <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>\r
                <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>\r
              </span>\r
              Available for Hire\r
            </div>\r
            <h1 class="text-5xl md:text-7xl font-bold text-white tracking-tight">\r
              {{ currentContent.name }}\r
            </h1>\r
            <h2 class="text-2xl md:text-3xl text-cyan-500 font-semibold">\r
              {{ currentContent.role }}\r
            </h2>\r
            <div class="flex flex-col gap-2 text-gray-300 font-mono text-sm py-2">\r
              <div class="flex items-center gap-2">\r
                <i class="fas fa-phone text-cyan-500"></i>\r
                <a href="tel:1125960900" class="hover:text-white transition-colors">1125960900</a>\r
              </div>\r
              <div class="flex items-center gap-2">\r
                <i class="fas fa-envelope text-cyan-500"></i>\r
                <a href="mailto:EzequielEnrico15@gmail.com" class="hover:text-white transition-colors">EzequielEnrico15@gmail.com</a>\r
              </div>\r
            </div>\r
            <p class="text-lg text-gray-400 max-w-xl leading-relaxed border-l-4 border-cyan-700/50 pl-4">\r
              {{ currentContent.tagline }}\r
            </p>\r
          </div>\r
\r
          <div class="flex flex-wrap gap-4">\r
            <a [href]="currentContent.cvUrl" download class="group relative px-8 py-4 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-all shadow-[0_0_20px_rgba(8,145,178,0.3)] hover:shadow-[0_0_30px_rgba(8,145,178,0.5)] overflow-hidden">\r
              <div class="absolute inset-0 w-full h-full bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>\r
              <span class="relative flex items-center gap-2">\r
                <i class="fas fa-download"></i> Download CV\r
              </span>\r
            </a>\r
            <a [href]="currentContent.linkedin" target="_blank" class="group relative px-8 py-4 bg-[#1a1d2d] border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white rounded-lg transition-all">\r
              <span class="relative">LinkedIn</span>\r
            </a>\r
            <a [href]="currentContent.github" target="_blank" class="group relative px-8 py-4 bg-[#1a1d2d] border border-gray-700 hover:border-cyan-500/50 text-gray-300 hover:text-white rounded-lg transition-all">\r
              <span class="relative">GitHub</span>\r
            </a>\r
          </div>\r
        </div>\r
\r
        <!-- HERO TERMINAL -->\r
        <div class="relative group">\r
          <div class="absolute -inset-1 bg-linear-to-r from-cyan-600 to-blue-600 rounded-lg blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>\r
          <div class="relative bg-[#0d1017] rounded-lg border border-gray-800 shadow-2xl overflow-hidden font-mono text-sm leading-relaxed">\r
            <!-- Terminal Header -->\r
            <div class="bg-[#1a1d2d] px-4 py-2 flex items-center gap-2 border-b border-gray-800">\r
              <div class="flex gap-2">\r
                <div class="w-3 h-3 rounded-full bg-red-500"></div>\r
                <div class="w-3 h-3 rounded-full bg-yellow-500"></div>\r
                <div class="w-3 h-3 rounded-full bg-green-500"></div>\r
              </div>\r
              <div class="text-gray-500 text-xs ml-4">root@server:~</div>\r
            </div>\r
            <!-- Terminal Body -->\r
            <div class="p-6 text-gray-300 h-[300px] overflow-hidden flex flex-col justify-end">\r
              <div class="opacity-50 mb-4">\r
                <span class="text-green-500">\u279C</span> <span class="text-cyan-400">~</span> neofetch\r
              </div>\r
              <div class="grid grid-cols-[120px_1fr] gap-6 mb-4">\r
                <div class="text-cyan-500 select-none">\r
                  _  _\r
                  (o)(o)\r
                  /    \\\r
                  (_/__\\_)\r
                  _/      \\_\r
                </div>\r
                <div class="space-y-1 text-xs md:text-sm">\r
                  <div><span class="text-cyan-500 font-bold">OS</span>: Arch Linux x86_64</div>\r
                  <div><span class="text-cyan-500 font-bold">Kernel</span>: 5.15.0-76-generic</div>\r
                  <div><span class="text-cyan-500 font-bold">Uptime</span>: 5 years, 3 months</div>\r
                  <div><span class="text-cyan-500 font-bold">Shell</span>: zsh 5.8</div>\r
                  <div><span class="text-cyan-500 font-bold">Backend</span>: Node.js, Python, Java</div>\r
                  <div><span class="text-cyan-500 font-bold">Database</span>: Supabase (PostgreSQL), Redis</div>\r
                </div>\r
              </div>\r
              @for (line of terminalOutput; track line) {\r
                <div class="animate-fade-in-up">\r
                  <span class="text-gray-500">{{line}}</span>\r
                </div>\r
              }\r
              <div class="flex items-center">\r
                <span class="text-green-500 mr-2">\u279C</span>\r
                <span class="animate-pulse">_</span>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </section>\r
\r
      <!-- SYSTEM STATUS / DASHBOARD -->\r
      <section class="grid grid-cols-2 md:grid-cols-4 gap-4">\r
        @for (status of systemStatuses; track status) {\r
          <div class="bg-[#131620] border border-gray-800 p-4 rounded-xl hover:border-cyan-500/30 transition-colors">\r
            <div class="flex items-center justify-between mb-2">\r
              <span class="text-gray-400 text-sm">{{ status.name }}</span>\r
              <div class="flex items-center gap-2">\r
                <span class="relative flex h-2 w-2">\r
                  <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>\r
                  <span class="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>\r
                </span>\r
              </div>\r
            </div>\r
            <div class="flex items-end justify-between">\r
              <div>\r
                <div class="text-xl font-mono text-white">{{ status.latency }}ms</div>\r
                <div class="text-xs text-gray-500">Latency</div>\r
              </div>\r
              <div class="text-right">\r
                <div class="text-sm font-mono text-cyan-500">{{ status.uptime }}</div>\r
                <div class="text-xs text-gray-500">Uptime</div>\r
              </div>\r
            </div>\r
            <!-- Tiny chart visualization -->\r
            <div class="mt-3 flex items-end gap-1 h-8 opacity-30">\r
              <div class="flex-1 bg-cyan-500 h-[40%] rounded-xs"></div>\r
              <div class="flex-1 bg-cyan-500 h-[70%] rounded-xs"></div>\r
              <div class="flex-1 bg-cyan-500 h-[50%] rounded-xs"></div>\r
              <div class="flex-1 bg-cyan-500 h-[90%] rounded-xs"></div>\r
              <div class="flex-1 bg-cyan-500 h-[60%] rounded-xs"></div>\r
              <div class="flex-1 bg-cyan-500 h-[80%] rounded-xs"></div>\r
            </div>\r
          </div>\r
        }\r
      </section>\r
\r
      <!-- BACKEND HIGHLIGHTS & ARCHITECTURE -->\r
      <section>\r
        <div class="flex items-center gap-4 mb-12">\r
          <h2 class="text-3xl font-bold text-white">Engineering <span class="text-cyan-500">Excellence</span></h2>\r
          <div class="h-px flex-1 bg-gray-800"></div>\r
        </div>\r
\r
        <div class="grid lg:grid-cols-3 gap-8 mb-16">\r
          @for (item of currentContent.backendHighlights; track item) {\r
            <div class="bg-[#131620] border border-gray-800 p-8 rounded-2xl hover:-translate-y-2 transition-transform duration-300 group">\r
              <div class="w-14 h-14 bg-cyan-500/10 rounded-lg flex items-center justify-center text-2xl text-cyan-500 mb-6 group-hover:bg-cyan-500 group-hover:text-black transition-colors">\r
                <i [class]="item.icon"></i>\r
              </div>\r
              <h3 class="text-xl font-bold text-white mb-3">{{ item.title }}</h3>\r
              <p class="text-gray-400 leading-relaxed mb-6 h-20">{{ item.description }}</p>\r
              <div class="grid grid-cols-2 gap-4 pt-6 border-t border-gray-800/50">\r
                @for (stat of item.stats; track stat) {\r
                  <div>\r
                    <div class="text-2xl font-mono font-bold text-white">{{ stat.value }}</div>\r
                    <div class="text-xs text-gray-500 uppercase tracking-wider">{{ stat.label }}</div>\r
                  </div>\r
                }\r
              </div>\r
            </div>\r
          }\r
        </div>\r
\r
        <!-- Code Snippet Viewer -->\r
        <div class="bg-[#0d1017] rounded-xl border border-gray-800 overflow-hidden shadow-2xl">\r
          <div class="flex border-b border-gray-800 overflow-x-auto">\r
            @for (snippet of currentContent.codeSnippets; track snippet; let i = $index) {\r
              <button\r
                (click)="activeSnippetIndex = i"\r
                class="px-6 py-4 text-sm font-medium border-r border-gray-800 hover:bg-[#1a1d2d] transition-colors whitespace-nowrap"\r
                [ngClass]="activeSnippetIndex === i ? 'bg-[#1a1d2d] text-cyan-400 border-b-2 border-b-cyan-500' : 'text-gray-500'">\r
                {{ snippet.title }}\r
              </button>\r
            }\r
          </div>\r
          <div class="p-0 grid md:grid-cols-[1fr_300px]">\r
            <div class="bg-[#0d1017] p-6 overflow-x-auto">\r
              <pre class="font-mono text-sm leading-relaxed"><code class="language-typescript text-gray-300">{{ currentContent.codeSnippets[activeSnippetIndex].code }}</code></pre>\r
            </div>\r
            <div class="bg-[#131620] p-6 border-l border-gray-800">\r
              <h4 class="text-white font-bold mb-4">Code Analysis</h4>\r
              <p class="text-gray-400 text-sm leading-relaxed">\r
                {{ currentContent.codeSnippets[activeSnippetIndex].description }}\r
              </p>\r
              <div class="mt-8">\r
                <div class="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">Tech Stack</div>\r
                <div class="flex flex-wrap gap-2">\r
                  <span class="px-2 py-1 bg-cyan-900/30 text-cyan-300 text-xs rounded-md border border-cyan-500/20">TypeScript</span>\r
                  <span class="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs rounded-md border border-blue-500/20">Clean Arch</span>\r
                  <span class="px-2 py-1 bg-purple-900/30 text-purple-300 text-xs rounded-md border border-purple-500/20">Solid</span>\r
                </div>\r
              </div>\r
            </div>\r
          </div>\r
        </div>\r
      </section>\r
\r
      <!-- SKILLS WITH METERS -->\r
      <!-- SKILLS MATRIX -->\r
      <section>\r
        <div class="flex items-center gap-4 mb-12">\r
          <h2 class="text-3xl font-bold text-white">Technical <span class="text-cyan-500">Mastery</span></h2>\r
          <div class="h-px flex-1 bg-gray-800"></div>\r
        </div>\r
\r
        <div class="grid lg:grid-cols-3 gap-8">\r
          @for (category of currentContent.technicalSkills; track category) {\r
            <div class="bg-surface-dark p-6 rounded-2xl border border-gray-800/50 hover:border-cyan-500/30 transition-all duration-300">\r
              <h3 class="text-xl font-bold text-white mb-6 flex items-center gap-3">\r
                <i class="fas fa-layer-group text-cyan-500"></i>\r
                {{ category.category }}\r
              </h3>\r
              <div class="space-y-6">\r
                @for (skill of category.skills; track skill) {\r
                  <div class="group flex gap-4 items-start p-3 rounded-lg hover:bg-gray-800/30 transition-colors">\r
                    <div class="w-10 h-10 rounded-lg bg-[#1a1d2d] flex items-center justify-center shrink-0 border border-gray-700/50 group-hover:border-cyan-500/50 group-hover:bg-cyan-900/10 transition-all">\r
                      <i [class]="skill.icon + ' text-xl text-gray-400 group-hover:text-cyan-400 transition-colors'"></i>\r
                    </div>\r
                    <div>\r
                      <h4 class="text-white font-bold text-sm tracking-wide group-hover:text-cyan-300 transition-colors">{{ skill.name }}</h4>\r
                      <p class="text-gray-500 text-xs mt-1 leading-relaxed">{{ skill.description }}</p>\r
                    </div>\r
                  </div>\r
                }\r
              </div>\r
            </div>\r
          }\r
        </div>\r
      </section>\r
\r
      <!-- EXPERIENCE -->\r
      <section>\r
        <div class="flex items-center gap-4 mb-12">\r
          <h2 class="text-3xl font-bold text-white">Experience <span class="text-cyan-500">Log</span></h2>\r
          <div class="h-px flex-1 bg-gray-800"></div>\r
        </div>\r
\r
        <div class="relative border-l border-gray-800 ml-4 md:ml-8 space-y-16">\r
          @for (exp of currentContent.workExperience; track exp) {\r
            <div class="relative pl-8 md:pl-12">\r
              <!-- Timeline Dot -->\r
              <div class="absolute -left-3 top-0 w-6 h-6 rounded-full bg-[#0f111a] border-4 border-cyan-600 shadow-[0_0_10px_rgba(8,145,178,0.5)]"></div>\r
              <div class="flex flex-col md:flex-row md:justify-between md:items-start mb-4 gap-2">\r
                <div>\r
                  <h3 class="text-2xl font-bold text-white">{{ exp.position }}</h3>\r
                  <div class="text-cyan-500 text-lg">{{ exp.company }}</div>\r
                </div>\r
                <div class="px-4 py-1 bg-gray-800 rounded-full text-xs font-mono text-gray-300 border border-gray-700">\r
                  {{ exp.period }}\r
                </div>\r
              </div>\r
              <p class="text-gray-400 text-lg leading-relaxed mb-6 max-w-4xl">\r
                {{ exp.description }}\r
              </p>\r
              <div class="flex flex-wrap gap-2">\r
                @for (tech of exp.techStack; track tech) {\r
                  <span class="px-3 py-1 bg-[#1a1d2d] hover:bg-gray-800 text-gray-300 hover:text-white text-xs font-mono rounded border border-gray-700 hover:border-cyan-500/50 transition-colors">\r
                    <span class="text-cyan-500 mr-1">$</span> {{ tech }}\r
                  </span>\r
                }\r
              </div>\r
            </div>\r
          }\r
        </div>\r
      </section>\r
\r
      <!-- PROJECTS SHOWCASE -->\r
      <section class="pb-20">\r
        <div class="flex items-center gap-4 mb-12">\r
          <h2 class="text-3xl font-bold text-white">Deployed <span class="text-cyan-500">Systems</span></h2>\r
          <div class="h-px flex-1 bg-gray-800"></div>\r
        </div>\r
\r
        <div class="grid md:grid-cols-2 gap-8">\r
          @for (project of currentContent.projects; track project) {\r
            <div\r
              [class]="project.featured ? 'group relative bg-[#131620]/80 backdrop-blur-sm rounded-xl overflow-hidden border border-cyan-500/50 shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-300 md:col-span-2 grid md:grid-cols-2' : 'group relative bg-[#131620] rounded-xl overflow-hidden border border-gray-800 hover:border-cyan-500/50 transition-all duration-300'">\r
              <!-- Featured Project Layout -->\r
              @if (project.featured) {\r
                <div class="relative overflow-hidden h-64 md:h-auto min-h-[350px]">\r
                  <div class="absolute inset-0 bg-cyan-900/20 z-10 mix-blend-overlay"></div>\r
                  <img [ngSrc]="project.image" class="object-cover w-full h-full transform scale-100 group-hover:scale-110 transition-transform duration-700" fill />\r
                </div>\r
                <div class="p-6 md:p-10 flex flex-col justify-center">\r
                  <div class="inline-flex items-center gap-2 mb-4">\r
                    <span class="px-2 py-1 rounded bg-cyan-500 text-black text-xs font-bold uppercase tracking-wider">Featured</span>\r
                    <span class="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>\r
                  </div>\r
                  <h3 class="text-3xl font-bold text-white mb-4 leading-tight">{{ project.title }}</h3>\r
                  <p class="text-gray-300 mb-6 text-lg leading-relaxed">{{ project.description }}</p>\r
                  @if (project.features) {\r
                    <ul class="mb-8 space-y-3">\r
                      @for (feature of project.features; track feature) {\r
                        <li class="flex items-start gap-3 text-sm text-gray-400">\r
                          <i class="fas fa-check-circle text-cyan-500 mt-1 shrink-0"></i>\r
                          <span>{{ feature }}</span>\r
                        </li>\r
                      }\r
                    </ul>\r
                  }\r
                  <div class="flex flex-wrap gap-2 mb-8">\r
                    @for (tag of project.techStack; track tag) {\r
                      <span class="text-sm font-medium text-cyan-300 bg-cyan-950/50 px-3 py-1.5 rounded border border-cyan-500/20">\r
                        {{ tag }}\r
                      </span>\r
                    }\r
                  </div>\r
                  <div class="flex gap-4 mt-auto">\r
                    @if (project.link) {\r
                      <a [href]="project.link" target="_blank" class="px-6 py-3 bg-cyan-600 hover:bg-cyan-500 text-white font-bold rounded-lg transition-colors flex items-center gap-2 shadow-lg shadow-cyan-500/20">\r
                        <i class="fas fa-rocket"></i> View Project\r
                      </a>\r
                    }\r
                  </div>\r
                </div>\r
              }\r
              <!-- Standard Project Layout -->\r
              @if (!project.featured) {\r
                <div class="aspect-video bg-gray-900 relative overflow-hidden">\r
                  <div class="absolute inset-0 bg-linear-to-b from-transparent to-[#131620] z-10 opacity-90 transition-opacity group-hover:opacity-40"></div>\r
                  <img [ngSrc]="project.image" class="object-cover transform scale-100 group-hover:scale-110 transition-transform duration-700 opacity-50 group-hover:opacity-100" fill />\r
                </div>\r
                <div class="p-8 relative z-20 -mt-10">\r
                  <h3 class="text-2xl font-bold text-white mb-2">{{ project.title }}</h3>\r
                  <p class="text-gray-400 mb-6 line-clamp-2 h-12">{{ project.description }}</p>\r
                  <div class="flex flex-wrap gap-2 mb-6">\r
                    @for (tag of project.techStack; track tag) {\r
                      <span class="text-xs text-cyan-400 bg-cyan-900/20 px-2 py-1 rounded border border-cyan-500/20">\r
                        {{ tag }}\r
                      </span>\r
                    }\r
                  </div>\r
                  <div class="flex gap-4">\r
                    @if (project.link) {\r
                      <a [href]="project.link" target="_blank" class="text-sm font-bold text-white hover:text-cyan-400 transition-colors flex items-center gap-1">\r
                        <i class="fas fa-external-link-alt"></i> Live Demo\r
                      </a>\r
                    }\r
                    @if (project.github) {\r
                      <a [href]="project.github" target="_blank" class="text-sm font-bold text-white hover:text-cyan-400 transition-colors flex items-center gap-1">\r
                        <i class="fab fa-github"></i> Source Code\r
                      </a>\r
                    }\r
                  </div>\r
                </div>\r
              }\r
            </div>\r
          }\r
        </div>\r
      </section>\r
\r
      <!-- Footer / Contact CTA -->\r
      <div class="text-center pt-20 border-t border-gray-800">\r
        <h2 class="text-3xl font-bold text-white mb-6">Ready to Scale Your Team?</h2>\r
        <div class="flex justify-center gap-4">\r
          <a routerLink="/contacto" class="px-8 py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-500 transition-colors shadow-lg shadow-cyan-500/20 cursor-pointer">\r
            Initialize Contact Protocol\r
          </a>\r
        </div>\r
\r
        <div class="mt-16 text-left">\r
          <app-certificate-gallery [title]="'Verified Credentials'"></app-certificate-gallery>\r
        </div>\r
\r
        <p class="mt-8 text-gray-600 font-mono text-xs text-center">\r
          SYSTEM_ID: EZEQUIEL-ENRICO-V2.5.0 // STATUS: ONLINE\r
        </p>\r
      </div>\r
\r
    </div>\r
  </div>\r
</div>\r
`, styles: ["/* src/app/public/portfolio/portfolio.css */\n/*# sourceMappingURL=portfolio.css.map */\n"] }]
  }], () => [{ type: PreferencesService }], null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(PortfolioComponent, { className: "PortfolioComponent", filePath: "src/app/public/portfolio/portfolio.ts", lineNumber: 78 });
})();
export {
  PortfolioComponent
};
//# sourceMappingURL=chunk-IY4UYDES.js.map
