import './polyfills.server.mjs';
import {
  AuthService
} from "./chunk-PUVRELIK.mjs";
import {
  DefaultValueAccessor,
  FormsModule,
  NgControlStatus,
  NgModel
} from "./chunk-VVLZNBXY.mjs";
import {
  Component,
  inject,
  setClassMetadata,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵattribute,
  ɵɵclassProp,
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
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵrepeaterTrackByIdentity,
  ɵɵrepeaterTrackByIndex,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtwoWayBindingSet,
  ɵɵtwoWayListener,
  ɵɵtwoWayProperty
} from "./chunk-DXH6IVIR.mjs";

// src/app/public/reservation/reservation-calendar.ts
function ReservationCalendar_For_12_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 9);
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const day_r1 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", day_r1, " ");
  }
}
function ReservationCalendar_For_15_Conditional_0_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 12)(1, "button", 14);
    \u0275\u0275listener("click", function ReservationCalendar_For_15_Conditional_0_Template_button_click_1_listener() {
      \u0275\u0275restoreView(_r2);
      const day_r3 = \u0275\u0275nextContext().$implicit;
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.selectDate(day_r3));
    });
    \u0275\u0275text(2);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const day_r3 = \u0275\u0275nextContext().$implicit;
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance();
    \u0275\u0275classProp("bg-indigo-600", ctx_r3.isSelectedDate(day_r3))("text-white", ctx_r3.isSelectedDate(day_r3))("shadow-md", ctx_r3.isSelectedDate(day_r3))("bg-blue-100", ctx_r3.isToday(day_r3) && !ctx_r3.isSelectedDate(day_r3))("text-blue-700", ctx_r3.isToday(day_r3) && !ctx_r3.isSelectedDate(day_r3))("text-gray-400", ctx_r3.isPastDate(day_r3))("cursor-not-allowed", ctx_r3.isPastDate(day_r3))("text-gray-700", !ctx_r3.isSelectedDate(day_r3) && !ctx_r3.isPastDate(day_r3) && !ctx_r3.isToday(day_r3))("hover:bg-gray-100", !ctx_r3.isSelectedDate(day_r3) && !ctx_r3.isPastDate(day_r3));
    \u0275\u0275property("disabled", ctx_r3.isPastDate(day_r3));
    \u0275\u0275attribute("aria-label", "Seleccionar " + (day_r3 == null ? null : day_r3.getDate()) + " de " + ctx_r3.currentMonthYear);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", day_r3 == null ? null : day_r3.getDate(), " ");
  }
}
function ReservationCalendar_For_15_Conditional_1_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 13);
  }
}
function ReservationCalendar_For_15_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275conditionalCreate(0, ReservationCalendar_For_15_Conditional_0_Template, 3, 21, "div", 12)(1, ReservationCalendar_For_15_Conditional_1_Template, 1, 0, "div", 13);
  }
  if (rf & 2) {
    const day_r3 = ctx.$implicit;
    \u0275\u0275conditional(day_r3 ? 0 : 1);
  }
}
function ReservationCalendar_Conditional_16_For_5_Template(rf, ctx) {
  if (rf & 1) {
    const _r5 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "button", 18);
    \u0275\u0275listener("click", function ReservationCalendar_Conditional_16_For_5_Template_button_click_0_listener() {
      const time_r6 = \u0275\u0275restoreView(_r5).$implicit;
      const ctx_r3 = \u0275\u0275nextContext(2);
      return \u0275\u0275resetView(ctx_r3.selectTime(time_r6));
    });
    \u0275\u0275text(1);
    \u0275\u0275elementEnd();
  }
  if (rf & 2) {
    const time_r6 = ctx.$implicit;
    const ctx_r3 = \u0275\u0275nextContext(2);
    \u0275\u0275classProp("bg-indigo-600", ctx_r3.selectedTime === time_r6)("text-white", ctx_r3.selectedTime === time_r6);
    \u0275\u0275attribute("aria-label", "Seleccionar horario " + time_r6);
    \u0275\u0275advance();
    \u0275\u0275textInterpolate1(" ", time_r6, " ");
  }
}
function ReservationCalendar_Conditional_16_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 11)(1, "h3", 15);
    \u0275\u0275text(2, "Selecciona un horario");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 16);
    \u0275\u0275repeaterCreate(4, ReservationCalendar_Conditional_16_For_5_Template, 2, 6, "button", 17, \u0275\u0275repeaterTrackByIdentity);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(4);
    \u0275\u0275repeater(ctx_r3.availableHours);
  }
}
function ReservationCalendar_Conditional_17_Conditional_20_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 29);
    \u0275\u0275element(1, "circle", 30)(2, "path", 31);
    \u0275\u0275elementEnd();
  }
}
function ReservationCalendar_Conditional_17_Conditional_21_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275namespaceSVG();
    \u0275\u0275elementStart(0, "svg", 32);
    \u0275\u0275element(1, "path", 33);
    \u0275\u0275elementEnd();
    \u0275\u0275text(2, " Confirmar Reserva ");
  }
}
function ReservationCalendar_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    const _r7 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 11)(1, "h3", 19);
    \u0275\u0275text(2, "Completa tus datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(3, "div", 20)(4, "div")(5, "label", 21);
    \u0275\u0275text(6, "Nombre y Apellido");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "input", 22);
    \u0275\u0275twoWayListener("ngModelChange", function ReservationCalendar_Conditional_17_Template_input_ngModelChange_7_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.customerName, $event) || (ctx_r3.customerName = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(8, "div")(9, "label", 21);
    \u0275\u0275text(10, "Tel\xE9fono");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "input", 23);
    \u0275\u0275twoWayListener("ngModelChange", function ReservationCalendar_Conditional_17_Template_input_ngModelChange_11_listener($event) {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      \u0275\u0275twoWayBindingSet(ctx_r3.customerPhone, $event) || (ctx_r3.customerPhone = $event);
      return \u0275\u0275resetView($event);
    });
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(12, "div", 24)(13, "p", 25);
    \u0275\u0275text(14, "Est\xE1s reservando para:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "p", 26);
    \u0275\u0275text(16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "p", 27);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(19, "button", 28);
    \u0275\u0275listener("click", function ReservationCalendar_Conditional_17_Template_button_click_19_listener() {
      \u0275\u0275restoreView(_r7);
      const ctx_r3 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r3.confirmReservation());
    });
    \u0275\u0275conditionalCreate(20, ReservationCalendar_Conditional_17_Conditional_20_Template, 3, 0, ":svg:svg", 29)(21, ReservationCalendar_Conditional_17_Conditional_21_Template, 3, 0);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r3 = \u0275\u0275nextContext();
    \u0275\u0275advance(7);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.customerName);
    \u0275\u0275advance(4);
    \u0275\u0275twoWayProperty("ngModel", ctx_r3.customerPhone);
    \u0275\u0275advance(5);
    \u0275\u0275textInterpolate(ctx_r3.formattedSelectedDate);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate1("", ctx_r3.selectedTime, " hs");
    \u0275\u0275advance();
    \u0275\u0275property("disabled", ctx_r3.saving || !ctx_r3.customerName || !ctx_r3.customerPhone);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r3.saving ? 20 : 21);
  }
}
var ReservationCalendar = class _ReservationCalendar {
  auth = inject(AuthService);
  // Configuración
  whatsappNumber = "5491125960900";
  availableHours = ["09:00", "10:00", "11:00", "12:00", "14:00", "15:00", "16:00", "17:00"];
  monthNames = [
    "Enero",
    "Febrero",
    "Marzo",
    "Abril",
    "Mayo",
    "Junio",
    "Julio",
    "Agosto",
    "Septiembre",
    "Octubre",
    "Noviembre",
    "Diciembre"
  ];
  weekDayNames = ["Dom", "Lun", "Mar", "Mi\xE9", "Jue", "Vie", "S\xE1b"];
  // Estado
  currentDate = /* @__PURE__ */ new Date();
  selectedDate = null;
  selectedTime = null;
  showTimeSelection = false;
  showConfirmation = false;
  // Form Data
  customerName = "";
  customerPhone = "";
  saving = false;
  initializeCalendar() {
    this.currentDate = /* @__PURE__ */ new Date();
    this.selectedDate = null;
    this.selectedTime = null;
    this.showTimeSelection = false;
    this.showConfirmation = false;
    this.customerName = "";
    this.customerPhone = "";
  }
  ngOnInit() {
    this.initializeCalendar();
  }
  // Métodos de navegación
  prevMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() - 1, 1);
    this.resetSelection();
  }
  nextMonth() {
    this.currentDate = new Date(this.currentDate.getFullYear(), this.currentDate.getMonth() + 1, 1);
    this.resetSelection();
  }
  // Métodos de selección
  selectDate(date) {
    if (this.isPastDate(date))
      return;
    this.selectedDate = date;
    this.selectedTime = null;
    this.showTimeSelection = true;
    this.showConfirmation = false;
  }
  selectTime(time) {
    this.selectedTime = time;
    this.showConfirmation = true;
  }
  resetSelection() {
    this.selectedDate = null;
    this.selectedTime = null;
    this.showTimeSelection = false;
    this.showConfirmation = false;
  }
  // Métodos de ayuda
  get daysInMonth() {
    const year = this.currentDate.getFullYear();
    const month = this.currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];
    const startOffset = firstDay.getDay() === 0 ? 6 : firstDay.getDay() - 1;
    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }
    for (let day = 1; day <= lastDay.getDate(); day++) {
      days.push(new Date(year, month, day));
    }
    return days;
  }
  isToday(date) {
    if (!date)
      return false;
    const today = /* @__PURE__ */ new Date();
    return date.getDate() === today.getDate() && date.getMonth() === today.getMonth() && date.getFullYear() === today.getFullYear();
  }
  isSelectedDate(date) {
    return !!date && !!this.selectedDate && date.getDate() === this.selectedDate.getDate() && date.getMonth() === this.selectedDate.getMonth() && date.getFullYear() === this.selectedDate.getFullYear();
  }
  isPastDate(date) {
    const today = /* @__PURE__ */ new Date();
    today.setHours(0, 0, 0, 0);
    return date < today;
  }
  async confirmReservation() {
    if (!this.selectedDate || !this.selectedTime || !this.customerName || !this.customerPhone) {
      alert("Por favor completa todos los datos para continuar.");
      return;
    }
    this.saving = true;
    try {
      const supabase = this.auth.getSupabaseClient();
      const options = {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric"
      };
      const formattedDate = this.selectedDate.toLocaleDateString("es-ES", options);
      await supabase.from("contact_messages").insert({
        name: this.customerName,
        phone: this.customerPhone,
        email: "reserva@web.com",
        // Placeholder if email not asked
        subject: `Nueva Reserva: ${formattedDate} ${this.selectedTime}`,
        message: `Reserva solicitada para el ${formattedDate} a las ${this.selectedTime}. Tel\xE9fono: ${this.customerPhone}`,
        is_read: false
      });
      const message = `\xA1Hola! Soy ${this.customerName}. Quiero confirmar mi reserva para el ${formattedDate} a las ${this.selectedTime} horas.`;
      const encodedMessage = encodeURIComponent(message);
      if (typeof window !== "undefined") {
        window.open(`https://wa.me/${this.whatsappNumber}?text=${encodedMessage}`, "_blank");
      }
      this.resetSelection();
      this.customerName = "";
      this.customerPhone = "";
    } catch (error) {
      console.error("Error saving reservation:", error);
      this.sendWhatsAppMessage();
    } finally {
      this.saving = false;
    }
  }
  // Deprecated but kept as fallback
  sendWhatsAppMessage() {
    if (!this.selectedDate || !this.selectedTime)
      return;
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    const formattedDate = this.selectedDate.toLocaleDateString("es-ES", options);
    const message = `\xA1Hola! Quiero reservar una cita para el ${formattedDate} a las ${this.selectedTime} horas.`;
    if (typeof window !== "undefined") {
      window.open(`https://wa.me/${this.whatsappNumber}?text=${encodeURIComponent(message)}`, "_blank");
    }
  }
  get currentMonthYear() {
    return `${this.monthNames[this.currentDate.getMonth()]} ${this.currentDate.getFullYear()}`;
  }
  get formattedSelectedDate() {
    if (!this.selectedDate)
      return "";
    const options = { weekday: "long", year: "numeric", month: "long", day: "numeric" };
    return this.selectedDate.toLocaleDateString("es-ES", options);
  }
  static \u0275fac = function ReservationCalendar_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _ReservationCalendar)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _ReservationCalendar, selectors: [["app-reservation-calendar"]], decls: 18, vars: 3, consts: [[1, "max-w-md", "mx-auto", "bg-white", "rounded-xl", "shadow-md", "overflow-hidden", "md:max-w-2xl"], [1, "bg-indigo-600", "text-white", "p-4", "flex", "justify-between", "items-center"], ["aria-label", "Mes anterior", 1, "p-2", "rounded-full", "hover:bg-indigo-700", "transition", 3, "click"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 20 20", "fill", "currentColor", 1, "h-5", "w-5"], ["fill-rule", "evenodd", "d", "M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z", "clip-rule", "evenodd"], [1, "text-lg", "font-semibold"], ["aria-label", "Mes siguiente", 1, "p-2", "rounded-full", "hover:bg-indigo-700", "transition", 3, "click"], ["fill-rule", "evenodd", "d", "M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z", "clip-rule", "evenodd"], [1, "grid", "grid-cols-7", "gap-1", "p-2", "bg-gray-100"], [1, "text-center", "text-gray-700", "font-medium", "text-sm", "py-2"], [1, "grid", "grid-cols-7", "gap-2", "p-4"], [1, "border-t", "p-4"], [1, "flex", "items-center", "justify-center"], [1, "h-10", "w-10"], [1, "h-10", "w-10", "flex", "items-center", "justify-center", "text-sm", "font-medium", "rounded-full", "transition-all", "duration-200", "focus:outline-none", "focus:ring-2", "focus:ring-offset-2", "focus:ring-indigo-500", 3, "click", "disabled"], [1, "font-semibold", "text-gray-700", "mb-3"], [1, "grid", "grid-cols-2", "sm:grid-cols-4", "gap-2"], [1, "py-2", "px-3", "text-sm", "font-medium", "text-gray-700", "hover:bg-indigo-100", "rounded-full", "transition", 3, "bg-indigo-600", "text-white"], [1, "py-2", "px-3", "text-sm", "font-medium", "text-gray-700", "hover:bg-indigo-100", "rounded-full", "transition", 3, "click"], [1, "font-semibold", "text-gray-700", "mb-4"], [1, "space-y-4", "mb-6"], [1, "block", "text-sm", "font-medium", "text-gray-700", "mb-1"], ["type", "text", "placeholder", "Ej: Juan P\xE9rez", 1, "w-full", "px-3", "py-2", "border", "rounded-lg", "focus:ring-2", "focus:ring-indigo-500", "outline-none", 3, "ngModelChange", "ngModel"], ["type", "tel", "placeholder", "Ej: 11 1234 5678", 1, "w-full", "px-3", "py-2", "border", "rounded-lg", "focus:ring-2", "focus:ring-indigo-500", "outline-none", 3, "ngModelChange", "ngModel"], [1, "bg-gray-50", "p-4", "rounded-lg", "mb-6", "border", "border-gray-100"], [1, "text-sm", "text-gray-500", "mb-1"], [1, "text-gray-800", "font-bold", "text-lg", "capitalize"], [1, "text-indigo-600", "font-bold", "text-xl"], ["aria-label", "Confirmar reserva y enviar mensaje por WhatsApp", 1, "w-full", "bg-green-600", "hover:bg-green-700", "disabled:bg-gray-400", "text-white", "font-medium", "py-3", "px-4", "rounded-lg", "transition", "flex", "items-center", "justify-center", "gap-2", 3, "click", "disabled"], ["xmlns", "http://www.w3.org/2000/svg", "fill", "none", "viewBox", "0 0 24 24", 1, "animate-spin", "h-5", "w-5", "text-white"], ["cx", "12", "cy", "12", "r", "10", "stroke", "currentColor", "stroke-width", "4", 1, "opacity-25"], ["fill", "currentColor", "d", "M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z", 1, "opacity-75"], ["xmlns", "http://www.w3.org/2000/svg", "viewBox", "0 0 24 24", "fill", "currentColor", 1, "h-5", "w-5"], ["d", "M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"]], template: function ReservationCalendar_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "div", 1)(2, "button", 2);
      \u0275\u0275listener("click", function ReservationCalendar_Template_button_click_2_listener() {
        return ctx.prevMonth();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(3, "svg", 3);
      \u0275\u0275element(4, "path", 4);
      \u0275\u0275elementEnd()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(5, "h2", 5);
      \u0275\u0275text(6);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(7, "button", 6);
      \u0275\u0275listener("click", function ReservationCalendar_Template_button_click_7_listener() {
        return ctx.nextMonth();
      });
      \u0275\u0275namespaceSVG();
      \u0275\u0275elementStart(8, "svg", 3);
      \u0275\u0275element(9, "path", 7);
      \u0275\u0275elementEnd()()();
      \u0275\u0275namespaceHTML();
      \u0275\u0275elementStart(10, "div", 8);
      \u0275\u0275repeaterCreate(11, ReservationCalendar_For_12_Template, 2, 1, "div", 9, \u0275\u0275repeaterTrackByIdentity);
      \u0275\u0275elementEnd();
      \u0275\u0275elementStart(13, "div", 10);
      \u0275\u0275repeaterCreate(14, ReservationCalendar_For_15_Template, 2, 1, null, null, \u0275\u0275repeaterTrackByIndex);
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(16, ReservationCalendar_Conditional_16_Template, 6, 0, "div", 11);
      \u0275\u0275conditionalCreate(17, ReservationCalendar_Conditional_17_Template, 22, 6, "div", 11);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(6);
      \u0275\u0275textInterpolate(ctx.currentMonthYear);
      \u0275\u0275advance(5);
      \u0275\u0275repeater(ctx.weekDayNames);
      \u0275\u0275advance(3);
      \u0275\u0275repeater(ctx.daysInMonth);
      \u0275\u0275advance(2);
      \u0275\u0275conditional(ctx.showTimeSelection ? 16 : -1);
      \u0275\u0275advance();
      \u0275\u0275conditional(ctx.showConfirmation ? 17 : -1);
    }
  }, dependencies: [FormsModule, DefaultValueAccessor, NgControlStatus, NgModel], styles: ["\n\nbutton[_ngcontent-%COMP%] {\n  transition: all 0.2s ease;\n}\nbutton[_ngcontent-%COMP%]:not(:disabled):hover {\n  transform: scale(1.05);\n}\n.h-10[_ngcontent-%COMP%] {\n  height: 2.5rem;\n}\n/*# sourceMappingURL=reservation-calendar.css.map */"] });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(ReservationCalendar, [{
    type: Component,
    args: [{ selector: "app-reservation-calendar", standalone: true, imports: [FormsModule], template: `<div class="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl">\r
  <!-- Header -->\r
  <div class="bg-indigo-600 text-white p-4 flex justify-between items-center">\r
    <button (click)="prevMonth()" class="p-2 rounded-full hover:bg-indigo-700 transition" aria-label="Mes anterior">\r
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">\r
        <path fill-rule="evenodd"\r
          d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"\r
          clip-rule="evenodd" />\r
      </svg>\r
    </button>\r
    <h2 class="text-lg font-semibold">{{ currentMonthYear }}</h2>\r
    <button (click)="nextMonth()" class="p-2 rounded-full hover:bg-indigo-700 transition" aria-label="Mes siguiente">\r
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">\r
        <path fill-rule="evenodd"\r
          d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"\r
          clip-rule="evenodd" />\r
      </svg>\r
    </button>\r
  </div>\r
\r
  <!-- D\xEDas semana -->\r
  <div class="grid grid-cols-7 gap-1 p-2 bg-gray-100">\r
    @for (day of weekDayNames; track day) {\r
    <div class="text-center text-gray-700 font-medium text-sm py-2">\r
      {{ day }}\r
    </div>\r
    }\r
  </div>\r
\r
  <!-- D\xEDas mes -->\r
  <div class="grid grid-cols-7 gap-2 p-4">\r
    @for (day of daysInMonth; track $index) {\r
    @if (day) {\r
    <div class="flex items-center justify-center">\r
      <button (click)="selectDate(day)" [class.bg-indigo-600]="isSelectedDate(day)"\r
        [class.text-white]="isSelectedDate(day)" [class.shadow-md]="isSelectedDate(day)"\r
        [class.bg-blue-100]="isToday(day) && !isSelectedDate(day)"\r
        [class.text-blue-700]="isToday(day) && !isSelectedDate(day)" [class.text-gray-400]="isPastDate(day)"\r
        [class.cursor-not-allowed]="isPastDate(day)"\r
        [class.text-gray-700]="!isSelectedDate(day) && !isPastDate(day) && !isToday(day)"\r
        [class.hover:bg-gray-100]="!isSelectedDate(day) && !isPastDate(day)"\r
        class="h-10 w-10 flex items-center justify-center text-sm font-medium rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"\r
        [disabled]="isPastDate(day)" [attr.aria-label]="'Seleccionar ' + day?.getDate() + ' de ' + currentMonthYear">\r
        {{ day?.getDate() }}\r
      </button>\r
    </div>\r
    } @else {\r
    <div class="h-10 w-10"></div>\r
    }\r
    }\r
  </div>\r
\r
  <!-- Selecci\xF3n de hora -->\r
  @if (showTimeSelection) {\r
  <div class="border-t p-4">\r
    <h3 class="font-semibold text-gray-700 mb-3">Selecciona un horario</h3>\r
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-2">\r
      @for (time of availableHours; track time) {\r
      <button (click)="selectTime(time)" [class.bg-indigo-600]="selectedTime === time"\r
        [class.text-white]="selectedTime === time"\r
        class="py-2 px-3 text-sm font-medium text-gray-700 hover:bg-indigo-100 rounded-full transition"\r
        [attr.aria-label]="'Seleccionar horario ' + time">\r
        {{ time }}\r
      </button>\r
      }\r
    </div>\r
  </div>\r
  }\r
\r
  <!-- Confirmaci\xF3n -->\r
  @if (showConfirmation) {\r
  <div class="border-t p-4">\r
    <h3 class="font-semibold text-gray-700 mb-4">Completa tus datos</h3>\r
    \r
    <div class="space-y-4 mb-6">\r
      <div>\r
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre y Apellido</label>\r
        <input type="text" [(ngModel)]="customerName" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: Juan P\xE9rez">\r
      </div>\r
      <div>\r
        <label class="block text-sm font-medium text-gray-700 mb-1">Tel\xE9fono</label>\r
        <input type="tel" [(ngModel)]="customerPhone" class="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none" placeholder="Ej: 11 1234 5678">\r
      </div>\r
    </div>\r
\r
    <div class="bg-gray-50 p-4 rounded-lg mb-6 border border-gray-100">\r
      <p class="text-sm text-gray-500 mb-1">Est\xE1s reservando para:</p>\r
      <p class="text-gray-800 font-bold text-lg capitalize">{{ formattedSelectedDate }}</p>\r
      <p class="text-indigo-600 font-bold text-xl">{{ selectedTime }} hs</p>\r
    </div>\r
\r
    <button (click)="confirmReservation()"\r
      [disabled]="saving || !customerName || !customerPhone"\r
      class="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition flex items-center justify-center gap-2"\r
      aria-label="Confirmar reserva y enviar mensaje por WhatsApp">\r
      @if (saving) {\r
        <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">\r
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>\r
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>\r
        </svg>\r
      } @else {\r
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">\r
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />\r
        </svg>\r
        Confirmar Reserva\r
      }\r
    </button>\r
  </div>\r
  }\r
</div>`, styles: ["/* src/app/public/reservation/reservation-calendar.css */\nbutton {\n  transition: all 0.2s ease;\n}\nbutton:not(:disabled):hover {\n  transform: scale(1.05);\n}\n.h-10 {\n  height: 2.5rem;\n}\n/*# sourceMappingURL=reservation-calendar.css.map */\n"] }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(ReservationCalendar, { className: "ReservationCalendar", filePath: "src/app/public/reservation/reservation-calendar.ts", lineNumber: 13 });
})();

export {
  ReservationCalendar
};
//# sourceMappingURL=chunk-LD2LNSYS.mjs.map
