import './polyfills.server.mjs';
import {
  BaseChartDirective
} from "./chunk-KMT4KQ2P.mjs";
import {
  AnalyticsRepository
} from "./chunk-VBVV3U42.mjs";
import {
  AnalyticsService
} from "./chunk-QOHRYQPW.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  RouterLink
} from "./chunk-GLYZDHZB.mjs";
import {
  CommonModule,
  CurrencyPipe
} from "./chunk-NQCCIK3J.mjs";
import {
  Component,
  firstValueFrom,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵnextContext,
  ɵɵpipe,
  ɵɵpipeBind1,
  ɵɵproperty,
  ɵɵtext,
  ɵɵtextInterpolate
} from "./chunk-RN3QJLYL.mjs";
import "./chunk-TB3YAHZW.mjs";

// src/app/admin/dashboard/constants/chart-colors.constant.ts
var CHART_COLORS = {
  primary: "#4f46e5",
  primaryTransparent: "rgba(79, 70, 229, 0.2)",
  red: "#ef4444",
  blue: "#3b82f6",
  green: "#10b981",
  yellow: "#f59e0b",
  purple: "#8b5cf6",
  pink: "#ec4899",
  indigo: "#6366f1",
  // Arrays for charts with multiple datasets/segments
  palette: [
    "#ef4444",
    // Red
    "#3b82f6",
    // Blue
    "#10b981",
    // Green
    "#f59e0b",
    // Yellow
    "#8b5cf6",
    // Purple
    "#6366f1",
    // Indigo
    "#ec4899"
    // Pink
  ],
  paletteAlt: [
    "#3b82f6",
    "#10b981",
    "#f59e0b",
    "#ef4444",
    "#8b5cf6",
    "#ec4899",
    "#6366f1"
  ]
};

