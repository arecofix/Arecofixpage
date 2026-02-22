import './polyfills.server.mjs';
import {
  OrderService
} from "./chunk-DDTW4W76.mjs";
import {
  ContactService
} from "./chunk-L26XQAD6.mjs";
import {
  NotificationService
} from "./chunk-GBKHDUJJ.mjs";
import {
  AuthService
} from "./chunk-PUVRELIK.mjs";
import {
  ProductService
} from "./chunk-3AK4HRR5.mjs";
import {
  CartService
} from "./chunk-LSCMNRBM.mjs";
import "./chunk-EJ6NDVRN.mjs";
import "./chunk-7JR2GAHJ.mjs";
import {
  DefaultValueAccessor,
  FormBuilder,
  FormControlName,
  FormGroupDirective,
  FormGroupName,
  NgControlStatus,
  NgControlStatusGroup,
  ReactiveFormsModule,
  Validators,
  ɵNgNoValidate
} from "./chunk-VVLZNBXY.mjs";
import "./chunk-ME5JAH3I.mjs";
import "./chunk-R72SLW3B.mjs";
import {
  Router,
  RouterLink
} from "./chunk-JEV3MPEL.mjs";
import {
  Component,
  firstValueFrom,
  inject,
  setClassMetadata,
  signal,
  ɵsetClassDebugInfo,
  ɵɵadvance,
  ɵɵclassProp,
  ɵɵconditional,
  ɵɵconditionalCreate,
  ɵɵdefineComponent,
  ɵɵelement,
  ɵɵelementEnd,
  ɵɵelementStart,
  ɵɵgetCurrentView,
  ɵɵlistener,
  ɵɵnextContext,
  ɵɵproperty,
  ɵɵrepeater,
  ɵɵrepeaterCreate,
  ɵɵresetView,
  ɵɵrestoreView,
  ɵɵsanitizeUrl,
  ɵɵtext,
  ɵɵtextInterpolate,
  ɵɵtextInterpolate1,
  ɵɵtextInterpolate2
} from "./chunk-DXH6IVIR.mjs";
import "./chunk-ML5XS5HX.mjs";

