import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-ZWWV2735.mjs";
import "./chunk-7NQOFK7J.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  CommonModule,
  DatePipe
} from "./chunk-YFUS3N4N.mjs";
import {
  Component,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵdomElement,
  ɵɵdomElementEnd,
  ɵɵdomElementStart,
  ɵɵdomListener,
  ɵɵdomProperty,
  ɵɵgetCurrentView,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind2,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1
} from "./chunk-CGATP5QV.mjs";
import {
  __spreadProps,
  __spreadValues
} from "./chunk-ML5XS5HX.mjs";

// src/app/admin/messages/admin-messages-page.ts
var _forTrack0 = ($index, $item) => $item.id;
function AdminMessagesPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 3);
    \u0275\u0275domElement(1, "span", 5);
    \u0275\u0275domElementEnd();
  }
}
function AdminMessagesPage_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 4);
    \u0275\u0275domElement(1, "i", 6);
    \u0275\u0275domElementStart(2, "span");
    \u0275\u0275text(3, "No hay mensajes nuevos.");
    \u0275\u0275domElementEnd()();
  }
}
function AdminMessagesPage_Conditional_6_For_1_Conditional_7_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span", 14);
    \u0275\u0275text(1, "Nuevo");
    \u0275\u0275domElementEnd();
  }
}
function AdminMessagesPage_Conditional_6_For_1_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "span");
    \u0275\u0275domElement(1, "i", 27);
    \u0275\u0275text(2);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const msg_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1(" ", msg_r2.phone);
  }
}
function AdminMessagesPage_Conditional_6_For_1_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275domElementStart(0, "div", 19);
    \u0275\u0275text(1);
    \u0275\u0275domElementEnd();
  }
  if (rf & 2) {
    const msg_r2 = \u0275\u0275nextContext().$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1("Asunto: ", msg_r2.subject);
  }
}
function AdminMessagesPage_Conditional_6_For_1_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "button", 28);
    \u0275\u0275domListener("click", function AdminMessagesPage_Conditional_6_For_1_Conditional_21_Template_button_click_0_listener() {
      \u0275\u0275restoreView(_r3);
      const msg_r2 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.markAsRead(msg_r2.id));
    });
    \u0275\u0275domElement(1, "i", 29);
    \u0275\u0275domElementEnd();
  }
}
function AdminMessagesPage_Conditional_6_For_1_Template(rf, ctx) {
  if (rf & 1) {
    const _r1 = \u0275\u0275getCurrentView();
    \u0275\u0275domElementStart(0, "div", 8)(1, "div", 9)(2, "div", 10)(3, "div", 11)(4, "div", 12)(5, "h3", 13);
    \u0275\u0275text(6);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(7, AdminMessagesPage_Conditional_6_For_1_Conditional_7_Template, 2, 0, "span", 14);
    \u0275\u0275domElementStart(8, "span", 15);
    \u0275\u0275text(9);
    \u0275\u0275pipe(10, "date");
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(11, "div", 16)(12, "div", 17)(13, "span");
    \u0275\u0275domElement(14, "i", 18);
    \u0275\u0275text(15);
    \u0275\u0275domElementEnd();
    \u0275\u0275conditionalCreate(16, AdminMessagesPage_Conditional_6_For_1_Conditional_16_Template, 3, 1, "span");
    \u0275\u0275domElementEnd()();
    \u0275\u0275conditionalCreate(17, AdminMessagesPage_Conditional_6_For_1_Conditional_17_Template, 2, 1, "div", 19);
    \u0275\u0275domElementStart(18, "p", 20);
    \u0275\u0275text(19);
    \u0275\u0275domElementEnd()();
    \u0275\u0275domElementStart(20, "div", 21);
    \u0275\u0275conditionalCreate(21, AdminMessagesPage_Conditional_6_For_1_Conditional_21_Template, 2, 0, "button", 22);
    \u0275\u0275domElementStart(22, "button", 23);
    \u0275\u0275domListener("click", function AdminMessagesPage_Conditional_6_For_1_Template_button_click_22_listener() {
      const msg_r2 = \u0275\u0275restoreView(_r1).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.deleteMessage(msg_r2.id));
    });
    \u0275\u0275domElement(23, "i", 24);
    \u0275\u0275domElementEnd();
    \u0275\u0275domElementStart(24, "a", 25);
    \u0275\u0275domElement(25, "i", 26);
    \u0275\u0275domElementEnd()()()()();
  }
  if (rf & 2) {
    const msg_r2 = ctx.$implicit;
    \u0275\u0275classProp("border-l-4", !msg_r2.is_read)("border-primary", !msg_r2.is_read);
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate(msg_r2.name);
    \u0275\u0275advance();
    \u0275\u0275conditional(!msg_r2.is_read ? 7 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind2(10, 13, msg_r2.created_at, "medium"));
    \u0275\u0275advance(6);
    \u0275\u0275textInterpolate1(" ", msg_r2.email);
    \u0275\u0275advance();
    \u0275\u0275conditional(msg_r2.phone ? 16 : -1);
    \u0275\u0275advance();
    \u0275\u0275conditional(msg_r2.subject ? 17 : -1);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate(msg_r2.message);
    \u0275\u0275advance(2);
    \u0275\u0275conditional(!msg_r2.is_read ? 21 : -1);
    \u0275\u0275advance(3);
    \u0275\u0275domProperty("href", "mailto:" + msg_r2.email, \u0275\u0275sanitizeUrl);
  }
}
function AdminMessagesPage_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275repeaterCreate(0, AdminMessagesPage_Conditional_6_For_1_Template, 26, 16, "div", 7, _forTrack0);
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275repeater(ctx_r3.messages());
  }
}
var AdminMessagesPage = class _AdminMessagesPage {
  auth = inject(AuthService);
  messages = signal([], ...ngDevMode ? [{ debugName: "messages" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  async ngOnInit() {
    await this.loadMessages();
  }
  async loadMessages() {
    this.loading.set(true);
    const supabase = this.auth.getSupabaseClient();
    const { data, error } = await supabase.from("contact_messages").select("*").order("created_at", { ascending: false });
    if (data) {
      this.messages.set(data);
    }
    this.loading.set(false);
  }
  async markAsRead(id) {
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from("contact_messages").update({ is_read: true }).eq("id", id);
    if (!error) {
      this.messages.update((msgs) => msgs.map((m) => m.id === id ? __spreadProps(__spreadValues({}, m), { is_read: true }) : m));
    }
  }
  async deleteMessage(id) {
    if (!confirm("\xBFEst\xE1s seguro de eliminar este mensaje?"))
      return;
    const supabase = this.auth.getSupabaseClient();
    const { error } = await supabase.from("contact_messages").delete().eq("id", id);
    if (!error) {
      this.messages.update((msgs) => msgs.filter((m) => m.id !== id));
    } else {
      alert("Error al eliminar el mensaje");
    }
  }
  static \u0275fac = function AdminMessagesPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminMessagesPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminMessagesPage, selectors: [["app-admin-messages-page"]], decls: 7, vars: 1, consts: [[1, "flex", "justify-between", "items-center", "mb-6"], [1, "text-2xl", "font-bold", "text-green-600"], [1, "grid", "gap-4"], [1, "flex", "justify-center", "py-8"], [1, "alert", "alert-info"], [1, "loading", "loading-spinner", "loading-lg"], [1, "fas", "fa-info-circle"], [1, "card", "bg-base-100", "shadow", "hover:shadow-md", "transition-shadow", "text-base-content", 3, "border-l-4", "border-primary"], [1, "card", "bg-base-100", "shadow", "hover:shadow-md", "transition-shadow", "text-base-content"], [1, "card-body", "p-6"], [1, "flex", "justify-between", "items-start", "gap-4"], [1, "flex-1"], [1, "flex", "items-center", "gap-2", "mb-2"], [1, "font-bold", "text-lg"], [1, "badge", "badge-primary", "badge-sm"], [1, "text-sm", "text-gray-500"], [1, "text-sm", "text-gray-600", "mb-2"], [1, "flex", "items-center", "gap-4"], [1, "fas", "fa-envelope", "mr-1"], [1, "font-medium", "mb-2"], [1, "text-gray-700", "whitespace-pre-wrap"], [1, "flex", "flex-col", "gap-2"], ["title", "Marcar como le\xEDdo", 1, "btn", "btn-sm", "btn-ghost"], ["title", "Eliminar", 1, "btn", "btn-sm", "btn-ghost", "text-error", 3, "click"], [1, "fas", "fa-trash"], ["title", "Responder", 1, "btn", "btn-sm", "btn-ghost", "text-info", 3, "href"], [1, "fas", "fa-reply"], [1, "fas", "fa-phone", "mr-1"], ["title", "Marcar como le\xEDdo", 1, "btn", "btn-sm", "btn-ghost", 3, "click"], [1, "fas", "fa-check", "text-success"]], template: function AdminMessagesPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275domElementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Mensajes de Contacto");
      \u0275\u0275domElementEnd()();
      \u0275\u0275domElementStart(3, "div", 2);
      \u0275\u0275conditionalCreate(4, AdminMessagesPage_Conditional_4_Template, 2, 0, "div", 3)(5, AdminMessagesPage_Conditional_5_Template, 4, 0, "div", 4)(6, AdminMessagesPage_Conditional_6_Template, 2, 0);
      \u0275\u0275domElementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(4);
      \u0275\u0275conditional(ctx.loading() ? 4 : ctx.messages().length === 0 ? 5 : 6);
    }
  }, dependencies: [CommonModule, DatePipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminMessagesPage, [{
    type: Component,
    args: [{ selector: "app-admin-messages-page", standalone: true, imports: [CommonModule], template: `<div class="flex justify-between items-center mb-6">\r
    <h1 class="text-2xl font-bold text-green-600">Mensajes de Contacto</h1>\r
</div>\r
\r
<div class="grid gap-4">\r
    @if (loading()) {\r
    <div class="flex justify-center py-8">\r
        <span class="loading loading-spinner loading-lg"></span>\r
    </div>\r
    } @else if (messages().length === 0) {\r
    <div class="alert alert-info">\r
        <i class="fas fa-info-circle"></i>\r
        <span>No hay mensajes nuevos.</span>\r
    </div>\r
    } @else {\r
    @for (msg of messages(); track msg.id) {\r
    <div class="card bg-base-100 shadow hover:shadow-md transition-shadow text-base-content" [class.border-l-4]="!msg.is_read"\r
        [class.border-primary]="!msg.is_read">\r
        <div class="card-body p-6">\r
            <div class="flex justify-between items-start gap-4">\r
                <div class="flex-1">\r
                    <div class="flex items-center gap-2 mb-2">\r
                        <h3 class="font-bold text-lg">{{ msg.name }}</h3>\r
                        @if (!msg.is_read) {\r
                        <span class="badge badge-primary badge-sm">Nuevo</span>\r
                        }\r
                        <span class="text-sm text-gray-500">{{ msg.created_at | date:'medium' }}</span>\r
                    </div>\r
\r
                    <div class="text-sm text-gray-600 mb-2">\r
                        <div class="flex items-center gap-4">\r
                            <span><i class="fas fa-envelope mr-1"></i> {{ msg.email }}</span>\r
                            @if (msg.phone) {\r
                            <span><i class="fas fa-phone mr-1"></i> {{ msg.phone }}</span>\r
                            }\r
                        </div>\r
                    </div>\r
\r
                    @if (msg.subject) {\r
                    <div class="font-medium mb-2">Asunto: {{ msg.subject }}</div>\r
                    }\r
\r
                    <p class="text-gray-700 whitespace-pre-wrap">{{ msg.message }}</p>\r
                </div>\r
\r
                <div class="flex flex-col gap-2">\r
                    @if (!msg.is_read) {\r
                    <button class="btn btn-sm btn-ghost" (click)="markAsRead(msg.id)" title="Marcar como le\xEDdo">\r
                        <i class="fas fa-check text-success"></i>\r
                    </button>\r
                    }\r
                    <button class="btn btn-sm btn-ghost text-error" (click)="deleteMessage(msg.id)" title="Eliminar">\r
                        <i class="fas fa-trash"></i>\r
                    </button>\r
                    <a [href]="'mailto:' + msg.email" class="btn btn-sm btn-ghost text-info" title="Responder">\r
                        <i class="fas fa-reply"></i>\r
                    </a>\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
    }\r
    }\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminMessagesPage, { className: "AdminMessagesPage", filePath: "src/app/admin/messages/admin-messages-page.ts", lineNumber: 12 });
})();
export {
  AdminMessagesPage
};
//# sourceMappingURL=chunk-KQVS27MO.mjs.map