// src/app/admin/dashboard/admin-dashboard-page.ts
function AdminDashboardPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2);
    \u0275\u0275element(1, "span", 3);
    \u0275\u0275elementEnd();
  }
}
function AdminDashboardPage_Conditional_4_Conditional_115_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "div", 50);
    \u0275\u0275elementStart(1, "div", 51)(2, "div", 52)(3, "span", 53);
    \u0275\u0275element(4, "i", 54);
    \u0275\u0275elementStart(5, "span");
    \u0275\u0275text(6, "Sesi\xF3n Actual");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "span", 55);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(9, "div", 52)(10, "span", 53);
    \u0275\u0275element(11, "i", 56);
    \u0275\u0275elementStart(12, "span");
    \u0275\u0275text(13, "Usuario");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(14, "span", 57);
    \u0275\u0275text(15);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(16, "a", 58);
    \u0275\u0275element(17, "i", 59);
    \u0275\u0275text(18, " Ver Dashboard Completo ");
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.analyticsStats().sessionId ? "Activa" : "N/A");
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate(ctx_r0.analyticsStats().distinctId || "An\xF3nimo");
  }
}
function AdminDashboardPage_Conditional_4_Conditional_116_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 49);
    \u0275\u0275element(1, "i", 60);
    \u0275\u0275elementStart(2, "span");
    \u0275\u0275text(3, "PostHog no est\xE1 inicializado correctamente");
    \u0275\u0275elementEnd()();
  }
}
function AdminDashboardPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 4)(1, "div", 5)(2, "div", 6)(3, "div", 7);
    \u0275\u0275element(4, "i", 8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "div", 9);
    \u0275\u0275text(6, "Usuarios");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "div", 10);
    \u0275\u0275text(8);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(9, "div", 11);
    \u0275\u0275text(10, "Registrados");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(11, "div", 5)(12, "div", 6)(13, "div", 12);
    \u0275\u0275element(14, "i", 13);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "div", 9);
    \u0275\u0275text(16, "Reparaciones (Mes)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(17, "div", 14);
    \u0275\u0275text(18);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(19, "div", 11);
    \u0275\u0275text(20, "Equipos ingresados");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(21, "div", 5)(22, "div", 6)(23, "div", 15);
    \u0275\u0275element(24, "i", 16);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(25, "div", 9);
    \u0275\u0275text(26, "Ganancia Taller");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(27, "div", 17);
    \u0275\u0275text(28);
    \u0275\u0275pipe(29, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 11);
    \u0275\u0275text(31, "Este mes");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(32, "div", 5)(33, "div", 6)(34, "div", 18);
    \u0275\u0275element(35, "i", 19);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(36, "div", 9);
    \u0275\u0275text(37, "Equipos Arreglados");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(38, "div", 20);
    \u0275\u0275text(39);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(40, "div", 11);
    \u0275\u0275text(41, "Hist\xF3rico de Taller");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(42, "div", 5)(43, "div", 6)(44, "div", 21);
    \u0275\u0275element(45, "i", 22);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(46, "div", 9);
    \u0275\u0275text(47, "Ventas Tienda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 23);
    \u0275\u0275text(49);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(50, "div", 11);
    \u0275\u0275text(51, "Total realizadas");
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(52, "div", 5)(53, "div", 6)(54, "div", 24);
    \u0275\u0275element(55, "i", 25);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(56, "div", 9);
    \u0275\u0275text(57, "Ingresos Tienda");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "div", 26);
    \u0275\u0275text(59);
    \u0275\u0275pipe(60, "currency");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(61, "div", 11);
    \u0275\u0275text(62, "Total facturado");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(63, "div", 27)(64, "div", 28)(65, "div", 29)(66, "h2", 30);
    \u0275\u0275text(67, "Resumen de Ventas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(68, "div", 31);
    \u0275\u0275element(69, "canvas", 32);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(70, "div", 33)(71, "div", 29)(72, "h2", 30);
    \u0275\u0275text(73, "Productos Top");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(74, "div", 34);
    \u0275\u0275element(75, "canvas", 32);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(76, "div", 33)(77, "div", 29)(78, "h2", 30);
    \u0275\u0275text(79, "Ventas por Categor\xEDa");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(80, "div", 35);
    \u0275\u0275element(81, "canvas", 32);
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(82, "div", 36)(83, "div", 33)(84, "div", 29)(85, "h2", 30);
    \u0275\u0275text(86, "Acciones R\xE1pidas");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(87, "div", 37)(88, "a", 38);
    \u0275\u0275element(89, "i", 39);
    \u0275\u0275text(90, " Nuevo Producto ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(91, "a", 40);
    \u0275\u0275element(92, "i", 41);
    \u0275\u0275text(93, " Nueva Venta ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(94, "a", 42);
    \u0275\u0275element(95, "i", 43);
    \u0275\u0275text(96, " Gestionar Usuarios ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(97, "a", 44);
    \u0275\u0275element(98, "i", 45);
    \u0275\u0275text(99, " Taller ");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(100, "div", 33)(101, "div", 29)(102, "h2", 30);
    \u0275\u0275text(103, "Analytics & Sistema");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(104, "div", 46)(105, "div", 47)(106, "span");
    \u0275\u0275text(107, "Base de Datos");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(108, "span", 48);
    \u0275\u0275text(109, "Conectado");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(110, "div", 47)(111, "span");
    \u0275\u0275text(112, "Analytics (PostHog)");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(113, "span", 48);
    \u0275\u0275text(114);
    \u0275\u0275elementEnd()();
    \u0275\u0275conditionalCreate(115, AdminDashboardPage_Conditional_4_Conditional_115_Template, 19, 2)(116, AdminDashboardPage_Conditional_4_Conditional_116_Template, 4, 0, "div", 49);
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(8);
    \u0275\u0275textInterpolate(ctx_r0.stats().users);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r0.stats().repairs_month);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(29, 17, ctx_r0.stats().repairs_revenue));
    \u0275\u0275advance(11);
    \u0275\u0275textInterpolate(ctx_r0.stats().devices_fixed);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(ctx_r0.stats().sales);
    \u0275\u0275advance(10);
    \u0275\u0275textInterpolate(\u0275\u0275pipeBind1(60, 19, ctx_r0.stats().revenue));
    \u0275\u0275advance(10);
    \u0275\u0275property("data", ctx_r0.salesChartData)("options", ctx_r0.salesChartOptions)("type", ctx_r0.salesChartType);
    \u0275\u0275advance(6);
    \u0275\u0275property("data", ctx_r0.productsChartData)("options", ctx_r0.productsChartOptions)("type", ctx_r0.productsChartType);
    \u0275\u0275advance(6);
    \u0275\u0275property("data", ctx_r0.categoryChartData)("options", ctx_r0.categoryChartOptions)("type", ctx_r0.categoryChartType);
    \u0275\u0275advance(33);
    \u0275\u0275textInterpolate(ctx_r0.posthogStatus());
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.analyticsStats().enabled ? 115 : 116);
  }
}
var AdminDashboardPage = class _AdminDashboardPage {
  analyticsRepo = inject(AnalyticsRepository);
  analyticsService = inject(AnalyticsService);
  stats = signal({
    users: 0,
    products: 0,
    sales: 0,
    revenue: 0,
    repairs_month: 0,
    repairs_revenue: 0,
    devices_fixed: 0
  }, ...ngDevMode ? [{ debugName: "stats" }] : []);
  analyticsStats = signal({
    enabled: false,
    sessionId: "",
    distinctId: ""
  }, ...ngDevMode ? [{ debugName: "analyticsStats" }] : []);
  loading = signal(true, ...ngDevMode ? [{ debugName: "loading" }] : []);
  // Sales over the Year Chart
  salesChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "bottom" },
      title: { display: true, text: "Ventas del A\xF1o" }
    }
  };
  salesChartType = "line";
  salesChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: "Ventas ($)",
        borderColor: CHART_COLORS.primary,
        backgroundColor: CHART_COLORS.primaryTransparent,
        fill: true
      }
    ]
  };
  // Top Products Chart
  productsChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false },
      title: { display: true, text: "Productos M\xE1s Vendidos" }
    }
  };
  productsChartType = "bar";
  productsChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        label: "Unidades",
        backgroundColor: CHART_COLORS.palette
      }
    ]
  };
  // Sales by Category Chart
  categoryChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: "right" },
      title: { display: true, text: "Ventas por Categor\xEDa" }
    }
  };
  categoryChartType = "doughnut";
  categoryChartData = {
    labels: [],
    datasets: [
      { data: [], backgroundColor: CHART_COLORS.paletteAlt }
    ]
  };
  ngOnInit() {
    this.loadStats();
    this.loadAnalyticsInfo();
  }
  async loadStats() {
    this.loading.set(true);
    try {
      const data = await firstValueFrom(this.analyticsRepo.getDashboardStats());
      this.stats.set({
        users: data.users,
        products: data.products,
        sales: data.sales,
        revenue: data.revenue,
        repairs_month: data.repairs_month,
        repairs_revenue: data.repairs_revenue,
        devices_fixed: data.devices_fixed
      });
      if (data.sales_chart && data.sales_chart.length > 0) {
        const months = data.sales_chart.map((d) => this.formatMonth(d.period));
        const totals = data.sales_chart.map((d) => d.total);
        this.salesChartData = {
          labels: months,
          datasets: [
            {
              data: totals,
              label: "Ventas ($)",
              borderColor: CHART_COLORS.primary,
              backgroundColor: CHART_COLORS.primaryTransparent,
              fill: true
            }
          ]
        };
      }
      if (data.products_chart && data.products_chart.length > 0) {
        const productNames = data.products_chart.map((d) => d.name);
        const quantities = data.products_chart.map((d) => d.quantity);
        this.productsChartData = {
          labels: productNames,
          datasets: [
            {
              data: quantities,
              label: "Unidades",
              backgroundColor: CHART_COLORS.palette
            }
          ]
        };
      }
      if (data.category_chart && data.category_chart.length > 0) {
        const catNames = data.category_chart.map((d) => d.name);
        const catCounts = data.category_chart.map((d) => d.count);
        this.categoryChartData = {
          labels: catNames,
          datasets: [
            {
              data: catCounts,
              backgroundColor: CHART_COLORS.paletteAlt
            }
          ]
        };
      }
    } catch (error) {
      console.error("Error loading dashboard stats:", error);
    } finally {
      this.loading.set(false);
    }
  }
  formatMonth(yearMonth) {
    const [year, month] = yearMonth.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    return date.toLocaleDateString("es-ES", { month: "short" });
  }
  async loadAnalyticsInfo() {
    this.analyticsStats.set({
      enabled: this.analyticsService.isEnabled(),
      sessionId: this.analyticsService.getSessionId(),
      distinctId: this.analyticsService.getDistinctId()
    });
  }
  posthogStatus() {
    return this.analyticsStats().enabled ? "Activo" : "Inactivo";
  }
  static \u0275fac = function AdminDashboardPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _AdminDashboardPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _AdminDashboardPage, selectors: [["app-admin-dashboard-page"]], decls: 5, vars: 1, consts: [[1, "p-6"], [1, "text-2xl", "font-bold", "mb-6", "text-black", "dark:text-green-400"], [1, "flex", "justify-center", "py-12"], [1, "loading", "loading-spinner", "loading-lg"], [1, "grid", "grid-cols-2", "lg:grid-cols-4", "gap-6", "mb-8"], [1, "stats", "shadow", "bg-base-100", "dark:bg-gray-800", "text-base-content", "dark:text-white"], [1, "stat"], [1, "stat-figure", "text-primary"], [1, "fas", "fa-users", "text-3xl"], [1, "stat-title", "dark:text-gray-400"], [1, "stat-value", "text-primary"], [1, "stat-desc", "dark:text-gray-500"], [1, "stat-figure", "text-warning"], [1, "fas", "fa-tools", "text-3xl"], [1, "stat-value", "text-warning"], [1, "stat-figure", "text-success"], [1, "fas", "fa-hand-holding-usd", "text-3xl"], [1, "stat-value", "text-success"], [1, "stat-figure", "text-info"], [1, "fas", "fa-check-circle", "text-3xl"], [1, "stat-value", "text-info"], [1, "stat-figure", "text-accent"], [1, "fas", "fa-shopping-cart", "text-3xl"], [1, "stat-value", "text-accent"], [1, "stat-figure", "text-secondary"], [1, "fas", "fa-dollar-sign", "text-3xl"], [1, "stat-value", "text-secondary"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6", "mb-8"], [1, "card", "shadow", "lg:col-span-2", "bg-base-100", "dark:bg-gray-800", "text-base-content", "dark:text-white"], [1, "card-body"], [1, "card-title", "mb-4"], [1, "h-80", "w-full"], ["baseChart", "", 3, "data", "options", "type"], [1, "card", "shadow", "bg-base-100", "dark:bg-gray-800", "text-base-content", "dark:text-white"], [1, "h-64", "w-full"], [1, "h-64", "w-full", "flex", "justify-center"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-6"], [1, "grid", "grid-cols-2", "gap-4"], ["routerLink", "/admin/products/new", 1, "btn", "btn-outline", "btn-primary"], [1, "fas", "fa-plus", "mr-2"], ["routerLink", "/admin/sales", 1, "btn", "btn-outline", "btn-accent"], [1, "fas", "fa-cash-register", "mr-2"], ["routerLink", "/admin/users", 1, "btn", "btn-outline", "dark:text-white", "dark:border-white", "dark:hover:bg-white", "dark:hover:text-gray-900"], [1, "fas", "fa-user-plus", "mr-2"], ["routerLink", "/admin/repairs", 1, "btn", "btn-outline", "btn-secondary"], [1, "fas", "fa-tools", "mr-2"], [1, "space-y-4"], [1, "flex", "justify-between", "items-center"], [1, "badge", "badge-success"], [1, "alert", "alert-warning", "text-xs", "mt-4"], [1, "divider", "my-2"], [1, "space-y-3"], [1, "flex", "justify-between", "items-center", "text-sm"], [1, "flex", "items-center", "gap-2"], [1, "fas", "fa-eye", "text-info"], [1, "font-semibold"], [1, "fas", "fa-user", "text-primary"], [1, "font-semibold", "text-xs"], ["href", "https://us.posthog.com/project/253677/dashboard/791256", "target", "_blank", 1, "btn", "btn-sm", "btn-outline", "btn-info", "w-full", "mt-2"], [1, "fas", "fa-chart-line", "mr-2"], [1, "fas", "fa-exclamation-triangle"]], template: function AdminDashboardPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Panel de Control");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, AdminDashboardPage_Conditional_3_Template, 2, 0, "div", 2)(4, AdminDashboardPage_Conditional_4_Template, 117, 21);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.loading() ? 3 : 4);
    }
  }, dependencies: [CommonModule, RouterLink, BaseChartDirective, CurrencyPipe], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(AdminDashboardPage, [{
    type: Component,
    args: [{ selector: "app-admin-dashboard-page", standalone: true, imports: [CommonModule, RouterLink, BaseChartDirective], template: `<div class="p-6">\r
  <h1 class="text-2xl font-bold mb-6 text-black dark:text-green-400">Panel de Control</h1>\r
  \r
  @if (loading()) {\r
    <div class="flex justify-center py-12">\r
        <span class="loading loading-spinner loading-lg"></span>\r
    </div>\r
  } @else {\r
    <!-- Stats Cards: E-Commerce & Workshop -->\r
    <div class="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">\r
        <!-- Users Card -->\r
        <div class="stats shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="stat">\r
                <div class="stat-figure text-primary">\r
                    <i class="fas fa-users text-3xl"></i>\r
                </div>\r
                <div class="stat-title dark:text-gray-400">Usuarios</div>\r
                <div class="stat-value text-primary">{{ stats().users }}</div>\r
                <div class="stat-desc dark:text-gray-500">Registrados</div>\r
            </div>\r
        </div>\r
\r
        <!-- Repairs This Month (NEW) -->\r
        <div class="stats shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="stat">\r
                <div class="stat-figure text-warning">\r
                    <i class="fas fa-tools text-3xl"></i>\r
                </div>\r
                <div class="stat-title dark:text-gray-400">Reparaciones (Mes)</div>\r
                <div class="stat-value text-warning">{{ stats().repairs_month }}</div>\r
                <div class="stat-desc dark:text-gray-500">Equipos ingresados</div>\r
            </div>\r
        </div>\r
\r
        <!-- Revenue Repair (NEW) -->\r
        <div class="stats shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="stat">\r
                <div class="stat-figure text-success">\r
                    <i class="fas fa-hand-holding-usd text-3xl"></i>\r
                </div>\r
                <div class="stat-title dark:text-gray-400">Ganancia Taller</div>\r
                <div class="stat-value text-success">{{ stats().repairs_revenue | currency }}</div>\r
                <div class="stat-desc dark:text-gray-500">Este mes</div>\r
            </div>\r
        </div>\r
\r
        <!-- Fixed Devices (NEW) -->\r
        <div class="stats shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="stat">\r
                <div class="stat-figure text-info">\r
                    <i class="fas fa-check-circle text-3xl"></i>\r
                </div>\r
                <div class="stat-title dark:text-gray-400">Equipos Arreglados</div>\r
                <div class="stat-value text-info">{{ stats().devices_fixed }}</div>\r
                <div class="stat-desc dark:text-gray-500">Hist\xF3rico de Taller</div>\r
            </div>\r
        </div>\r
\r
        <!-- E-Commerce Orders Card -->\r
        <div class="stats shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="stat">\r
                <div class="stat-figure text-accent">\r
                    <i class="fas fa-shopping-cart text-3xl"></i>\r
                </div>\r
                <div class="stat-title dark:text-gray-400">Ventas Tienda</div>\r
                <div class="stat-value text-accent">{{ stats().sales }}</div>\r
                <div class="stat-desc dark:text-gray-500">Total realizadas</div>\r
            </div>\r
        </div>\r
\r
        <!-- E-Commerce Revenue Card -->\r
        <div class="stats shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="stat">\r
                <div class="stat-figure text-secondary">\r
                    <i class="fas fa-dollar-sign text-3xl"></i>\r
                </div>\r
                <div class="stat-title dark:text-gray-400">Ingresos Tienda</div>\r
                <div class="stat-value text-secondary">{{ stats().revenue | currency }}</div>\r
                <div class="stat-desc dark:text-gray-500">Total facturado</div>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <!-- Charts Section -->\r
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">\r
        <!-- Sales Chart -->\r
        <div class="card shadow lg:col-span-2 bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="card-body">\r
                <h2 class="card-title mb-4">Resumen de Ventas</h2>\r
                <div class="h-80 w-full">\r
                    <canvas baseChart\r
                        [data]="salesChartData"\r
                        [options]="salesChartOptions"\r
                        [type]="salesChartType">\r
                    </canvas>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Top Products Chart -->\r
        <div class="card shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="card-body">\r
                <h2 class="card-title mb-4">Productos Top</h2>\r
                <div class="h-64 w-full">\r
                    <canvas baseChart\r
                        [data]="productsChartData"\r
                        [options]="productsChartOptions"\r
                        [type]="productsChartType">\r
                    </canvas>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Category Chart -->\r
        <div class="card shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="card-body">\r
                <h2 class="card-title mb-4">Ventas por Categor\xEDa</h2>\r
                <div class="h-64 w-full flex justify-center">\r
                    <canvas baseChart\r
                        [data]="categoryChartData"\r
                        [options]="categoryChartOptions"\r
                        [type]="categoryChartType">\r
                    </canvas>\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
\r
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">\r
        <!-- Quick Actions -->\r
        <div class="card shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="card-body">\r
                <h2 class="card-title mb-4">Acciones R\xE1pidas</h2>\r
                <div class="grid grid-cols-2 gap-4">\r
                    <a routerLink="/admin/products/new" class="btn btn-outline btn-primary">\r
                        <i class="fas fa-plus mr-2"></i> Nuevo Producto\r
                    </a>\r
                    <a routerLink="/admin/sales" class="btn btn-outline btn-accent">\r
                        <i class="fas fa-cash-register mr-2"></i> Nueva Venta\r
                    </a>\r
                    <a routerLink="/admin/users" class="btn btn-outline dark:text-white dark:border-white dark:hover:bg-white dark:hover:text-gray-900">\r
                        <i class="fas fa-user-plus mr-2"></i> Gestionar Usuarios\r
                    </a>\r
                    <a routerLink="/admin/repairs" class="btn btn-outline btn-secondary">\r
                        <i class="fas fa-tools mr-2"></i> Taller\r
                    </a>\r
                </div>\r
            </div>\r
        </div>\r
\r
        <!-- Analytics & System Status -->\r
        <div class="card shadow bg-base-100 dark:bg-gray-800 text-base-content dark:text-white">\r
            <div class="card-body">\r
                <h2 class="card-title mb-4">Analytics & Sistema</h2>\r
                <div class="space-y-4">\r
                    <!-- System Status -->\r
                    <div class="flex justify-between items-center">\r
                        <span>Base de Datos</span>\r
                        <span class="badge badge-success">Conectado</span>\r
                    </div>\r
                    <div class="flex justify-between items-center">\r
                        <span>Analytics (PostHog)</span>\r
                        <span class="badge badge-success">{{ posthogStatus() }}</span>\r
                    </div>\r
                    \r
                    <!-- PostHog Metrics -->\r
                    @if (analyticsStats().enabled) {\r
                      <div class="divider my-2"></div>\r
                      <div class="space-y-3">\r
                        <div class="flex justify-between items-center text-sm">\r
                          <span class="flex items-center gap-2">\r
                            <i class="fas fa-eye text-info"></i>\r
                            <span>Sesi\xF3n Actual</span>\r
                          </span>\r
                          <span class="font-semibold">{{ analyticsStats().sessionId ? 'Activa' : 'N/A' }}</span>\r
                        </div>\r
                        <div class="flex justify-between items-center text-sm">\r
                          <span class="flex items-center gap-2">\r
                            <i class="fas fa-user text-primary"></i>\r
                            <span>Usuario</span>\r
                          </span>\r
                          <span class="font-semibold text-xs">{{ analyticsStats().distinctId || 'An\xF3nimo' }}</span>\r
                        </div>\r
                        <a \r
                          href="https://us.posthog.com/project/253677/dashboard/791256" \r
                          target="_blank" \r
                          class="btn btn-sm btn-outline btn-info w-full mt-2"\r
                        >\r
                          <i class="fas fa-chart-line mr-2"></i>\r
                          Ver Dashboard Completo\r
                        </a>\r
                      </div>\r
                    } @else {\r
                      <div class="alert alert-warning text-xs mt-4">\r
                        <i class="fas fa-exclamation-triangle"></i>\r
                        <span>PostHog no est\xE1 inicializado correctamente</span>\r
                      </div>\r
                    }\r
                </div>\r
            </div>\r
        </div>\r
    </div>\r
  }\r
</div>\r
` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(AdminDashboardPage, { className: "AdminDashboardPage", filePath: "src/app/admin/dashboard/admin-dashboard-page.ts", lineNumber: 18 });
})();
export {
  AdminDashboardPage
};
//# sourceMappingURL=chunk-XFVE4BJF.mjs.map