// src/app/public/checkout/checkout-page.ts
var _forTrack0 = ($index, $item) => $item.product.id;
function CheckoutPage_Conditional_3_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 2)(1, "div", 4)(2, "div", 5);
    \u0275\u0275element(3, "i", 6);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(4, "h2", 7);
    \u0275\u0275text(5, "\xA1Orden Recibida!");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(6, "p", 8);
    \u0275\u0275text(7, "Gracias por tu compra. Para procesar el env\xEDo, por favor realiza el pago:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(8, "div", 9)(9, "p", 10);
    \u0275\u0275text(10, "Datos Bancarios:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "div", 11)(12, "p", 12)(13, "span");
    \u0275\u0275text(14, "Alias:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(15, "span", 13);
    \u0275\u0275text(16, "areco.fix");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(17, "p", 12)(18, "span");
    \u0275\u0275text(19, "CBU:");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(20, "span", 13);
    \u0275\u0275text(21, "0000003100084531456958");
    \u0275\u0275elementEnd()()()();
    \u0275\u0275elementStart(22, "p", 14);
    \u0275\u0275text(23, " Una vez realizado el pago, env\xEDa el comprobante al: ");
    \u0275\u0275element(24, "br");
    \u0275\u0275elementStart(25, "strong", 15);
    \u0275\u0275text(26, "+54 9 11 2596-0900");
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(27, "div", 16)(28, "a", 17);
    \u0275\u0275element(29, "i", 18);
    \u0275\u0275text(30, " Enviar Comprobante ");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(31, "a", 19);
    \u0275\u0275text(32, "Volver al Inicio");
    \u0275\u0275elementEnd()()()();
  }
  if (rf & 2) {
    let tmp_1_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(28);
    \u0275\u0275property("href", "https://wa.me/5491125960900?text=Hola,%20hice%20un%20pedido%20a%20nombre%20de%20" + ((tmp_1_0 = ctx_r0.checkoutForm.get("name")) == null ? null : tmp_1_0.value) + ".%20Adjunto%20comprobante.", \u0275\u0275sanitizeUrl);
  }
}
function CheckoutPage_Conditional_4_Conditional_5_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "p", 42);
    \u0275\u0275text(1, "Tu carrito est\xE1 vac\xEDo.");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(2, "a", 43);
    \u0275\u0275text(3, "Ir a comprar");
    \u0275\u0275elementEnd();
  }
}
function CheckoutPage_Conditional_4_Conditional_6_For_2_Template(rf, ctx) {
  if (rf & 1) {
    const _r3 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 45);
    \u0275\u0275element(1, "img", 48);
    \u0275\u0275elementStart(2, "div", 49)(3, "h3", 50);
    \u0275\u0275text(4);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(5, "p", 51);
    \u0275\u0275text(6);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 52)(8, "span", 50);
    \u0275\u0275text(9);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(10, "button", 53);
    \u0275\u0275listener("click", function CheckoutPage_Conditional_4_Conditional_6_For_2_Template_button_click_10_listener() {
      const item_r4 = \u0275\u0275restoreView(_r3).$implicit;
      const ctx_r0 = \u0275\u0275nextContext(3);
      return \u0275\u0275resetView(ctx_r0.cartService.removeFromCart(item_r4.product.id));
    });
    \u0275\u0275element(11, "i", 54);
    \u0275\u0275elementEnd()()();
  }
  if (rf & 2) {
    const item_r4 = ctx.$implicit;
    \u0275\u0275advance();
    \u0275\u0275property("src", item_r4.product.image_url || (item_r4.product.gallery_urls == null ? null : item_r4.product.gallery_urls[0]) || "assets/img/no-image.png", \u0275\u0275sanitizeUrl);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate(item_r4.product.name);
    \u0275\u0275advance(2);
    \u0275\u0275textInterpolate2("$", item_r4.product.price, " x ", item_r4.quantity);
    \u0275\u0275advance(3);
    \u0275\u0275textInterpolate1(" $", (item_r4.product.price * item_r4.quantity).toFixed(2), " ");
  }
}
function CheckoutPage_Conditional_4_Conditional_6_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "div", 44);
    \u0275\u0275repeaterCreate(1, CheckoutPage_Conditional_4_Conditional_6_For_2_Template, 12, 5, "div", 45, _forTrack0);
    \u0275\u0275elementEnd();
    \u0275\u0275element(3, "div", 46);
    \u0275\u0275elementStart(4, "div", 47)(5, "span");
    \u0275\u0275text(6, "Total");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(7, "span");
    \u0275\u0275text(8);
    \u0275\u0275elementEnd()();
  }
  if (rf & 2) {
    const ctx_r0 = \u0275\u0275nextContext(2);
    \u0275\u0275advance();
    \u0275\u0275repeater(ctx_r0.cartService.cartItems());
    \u0275\u0275advance(7);
    \u0275\u0275textInterpolate1("$", ctx_r0.cartService.totalPrice().toFixed(2));
  }
}
function CheckoutPage_Conditional_4_Conditional_17_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "El nombre es requerido");
    \u0275\u0275elementEnd();
  }
}
function CheckoutPage_Conditional_4_Conditional_23_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "Email inv\xE1lido");
    \u0275\u0275elementEnd();
  }
}
function CheckoutPage_Conditional_4_Conditional_29_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275elementStart(0, "span", 29);
    \u0275\u0275text(1, "El tel\xE9fono es requerido");
    \u0275\u0275elementEnd();
  }
}
function CheckoutPage_Conditional_4_Conditional_60_Template(rf, ctx) {
  if (rf & 1) {
    \u0275\u0275element(0, "span", 41);
  }
}
function CheckoutPage_Conditional_4_Template(rf, ctx) {
  if (rf & 1) {
    const _r2 = \u0275\u0275getCurrentView();
    \u0275\u0275elementStart(0, "div", 3)(1, "div", 20)(2, "div", 21)(3, "h2", 22);
    \u0275\u0275text(4, "Resumen del Carrito");
    \u0275\u0275elementEnd();
    \u0275\u0275conditionalCreate(5, CheckoutPage_Conditional_4_Conditional_5_Template, 4, 0)(6, CheckoutPage_Conditional_4_Conditional_6_Template, 9, 1);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(7, "div", 23)(8, "div", 21)(9, "h2", 22);
    \u0275\u0275text(10, "Datos del Cliente");
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(11, "form", 24);
    \u0275\u0275listener("ngSubmit", function CheckoutPage_Conditional_4_Template_form_ngSubmit_11_listener() {
      \u0275\u0275restoreView(_r2);
      const ctx_r0 = \u0275\u0275nextContext();
      return \u0275\u0275resetView(ctx_r0.placeOrder());
    });
    \u0275\u0275elementStart(12, "div", 25)(13, "label", 26)(14, "span", 27);
    \u0275\u0275text(15, "Nombre Completo");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(16, "input", 28);
    \u0275\u0275conditionalCreate(17, CheckoutPage_Conditional_4_Conditional_17_Template, 2, 0, "span", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(18, "div", 25)(19, "label", 26)(20, "span", 27);
    \u0275\u0275text(21, "Email");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(22, "input", 30);
    \u0275\u0275conditionalCreate(23, CheckoutPage_Conditional_4_Conditional_23_Template, 2, 0, "span", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(24, "div", 25)(25, "label", 26)(26, "span", 27);
    \u0275\u0275text(27, "Tel\xE9fono");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(28, "input", 31);
    \u0275\u0275conditionalCreate(29, CheckoutPage_Conditional_4_Conditional_29_Template, 2, 0, "span", 29);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(30, "div", 32)(31, "div", 33)(32, "div", 25)(33, "label", 26)(34, "span", 27);
    \u0275\u0275text(35, "Calle");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(36, "input", 34);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(37, "div", 25)(38, "label", 26)(39, "span", 27);
    \u0275\u0275text(40, "N\xFAmero");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(41, "input", 35);
    \u0275\u0275elementEnd()();
    \u0275\u0275elementStart(42, "div", 33)(43, "div", 25)(44, "label", 26)(45, "span", 27);
    \u0275\u0275text(46, "Barrio / Depto");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(47, "input", 36);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(48, "div", 25)(49, "label", 26)(50, "span", 27);
    \u0275\u0275text(51, "Ciudad");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(52, "input", 37);
    \u0275\u0275elementEnd()()();
    \u0275\u0275elementStart(53, "div", 25)(54, "label", 26)(55, "span", 27);
    \u0275\u0275text(56, "Notas (Opcional)");
    \u0275\u0275elementEnd()();
    \u0275\u0275element(57, "textarea", 38);
    \u0275\u0275elementEnd();
    \u0275\u0275elementStart(58, "div", 39)(59, "button", 40);
    \u0275\u0275conditionalCreate(60, CheckoutPage_Conditional_4_Conditional_60_Template, 1, 0, "span", 41);
    \u0275\u0275text(61, " Finalizar Compra ");
    \u0275\u0275elementEnd()()()()()();
  }
  if (rf & 2) {
    let tmp_3_0;
    let tmp_4_0;
    let tmp_5_0;
    let tmp_6_0;
    let tmp_7_0;
    let tmp_8_0;
    const ctx_r0 = \u0275\u0275nextContext();
    \u0275\u0275advance(5);
    \u0275\u0275conditional(ctx_r0.cartService.cartItems().length === 0 ? 5 : 6);
    \u0275\u0275advance(6);
    \u0275\u0275property("formGroup", ctx_r0.checkoutForm);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("input-error", ((tmp_3_0 = ctx_r0.checkoutForm.get("name")) == null ? null : tmp_3_0.invalid) && ((tmp_3_0 = ctx_r0.checkoutForm.get("name")) == null ? null : tmp_3_0.touched));
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_4_0 = ctx_r0.checkoutForm.get("name")) == null ? null : tmp_4_0.invalid) && ((tmp_4_0 = ctx_r0.checkoutForm.get("name")) == null ? null : tmp_4_0.touched) ? 17 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("input-error", ((tmp_5_0 = ctx_r0.checkoutForm.get("email")) == null ? null : tmp_5_0.invalid) && ((tmp_5_0 = ctx_r0.checkoutForm.get("email")) == null ? null : tmp_5_0.touched));
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_6_0 = ctx_r0.checkoutForm.get("email")) == null ? null : tmp_6_0.invalid) && ((tmp_6_0 = ctx_r0.checkoutForm.get("email")) == null ? null : tmp_6_0.touched) ? 23 : -1);
    \u0275\u0275advance(5);
    \u0275\u0275classProp("input-error", ((tmp_7_0 = ctx_r0.checkoutForm.get("phone")) == null ? null : tmp_7_0.invalid) && ((tmp_7_0 = ctx_r0.checkoutForm.get("phone")) == null ? null : tmp_7_0.touched));
    \u0275\u0275advance();
    \u0275\u0275conditional(((tmp_8_0 = ctx_r0.checkoutForm.get("phone")) == null ? null : tmp_8_0.invalid) && ((tmp_8_0 = ctx_r0.checkoutForm.get("phone")) == null ? null : tmp_8_0.touched) ? 29 : -1);
    \u0275\u0275advance(30);
    \u0275\u0275property("disabled", ctx_r0.isProcessing() || ctx_r0.cartService.cartItems().length === 0);
    \u0275\u0275advance();
    \u0275\u0275conditional(ctx_r0.isProcessing() ? 60 : -1);
  }
}
var CheckoutPage = class _CheckoutPage {
  cartService = inject(CartService);
  orderService = inject(OrderService);
  authService = inject(AuthService);
  contactService = inject(ContactService);
  productService = inject(ProductService);
  fb = inject(FormBuilder);
  router = inject(Router);
  notificationService = inject(NotificationService);
  checkoutForm = this.fb.group({
    name: ["", [Validators.required]],
    email: ["", [Validators.required, Validators.email]],
    phone: ["", [Validators.required]],
    address: this.fb.group({
      street: ["", [Validators.required]],
      number: ["", [Validators.required]],
      city: ["Marcos Paz", [Validators.required]],
      neighborhood: [""]
    }),
    notes: [""]
  });
  isProcessing = signal(false, ...ngDevMode ? [{ debugName: "isProcessing" }] : []);
  orderSuccess = signal(false, ...ngDevMode ? [{ debugName: "orderSuccess" }] : []);
  async placeOrder() {
    if (this.checkoutForm.invalid) {
      this.checkoutForm.markAllAsTouched();
      this.notificationService.showError("Por favor, completa todos los campos requeridos.");
      return;
    }
    this.isProcessing.set(true);
    const formVal = this.checkoutForm.getRawValue();
    const cartItems = this.cartService.cartItems();
    const total = this.cartService.totalPrice();
    const addressStr = `${formVal.address.street} ${formVal.address.number}, ${formVal.address.neighborhood ? formVal.address.neighborhood + ", " : ""}${formVal.address.city}`;
    const order = {
      customer_name: formVal.name,
      customer_email: formVal.email,
      customer_phone: formVal.phone,
      customer_address: formVal.address,
      // Structured object
      status: "pending",
      subtotal: total,
      tax: 0,
      discount: 0,
      total,
      notes: formVal.notes,
      customer_id: this.authService.getCurrentUser()?.id
    };
    const orderItems = cartItems.map((item) => ({
      product_name: item.product.name,
      product_id: item.product.id,
      quantity: item.quantity,
      unit_price: item.product.price,
      subtotal: item.product.price * item.quantity
    }));
    try {
      const { data, error } = await this.orderService.createOrder(order, orderItems);
      if (error) {
        console.error("Order creation error:", error);
        throw error;
      }
      const itemsList = cartItems.map((i) => `- ${i.product.name} (x${i.quantity}) - $${(i.product.price * i.quantity).toFixed(2)}`).join("\n");
      const detailedMessage = `Nuevo Pedido #${data?.order_number || "N/A"}
      
Detalles del Cliente:
Nombre: ${formVal.name}
Email: ${formVal.email}
Tel\xE9fono: ${formVal.phone}
Direcci\xF3n: ${addressStr}

Productos:
${itemsList}

Total: $${total.toFixed(2)}

Notas Adicionales:
${formVal.notes || "Ninguna"}`;
      const messageDto = {
        name: formVal.name,
        email: formVal.email,
        phone: formVal.phone,
        subject: `[NUEVO PEDIDO] #${data?.order_number} - ${formVal.name} - $${total.toFixed(2)}`,
        message: detailedMessage
      };
      const { error: msgError } = await this.contactService.createMessage(messageDto);
      if (msgError) {
        console.error("Message creation error (non-fatal):", msgError);
      }
      const currentUser = this.authService.getCurrentUser();
      if (currentUser) {
        const supabase = this.authService.getSupabaseClient();
        await supabase.from("profiles").update({
          phone: formVal.phone,
          address: formVal.address,
          // Save JSONB object
          updated_at: (/* @__PURE__ */ new Date()).toISOString()
        }).eq("id", currentUser.id).maybeSingle();
      }
      const uniqueProductIds = [...new Set(cartItems.map((item) => item.product.id))];
      try {
        const updatePromises = uniqueProductIds.map((id) => firstValueFrom(this.productService.updateProduct(id, { is_featured: true })));
        await Promise.all(updatePromises);
      } catch (featError) {
        console.warn("Could not update featured status for products (likely permission issue):", featError);
      }
      this.orderSuccess.set(true);
      this.cartService.clearCart();
      this.notificationService.showSuccess("\xA1Orden creada exitosamente!");
    } catch (error) {
      console.error("Checkout failed full error:", JSON.stringify(error, null, 2));
      const errMsg = error?.message || "Error desconocido";
      const errCode = error?.code || "N/A";
      this.notificationService.showError(`Hubo un error al procesar tu orden: ${errMsg} (C\xF3digo: ${errCode})`);
    } finally {
      this.isProcessing.set(false);
    }
  }
  static \u0275fac = function CheckoutPage_Factory(__ngFactoryType__) {
    return new (__ngFactoryType__ || _CheckoutPage)();
  };
  static \u0275cmp = /* @__PURE__ */ \u0275\u0275defineComponent({ type: _CheckoutPage, selectors: [["app-checkout-page"]], decls: 5, vars: 1, consts: [[1, "container", "mx-auto", "px-4", "py-8", "max-w-4xl"], [1, "text-3xl", "font-bold", "mb-8", "text-center", "text-primary"], [1, "card", "bg-base-100", "shadow-xl", "text-center", "p-10", "border", "border-base-200"], [1, "grid", "grid-cols-1", "lg:grid-cols-2", "gap-8"], [1, "card-body", "items-center"], [1, "text-success", "text-6xl", "mb-4"], [1, "fas", "fa-check-circle"], [1, "card-title", "text-2xl", "text-base-content", "mb-2"], [1, "text-base-content/80", "mb-6"], [1, "bg-base-200", "p-6", "rounded-xl", "w-full", "max-w-md", "mb-6", "text-left", "border", "border-base-300"], [1, "font-bold", "text-base-content", "mb-2", "border-b", "border-base-content/10", "pb-2"], [1, "space-y-2"], [1, "text-base-content/70", "flex", "justify-between"], [1, "font-mono", "font-bold", "text-base-content", "select-all", "bg-base-100", "px-2", "rounded"], [1, "text-sm", "mb-4", "text-base-content/80"], [1, "text-lg", "text-primary"], [1, "card-actions", "flex", "flex-col", "gap-3", "w-full", "max-w-md"], ["target", "_blank", 1, "btn", "btn-success", "text-white", "w-full", "btn-lg", 3, "href"], [1, "fab", "fa-whatsapp", "text-xl", "mr-2"], ["routerLink", "/", 1, "btn", "btn-ghost", "w-full"], [1, "card", "bg-base-100", "shadow-xl", "h-fit", "border", "border-base-200"], [1, "card-body"], [1, "card-title", "mb-4", "text-base-content"], [1, "card", "bg-base-100", "shadow-xl", "border", "border-base-200"], [1, "space-y-4", 3, "ngSubmit", "formGroup"], [1, "form-control", "w-full"], [1, "label"], [1, "label-text", "text-base-content"], ["type", "text", "formControlName", "name", 1, "input", "input-bordered", "w-full", "bg-base-100", "text-base-content"], [1, "text-error", "text-xs", "mt-1"], ["type", "email", "formControlName", "email", 1, "input", "input-bordered", "w-full", "bg-base-100", "text-base-content"], ["type", "tel", "formControlName", "phone", 1, "input", "input-bordered", "w-full", "bg-base-100", "text-base-content"], ["formGroupName", "address", 1, "space-y-4"], [1, "grid", "grid-cols-2", "gap-4"], ["type", "text", "formControlName", "street", 1, "input", "input-bordered", "w-full", "bg-base-100", "text-base-content"], ["type", "text", "formControlName", "number", 1, "input", "input-bordered", "w-full", "bg-base-100", "text-base-content"], ["type", "text", "formControlName", "neighborhood", "placeholder", "Opcional", 1, "input", "input-bordered", "w-full", "bg-base-100", "text-base-content"], ["type", "text", "formControlName", "city", 1, "input", "input-bordered", "w-full", "bg-base-100", "text-base-content"], ["formControlName", "notes", 1, "textarea", "textarea-bordered", "w-full", "bg-base-100", "text-base-content"], [1, "mt-6"], ["type", "submit", 1, "btn", "btn-primary", "btn-block", "btn-lg", 3, "disabled"], [1, "loading", "loading-spinner"], [1, "text-base-content"], ["routerLink", "/products/featured", 1, "btn", "btn-link", "px-0"], [1, "space-y-4"], [1, "flex", "gap-4", "items-center", "p-2", "hover:bg-base-200", "rounded-lg", "transition-colors"], [1, "divider"], [1, "flex", "justify-between", "text-xl", "font-bold", "text-base-content"], [1, "w-16", "h-16", "object-cover", "rounded-lg", "border", "border-base-300", 3, "src"], [1, "flex-1"], [1, "font-bold", "text-base-content"], [1, "text-sm", "text-base-content/70"], [1, "flex", "flex-col", "items-end", "gap-1"], ["aria-label", "Eliminar", 1, "btn", "btn-ghost", "btn-xs", "text-error", 3, "click"], [1, "fas", "fa-trash-alt"]], template: function CheckoutPage_Template(rf, ctx) {
    if (rf & 1) {
      \u0275\u0275elementStart(0, "div", 0)(1, "h1", 1);
      \u0275\u0275text(2, "Finalizar Compra");
      \u0275\u0275elementEnd();
      \u0275\u0275conditionalCreate(3, CheckoutPage_Conditional_3_Template, 33, 1, "div", 2)(4, CheckoutPage_Conditional_4_Template, 62, 13, "div", 3);
      \u0275\u0275elementEnd();
    }
    if (rf & 2) {
      \u0275\u0275advance(3);
      \u0275\u0275conditional(ctx.orderSuccess() ? 3 : 4);
    }
  }, dependencies: [ReactiveFormsModule, \u0275NgNoValidate, DefaultValueAccessor, NgControlStatus, NgControlStatusGroup, FormGroupDirective, FormControlName, FormGroupName, RouterLink], encapsulation: 2 });
};
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && setClassMetadata(CheckoutPage, [{
    type: Component,
    args: [{ selector: "app-checkout-page", standalone: true, imports: [ReactiveFormsModule, RouterLink], template: `<div class="container mx-auto px-4 py-8 max-w-4xl">\r
    <h1 class="text-3xl font-bold mb-8 text-center text-primary">Finalizar Compra</h1>\r
\r
    @if (orderSuccess()) {\r
    <div class="card bg-base-100 shadow-xl text-center p-10 border border-base-200">\r
        <div class="card-body items-center">\r
            <div class="text-success text-6xl mb-4">\r
                <i class="fas fa-check-circle"></i>\r
            </div>\r
            <h2 class="card-title text-2xl text-base-content mb-2">\xA1Orden Recibida!</h2>\r
            <p class="text-base-content/80 mb-6">Gracias por tu compra. Para procesar el env\xEDo, por favor realiza el pago:</p>\r
            \r
            <div class="bg-base-200 p-6 rounded-xl w-full max-w-md mb-6 text-left border border-base-300">\r
                <p class="font-bold text-base-content mb-2 border-b border-base-content/10 pb-2">Datos Bancarios:</p>\r
                <div class="space-y-2">\r
                    <p class="text-base-content/70 flex justify-between">\r
                        <span>Alias:</span> \r
                        <span class="font-mono font-bold text-base-content select-all bg-base-100 px-2 rounded">areco.fix</span>\r
                    </p>\r
                    <p class="text-base-content/70 flex justify-between">\r
                        <span>CBU:</span> \r
                        <span class="font-mono font-bold text-base-content select-all bg-base-100 px-2 rounded">0000003100084531456958</span>\r
                    </p>\r
                </div>\r
            </div>\r
\r
            <p class="text-sm mb-4 text-base-content/80">\r
                Una vez realizado el pago, env\xEDa el comprobante al: <br>\r
                <strong class="text-lg text-primary">+54 9 11 2596-0900</strong>\r
            </p>\r
\r
            <div class="card-actions flex flex-col gap-3 w-full max-w-md">\r
                <a [href]="'https://wa.me/5491125960900?text=Hola,%20hice%20un%20pedido%20a%20nombre%20de%20' + checkoutForm.get('name')?.value + '.%20Adjunto%20comprobante.'"\r
                   target="_blank" \r
                   class="btn btn-success text-white w-full btn-lg">\r
                    <i class="fab fa-whatsapp text-xl mr-2"></i> Enviar Comprobante\r
                </a>\r
                <a routerLink="/" class="btn btn-ghost w-full">Volver al Inicio</a>\r
            </div>\r
        </div>\r
    </div>\r
    } @else {\r
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">\r
        <!-- Cart Summary -->\r
        <div class="card bg-base-100 shadow-xl h-fit border border-base-200">\r
            <div class="card-body">\r
                <h2 class="card-title mb-4 text-base-content">Resumen del Carrito</h2>\r
\r
                @if (cartService.cartItems().length === 0) {\r
                <p class="text-base-content">Tu carrito est\xE1 vac\xEDo.</p>\r
                <a routerLink="/products/featured" class="btn btn-link px-0">Ir a comprar</a>\r
                } @else {\r
                <div class="space-y-4">\r
                    @for (item of cartService.cartItems(); track item.product.id) {\r
                    <div class="flex gap-4 items-center p-2 hover:bg-base-200 rounded-lg transition-colors">\r
                        <img [src]="item.product.image_url || item.product.gallery_urls?.[0] || 'assets/img/no-image.png'"\r
                            class="w-16 h-16 object-cover rounded-lg border border-base-300" />\r
                        <div class="flex-1">\r
                            <h3 class="font-bold text-base-content">{{ item.product.name }}</h3>\r
                            <p class="text-sm text-base-content/70">\${{ item.product.price }} x {{ item.quantity }}</p>\r
                        </div>\r
                        <div class="flex flex-col items-end gap-1">\r
                            <span class="font-bold text-base-content">\r
                                \${{ (item.product.price * item.quantity).toFixed(2) }}\r
                            </span>\r
                            <button (click)="cartService.removeFromCart(item.product.id)" class="btn btn-ghost btn-xs text-error" aria-label="Eliminar">\r
                                <i class="fas fa-trash-alt"></i>\r
                            </button>\r
                        </div>\r
                    </div>\r
                    }\r
                </div>\r
\r
                <div class="divider"></div>\r
\r
                <div class="flex justify-between text-xl font-bold text-base-content">\r
                    <span>Total</span>\r
                    <span>\${{ cartService.totalPrice().toFixed(2) }}</span>\r
                </div>\r
                }\r
            </div>\r
        </div>\r
\r
        <!-- Customer Form -->\r
        <div class="card bg-base-100 shadow-xl border border-base-200">\r
            <div class="card-body">\r
                <h2 class="card-title mb-4 text-base-content">Datos del Cliente</h2>\r
\r
                <form [formGroup]="checkoutForm" (ngSubmit)="placeOrder()" class="space-y-4">\r
                    <div class="form-control w-full">\r
                        <label class="label">\r
                            <span class="label-text text-base-content">Nombre Completo</span>\r
                        </label>\r
                        <input type="text" formControlName="name" class="input input-bordered w-full bg-base-100 text-base-content"\r
                            [class.input-error]="checkoutForm.get('name')?.invalid && checkoutForm.get('name')?.touched" />\r
                        @if (checkoutForm.get('name')?.invalid && checkoutForm.get('name')?.touched) {\r
                        <span class="text-error text-xs mt-1">El nombre es requerido</span>\r
                        }\r
                    </div>\r
\r
                    <div class="form-control w-full">\r
                        <label class="label">\r
                            <span class="label-text text-base-content">Email</span>\r
                        </label>\r
                        <input type="email" formControlName="email" class="input input-bordered w-full bg-base-100 text-base-content"\r
                            [class.input-error]="checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched" />\r
                        @if (checkoutForm.get('email')?.invalid && checkoutForm.get('email')?.touched) {\r
                        <span class="text-error text-xs mt-1">Email inv\xE1lido</span>\r
                        }\r
                    </div>\r
\r
                    <div class="form-control w-full">\r
                        <label class="label">\r
                            <span class="label-text text-base-content">Tel\xE9fono</span>\r
                        </label>\r
                        <input type="tel" formControlName="phone" class="input input-bordered w-full bg-base-100 text-base-content"\r
                            [class.input-error]="checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched" />\r
                        @if (checkoutForm.get('phone')?.invalid && checkoutForm.get('phone')?.touched) {\r
                        <span class="text-error text-xs mt-1">El tel\xE9fono es requerido</span>\r
                        }\r
                    </div>\r
\r
                    <div formGroupName="address" class="space-y-4">\r
                        <div class="grid grid-cols-2 gap-4">\r
                            <div class="form-control w-full">\r
                                <label class="label">\r
                                    <span class="label-text text-base-content">Calle</span>\r
                                </label>\r
                                <input type="text" formControlName="street" class="input input-bordered w-full bg-base-100 text-base-content" />\r
                            </div>\r
                            <div class="form-control w-full">\r
                                <label class="label">\r
                                    <span class="label-text text-base-content">N\xFAmero</span>\r
                                </label>\r
                                <input type="text" formControlName="number" class="input input-bordered w-full bg-base-100 text-base-content" />\r
                            </div>\r
                        </div>\r
\r
                        <div class="grid grid-cols-2 gap-4">\r
                            <div class="form-control w-full">\r
                                <label class="label">\r
                                    <span class="label-text text-base-content">Barrio / Depto</span>\r
                                </label>\r
                                <input type="text" formControlName="neighborhood" class="input input-bordered w-full bg-base-100 text-base-content" placeholder="Opcional" />\r
                            </div>\r
                            <div class="form-control w-full">\r
                                <label class="label">\r
                                    <span class="label-text text-base-content">Ciudad</span>\r
                                </label>\r
                                <input type="text" formControlName="city" class="input input-bordered w-full bg-base-100 text-base-content" />\r
                            </div>\r
                        </div>\r
                    </div>\r
\r
                    <div class="form-control w-full">\r
                        <label class="label">\r
                            <span class="label-text text-base-content">Notas (Opcional)</span>\r
                        </label>\r
                        <textarea formControlName="notes" class="textarea textarea-bordered w-full bg-base-100 text-base-content"></textarea>\r
                    </div>\r
\r
                    <div class="mt-6">\r
                        <button type="submit" class="btn btn-primary btn-block btn-lg"\r
                            [disabled]="isProcessing() || cartService.cartItems().length === 0">\r
                            @if (isProcessing()) {\r
                            <span class="loading loading-spinner"></span>\r
                            }\r
                            Finalizar Compra\r
                        </button>\r
                    </div>\r
                </form>\r
            </div>\r
        </div>\r
    </div>\r
    }\r
</div>` }]
  }], null, null);
})();
(() => {
  (typeof ngDevMode === "undefined" || ngDevMode) && \u0275setClassDebugInfo(CheckoutPage, { className: "CheckoutPage", filePath: "src/app/public/checkout/checkout-page.ts", lineNumber: 25 });
})();
export {
  CheckoutPage
};
//# sourceMappingURL=chunk-POBXSLET.mjs.map
